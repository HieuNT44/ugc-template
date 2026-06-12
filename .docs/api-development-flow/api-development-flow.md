# API DEVELOPMENT FLOW - REALREAD

**Dự án:** RealRead | **Version:** 1.0 | **Ngày:** 11/06/2026

Step-by-step workflow for creating a new API endpoint in this Laravel 12 project. Follow this order to avoid common agent and implementation mistakes.

**Related docs:**

- [API Error Handling](../../.cursor/skills/backend-api/errors.md)
- Skill (FE): `.cursor/skills/backend-api/SKILL.md`

---

## 1. REQUEST FLOW (ARCHITECTURE)

```
Client
  → routes/api.php          (prefix /api/v1, middleware)
  → Action class            (lorisleiva/laravel-actions)
      → rules()             validation (422)
      → handle()            business logic
      → throw BaseException (4xx/5xx)
  → Resource / Collection   JSON transform
  → Global exception handler (bootstrap/app.php → ErrorResource)
```

**Rules:**

- Routes point to **Action classes** — no fat controllers.
- Laravel auto-prefixes `routes/api.php` with `/api`.
- Protected routes use `auth:sanctum` (Bearer token), not session cookies.

---

## 2. PHASE 0 — PLAN BEFORE CODE

Answer these before writing files:

| #   | Question             | Example                                                               |
| --- | -------------------- | --------------------------------------------------------------------- |
| 1   | API type?            | CRUD resource / auth / custom action (`cancel`, `publish`)            |
| 2   | Public or protected? | `auth:sanctum` middleware                                             |
| 3   | Model exists?        | CRUD requires Model + migration first                                 |
| 4   | Public ID?           | Use `external_id` (UUID) — never expose auto-increment `id`           |
| 5   | Error contract?      | Read [api-error-handling](../../.cursor/skills/backend-api/errors.md) |
| 6   | Which skill?         | CRUD → `generate-laravel-crud`; design rules → `laravel-api-design`   |

---

## 3. PHASE 1 — DATABASE (NEW RESOURCE ONLY)

```
1. Migration (columns, indexes, soft deletes)
2. Model ($fillable, $casts, enums, relationships, external_id boot)
3. Factory + Seeder (dev/test)
4. php artisan migrate
```

**Common mistakes:**

- Missing `external_id` on public-facing models
- Missing enum casts
- Forgetting soft-delete scope on queries

---

## 4. PHASE 2 — FILE GENERATION ORDER

### 4.1. CRUD resource (e.g. `Profile` → `/api/v1/profiles`)

Generate in this **dependency order**:

| Step | File                                                       |
| ---- | ---------------------------------------------------------- |
| 1    | `app/Http/Resources/{Models}/{Model}Resource.php`          |
| 2    | `app/Http/Resources/{Models}/{Model}Collection.php`        |
| 3    | `app/Actions/{Models}/ListAction.php`                      |
| 4    | `app/Actions/{Models}/ShowAction.php`                      |
| 5    | `app/Actions/{Models}/StoreAction.php`                     |
| 6    | `app/Actions/{Models}/UpdateAction.php`                    |
| 7    | `app/Actions/{Models}/DeleteAction.php`                    |
| 8    | `app/Filters/{Models}/...` (optional, Spatie QueryBuilder) |
| 9    | Append routes to `routes/api.php`                          |

For full templates, use skill `generate-laravel-crud`.

### 4.2. Custom / Auth action (e.g. `POST /api/v1/auth/login`)

| Step | File                                                                       |
| ---- | -------------------------------------------------------------------------- |
| 1    | `app/Actions/{Domain}/{Name}Action.php`                                    |
| 2    | Dedicated Resource if response shape is special (e.g. `AuthTokenResource`) |
| 3    | Trait in `Concerns/` if logic is shared                                    |
| 4    | `lang/en/errors.php` + `lang/ja/errors.php` for new error codes            |
| 5    | Route in `routes/api.php`                                                  |

Reference: `app/Actions/Auth/*`.

---

## 5. PHASE 3 — ACTION PATTERN

Every Action should include:

```php
class ExampleAction
{
    use AsAction;

    public function rules(): array
    {
        return [ /* validation */ ];
    }

    #[OA\Post(path: '/api/v1/...', tags: ['...'], ...)]
    public function handle(ActionRequest $request): ExampleResource
    {
        // Business logic
        // throw BaseException::make('email_already_exists', [], 409);
        return new ExampleResource($model);
    }

    // Only when custom status / headers are needed:
    public function asController(ActionRequest $request): JsonResponse
    {
        $resource = $this->handle($request);

        return $resource
            ->response()
            ->setStatusCode(201)
            ->header('Location', url("/api/v1/examples/{$model->external_id}"));
    }
}
```

**Resource rules:**

- Access fields via `$this->resource->field` (not `$this->field`)
- Relationships: `$this->whenLoaded('relation')`
- Lookup by `external_id`: `->where('external_id', $id)->firstOrFail()`

---

## 6. PHASE 4 — ROUTES

```php
// routes/api.php
Route::prefix('v1')->group(static function () {
    Route::middleware(['auth:sanctum'])->prefix('profiles')->group(static function () {
        Route::get('/', ProfileListAction::class)->name('profiles.list');
        Route::get('/{id}', ProfileShowAction::class)->name('profiles.show');
        Route::post('/', ProfileStoreAction::class)->name('profiles.store');
        Route::put('/{id}', ProfileUpdateAction::class)->name('profiles.update');
        Route::delete('/{id}', ProfileDeleteAction::class)->name('profiles.delete');
    });
});
```

