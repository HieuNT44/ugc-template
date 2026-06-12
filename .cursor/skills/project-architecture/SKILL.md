---
name: project-architecture
description: Hướng dẫn kiến trúc modular 5 tầng cho Next.js + ShadcnUI. Sử dụng khi tạo components, features, actions, hooks, hoặc bất kỳ code nào trong dự án. Trigger khi user yêu cầu tạo feature mới, component, page, hoặc hỏi về cấu trúc dự án.
---

# Kiến trúc Modular Next.js

> Chi tiết đầy đủ trong `.cursorrules` (luôn được đọc tự động)

## Quick Reference

### 4 Layers

```
APP (src/app/)           → Routing only
    ↓
FEATURES (src/features/) → Business modules
    ↓
CORE (src/core/)         → Infrastructure + cross-feature UI/types
    ↓
UI (src/components/ui/)  → ShadcnUI primitives
```

### Import Rules

```typescript
// ✅ OK
import { Button } from "@/components/ui/button";
import { PostLabelBadge } from "@/core/components/post";
import { LoginForm } from "@/core/auth";

// ❌ NGHIÊM CẤM
import { UserForm } from "@/features/users"; // trong core/*
```

`core/` gồm `auth/`, `components/` (post, badges, …), `types/`, `constants/`, `lib/`.

### Feature Structure

```
features/{name}/
├── index.ts              # Public API
├── components/
├── actions/
├── hooks/
├── types/
└── validations/
```

### Naming

| Type      | File             | Code               |
| --------- | ---------------- | ------------------ |
| Component | `user-form.tsx`  | `UserForm`         |
| Hook      | `use-auth.ts`    | `useAuth`          |
| Action    | `create-user.ts` | `createUserAction` |
| Schema    | `user.schema.ts` | `userSchema`       |

### Tạo Feature mới

```bash
mkdir -p src/features/{name}/{components,actions,hooks,types,validations}
touch src/features/{name}/index.ts
```

## Tài liệu chi tiết

- [Cấu trúc thư mục](structure.md)
- [Code patterns](patterns.md)
- [Code quality tools](quality.md)
- [Ví dụ thực tế](examples.md)
