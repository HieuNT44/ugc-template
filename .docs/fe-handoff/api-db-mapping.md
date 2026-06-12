# API ↔ DB Mapping

FE type theo **API response**, không theo DB. Bảng này giải thích chỗ khác nhau.

## User

| API field           | DB column                 | Note                                |
| ------------------- | ------------------------- | ----------------------------------- |
| `id`                | `users.external_id`       | UUID — **không** dùng `users.id`    |
| `email`             | `users.email`             |                                     |
| `role`              | `users.role`              | enum string                         |
| `status`            | `users.status`            | enum string                         |
| `expert_status`     | `users.expert_status`     | enum string                         |
| `email_verified_at` | `users.email_verified_at` | ISO 8601                            |
| —                   | `users.password`          | **Không expose**                    |
| —                   | `users.id`                | Integer internal — **không expose** |

## Profile

| API field         | DB column                  | Note               |
| ----------------- | -------------------------- | ------------------ |
| `id`              | `profiles.external_id`     | UUID               |
| `avatar_url`      | `profiles.avatar_path`     | BE resolve CDN URL |
| `cover_url`       | `profiles.cover_path`      | BE resolve CDN URL |
| `skills`          | `profiles.skills`          | JSON array         |
| `onboarding_step` | `profiles.onboarding_step` | enum string        |
| Các field còn lại | cùng tên column            | snake_case         |

## UserSettings

| API field            | DB column                          |
| -------------------- | ---------------------------------- |
| `dark_mode`          | `user_settings.dark_mode`          |
| `language`           | `user_settings.language`           |
| `timezone`           | `user_settings.timezone`           |
| `email_notify`       | `user_settings.email_notify`       |
| `inapp_notify`       | `user_settings.inapp_notify`       |
| `privacy_hide_email` | `user_settings.privacy_hide_email` |

## Profile sub-resources

| API field        | DB column                  | Note                            |
| ---------------- | -------------------------- | ------------------------------- |
| `id`             | `{table}.id`               | **Integer** — khác User/Profile |
| `upload_file_id` | `upload_files.external_id` | UUID (certification only)       |
| `image_url`      | derived from upload        | BE resolve URL                  |

## Field constraints (validation reference)

| Field       | Max / Rule                      |
| ----------- | ------------------------------- |
| `email`     | max 255, email format           |
| `password`  | min 8, max 24                   |
| `full_name` | max 100                         |
| `username`  | max 50, `alpha_dash`, unique    |
| `headline`  | max 120                         |
| `bio`       | max 5000                        |
| `industry`  | max 100                         |
| `skills`    | max 20 items, each max 50 chars |
| Social URLs | valid URL, max 255              |
