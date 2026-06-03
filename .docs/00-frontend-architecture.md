# Frontend Architecture

## Technology Stack

| Category             | Technology                                          |
| -------------------- | --------------------------------------------------- |
| Framework            | Next.js 16 (App Router)                             |
| Language             | TypeScript                                          |
| UI Library           | React 19                                            |
| UI Components        | ShadcnUI (Radix UI)                                 |
| Styling              | Tailwind CSS 4                                      |
| State Management     | Zustand _(planned)_                                 |
| Data Fetching        | TanStack Query _(planned)_ / Custom hooks + `fetch` |
| Form Management      | React Hook Form                                     |
| Validation           | Zod                                                 |
| Rich Text Editor     | Tiptap                                              |
| Authentication       | NextAuth.js v4 + Firebase Auth (JWT Session)        |
| Internationalization | next-intl (en / ja)                                 |
| HTTP Client          | Axios                                               |
| Backend / Data       | Firebase + Firestore (via Next.js API Routes)       |
| Payments             | Stripe, GMO Payment Gateway                         |
| Notifications        | Firebase                                            |
| Testing              | Vitest + Testing Library                            |
| Code Quality         | ESLint, Prettier, Knip, Lefthook                    |

---

## Source Code Structure

```text
src/
├── app/
│   ├── [locale]/
│   │   ├── (auth)/              # Login, register, forgot/reset password, OTP
│   │   ├── (dashboard)/         # Protected dashboard pages
│   │   └── (docs)/              # In-app documentation
│   └── api/                     # Next.js Route Handlers (BFF layer)
│       ├── auth/[...nextauth]/
│       ├── residents/
│       ├── products/
│       ├── payment/
│       ├── identity-verification/
│       └── seed/
│
├── features/                    # Business modules (feature-based)
│   ├── auth/
│   ├── user-management/
│   ├── profile/
│   ├── products/
│   ├── payment/
│   ├── billing/
│   ├── notifications/
│   ├── kanban/
│   ├── file-manage/
│   ├── hotel/
│   ├── identity-verification/
│   ├── medical-dashboard/
│   ├── staff-list/
│   ├── system-settings/
│   ├── transitions/
│   └── docs/
│
├── components/
│   ├── ui/                      # ShadcnUI primitives
│   ├── app-sidebar.tsx
│   └── theme-mode-toggle.tsx
│
├── core/                        # Infrastructure & shared services
│   ├── components/              # Providers, locale helpers
│   ├── lib/                     # auth, api-client, firebase, utils
│   ├── image-handle/            # Image upload, crop, blurhash
│   ├── verify-ocr/              # OCR & face verification
│   ├── constants/
│   └── types/
│
├── shared/                      # Cross-feature reusable code
│   └── components/
│
├── i18n/                        # next-intl routing & config
├── messages/                    # en.json, ja.json
├── types/                       # Global type extensions (e.g. next-auth)
└── proxy.ts                     # Route protection + i18n middleware
```

### Feature Module Structure

Each feature follows a consistent internal layout:

```text
features/{name}/
├── index.ts              # Public API (barrel export)
├── components/           # Feature-specific UI ("use client")
├── actions/              # Server Actions
├── hooks/                # Custom data/UI hooks
├── types/                # Domain types
├── validations/          # Zod schemas
└── lib/                  # Feature utilities (optional)
```

---

## Architecture Pattern

The frontend follows a **5-layer modular architecture** combined with Next.js App Router conventions.

```text
┌─────────────────────────────────────────┐
│  APP (src/app/)                         │  Routing, layouts, pages only
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  FEATURES (src/features/)             │  Business logic & UI modules
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  SHARED (src/shared/)                   │  Cross-feature reusable code
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  CORE (src/core/)                       │  Infrastructure, config, providers
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  UI (src/components/ui/)                │  ShadcnUI primitives
└─────────────────────────────────────────┘
```

### Data Flow

```text
Page (app/)
   ↓
Feature Component / Hook
   ↓
Server Action  OR  API Route Handler (app/api/)
   ↓
Core Service (Firebase Admin, Stripe, OCR engine…)
   ↓
Firebase / Firestore / External APIs
```

### Import Rules

| Layer            | Can import from                                    |
| ---------------- | -------------------------------------------------- |
| `app/`           | features, shared, core, components/ui              |
| `features/`      | shared, core, components/ui _(not other features)_ |
| `shared/`        | core, components/ui                                |
| `core/`          | components/ui                                      |
| `components/ui/` | Standalone primitives only                         |

---

## State Management

