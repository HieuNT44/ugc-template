# API Error Handling — RealRead (BE Contract)

**Project:** RealRead | **Version:** 1.0 | **Date:** 11/06/2026

---

## 1. NGUYÊN TẮC

| Nguyên tắc                 | Mô tả                                      |
| :------------------------- | :----------------------------------------- |
| **HTTP Status Code chuẩn** | Dùng đúng status code cho từng loại lỗi    |
| **Error code duy nhất**    | Mỗi lỗi có một mã duy nhất để client xử lý |
| **Message đa ngôn ngữ**    | Hỗ trợ tiếng Nhật (ja) và tiếng Anh (en)   |
| **Chi tiết lỗi rõ ràng**   | Validation lỗi có field-level details      |

**Quy ước client:**

- Phân loại lỗi bằng **HTTP status code** và **`error.code`** — không dùng field `success: false` với HTTP 200.
- Success response dùng envelope `{ "data": ... }`; error response dùng envelope `{ "error": ... }`.
- JSON field naming: **snake_case**.

**Related:** [development-flow.md](development-flow.md) | [.docs/api-development-flow](../../../.docs/api-development-flow/api-development-flow.md)

**BE implementation (Laravel):**

- Global handler: `bootstrap/app.php`
- Error envelope: `app/Http/Resources/ErrorResource.php`
- Business errors: `app/Exceptions/BaseException.php`
- Lang files: `lang/en/errors.php`, `lang/ja/errors.php`, `lang/{locale}/validation.php`

---

## 2. CẤU TRÚC ERROR RESPONSE

### 2.1. Lỗi thông thường

```json
{
  "error": {
    "code": "unauthorized",
    "message": "認証が必要です"
  }
}
```

### 2.2. Lỗi validation

```json
{
  "error": {
    "code": "validation_error",
    "message": "入力内容に誤りがあります",
    "details": [
      {
        "field": "email",
        "message": "メールアドレスは必須です",
        "code": "required"
      },
      {
        "field": "password",
        "message": "パスワードは8文字以上で入力してください",
        "code": "min_length"
      }
    ]
  }
}
```

| Field           | Mô tả                                                   |
| :-------------- | :------------------------------------------------------ |
| `error.code`    | Machine-readable code (ổn định, không phụ thuộc locale) |
| `error.message` | Message tổng quát hiển thị cho user (đã localize)       |
| `error.details` | Optional — chỉ dùng cho validation 422                  |

---

## 3. ERROR CODES & MESSAGES

### 3.1. Client Errors (4xx)

| Status  | Error Code                | Message (EN)                    | Message (JA)                                   |
| :------ | :------------------------ | :------------------------------ | :--------------------------------------------- |
| **400** | `bad_request`             | Bad request                     | 不正なリクエストです                           |
| **400** | `invalid_json`            | Invalid JSON format             | JSON形式が無効です                             |
| **400** | `missing_parameter`       | Missing required parameter      | 必須パラメータが不足しています                 |
| **401** | `unauthorized`            | Unauthorized                    | 認証が必要です                                 |
| **401** | `invalid_credentials`     | Email or password is incorrect. | メールアドレスかパスワードが正しくありません。 |
| **401** | `token_expired`           | Token has expired               | トークンの有効期限が切れました                 |
| **401** | `token_invalid`           | Invalid token                   | 無効なトークンです                             |
| **401** | `token_not_provided`      | Token not provided              | トークンが提供されていません                   |
| **403** | `forbidden`               | Forbidden                       | アクセス権限がありません                       |
| **403** | `account_banned`          | Account has been banned         | アカウントが停止されました                     |
| **403** | `email_not_verified`      | Email not verified              | メールアドレスが確認されていません             |
| **403** | `expert_not_approved`     | Expert status not approved      | 専門家として承認されていません                 |
| **404** | `not_found`               | Resource not found              | リソースが見つかりません                       |
| **404** | `user_not_found`          | User not found                  | ユーザーが見つかりません                       |
| **404** | `content_not_found`       | Content not found               | コンテンツが見つかりません                     |
| **409** | `email_already_exists`    | Email already exists            | このメールアドレスは既に登録されています       |
| **409** | `username_already_exists` | Username already exists         | このユーザー名は既に使用されています           |
| **409** | `already_purchased`       | Content already purchased       | このコンテンツは既に購入済みです               |
| **409** | `expert_request_pending`  | Expert request already pending  | 専門家申請は既に提出済みです                   |
| **422** | `validation_error`        | Validation failed               | 入力内容に誤りがあります                       |
| **429** | `rate_limit_exceeded`     | Too many requests               | リクエスト数が制限を超えました                 |

### 3.2. Server Errors (5xx)

| Status  | Error Code              | Message (EN)                    | Message (JA)                     |
| :------ | :---------------------- | :------------------------------ | :------------------------------- |
| **500** | `internal_server_error` | Internal server error           | サーバーエラーが発生しました     |
| **502** | `bad_gateway`           | Bad gateway                     | ゲートウェイエラーが発生しました |
| **503** | `service_unavailable`   | Service temporarily unavailable | サービスは一時的に利用できません |

