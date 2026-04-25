/** Strip PII and oversized values from analytics event props before send. */

const PII_KEY_PATTERN = /password|token|secret/i;
const MAX_STRING_LENGTH = 200;

/**
 * Sanitize event props: strip sensitive keys, truncate long strings.
 * Email is intentionally NOT stripped here — it's allowed in identify() only.
 * For regular track() calls, callers must not pass email in props.
 */
export function sanitizeProps(
	props: Record<string, unknown>,
): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(props)) {
		if (PII_KEY_PATTERN.test(key)) continue;
		if (typeof value === "string" && value.length > MAX_STRING_LENGTH) {
			result[key] = value.slice(0, MAX_STRING_LENGTH);
		} else {
			result[key] = value;
		}
	}
	return result;
}
