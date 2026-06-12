# Connection & Auth Flow

## Base URL

| Environment    | Base URL                       |
| -------------- | ------------------------------ |
| Local (Docker) | `http://localhost:8000/api/v1` |
| Staging        | _BE team cung cấp_             |

Tất cả endpoint trong package này có prefix `/api/v1`.

## Frontend env (Next.js example)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=   # nếu dùng Google Sign-In
```

**Lưu ý:** Nếu dùng Next.js rewrite proxy (`NEXT_PUBLIC_API_URL=/api/v1`), cần cấu hình rewrite trỏ về Laravel (`http://localhost:8000/api`).

## Backend env (BE team cấu hình)

```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000   # URL Next.js — dùng cho CORS
GOOGLE_CLIENT_ID=                    # nếu dùng Google login
```

## Required headers

Mọi request:

```http
Accept: application/json
Content-Type: application/json
```

Protected routes thêm:

```http
Authorization: Bearer {access_token}
```

Optional (auth endpoints):

```http
X-Client-Type: web          # hoặc gửi client_type trong body
X-Device-Name: chrome-mac   # hoặc gửi device_name trong body
```

## Authentication

- **Mechanism:** Laravel Sanctum Bearer token — **không dùng session cookie**
- **Login/Register response:** lưu `data.access_token`, gắn vào header mọi request protected
- **Token TTL:**
  - `client_type: "web"` → 24 giờ
  - `client_type: "mobile"` → 7 ngày
- **Refresh:** `POST /auth/refresh` (cần Bearer token hiện tại) → nhận token mới
- **Logout:** `POST /auth/logout` → thu hồi token hiện tại

## Response envelope

**Success:**

```json
{ "data": { ... } }
```

Một số endpoint trả `{ "message": "..." }` (forgot-password, change-password).

**Error:**

```json
{
  "error": {
    "code": "invalid_credentials",
    "message": "...",
    "details": []
  }
}
```

## Public ID convention

- `User.id`, `Profile.id` → **UUID** (`external_id` ở DB)
- Sub-resources (`experiences`, `educations`, …) → **`id` là integer** (DB auto-increment)
- **Không** dùng integer `users.id` — FE không bao giờ nhận field này

## CORS

BE chỉ allow origins từ `FRONTEND_URL` và `APP_URL`. FE chạy port/origin khác → báo BE cập nhật `FRONTEND_URL`.
