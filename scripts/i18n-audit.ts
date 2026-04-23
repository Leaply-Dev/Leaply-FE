import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join } from "node:path";

const ROOTS = ["app", "components", "lib"];
const MESSAGES = { en: "messages/en.json", vi: "messages/vi.json" };
const EXTS = new Set([".ts", ".tsx"]);

type Call = { file: string; line: number; namespace: string; key: string };
type Dynamic = { file: string; line: number; binding: string; raw: string };
type FileHints = {
	arrayProps: Map<string, Map<string, Set<string>>>;
	objectProps: Map<string, Map<string, Set<string>>>;
	arrayValues: Map<string, Set<string>>;
	aliases: Map<string, Set<string>>;
	mapBindings: Map<string, Set<string>>;
	varLiterals: Map<string, Set<string>>;
};
type PrefixPattern = { namespace: string; prefix: string; suffix?: string };

function walk(dir: string, out: string[] = []) {
	for (const name of readdirSync(dir)) {
		if (name === "node_modules" || name.startsWith(".")) continue;
		const p = join(dir, name);
		const s = statSync(p);
		if (s.isDirectory()) walk(p, out);
		else if (EXTS.has(extname(p))) out.push(p);
	}
	return out;
}

function flatten(obj: unknown, prefix = "", acc = new Set<string>()) {
	if (obj && typeof obj === "object" && !Array.isArray(obj)) {
		for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
			const next = prefix ? `${prefix}.${k}` : k;
			if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, next, acc);
			else acc.add(next);
		}
	}
	return acc;
}