### 3.3. Auth endpoints mapping (target)

| Endpoint                     | Tình huống              | Status | Error Code                                               |
| :--------------------------- | :---------------------- | :----: | :------------------------------------------------------- |
| `POST /api/v1/auth/login`    | Sai email/password      |  401   | `invalid_credentials`                                    |
| `POST /api/v1/auth/login`    | Account banned          |  403   | `account_banned`                                         |
| `POST /api/v1/auth/login`    | Input validation        |  422   | `validation_error`                                       |
| `POST /api/v1/auth/login`    | Rate limit              |  429   | `rate_limit_exceeded`                                    |
| `POST /api/v1/auth/register` | Email trùng             |  409   | `email_already_exists`                                   |
| `GET /api/v1/auth/me`        | Token thiếu/sai/hết hạn |  401   | `token_not_provided` / `token_invalid` / `token_expired` |
| `POST /api/v1/auth/refresh`  | Account inactive        |  403   | `account_banned`                                         |
| `POST /api/v1/auth/logout`   | Token không hợp lệ      |  401   | `unauthorized`                                           |

---

## 4. VALIDATION RULES

### 4.1. Common Validation Rules

| Rule            | Description (EN)                              | Description (JA)                           |
| :-------------- | :-------------------------------------------- | :----------------------------------------- |
| `required`      | This field is required                        | このフィールドは必須です                   |
| `required_with` | This field is required when :field is present | :fieldがある場合、このフィールドは必須です |
| `email`         | Must be a valid email address                 | 有効なメールアドレスを入力してください     |
| `min:n`         | Must be at least :n characters                | :n文字以上で入力してください               |
| `max:n`         | Must not exceed :n characters                 | :n文字以内で入力してください               |
| `unique`        | This value already exists                     | この値は既に存在します                     |
| `confirmed`     | Confirmation does not match                   | 確認用の値と一致しません                   |
| `exists`        | Selected value is invalid                     | 選択された値は無効です                     |
| `in`            | Selected value is invalid                     | 選択された値は無効です                     |
| `regex`         | Format is invalid                             | 形式が無効です                             |

### 4.2. Field-Specific Validation

| Field                   | Rules (EN)                                                | Rules (JA)                                         |
| :---------------------- | :-------------------------------------------------------- | :------------------------------------------------- |
| `email`                 | Required, valid email, max 191, unique                    | 必須、有効なメールアドレス、191文字以内、一意      |
| `password`              | Required, min 8, confirmed                                | 必須、8文字以上、確認用と一致                      |
| `full_name`             | Required, max 100                                         | 必須、100文字以内                                  |
| `username`              | Required, max 50, regex: `^[a-z0-9_]+$`, unique           | 必須、50文字以内、英数字とアンダースコアのみ、一意 |
| `headline`              | Max 120                                                   | 120文字以内                                        |
| `location`              | Max 255                                                   | 255文字以内                                        |
| `industry`              | Max 100                                                   | 100文字以内                                        |
| `company_name`          | Required, max 255                                         | 必須、255文字以内                                  |
| `title` (experience)    | Required, max 255                                         | 必須、255文字以内                                  |
| `school_name`           | Required, max 255                                         | 必須、255文字以内                                  |
| `degree`                | Max 100                                                   | 100文字以内                                        |
| `field_of_study`        | Max 255                                                   | 255文字以内                                        |
| `name` (certification)  | Required, max 255                                         | 必須、255文字以内                                  |
| `issuing_organization`  | Required, max 255                                         | 必須、255文字以内                                  |
| `type` (accomplishment) | Required, in: project, publication, patent, award, course | 必須、指定された値のみ                             |
| `price`                 | Numeric, min:0, max:5000                                  | 数値、0以上5000以下                                |
| `is_paid`               | Boolean                                                   | 真偽値                                             |

**Auth API hiện tại (đã implement):**

| Field         | Rules                                                           |
| :------------ | :-------------------------------------------------------------- |
| `email`       | `required`, `string`, `email`, `max:255`                        |
| `password`    | `required`, `string`, `min:8`, `max:12`, `confirmed` (register) |
| `device_name` | `sometimes`, `string`, `max:255`                                |

### 4.3. Validation Error Details Format

| Field     | Mô tả                                                                                                                        |
| :-------- | :--------------------------------------------------------------------------------------------------------------------------- |
| `field`   | Tên trường bị lỗi                                                                                                            |
| `message` | Message lỗi (đã localize)                                                                                                    |
| `code`    | Mã lỗi validation (`required`, `email`, `min_length`, `max_length`, `unique`, `confirmed`, `invalid_format`, `out_of_range`) |

---

## 5. VALIDATION CODES