| State Type   | Solution                               | Usage in Project                          |
| ------------ | -------------------------------------- | ----------------------------------------- |
| Server State | TanStack Query _(convention)_          | Planned; currently custom hooks + `fetch` |
| UI State     | React `useState` / Zustand _(planned)_ | Local state in components & custom hooks  |
| Form State   | React Hook Form                        | All auth, profile, and CRUD forms         |
| Session      | NextAuth.js `SessionProvider`          | Auth session across the app               |
| Theme        | next-themes                            | Light / dark / system mode                |

### Current Data Fetching Pattern

Feature hooks fetch data from Next.js API Routes using native `fetch`:

```text
useResidents()  →  GET /api/residents  →  Firestore (residents)
usePlayers()    →  GET /api/players    →  Firestore (players)
```

An Axios-based API client (`core/lib/api-client.ts`) is available for centralized error handling and auth header injection.

---

## API Communication

This project uses a **Backend-for-Frontend (BFF)** pattern. The frontend does not call an external REST API directly; instead, Next.js Route Handlers act as the API layer.

```text
Client Component / Hook
   ↓
fetch("/api/...")  OR  axios (api-client)
   ↓
Next.js Route Handler (app/api/)
   ↓
Firebase Admin SDK / Stripe SDK / OCR Engine
   ↓
Firestore / External Services
```

All API requests go through Next.js Route Handlers to ensure:

- Consistent validation (Zod schemas)
- Server-side secret management (Firebase Admin, Stripe keys)
- Unified error response format
- No direct exposure of backend credentials to the client

### API Route Categories

| Category              | Examples                                        |
| --------------------- | ----------------------------------------------- |
| Auth                  | `/api/auth/[...nextauth]`                       |
| CRUD Resources        | `/api/residents`, `/api/products`, `/api/staff` |
| Payments              | `/api/payment/stripe/*`, `/api/payment/gmo/*`   |
| Identity Verification | `/api/identity-verification/ocr`, `/verify`     |
| Seed / Dev            | `/api/seed/*`                                   |

---

## Authentication Flow

Authentication is handled by **NextAuth.js v4** with a **JWT session strategy**. Credentials login delegates to **Firebase Auth**; social login supports Google, Facebook, Instagram, and LINE.

```text
User visits /login
    ↓
LoginForm validates input (Zod + React Hook Form)
    ↓
signIn("credentials", { email, password })   [client]
    OR
signIn("google" | "facebook" | "instagram" | "line")   [client]
    ↓
NextAuth authorize() in core/lib/auth.ts   [server]
    ↓
Firebase Auth (email/password) OR OAuth Provider
    ↓
JWT token created → Session cookie set
    ↓
Redirect to /dashboard
```

### Route Protection

Route protection is handled by `src/proxy.ts` (Next.js 16 proxy convention):

```text
Incoming Request
    ↓
proxy.ts reads JWT from session cookie (optimistic check)
    ↓
Protected route + no token  →  redirect to /login
Auth route + has token      →  redirect to /dashboard
    ↓
next-intl middleware handles locale routing (en / ja)
```

| Route Type | Paths                                                                |
| ---------- | -------------------------------------------------------------------- |
| Protected  | `/profile`, `/dashboard`, `/settings`                                |
| Auth-only  | `/login`, `/register`, `/forgot-password`, `/reset-password`, `/otp` |

> **Note:** The proxy performs optimistic cookie-based checks only. Server Actions and API Routes must verify authentication independently.

---

## Internationalization (i18n)

| Item           | Detail                                         |
| -------------- | ---------------------------------------------- |
| Library        | next-intl                                      |
| Locales        | English (`en`), Japanese (`ja`)                |
| URL Strategy   | Locale prefix as needed (`/ja/dashboard`)      |
| Message Files  | `src/messages/en.json`, `src/messages/ja.json` |
| Routing Config | `src/i18n/routing.ts`                          |

All user-facing strings must be defined in both `en` and `ja` message files.

---

## Key Conventions

| Convention       | Rule                                                           |
| ---------------- | -------------------------------------------------------------- |
| File naming      | kebab-case (`login-form.tsx`)                                  |
| Component naming | PascalCase (`LoginForm`)                                       |
| Server Actions   | Suffix with `Action` (`createUserAction`)                      |
| Zod schemas      | Suffix with `Schema` (`loginSchema`)                           |
| Public API       | Export via feature `index.ts` only                             |
| Form validation  | Zod schema first, then React Hook Form + `@hookform/resolvers` |
| Comments         | English only                                                   |

---

## Related Documentation

| Document                        | Location                         |
| ------------------------------- | -------------------------------- |
| Auth feature rules              | `src/features/auth/auth-rule.md` |
| Project architecture (internal) | `.docs/01-architecture.md`       |
| Code patterns                   | `.docs/05-code-patterns.md`      |
| Cursor AI rules                 | `.cursorrules`                   |
