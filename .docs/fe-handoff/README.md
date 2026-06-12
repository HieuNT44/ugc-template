# RealRead API — Frontend Handoff (Auth + Profile)

**Phase:** 1 — Authentication & Profile  
**API version:** `v1`  
**Last updated:** 2026-06-11

Package này gồm mọi thứ FE cần để tích hợp Auth + Profile với Laravel API.

---

## Contents

| File | Description |
|------|-------------|
| [connection.md](./connection.md) | Base URL, env, headers, CORS, token flow |
| [endpoints.md](./endpoints.md) | Danh sách endpoint Auth + Profile |
| [error-handling.md](./error-handling.md) | Error envelope, codes quan trọng |
| [enums-and-entities.md](./enums-and-entities.md) | Enum values + ERD thực thể |
| [api-db-mapping.md](./api-db-mapping.md) | API field ↔ DB column (chỗ khác nhau) |
| [known-gaps.md](./known-gaps.md) | Gap cần align BE/FE trước khi implement |
| [types/domain-types.ts](./types/domain-types.ts) | TypeScript types (copy vào FE project) |
| [test-accounts.example.md](./test-accounts.example.md) | Template tài khoản test |

## OpenAPI / Swagger

- **Swagger UI:** `{API_BASE}/api/documentation`
- **OpenAPI JSON:** `{API_BASE}/api/documentation.json` hoặc file `storage/api-docs/api-docs.json` trong repo BE

> Thay `{API_BASE}` bằng URL thực tế (local: `http://localhost:8000`, staging: do BE team cung cấp).

## Related docs (full spec trong repo BE)

- [API Error Handling](../api-error-handling/api-error-handling.md)
- [API Development Flow](../api-development-flow/api-development-flow.md)

## Quick start checklist

- [ ] Nhận staging API URL + test accounts từ BE
- [ ] Set `NEXT_PUBLIC_API_URL` (hoặc tương đương) → `/api/v1`
- [ ] Cấu hình CORS: BE set `FRONTEND_URL` = URL Next.js
- [ ] Copy `types/domain-types.ts` vào FE project
- [ ] Implement Bearer token storage + axios/fetch interceptor
- [ ] Đọc [known-gaps.md](./known-gaps.md) trước khi làm forgot-password & avatar upload