| Validation Code  | Description (EN)              | Description (JA)                   |
| :--------------- | :---------------------------- | :--------------------------------- |
| `required`       | Field is required             | フィールドは必須です               |
| `email`          | Must be a valid email         | 有効なメールアドレスではありません |
| `min_length`     | Value is too short            | 値が短すぎます                     |
| `max_length`     | Value is too long             | 値が長すぎます                     |
| `unique`         | Value already exists          | 値は既に存在します                 |
| `confirmed`      | Confirmation does not match   | 確認用の値と一致しません           |
| `invalid_format` | Format is invalid             | 形式が無効です                     |
| `out_of_range`   | Value is out of allowed range | 値が許容範囲外です                 |
| `invalid_choice` | Selected value is invalid     | 選択された値は無効です             |
| `exists`         | Value does not exist          | 値が存在しません                   |

---

## 6. HTTP STATUS CODES SUMMARY

| Status                | Use Case                                                  |
| :-------------------- | :-------------------------------------------------------- |
| 200 OK                | GET, PUT, PATCH thành công                                |
| 201 Created           | POST tạo resource thành công                              |
| 204 No Content        | DELETE thành công                                         |
| 400 Bad Request       | JSON malformed, thiếu parameter                           |
| 401 Unauthorized      | Token thiếu, hết hạn, không hợp lệ; login sai credentials |
| 403 Forbidden         | Có token nhưng không đủ quyền / account banned            |
| 404 Not Found         | Resource không tồn tại                                    |
| 409 Conflict          | Dữ liệu đã tồn tại (email, username)                      |
| 422 Unprocessable     | Validation lỗi (input format)                             |
| 429 Too Many Requests | Rate limit exceeded                                       |
| 500 Server Error      | Lỗi server không xác định                                 |

---

## 7. VÍ DỤ ERROR RESPONSES

### 7.1. Unauthorized (401)

```json
{
  "error": {
    "code": "token_expired",
    "message": "トークンの有効期限が切れました"
  }
}
```

### 7.2. Invalid credentials (401) — Login

```json
{
  "error": {
    "code": "invalid_credentials",
    "message": "メールアドレスかパスワードが正しくありません。"
  }
}
```

### 7.3. Forbidden (403)

```json
{
  "error": {
    "code": "account_banned",
    "message": "アカウントが停止されました"
  }
}
```

### 7.4. Not Found (404)

```json
{
  "error": {
    "code": "user_not_found",
    "message": "ユーザーが見つかりません"
  }
}
```

### 7.5. Conflict (409)

```json
{
  "error": {
    "code": "email_already_exists",
    "message": "このメールアドレスは既に登録されています"
  }
}
```

### 7.6. Rate Limit (429)

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
```

```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "リクエスト数が制限を超えました。しばらく経ってから再度お試しください"
  }
}
```

### 7.7. Server Error (500)

```json
{
  "error": {
    "code": "internal_server_error",
    "message": "サーバーエラーが発生しました"
  }
}
```

---

## 8. LANGUAGE NEGOTIATION

Client gửi language qua header:

```http
Accept-Language: ja
```

| Header                      | Language          |
| :-------------------------- | :---------------- |
| `Accept-Language: ja`       | 日本語            |
| `Accept-Language: en`       | English           |
| Không gửi hoặc giá trị khác | English (default) |

**Lưu ý triển khai:** Cần middleware đọc `Accept-Language` và gọi `App::setLocale()`. Message lấy từ `lang/{locale}/errors.php` và `lang/{locale}/validation.php`.

---

## 9. IMPLEMENTATION STATUS (BE snapshot)

| Hạng mục                                                | Trạng thái                                 |
| :------------------------------------------------------ | :----------------------------------------- |
| Error envelope `{ error: { code, message, details? } }` | ✅ Done                                    |
| `validation_error` + `details[]`                        | ✅ Done                                    |
| `email_already_exists` (409)                            | ✅ Done                                    |
| `invalid_credentials` (401 login)                       | ✅ Done                                    |
| `account_banned` (403 login)                            | ✅ Done                                    |
| Token errors phân biệt (`token_expired`, …)             | ❌ Chưa — dùng chung `unauthorized`        |
| `Accept-Language` middleware                            | ❌ Chưa — dùng `APP_LOCALE`                |
| Lang JA đầy đủ theo bảng §3                             | ⚠️ Một phần                                |
| Login rate limit 429                                    | ✅ Done (5 attempts / 15 min per email+IP) |
| Success response `{ message }` (no `data` wrap)         | ✅ Done (auth endpoints)                   |
| Forgot-password không lộ email                          | ✅ Done (luôn 200)                         |
| Validation `details[].code` từ rule name                | ✅ Done                                    |
| Refresh inactive → `account_banned`                     | ✅ Done                                    |

**FE implication:** Until `Accept-Language` middleware ships, `error.message` may not match user locale — keep FE fallback copy keyed by `error.code` (en + ja per project i18n rules).
