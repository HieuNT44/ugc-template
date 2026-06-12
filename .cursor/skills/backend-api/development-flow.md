# API Development Flow — FE Integration Guide

> Full BE workflow: [.docs/api-development-flow/api-development-flow.md](../../../.docs/api-development-flow/api-development-flow.md)

This file translates the BE development flow into what the **Next.js frontend** must know when consuming or integrating a new endpoint.

---

## BE request flow (what FE talks to)

```
Client (Next.js)
  → /api/v1/{resource}     (Laravel routes/api.php + auth:sanctum)
  → Action.rules()         → 422 validation_error + details[]
  → Action.handle()        → 200/201 + { data } or BaseException → { error }
  → Resource               → snake_case JSON, external_id (not integer id)
  → ErrorResource          → { error: { code, message, details? } }
```

**FE implications:**

- Read Action `rules()` (or Swagger) for exact field names — e.g. login uses `email`, not `username`
- All paths under `/api/v1`, kebab-case plural (`/team-members`, `/auth/login`)
- Protected = `Authorization: Bearer` — never cookies / `withCredentials`
- Public resource IDs = `external_id` (UUID string) — never use auto-increment `id` in URLs or types

---

## Response contract (Phase 5)

| Operation   | HTTP    | FE expects                                                     |
| ----------- | ------- | -------------------------------------------------------------- |
| GET one     | 200     | `response.data` — single object                                |
| GET list    | 200     | `response.data` — array + `response.meta`                      |
| POST create | **201** | `response.data` + optional `Location` header                   |
| PUT / PATCH | 200     | `response.data`                                                |
| DELETE      | **204** | No body — `apiClient` returns `undefined`                      |
| Error       | 4xx/5xx | Throw `ApiError` from `{ error }` — see [errors.md](errors.md) |

**Never assume:**

- `success: false` with HTTP 200
- Errors inside `data` wrapper
- Integer `id` in API payloads — use `external_id`

### TypeScript shapes

```typescript
// List response
type ApiListResponse<T> = {
  data: T[];
  meta?: Record<string, unknown>; // pagination — confirm shape per endpoint
};

// Single resource
type ApiItemResponse<T> = {
  data: T;
};

// Resource entity (typical)
type ApiEntity = {
  external_id: string;
  // ... snake_case fields from Resource
};
```

Map `snake_case` → camelCase at the feature boundary if needed, or keep snake_case in Zod schemas to match BE exactly.

---

## FE workflow — integrate new endpoint

Mirror BE Phase 0 before writing FE code:

| #   | Question             | FE action                                           |
| --- | -------------------- | --------------------------------------------------- |
| 1   | CRUD or custom?      | Pick hook/action pattern                            |
| 2   | Public or protected? | Attach Bearer token or omit                         |
| 3   | Request body fields? | Match Action `rules()` — Zod schema                 |
| 4   | Response shape?      | Zod-parse `data`; use `external_id` in routes       |
| 5   | Error codes?         | Handle in `handleApiError` — [errors.md](errors.md) |
| 6   | Swagger available?   | Verify at `{API_BASE}/../documentation` or BE repo  |

### File generation order (FE)

| Step | File                                                               |
| ---- | ------------------------------------------------------------------ |
| 1    | `src/features/{name}/types/` — types from Resource / Swagger       |
| 2    | `src/features/{name}/validations/` — Zod (mirror BE `rules()`)     |
| 3    | `src/features/{name}/actions/` — Server Action calling `apiClient` |
| 4    | `src/features/{name}/hooks/` — client hook if needed               |
| 5    | `src/features/{name}/components/` — UI + form + error handling     |
| 6    | `src/app/(site)/...` — page wiring                                 |

### Verify before done (FE)

- [ ] Happy path — correct HTTP status (201 on create, 204 on delete)
- [ ] 422 → field errors from `details[]`
- [ ] 401 on protected route without token
- [ ] 404 on invalid `external_id`
- [ ] 409 on unique fields (register, username)
- [ ] `Accept-Language` sent; `error.message` displayed
- [ ] No `credentials: "include"` / session cookies

---

## URL & naming conventions

| BE rule               | FE must match                                                                      |
| --------------------- | ---------------------------------------------------------------------------------- |
| Prefix `v1`           | `apiClient("/profiles")` not `/api/profiles` — base URL already includes `/api/v1` |
| Kebab-case plural     | `/team-members`, `/auth/login`                                                     |
| `external_id` in path | `/profiles/${profile.external_id}`                                                 |
| `auth:sanctum`        | `accessToken` on protected calls                                                   |
| snake_case JSON       | Request body keys match BE (`full_name`, `device_name`)                            |

---

## Common FE mistakes (from BE §12)

| Wrong                                      | Correct                                     |
| ------------------------------------------ | ------------------------------------------- |
| `/api/profiles` (missing v1 in path logic) | Base URL = `.../api/v1`, path = `/profiles` |
| `username` on login body                   | `email` per Auth Action rules               |
| `withCredentials: true` / session cookie   | `Authorization: Bearer {token}`             |
| `user.id` (number) in links                | `user.external_id` (UUID string)            |
| Expect POST 200 on create                  | Expect **201** + parse `data`               |
| Parse `{ message, errors }` legacy shape   | Parse `{ error: { code, message } }`        |
| Match error by message string              | Branch on `error.code` + HTTP status        |
| Ignore `Location` on 201                   | Optional: redirect to new resource URL      |

---

## Swagger (FE discovery)

When BE ships OpenAPI:

1. Check `/api/documentation` on local BE (`http://localhost:8000/api/documentation`)
2. Protected endpoints use `bearerAuth` — not session
3. Regenerate on BE after changes: `php artisan l5-swagger:generate`

Use Swagger schemas as source of truth for Zod types when integrating.

---

## Related

- [SKILL.md](SKILL.md) — apiClient, headers, error handling patterns
- [errors.md](errors.md) — error codes, validation details
- [reference.md](reference.md) — auth, pagination (TBD)
