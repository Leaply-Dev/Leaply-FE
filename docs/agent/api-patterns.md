# API Patterns (Non-Generated)

## Mutation Callbacks

Generated hooks don't include cache invalidation. Add manually:

```typescript
const { mutate } = useSaveProgram({
  mutation: {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/v1/programs"] });
    },
  },
});
```

## Optimistic Updates

For instant UI feedback before server response:

```typescript
useMutation({
  mutationFn: saveProgram,
  onMutate: async (variables) => {
    await queryClient.cancelQueries({ queryKey: ["programs"] });
    const previous = queryClient.getQueryData(["programs"]);
    queryClient.setQueryData(["programs"], (old) => /* optimistic update */);
    return { previous };
  },
  onError: (err, vars, context) => {
    queryClient.setQueryData(["programs"], context?.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["programs"] });
  },
});
```

## Query Keys

Generated hooks use URL paths as query keys (e.g., `["/v1/programs"]`). Match these when invalidating.
