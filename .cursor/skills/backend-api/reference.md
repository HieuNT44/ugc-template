# Backend API — Extended Reference

> Keep [SKILL.md](SKILL.md) as the operational summary.

## Table of contents

1. [Hạ tầng & kết nối](SKILL.md#1-hạ-tầng--kết-nối)
2. [Response contract](SKILL.md#2-response-contract) + [development-flow.md](development-flow.md)
3. [Error handling](errors.md)
4. _(pending)_ Authentication (login, register, refresh, logout)
5. _(pending)_ Pagination (`meta` shape)
6. _(pending)_ Endpoints by domain

---

## BE architecture (summary)

```
Client → routes/api.php (/api/v1, auth:sanctum)
      → Action (rules → handle → Resource | BaseException)
      → ErrorResource (global handler)
```

Full diagram: [development-flow.md](development-flow.md) | [.docs/api-development-flow](../../../.docs/api-development-flow/api-development-flow.md)

---

## Success vs error envelopes

| Type                | HTTP      | Body shape                                       |
| ------------------- | --------- | ------------------------------------------------ |
| GET one             | 200       | `{ "data": { ... } }`                            |
| GET list            | 200       | `{ "data": [...], "meta": { ... } }`             |
| POST create         | **201**   | `{ "data": { ... } }` + optional `Location`      |
| PUT / PATCH         | 200       | `{ "data": { ... } }`                            |
| DELETE              | **204**   | No body                                          |
| Success (some auth) | 2xx       | `{ "message": "..." }` — no `data` wrap          |
| Error               | 4xx / 5xx | `{ "error": { "code", "message", "details?" } }` |

- JSON keys: **snake_case**
- Public IDs: **`external_id`** (UUID) — never auto-increment `id`
- Classify errors by **`response.status`** + **`error.code`**

---

## CORS troubleshooting

| Symptom                         | Likely cause                              |
| ------------------------------- | ----------------------------------------- |
| Browser CORS error on preflight | BE `FRONTEND_URL` mismatch                |
| `401` on protected route        | Missing/expired Bearer token              |
| `419` / CSRF (Laravel)          | Bearer-only Sanctum — confirm token guard |

---

## 4) Authentication

_TBD — document request/response for:_

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

Auth error mapping: [errors.md §3.3](errors.md#33-auth-endpoints-mapping-target)

---

## 5) Pagination

_TBD — confirm `meta` fields from BE Collection resources._

---

## 6) Endpoints by domain

_TBD — group by resource (users, posts, payments, …)._
