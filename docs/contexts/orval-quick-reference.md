# Orval Quick Reference Card

## 🚀 Commands

```bash
bun generate:api         # Generate API client from OpenAPI spec
bun generate:api:watch   # Watch mode (regenerate on changes)
```

## 📁 Generated Structure

```
lib/generated/api/
├── endpoints/           # React Query hooks
│   ├── admin/
│   ├── applications/
│   ├── authentication/
│   ├── explore/
│   ├── home/
│   ├── oauth/
│   ├── onboarding/
│   ├── persona-lab/
│   └── user/
├── models/              # TypeScript types
└── zod/                 # Validation schemas
```

## 💻 Usage Examples

### Query (GET)
```typescript
import { useListPrograms } from "@/lib/generated/api/endpoints/explore/explore";

const { data, isLoading, error } = useListPrograms({
  params: { page: 1, size: 20 }
});
```

### Mutation (POST/PUT/DELETE)
```typescript
import { useSaveProgram } from "@/lib/generated/api/endpoints/explore/explore";

const { mutate, isPending } = useSaveProgram({
  mutation: {
    onSuccess: () => alert("Saved!"),
  },
});

mutate({ id: "program-id" });
```

### With Zod Validation
```typescript
import { loginSchema } from "@/lib/generated/api/zod/authentication.zod";

const validData = loginSchema.parse(formData);
```

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| [orval.config.ts](../orval.config.ts) | Orval configuration |
| [lib/api/mutator.ts](../lib/api/mutator.ts) | Custom fetch wrapper (auth) |
| [package.json](../package.json) | Scripts |
| [.gitignore](../.gitignore) | Ignore generated files |

## 📝 Key Features

- ✅ Type-safe hooks auto-generated from OpenAPI
- ✅ Authentication built-in (Bearer token + refresh)
- ✅ Zod validation schemas included
- ✅ No Axios dependency (uses native fetch)
- ✅ Auto-formatted with Biome
- ✅ Works with existing TanStack Query setup

## 🔁 When to Regenerate

- Backend API schema changes
- New endpoints added
- Request/response types modified

```bash
bun generate:api  # Always run after API changes
```

## 📚 Documentation

- [Setup Guide](./orval-setup.md) - Complete documentation
- [Summary](./orval-summary.md) - Setup summary
- [Orval Docs](https://orval.dev) - Official documentation

## 🎯 Best Practices

1. **Use generated hooks** for all new API integrations
2. **Don't edit generated files** - regenerate instead
3. **Regenerate after API changes** to stay synchronized
4. **Use Zod schemas** for form validation
5. **Handle errors** with `onError` callbacks

## 🐛 Common Issues

### Generation fails
```bash
curl https://api.leaply.ai.vn/api/api-docs  # Check spec accessibility
```

### Type errors
```bash
bun generate:api  # Regenerate
bun build         # Rebuild
```

### Biome errors
```bash
bun check lib/generated/  # Run Biome manually
```
