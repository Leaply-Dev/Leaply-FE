# Co-Debugging Guide

When reporting bugs, provide context from browser DevTools to help Claude make accurate fixes.

## What to Provide

### Console Errors
- Open DevTools: `F12` or `Cmd+Option+I`
- Copy red error messages with stack traces

### Network Tab
- Filter by Fetch/XHR
- For failed requests: URL, status code, response body, Authorization header presence

### TanStack Query DevTools
- Click React Query button (bottom-left)
- Report: query key, status color (green/blue/yellow/gray), error message, cached data

## Good Bug Report

```
The program list isn't loading on /explore page.

Console: "Request failed with status code 403"

Network:
- GET /api/programs → 403 Forbidden
- Authorization header missing

Query DevTools:
- Key: ["programs"], Status: error
- Error: "AxiosError: Request failed with status code 403"
```

## Common Issues

**403/401**: Check Network tab for Authorization header, Application tab for `leaply-auth-state` cookie

**Stale data**: Check Query DevTools status color, try Invalidate button

**Infinite requests**: Check if query key contains changing values (timestamps, new objects each render)
