---
name: backend-api
description: Documents how the Next.js frontend communicates with the Laravel Sanctum REST API — base URL, headers, Bearer auth, response contract, error envelope, external_id, validation details, Accept-Language, and integration workflow. Use when integrating backend APIs, handling API errors, api-client, fetch calls, CRUD endpoints, form server errors, error.code, or backend API contract.
version: 1.2.0
---

# Frontend ↔ Backend API

Reference for AI when writing FE code that talks to the Laravel API (Sanctum Bearer token).

## Quick rules

| Rule       | Detail                                                                                        |
| ---------- | --------------------------------------------------------------------------------------------- |
| Auth       | Bearer token only — **no session cookies**                                                    |
| JSON       | Always `Accept` + `Content-Type: application/json`                                            |
| Locale     | Forward `Accept-Language: en` or `ja` on every request                                        |
| Base path  | All endpoints under `/api/v1`                                                                 |
| Success    | `{ "data": ... }` (some auth endpoints: `{ "message": ... }` only)                            |
| Error      | `{ "error": { "code", "message", "details?" } }` — use **status + code**, not message parsing |
| JSON keys  | **snake_case** in request/response bodies                                                     |
| Client env | `NEXT_PUBLIC_API_URL`                                                                         |
| Server env | `API_BASE_URL` (same value, server-only)                                                      |

- Error contract: [errors.md](errors.md)
- BE dev flow / FE integration: [development-flow.md](development-flow.md)
- Full BE doc: [.docs/api-development-flow/api-development-flow.md](../../../.docs/api-development-flow/api-development-flow.md)

## 1) Hạ tầng & kết nối

### Base URL

| Environment | Base URL                       |
| ----------- | ------------------------------ |
| Staging     | `https://<staging-api>/api/v1` |
| Local       | `http://localhost:8000/api/v1` |

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1   # browser / client components
API_BASE_URL=http://localhost:8000/api/v1          # Server Actions, Route Handlers, RSC
```

- **Client components / hooks**: `process.env.NEXT_PUBLIC_API_URL`
- **Server-only code**: `process.env.API_BASE_URL`
- Never hardcode hostnames in feature code

### CORS

Backend must set `FRONTEND_URL` to the Next.js origin (e.g. `http://localhost:3000`).

### Headers (every request)

| Header            | Value                   | Required                        |
| ----------------- | ----------------------- | ------------------------------- |
| `Accept`          | `application/json`      | Always                          |
| `Content-Type`    | `application/json`      | When sending a body             |
| `Accept-Language` | `en` or `ja`            | Always — match active UI locale |
| `Authorization`   | `Bearer <access_token>` | Protected routes only           |

Không dùng session cookie — auth hoàn toàn qua Bearer token (Sanctum).

| `Accept-Language` | Language             |
| ----------------- | -------------------- |
| `ja`              | 日本語               |
| `en`              | English              |
| omitted / other   | English (BE default) |

> **BE snapshot:** `Accept-Language` middleware not shipped yet — messages may follow `APP_LOCALE`. Still send the header; keep FE fallback copy by `error.code` (en + ja).

### Public vs protected

- **Public** (login, register): omit `Authorization`
- **Protected**: `Authorization: Bearer <access_token>`

## 2) Response contract

| Operation   | HTTP    | FE parses                                     |
| ----------- | ------- | --------------------------------------------- |
| GET one     | 200     | `{ data: T }`                                 |
| GET list    | 200     | `{ data: T[], meta?: ... }`                   |
| POST create | **201** | `{ data: T }` — may include `Location` header |
| PUT / PATCH | 200     | `{ data: T }`                                 |
| DELETE      | **204** | No body                                       |
| Error       | 4xx/5xx | `{ error: { code, message, details? } }`      |

**Resource IDs:** use `external_id` (UUID string) in URLs and types — BE never exposes auto-increment `id`.

**URL style:** kebab-case plural under `/api/v1` (e.g. `/team-members`, `/auth/login`). `apiClient` path is relative to base URL (`/profiles`, not `/api/v1/profiles`).

**Request body:** snake_case keys matching BE Action `rules()` (e.g. `full_name`, `device_name`).

Details: [development-flow.md](development-flow.md)

## 3) Error handling (FE)

### Principles

- Branch on **`response.status`** + **`error.code`** — never match `error.message` strings
- Display `error.message` to users (BE-localized when middleware works)
- `422` + `validation_error`: map `error.details[]` → form field errors
- No `success: false` with HTTP 200

### Types (`src/core/lib/api-errors.ts`)

```typescript
export type ApiValidationDetail = {
  field: string;
  message: string;
  code: string;
};

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: ApiValidationDetail[];
  };
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details: ApiValidationDetail[] = [],
    public readonly retryAfter?: number
  ) {
    super(message);
    this.name = "ApiError";
  }

  get isValidationError() {
    return this.code === "validation_error";
  }

  get isAuthError() {
    return (
      this.status === 401 ||
      [
        "unauthorized",
        "token_expired",
        "token_invalid",
        "token_not_provided",
      ].includes(this.code)
    );
  }
}

export function parseApiError(
  status: number,
  body: unknown,
  retryAfter?: number
): ApiError {
  const parsed = body as Partial<ApiErrorBody>;
  const error = parsed?.error;
  return new ApiError(
    status,
    error?.code ?? "internal_server_error",
    error?.message ?? "An unexpected error occurred",
    error?.details ?? [],
    retryAfter
  );
}
```

