# Error Handling

Full spec: [api-error-handling.md](../api-error-handling/api-error-handling.md)

## Envelope

```json
{
  "error": {
    "code": "validation_error",
    "message": "Localized message",
    "details": [{ "field": "email", "message": "...", "code": "required" }]
  }
}
```

- Phân loại lỗi bằng **HTTP status** + **`error.code`** — không parse `message` bằng string matching
- `details` chỉ có ở **422 validation**
- JSON field naming: **snake_case**

## Auth — codes thường gặp

| Status | Code                   | Khi nào                          |
| ------ | ---------------------- | -------------------------------- |
| 401    | `invalid_credentials`  | Sai email/password               |
| 401    | `unauthorized`         | Token thiếu/hết hạn/không hợp lệ |
| 403    | `account_banned`       | Tài khoản bị ban                 |
| 409    | `email_already_exists` | Email đã đăng ký                 |
| 422    | `validation_error`     | Input không hợp lệ               |
| 429    | `rate_limit_exceeded`  | Quá nhiều lần login/register     |

## Profile — codes thường gặp

| Status | Code                             | Khi nào                                          |
| ------ | -------------------------------- | ------------------------------------------------ |
| 403    | `forbidden`                      | Role không có quyền (vd. reader gọi experiences) |
| 404    | `not_found`                      | Profile chưa tồn tại                             |
| 409    | `profile.username_already_taken` | Username trùng                                   |
| 422    | `validation_error`               | Field validation fail                            |

## Client interceptor pattern

```typescript
const apiError = error.response?.data?.error;
const code = apiError?.code;
const message = apiError?.message;
const details = apiError?.details ?? [];

switch (code) {
  case "validation_error":
    // map details[] → form field errors
    break;
  case "invalid_credentials":
    break;
  case "unauthorized":
    // clear token, redirect login
    break;
  case "account_banned":
    break;
}
```

## Language

- Header `Accept-Language: ja|en` — **middleware chưa implement**, hiện message theo `APP_LOCALE` của BE
- Plan: FE gửi header, BE localize sau
