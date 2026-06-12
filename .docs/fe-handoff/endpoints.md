# Endpoints — Auth & Profile (Phase 1)

Base: `/api/v1`

---

## Authentication

| Method | Path                     | Auth   | Status | Description                        |
| ------ | ------------------------ | ------ | ------ | ---------------------------------- |
| POST   | `/auth/register`         | —      | 201    | Đăng ký **reader**                 |
| POST   | `/auth/register/creator` | —      | 201    | Đăng ký **creator**                |
| POST   | `/auth/login`            | —      | 200    | Login email/password               |
| POST   | `/auth/social/google`    | —      | 200    | Login Google (`id_token`)          |
| POST   | `/auth/forgot-password`  | —      | 200    | Gửi email reset password           |
| POST   | `/auth/reset-password`   | —      | 200    | Reset password bằng token từ email |
| GET    | `/auth/me`               | Bearer | 200    | Lấy user hiện tại                  |
| POST   | `/auth/refresh`          | Bearer | 200    | Đổi token mới                      |
| POST   | `/auth/logout`           | Bearer | 200    | Thu hồi token                      |
| POST   | `/auth/change-password`  | Bearer | 200    | Đổi mật khẩu (đã login)            |

### Request bodies (summary)

**Register / Login:**

```json
{
  "email": "user@example.com",
  "password": "password12",
  "password_confirmation": "password12",
  "client_type": "web",
  "device_name": "web"
}
```

**Google login:**

```json
{
  "id_token": "<google-id-token>",
  "role": "reader",
  "client_type": "web"
}
```

`role`: `reader` | `creator` (optional, default reader cho user mới).

**Forgot password:**

```json
{ "email": "user@example.com" }
```

**Reset password:**

```json
{
  "token": "<token-from-email>",
  "password": "newpass12",
  "password_confirmation": "newpass12"
}
```

**Change password:**

```json
{
  "current_password": "oldpass12",
  "password": "newpass12",
  "password_confirmation": "newpass12"
}
```

**Validation:** password `min:8`, `max:24`, `confirmed`.

### Auth response shape

```json
{
  "data": {
    "access_token": "1|...",
    "expires_at": "2026-06-12T12:00:00.000000Z",
    "client_type": "web",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "reader",
      "status": "active",
      "expert_status": "none",
      "email_verified_at": null
    }
  }
}
```

---

## Public profiles

| Method | Path                               | Auth | Description                                    |
| ------ | ---------------------------------- | ---- | ---------------------------------------------- |
| GET    | `/profiles/top-committers?limit=3` | —    | Top creators theo số content public đã publish |
| GET    | `/profiles/{username}`             | —    | Xem public profile                             |
| GET    | `/profiles/{username}/contents`    | —    | List public contents của profile               |

### GET `/profiles/top-committers`

Response item:

```json
{
  "id": "uuid",
  "username": "creator_dev",
  "full_name": "Jane Creator",
  "avatar_url": null,
  "bio": "Creator bio",
  "content_count": 12,
  "is_certified": false
}
```

---

## Profile

Tất cả cần **Bearer token**.

| Method | Path                       | Role              | Description               |
| ------ | -------------------------- | ----------------- | ------------------------- |
| GET    | `/profile`                 | All (trừ admin\*) | Xem profile               |
| PUT    | `/profile`                 | All (trừ admin\*) | Cập nhật profile cơ bản   |
| POST   | `/profile/become-creator`  | Reader            | Nâng cấp reader → creator |
| GET    | `/profile/settings`        | Reader, Creator   | Xem settings              |
| PUT    | `/profile/settings`        | Reader, Creator   | Cập nhật settings         |
| GET    | `/profile/experiences`     | Creator           | List kinh nghiệm          |
| PUT    | `/profile/experiences`     | Creator           | Sync kinh nghiệm          |
| GET    | `/profile/educations`      | Creator           | List học vấn              |
| PUT    | `/profile/educations`      | Creator           | Sync học vấn              |
| GET    | `/profile/certifications`  | Creator           | List chứng chỉ            |
| PUT    | `/profile/certifications`  | Creator           | Sync chứng chỉ            |
| GET    | `/profile/accomplishments` | Creator           | List thành tựu            |
| PUT    | `/profile/accomplishments` | Creator           | Sync thành tựu            |

\* Admin dùng admin SPA riêng; `PUT /profile` bị reject cho admin.

### PUT `/profile` — updatable fields

`full_name`, `username`, `headline`, `bio`, `location`, `industry`, `skills[]`, `website_url`, `linkedin_url`, `github_url`, `x_url`, `facebook_url`, `line_url`, `youtube_url`, `is_public`

Partial update — chỉ gửi field cần đổi.

### POST `/profile/become-creator`

- **Role:** `reader` only (409 nếu đã là creator)
- **Body:** không bắt buộc — gọi sau `PUT /profile` với `full_name`, `bio` (≥ 20 ký tự), `skills[]` (≥ 1)
- **Yêu cầu:** `username` + `full_name` đã có trên profile
- **Response:** `200` + profile (creator shape, gồm sub-resources rỗng)
- **Side effect:** `users.role` → `creator`, `onboarding_step` → `completed`

### PUT `/profile/settings`

`dark_mode`, `language` (`ja`|`en`), `timezone`, `email_notify`, `inapp_notify`, `privacy_hide_email`

### Sync pattern (experiences, educations, certifications, accomplishments)

Gửi **full list** mỗi lần sync:

- Item **không có `id`** → tạo mới
- Item **có `id`** → cập nhật
- Item cũ **không có trong request** → xóa

Body ví dụ experiences:

```json
{
  "experiences": [
    {
      "id": 1,
      "company_name": "Acme",
      "title": "Engineer",
      "description": null,
      "start_date": "2020-04-01",
      "end_date": null,
      "is_current": true,
      "location": "Tokyo",
      "sort_order": 0
    }
  ]
}
```

---

## Upload (liên quan profile — certification)

| Method | Path                          | Auth   | Description                         |
| ------ | ----------------------------- | ------ | ----------------------------------- |
| POST   | `/upload-files`               | Bearer | Initiate upload → presigned S3 URLs |
| POST   | `/upload-files/{id}/complete` | Bearer | Complete multipart upload           |

`upload_type`: `profile_avatar` | `profile_cover` | `profile_certification`

Xem [known-gaps.md](./known-gaps.md) về avatar/cover.

---

## Flow gợi ý cho FE

```
Register/Login → lưu access_token
     ↓
GET /auth/me → role, status
     ↓
GET /profile → onboarding_step, profile data
     ↓
PUT /profile (onboarding) → cập nhật profile_basic
     ↓
POST /profile/onboarding/complete → đánh dấu completed (reader)
     ↓
Reader → Creator: PUT /profile (bio, skills, …) → POST /profile/become-creator
     ↓
(Creator) PUT /profile/experiences, ... (sync sub-resources)
     ↓
GET /profile/settings → user preferences
```