### API client (`src/core/lib/api-client.ts`)

```typescript
import { ApiError, parseApiError } from "./api-errors";

const getBaseUrl = () => {
  const url =
    typeof window === "undefined"
      ? process.env.API_BASE_URL
      : process.env.NEXT_PUBLIC_API_URL;
  if (!url) throw new Error("API base URL is not configured");
  return url.replace(/\/$/, "");
};

type ApiClientOptions = RequestInit & {
  accessToken?: string | null;
  locale?: "en" | "ja";
};

export async function apiClient<T>(
  path: string,
  { accessToken, locale = "en", headers, ...init }: ApiClientOptions = {}
): Promise<T> {
  const response = await fetch(
    `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`,
    {
      ...init,
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
    }
  );

  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    const retryAfter = Number(response.headers.get("Retry-After")) || undefined;
    throw parseApiError(response.status, body, retryAfter);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
```

### Handle by `error.code`

```typescript
import type { UseFormSetError, FieldValues, Path } from "react-hook-form";
import { ApiError } from "@/core/lib/api-errors";

export function handleApiError<T extends FieldValues>(
  error: unknown,
  options: {
    setError?: UseFormSetError<T>;
    onAuthError?: () => void;
    onRateLimit?: (retryAfter?: number) => void;
  } = {}
) {
  if (!(error instanceof ApiError)) return;

  if (error.isValidationError && options.setError) {
    for (const detail of error.details) {
      options.setError(detail.field as Path<T>, { message: detail.message });
    }
    return;
  }

  switch (error.code) {
    case "invalid_credentials":
      // login form — set root or email field
      break;
    case "unauthorized":
    case "token_expired":
    case "token_invalid":
    case "token_not_provided":
      options.onAuthError?.();
      break;
    case "rate_limit_exceeded":
      options.onRateLimit?.(error.retryAfter);
      break;
    case "account_banned":
    case "email_not_verified":
    case "expert_not_approved":
      // show forbidden state — use error.message
      break;
    case "email_already_exists":
    case "username_already_exists":
      // conflict — highlight field or show toast
      break;
    default:
      // toast / alert with error.message
      break;
  }
}
```

### React Hook Form + Server Action

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAction } from "@/features/auth/actions/login";
import { handleApiError } from "@/core/lib/handle-api-error";
import { loginSchema, type LoginFormData } from "@/features/auth/validations";

export function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginAction(data);
    } catch (error) {
      handleApiError(error, {
        setError: form.setError,
        onAuthError: () => router.push("/login"),
        onRateLimit: (seconds) => {
          /* disable submit, show countdown from Retry-After */
        },
      });
    }
  };

  return (/* form fields */);
}
```

Client-side Zod validates **before** submit; BE `422` handles server-side rules (unique, banned, etc.).

### Auth error codes (quick ref)

| Code                                               | Status | FE action                          |
| -------------------------------------------------- | ------ | ---------------------------------- |
| `invalid_credentials`                              | 401    | Show login error                   |
| `account_banned`                                   | 403    | Block access, show message         |
| `validation_error`                                 | 422    | Map `details[]` to fields          |
| `rate_limit_exceeded`                              | 429    | Disable submit; read `Retry-After` |
| `token_expired` / `token_invalid` / `unauthorized` | 401    | Clear token → `/login`             |
| `email_already_exists`                             | 409    | Highlight `email` field            |

> Until BE ships distinct token codes, treat any `401` on protected routes as session expired.

## FE file layout

```
src/core/lib/
├── api-client.ts       # fetch wrapper + headers + throw ApiError
├── api-errors.ts       # types, parseApiError, ApiError class
└── handle-api-error.ts # map error.code → UI / form / redirect

src/features/{name}/
├── actions/            # Server Actions — catch ApiError, return { success, error }
├── hooks/              # client hooks
└── validations/        # Zod schemas (client pre-check)
```

Follow [project-architecture](../project-architecture/SKILL.md): infra in `core/`, feature calls in `features/`.

## Integrate new endpoint (workflow)

1. Read BE Action `rules()` or Swagger — field names, public vs `auth:sanctum`
2. Types + Zod in `features/{name}/` (mirror BE validation)
3. Server Action → `apiClient` with correct method/status expectations
4. UI: `handleApiError` for `422`/`401`/`409`/`429`
5. Verify: 201 on create, 204 on delete, `external_id` in routes

Full checklist: [development-flow.md § FE workflow](development-flow.md#fe-workflow--integrate-new-endpoint)

## Checklist (new API integration)

- [ ] Path relative to base URL (`/profiles` not `/api/v1/profiles`)
- [ ] `Accept: application/json` + `Accept-Language: en|ja`
- [ ] `Content-Type: application/json` when body present
- [ ] `Authorization: Bearer …` on protected routes only
- [ ] No session cookies / `credentials: "include"`
- [ ] Request/response snake_case; URLs use `external_id`
- [ ] Expect **201** on POST create, **204** on DELETE
- [ ] Parse success from `data` key; errors via `ApiError`
- [ ] `validation_error` → `details[]` → `form.setError`
- [ ] `429` → respect `Retry-After` header
- [ ] Zod-validate `data` before use

## Additional docs

- [development-flow.md](development-flow.md) — BE architecture, response contract, FE file order, common mistakes
- [errors.md](errors.md) — error codes, validation rules, examples, BE status
- [reference.md](reference.md) — auth, pagination, endpoints (TBD)