const BINDING_RE =
	/(?:const|let)\s+(\w+)\s*=\s*(?:useTranslations|getTranslations)\s*\(\s*(?:["'`]([^"'`]*)["'`])?\s*\)/g;

function callRegex(binding: string) {
	// t("x"), t.rich("x"), t.markup("x"), t.raw("x")
	return new RegExp(
		`\\b${binding}(?:\\.(?:rich|markup|raw))?\\(\\s*(?:(["'])([^"'\`]+?)\\1|(\`)([^\`]*?)\\3)`,
		"g",
	);
}

function dynamicCallRegex(binding: string) {
	// t(expr), t.rich(expr), ... where expr is not a string/template literal
	return new RegExp(
		`\\b${binding}(?:\\.(?:rich|markup|raw))?\\(\\s*([^\\s"'\\\`][^\\n\\r\\)]*)`,
		"g",
	);
}

function tryResolveModuleFile(importerFile: string, modulePath: string): string | null {
	const base = modulePath.startsWith("@/")
		? join(process.cwd(), modulePath.slice(2))
		: join(dirname(importerFile), modulePath);

	const candidates = [
		base,
		`${base}.ts`,
		`${base}.tsx`,
		`${base}.js`,
		join(base, "index.ts"),
		join(base, "index.tsx"),
		join(base, "index.js"),
	];

	for (const c of candidates) {
		if (existsSync(c) && statSync(c).isFile()) return c;
	}
	return null;
}

function extractArrayPropsByName(
	source: string,
	arrayName: string,
): Map<string, Set<string>> | null {
	const escaped = arrayName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const re = new RegExp(
		`(?:export\\s+)?(?:const|let)\\s+${escaped}(?:\\s*:\\s*[^=]+)?\\s*=\\s*\\[([\\s\\S]*?)\\](?:\\s+as\\s+const)?\\s*;`,
		"g",
	);
	const m = re.exec(source);
	if (!m) return null;

	const body = m[1] ?? "";
	const perProp = new Map<string, Set<string>>();
	const propRe = /(\w+)\s*:\s*["'`]([^"'`]+)["'`]/g;
	for (const pm of body.matchAll(propRe)) {
		const prop = pm[1];
		const value = pm[2];
		if (!perProp.has(prop)) perProp.set(prop, new Set());
		perProp.get(prop)?.add(value);
	}
	return perProp.size ? perProp : null;
}

function extractObjectPropsByName(
	source: string,
	objectName: string,
): Map<string, Set<string>> | null {
	const escaped = objectName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const re = new RegExp(
		`(?:export\\s+)?(?:const|let)\\s+${escaped}(?:\\s*:\\s*[^=]+)?\\s*=\\s*\\{([\\s\\S]*?)\\}(?:\\s+as\\s+const)?\\s*;`,
		"g",
	);
	const m = re.exec(source);
	if (!m) return null;
	const body = m[1] ?? "";
	const perProp = new Map<string, Set<string>>();
	const propRe = /(\w+)\s*:\s*["'`]([^"'`]+)["'`]/g;
	for (const pm of body.matchAll(propRe)) {
		const prop = pm[1];
		const value = pm[2];
		if (!perProp.has(prop)) perProp.set(prop, new Set());
		perProp.get(prop)?.add(value);
	}
	return perProp.size ? perProp : null;
}

function buildFileHints(src: string, file: string): FileHints {
	const arrayProps = new Map<string, Map<string, Set<string>>>();
	const objectProps = new Map<string, Map<string, Set<string>>>();
	const arrayValues = new Map<string, Set<string>>();
	const aliases = new Map<string, Set<string>>();
	const mapBindings = new Map<string, Set<string>>();
	const varLiterals = new Map<string, Set<string>>();

	// const foo = [ ... ] OR const foo: SomeType = [ ... ]
	const arrayDeclRe =
		/(?:const|let)\s+(\w+)(?:\s*:\s*[^=]+)?\s*=\s*\[([\s\S]*?)\];/g;
	for (const m of src.matchAll(arrayDeclRe)) {
		const arrayName = m[1];
		const body = m[2] ?? "";
		const perProp = new Map<string, Set<string>>();
		const propRe = /(\w+)\s*:\s*["'`]([^"'`]+)["'`]/g;
		for (const pm of body.matchAll(propRe)) {
			const prop = pm[1];
			const value = pm[2];
			if (!perProp.has(prop)) perProp.set(prop, new Set());
			perProp.get(prop)?.add(value);
		}
		if (perProp.size) arrayProps.set(arrayName, perProp);
		const values = new Set<string>();
		const valRe = /["'`]([^"'`]+)["'`]/g;
		for (const vm of body.matchAll(valRe)) values.add(vm[1]);
		if (values.size) arrayValues.set(arrayName, values);
	}

	const objectDeclRe =
		/(?:const|let)\s+(\w+)(?:\s*:\s*[^=]+)?\s*=\s*\{([\s\S]*?)\};/g;
	for (const m of src.matchAll(objectDeclRe)) {
		const objectName = m[1];
		const body = m[2] ?? "";
		const perProp = new Map<string, Set<string>>();
		const propRe = /(\w+)\s*:\s*["'`]([^"'`]+)["'`]/g;
		for (const pm of body.matchAll(propRe)) {
			const prop = pm[1];
			const value = pm[2];
			if (!perProp.has(prop)) perProp.set(prop, new Set());
			perProp.get(prop)?.add(value);
		}
		if (perProp.size) objectProps.set(objectName, perProp);
	}

	// import { FOO, BAR as BAZ } from "..."
	const importRe = /import\s+\{([^}]+)\}\s+from\s+["']([^"']+)["']/g;
	for (const m of src.matchAll(importRe)) {
		const rawImports = m[1] ?? "";
		const modulePath = m[2] ?? "";
		const resolved = tryResolveModuleFile(file, modulePath);
		if (!resolved) continue;
		const importedSource = readFileSync(resolved, "utf8");

		const specs = rawImports
			.split(",")
			.map((x) => x.trim())
			.filter(Boolean);
		for (const spec of specs) {
			const aliasMatch = /^(\w+)\s+as\s+(\w+)$/.exec(spec);
			const importedName = aliasMatch ? aliasMatch[1] : spec;
			const localName = aliasMatch ? aliasMatch[2] : spec;
			const props = extractArrayPropsByName(importedSource, importedName);
			if (props) arrayProps.set(localName, props);
			const objProps = extractObjectPropsByName(importedSource, importedName);
			if (objProps) objectProps.set(localName, objProps);
			const importedVals = extractArrayPropsByName(importedSource, importedName);
			if (importedVals && importedVals.size === 0) {
				// no-op
			}
		}
	}

	// const navLinks = cond ? authNavLinks : publicNavLinks
	const aliasRe = /(?:const|let)\s+(\w+)\s*=\s*[^?;]+?\?\s*(\w+)\s*:\s*(\w+)/g;
	for (const m of src.matchAll(aliasRe)) {
		const target = m[1];
		const a = m[2];
		const b = m[3];
		aliases.set(target, new Set([a, b]));
	}

	// const config = SOME_OBJECT[type]
	const indexedAliasRe = /(?:const|let)\s+(\w+)\s*=\s*(\w+)\[[^\]]+\]/g;
	for (const m of src.matchAll(indexedAliasRe)) {
		const target = m[1];
		const source = m[2];
		aliases.set(target, new Set([source]));
	}
	const findAliasRe = /(?:const|let)\s+(\w+)\s*=\s*(\w+)\.find\(/g;
	for (const m of src.matchAll(findAliasRe)) {
		const target = m[1];
		const source = m[2];
		aliases.set(target, new Set([source]));
	}

	// foo.map((item) => ...), foo.find((item) => ...), supports typed callbacks
	const mapRe = /(\w+)\.(?:map|find|filter|some|forEach)\(\s*\(\s*(\w+)/g;
	for (const m of src.matchAll(mapRe)) {
		const arrayName = m[1];
		const itemVar = m[2];
		if (!mapBindings.has(itemVar)) mapBindings.set(itemVar, new Set());
		mapBindings.get(itemVar)?.add(arrayName);
	}
	const inlineArrayMapRe = /\[([^\]]+)\]\.map\(\s*\(\s*(\w+)/g;
	for (const m of src.matchAll(inlineArrayMapRe)) {
		const rawValues = m[1] ?? "";
		const itemVar = m[2];
		const synthetic = `__inline_${itemVar}`;
		const values = new Set<string>();
		for (const vm of rawValues.matchAll(/["'`]([^"'`]+)["'`]/g)) values.add(vm[1]);
		if (values.size) arrayValues.set(synthetic, values);
		if (!mapBindings.has(itemVar)) mapBindings.set(itemVar, new Set());
		mapBindings.get(itemVar)?.add(synthetic);
	}

	// const x = ["a","b"] as const; x.map((k) => ...)
	const readonlyArrayDeclRe =
		/(?:const|let)\s+(\w+)(?:\s*:\s*[^=]+)?\s*=\s*\[([^\]]*?)\]\s+as\s+const\s*;/g;
	for (const m of src.matchAll(readonlyArrayDeclRe)) {
		const arrName = m[1];
		const rawValues = m[2] ?? "";
		const values = new Set<string>();
		for (const vm of rawValues.matchAll(/["'`]([^"'`]+)["'`]/g)) values.add(vm[1]);
		if (values.size) arrayValues.set(arrName, values);
	}

	// type === "x" / type === 1 constraints
	const literalCompareRe = /(\w+)\s*===\s*(?:"([^"]+)"|'([^']+)'|`([^`]+)`|(\d+))/g;
	for (const m of src.matchAll(literalCompareRe)) {
		const v = m[1];
		const lit = m[2] ?? m[3] ?? m[4] ?? m[5] ?? "";
		if (!lit) continue;
		if (!varLiterals.has(v)) varLiterals.set(v, new Set());
		varLiterals.get(v)?.add(lit);
	}

	// Special extraction for motif constants
	const motifBlockMatch =
		/const\s+MOTIFS_BY_ESSAY_TYPE[\s\S]*?=\s*\{([\s\S]*?)\};/.exec(src);
	if (motifBlockMatch) {
		const vals = new Set<string>();
		for (const m of motifBlockMatch[1].matchAll(/["'`]([A-Z_]+)["'`]/g)) {
			vals.add(m[1]);
		}
		if (vals.size) varLiterals.set("motif", vals);
	}

	return { arrayProps, objectProps, arrayValues, aliases, mapBindings, varLiterals };
}

function resolveAliasTargets(
	name: string,
	aliases: Map<string, Set<string>>,
	seen = new Set<string>(),
): Set<string> {
	if (seen.has(name)) return new Set();
	seen.add(name);
	const direct = aliases.get(name);
	if (!direct || !direct.size) return new Set([name]);
	const out = new Set<string>();
	for (const d of direct) {
		for (const x of resolveAliasTargets(d, aliases, seen)) out.add(x);
	}
	return out;
}

function resolveDynamicKeys(raw: string, ns: string, hints: FileHints): string[] {
	const directProp = /^(\w+)\.(\w+)$/.exec(raw);
	if (directProp) {
		const itemVar = directProp[1];
		const prop = directProp[2];
		const mappedArrays = hints.mapBindings.get(itemVar);
		const resolved = new Set<string>();
		if (mappedArrays?.size) {
			for (const arr of mappedArrays) {
				const targets = resolveAliasTargets(arr, hints.aliases);
				for (const t of targets) {
					const values = hints.arrayProps.get(t)?.get(prop);
					if (!values) continue;
					for (const v of values) resolved.add(ns ? `${ns}.${v}` : v);
				}
			}
		}
		for (const t of resolveAliasTargets(itemVar, hints.aliases)) {
			const arrValues = hints.arrayProps.get(t)?.get(prop);
			if (arrValues) {
				for (const v of arrValues) resolved.add(ns ? `${ns}.${v}` : v);
			}
			const values = hints.objectProps.get(t)?.get(prop);
			if (!values) continue;
			for (const v of values) resolved.add(ns ? `${ns}.${v}` : v);
		}
		return [...resolved];
	}

	// suggestedActions.${type}.title
	const templateVarWithSuffix =
		/^([a-zA-Z0-9_.-]+)\.\$\{(\w+)\}\.([a-zA-Z0-9_.-]+)$/.exec(raw);
	if (templateVarWithSuffix) {
		const prefix = templateVarWithSuffix[1];
		const varName = templateVarWithSuffix[2];
		const suffix = templateVarWithSuffix[3];
		const values = new Set<string>(hints.varLiterals.get(varName) ?? []);
		const mappedArrays = hints.mapBindings.get(varName);
		if (mappedArrays?.size) {
			for (const arr of mappedArrays) {
				for (const t of resolveAliasTargets(arr, hints.aliases)) {
					for (const v of hints.arrayValues.get(t) ?? []) values.add(v);
				}
			}
		}
		if (!values?.size) return [];
		return [...values].map((v) => (ns ? `${ns}.${prefix}.${v}.${suffix}` : `${prefix}.${v}.${suffix}`));
	}
	const templateVarWithPostfix =
		/^([a-zA-Z0-9_.-]+)\.\$\{(\w+)\}([a-zA-Z0-9_.-]+)$/.exec(raw);
	if (templateVarWithPostfix) {
		const prefix = templateVarWithPostfix[1];
		const varName = templateVarWithPostfix[2];
		const postfix = templateVarWithPostfix[3];
		const values = new Set<string>(hints.varLiterals.get(varName) ?? []);
		const mappedArrays = hints.mapBindings.get(varName);
		if (mappedArrays?.size) {
			for (const arr of mappedArrays) {
				for (const t of resolveAliasTargets(arr, hints.aliases)) {
					for (const v of hints.arrayValues.get(t) ?? []) values.add(v);
				}
			}
		}
		if (!values.size) return [];
		return [...values].map((v) => (ns ? `${ns}.${prefix}.${v}${postfix}` : `${prefix}.${v}${postfix}`));
	}
	const charAtSlicePattern =
		/^([a-zA-Z0-9_.-]+)\.\$\{(\w+)\.charAt\(0\)\.toUpperCase\(\)\s*\+\s*\2\.slice\(1\)\}$/.exec(
			raw,
		);
	if (charAtSlicePattern) {
		const prefix = charAtSlicePattern[1];
		const varName = charAtSlicePattern[2];
		const values = new Set<string>(hints.varLiterals.get(varName) ?? []);
		const mappedArrays = hints.mapBindings.get(varName);
		if (mappedArrays?.size) {
			for (const arr of mappedArrays) {
				for (const t of resolveAliasTargets(arr, hints.aliases)) {
					for (const v of hints.arrayValues.get(t) ?? []) values.add(v);
				}
			}
		}
		if (!values.size) return [];
		return [...values].map((v) => {
			const cap = v.charAt(0).toUpperCase() + v.slice(1);
			const key = `${prefix}.${cap}`;
			return ns ? `${ns}.${key}` : key;
		});
	}

	// kind.${item.kind}
	const templateProp = /^([a-zA-Z0-9_.-]+)\.\$\{(\w+)\.(\w+)\}$/.exec(raw);
	if (templateProp) {
		const prefix = templateProp[1];
		const itemVar = templateProp[2];
		const prop = templateProp[3];
		const mappedArrays = hints.mapBindings.get(itemVar);
		if (!mappedArrays?.size) return [];
		const resolved = new Set<string>();
		for (const arr of mappedArrays) {
			const targets = resolveAliasTargets(arr, hints.aliases);
			for (const t of targets) {
				const values = hints.arrayProps.get(t)?.get(prop);
				if (!values) continue;
				for (const v of values) {
					const key = `${prefix}.${v}`;
					resolved.add(ns ? `${ns}.${key}` : key);
				}
			}
		}
		return [...resolved];
	}

	return [];
}

const calls: Call[] = [];
const dynamics: Dynamic[] = [];
const dynamicNamespaces = new Set<string>();
const prefixPatterns: PrefixPattern[] = [];
const allNamespacePatterns = new Set<string>();
const seenCalls = new Set<string>();
const seenDynamics = new Set<string>();
const files = ROOTS.flatMap((r) => walk(r));

for (const file of files) {
	const src = readFileSync(file, "utf8");
	const hints = buildFileHints(src, file);
	const bindings: Array<{ name: string; ns: string }> = [];
	const seenBindings = new Set<string>();
	for (const m of src.matchAll(BINDING_RE)) {
		const name = m[1];
		const ns = m[2] ?? "";
		const id = `${name}|${ns}`;
		if (seenBindings.has(id)) continue;
		seenBindings.add(id);
		bindings.push({ name, ns });
	}
	if (!bindings.length) continue;

	for (const { name, ns } of bindings) {
		for (const m of src.matchAll(callRegex(name))) {
			const line = src.slice(0, m.index).split("\n").length;
			const isTpl = Boolean(m[3]);
			const key = isTpl ? (m[4] ?? "") : (m[2] ?? "");
			if (!key) continue;
			if (isTpl && /\$\{/.test(key)) {
				const resolvedKeys = resolveDynamicKeys(key, ns, hints);
				if (resolvedKeys.length) {
					for (const fullKey of resolvedKeys) {
						const callId = `${file}:${line}:${name}:${fullKey}`;
						if (seenCalls.has(callId)) continue;
						seenCalls.add(callId);
						calls.push({ file, line, namespace: ns, key: fullKey });
					}
					continue;
				}
				const prefixPattern =
					/^([a-zA-Z0-9_.-]+)\.\$\{[^}]+\}(?:\.([a-zA-Z0-9_.-]+))?$/.exec(key);
				if (prefixPattern) {
					prefixPatterns.push({
						namespace: ns,
						prefix: prefixPattern[1],
						suffix: prefixPattern[2],
					});
					dynamicNamespaces.add(ns);
					continue;
				}
				const id = `${file}:${line}:${name}:${key}`;
				if (!seenDynamics.has(id)) {
					seenDynamics.add(id);
					dynamics.push({ file, line, binding: name, raw: key });
				}
				dynamicNamespaces.add(ns);
				continue;
			}
			const fullKey = ns ? `${ns}.${key}` : key;
			const callId = `${file}:${line}:${name}:${fullKey}`;
			if (seenCalls.has(callId)) continue;
			seenCalls.add(callId);
			calls.push({
				file,
				line,
				namespace: ns,
				key: fullKey,
			});
		}

		for (const m of src.matchAll(dynamicCallRegex(name))) {
			const line = src.slice(0, m.index).split("\n").length;
			const raw = m[1]?.trim() ?? "";
			if (!raw) continue;
			const resolvedKeys = resolveDynamicKeys(raw, ns, hints);
			if (resolvedKeys.length) {
				for (const fullKey of resolvedKeys) {
					const callId = `${file}:${line}:${name}:${fullKey}`;
					if (seenCalls.has(callId)) continue;
					seenCalls.add(callId);
					calls.push({ file, line, namespace: ns, key: fullKey });
				}
				continue;
			}
			const nullishStatus = /^\w+\.status\s*\?\?\s*["'`][^"'`]+["'`]$/.test(raw);
			if (nullishStatus && ns) {
				allNamespacePatterns.add(ns);
				dynamicNamespaces.add(ns);
				continue;
			}
			const id = `${file}:${line}:${name}:${raw}`;
			if (!seenDynamics.has(id)) {
				seenDynamics.add(id);
				dynamics.push({ file, line, binding: name, raw });
			}
			dynamicNamespaces.add(ns);
		}
	}
}

const used = new Set(calls.map((c) => c.key));
const en = flatten(JSON.parse(readFileSync(MESSAGES.en, "utf8")));
const vi = flatten(JSON.parse(readFileSync(MESSAGES.vi, "utf8")));

for (const p of prefixPatterns) {
	const fullPrefix = p.namespace ? `${p.namespace}.${p.prefix}.` : `${p.prefix}.`;
	for (const key of en) {
		if (!key.startsWith(fullPrefix)) continue;
		if (p.suffix && !key.endsWith(`.${p.suffix}`)) continue;
		used.add(key);
	}
}
for (const ns of allNamespacePatterns) {
	const fullPrefix = `${ns}.`;
	for (const key of en) {
		if (key.startsWith(fullPrefix)) used.add(key);
	}
}

const unused = [...en]
	.filter((k) => !used.has(k))
	// Conservative mode: if a namespace has dynamic accesses, we cannot safely
	// infer per-key usage in that namespace.
	.filter(
		(k) =>
			![...dynamicNamespaces].some((ns) => ns && (k === ns || k.startsWith(`${ns}.`))),
	)
	.sort();
const missingEn = [...used].filter((k) => !en.has(k)).sort();
const missingVi = [...used].filter((k) => !vi.has(k)).sort();
const enOnly = [...en].filter((k) => !vi.has(k)).sort();
const viOnly = [...vi].filter((k) => !en.has(k)).sort();

const log = (title: string, items: string[] | Dynamic[]) => {
	console.log(`\n=== ${title} (${items.length}) ===`);
	for (const it of items)
		console.log(typeof it === "string" ? it : `${it.file}:${it.line}  ${it.binding}(\`${it.raw}\`)`);
};

log("Unused keys (in en.json, not referenced)", unused);
log("Missing in en.json (referenced in code)", missingEn);
log("Missing in vi.json (referenced in code)", missingVi);
log("Only in en.json (drift)", enOnly);
log("Only in vi.json (drift)", viOnly);
log(
	"Namespaces with dynamic access (unused check skipped for these)",
	[...dynamicNamespaces].sort(),
);
log("Dynamic template-literal call sites (manual review)", dynamics);

const fatal = missingEn.length + missingVi.length;
process.exit(fatal ? 1 : 0);