**Route checklist:**

- [ ] Prefix `v1` (full path: `/api/v1/...`)
- [ ] Kebab-case plural URLs (`team-members`, not `getUsers`)
- [ ] Import aliases to avoid class name conflicts (`ProfileListAction`)
- [ ] `auth:sanctum` on protected routes
- [ ] Named routes: `{resource}.{action}`

---

## 7. PHASE 5 — RESPONSE CONTRACT

| Operation   | HTTP                        | Body                                             |
| ----------- | --------------------------- | ------------------------------------------------ |
| GET one     | 200                         | `{ "data": { ... } }`                            |
| GET list    | 200                         | `{ "data": [...], "meta": { ... } }`             |
| POST create | **201** + `Location` header | `{ "data": { ... } }`                            |
| PUT / PATCH | 200                         | `{ "data": { ... } }`                            |
| DELETE      | **204** (target)            | No body                                          |
| Error       | 4xx / 5xx                   | `{ "error": { "code", "message", "details"? } }` |

**Never:**

- Return `success: false` with HTTP 200
- Wrap errors in `data` (use `error` root key)
- Expose auto-increment `id` in public API responses

---

## 8. PHASE 6 — ERROR HANDLING

See [api-error-handling](../../.cursor/skills/backend-api/errors.md).

| Situation               | Throw                                                    | HTTP                   |
| ----------------------- | -------------------------------------------------------- | ---------------------- |
| Invalid input format    | `ValidationException` (via `rules()`)                    | 422 `validation_error` |
| Duplicate email         | `BaseException::make('email_already_exists', [], 409)`   | 409                    |
| No permission           | `BaseException::forbidden(...)`                          | 403                    |
| Invalid / missing token | `AuthenticationException` (middleware)                   | 401 `unauthorized`     |
| Rate limit              | `BaseException::make('rate_limit_exceeded', [...], 429)` | 429                    |

Do **not** hand-roll error JSON — `bootstrap/app.php` + `ErrorResource` handle formatting.

---

## 9. PHASE 7 — SWAGGER

1. `#[OA\Schema]` on Resource class
2. `#[OA\Get|Post|Put|Delete]` on Action method
3. Protected endpoints: `security: [['bearerAuth' => []]]`
4. Regenerate: `php artisan l5-swagger:generate`
5. Verify at `/api/documentation`

---

## 10. PHASE 8 — LOCALIZATION

For each new error code, add messages to:

- `lang/en/errors.php`
- `lang/ja/errors.php`
- `lang/{locale}/validation.php` (field validation messages)

Target: `Accept-Language: ja|en` header (middleware TBD). Until then, locale follows `APP_LOCALE`.

---

## 11. PHASE 9 — VERIFY BEFORE DONE

```bash
# PHP style
docker compose exec app ./vendor/bin/pint --dirty

# Swagger
docker compose exec app php artisan l5-swagger:generate

# Routes
docker compose exec app php artisan route:list --path=api/v1

# Manual test
curl -X POST http://localhost:8000/api/v1/... \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{ ... }'

# Tests (when available)
docker compose exec app php artisan test --filter=ExampleTest
```

**Minimum test cases per endpoint:**

- [ ] Success (happy path)
- [ ] 422 validation error
- [ ] 401 without token (protected routes)
- [ ] 404 not found (show / update / delete)
- [ ] 409 conflict (unique fields, if applicable)

---

## 12. COMMON AGENT MISTAKES

| #   | Wrong                                  | Correct                                      |
| --- | -------------------------------------- | -------------------------------------------- |
| 1   | Route without `v1`                     | `/api/v1/...`                                |
| 2   | `username` instead of `email` on login | Read Action `rules()`                        |
| 3   | Session cookie / `withCredentials`     | `Authorization: Bearer {token}`              |
| 4   | Expose integer `id`                    | Return `external_id` in Resource             |
| 5   | N+1 queries                            | `with()` eager load in Action                |
| 6   | `$this->field` in Resource             | `$this->resource->field`                     |
| 7   | `auth` session middleware              | `auth:sanctum`                               |
| 8   | Old error shape `{ message, errors }`  | `{ error: { code, message } }`               |
| 9   | POST returns 200                       | POST create returns **201** + `Location`     |
| 10  | Migration not run                      | `personal_access_tokens`, new tables missing |
| 11  | Swagger `sessionAuth`                  | `bearerAuth`                                 |
| 12  | Skip `pint` / swagger generate         | Broken CI or stale docs                      |

---

## 13. FULL FLOW DIAGRAM

```
[0] Read requirement + error doc + pick skill
        ↓
[1] Migration + Model (if new resource)
        ↓
[2] Resource (+ OA\Schema)
        ↓
[3] Collection (if list endpoint)
        ↓
[4] Action(s): rules → handle → throw/return
        ↓
[5] Lang keys (en / ja)
        ↓
[6] routes/api.php (v1, middleware, named routes)
        ↓
[7] Swagger attributes + l5-swagger:generate
        ↓
[8] pint + curl + tests
        ↓
[9] PR: describe contract + curl samples
```

---

## 14. SKILL ROUTING

| Task                             | Use                                                  |
| -------------------------------- | ---------------------------------------------------- |
| Step-by-step workflow (this doc) | `.docs/api-development-flow/api-development-flow.md` |
| FE integration patterns          | `.cursor/skills/backend-api/SKILL.md`                |
| Error codes & messages           | `.cursor/skills/backend-api/errors.md`               |

---

**HẾT**
