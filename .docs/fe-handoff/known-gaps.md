# Known Gaps & Alignment Items

Các điểm cần BE/FE thống nhất trước hoặc trong lúc implement.

## 1. Forgot password — reset URL

Email reset hiện trỏ tới:

```
{APP_URL}/reset-password?token={token}
```

→ URL của **BE** (vd. `http://localhost:8000/reset-password?token=...`), không phải FE.

**Cần chọn một:**

- FE implement route `/reset-password` trên domain BE (không khả thi nếu FE tách riêng), **hoặc**
- BE đổi link email sang `{FRONTEND_URL}/reset-password?token=...` (khuyến nghị)

FE cần page nhận `?token=` và gọi `POST /api/v1/auth/reset-password`.

## 2. Avatar / cover upload

- API upload có `upload_type: profile_avatar` | `profile_cover`
- `PUT /profile` hỗ trợ `avatar_upload_file_id` và `cover_upload_file_id` (nullable để xóa ảnh).
- FE settings profile gọi attach sau bước complete upload.

Certification **đã support** `upload_file_id` trong sync.

## 3. Accept-Language

- Doc spec có `Accept-Language: ja|en`
- Middleware **chưa implement** — message lỗi theo `APP_LOCALE` của BE
- FE có thể gửi header sẵn; chưa có hiệu lực

## 4. Token error codes

- Spec có `token_expired`, `token_invalid` riêng
- Hiện tại hầu hết trả chung `unauthorized` (401)

## 5. Admin role

- User `role: admin` dùng admin panel SPA trong repo BE
- App user FE (reader/creator) **không** cần implement admin flows phase 1
