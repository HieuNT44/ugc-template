# Image Upload — Error Codes

Envelope: `{ "error": { "code", "message", "details?" } }` — see [backend-api/errors.md](../backend-api/errors.md).

| HTTP | `error.code`                        | When                                | FE action                        |
| ---- | ----------------------------------- | ----------------------------------- | -------------------------------- |
| 401  | `unauthorized`                      | Missing/expired token               | Redirect login                   |
| 403  | `upload.access_denied`              | Role / `upload_type` not allowed    | Hide upload UI or toast          |
| 404  | `upload.not_found`                  | Wrong `upload_file_id` or not owned | Re-initiate                      |
| 409  | `upload.invalid_status`             | Complete when status ≠ `uploading`  | Re-initiate                      |
| 410  | `upload.expired`                    | Past `expires_at` (~60 min)         | Re-initiate                      |
| 422  | `validation_error`                  | Invalid initiate/complete body      | Map `details[]` → fields         |
| 422  | `upload.invalid_size`               | Size mismatch vs metadata / S3 head | Ask user to pick another file    |
| 422  | `upload.invalid_upload_id`          | Wrong `upload_id` on complete       | Use id from step 1               |
| 422  | `upload.invalid_parts`              | Part count or ETag wrong            | Fix split; keep ETag quotes      |
| 422  | `upload.invalid_type`               | `upload_type` mismatch on attach    | Initiate with correct type       |
| 422  | `upload.not_ready`                  | Attach before complete finishes     | Wait for complete                |
| 422  | `certification.invalid_upload_file` | Bad certification `upload_file_id`  | Re-upload                        |
| 503  | `upload.storage_not_configured`     | S3 not configured on BE             | Show generic error / retry later |

**422 validation example (initiate):**

```json
{
  "error": {
    "code": "validation_error",
    "message": "...",
    "details": [{ "field": "mime_type", "message": "...", "code": "regex" }]
  }
}
```
