# Prompt: User Web App – Dùng chung Firebase với Admin (Products, Residents, Transitions)

Dùng prompt này khi xây ứng dụng web phía user (user-facing app) cần đọc/ghi cùng dữ liệu Firebase với hệ thống admin hiện tại: **products**, **thông tin bệnh nhân (residents)**, và **transition logs**.

---

## Yêu cầu tổng quát

Ứng dụng web phía user phải dùng **cùng Firebase project** với admin. Cấu hình Firebase giống hệt (cùng env: `NEXT_PUBLIC_FIREBASE_*`). Dữ liệu nằm trong **Firestore** với 3 collection sau.

---

## 1. Firestore collections và cấu trúc document

### 1.1 Collection `products`

- **Collection ID:** `products`
- **Document ID:** auto-generated (khi tạo mới) hoặc `productId` (khi seed).
- **Document shape (khi tạo/sửa):**

```ts
{
  name: string;              // required
  kana?: string;
  category?: string;
  unit1: string;             // required, e.g. "枚"
  unit2: string;             // required, e.g. "袋"
  conversionRate: number;    // integer >= 1
  initialStock: number;      // integer >= 0 (stock in unit1 at last reset)
  keywords: string[];        // array of strings
  threshold: number;         // integer >= 0
  action: string;           // e.g. "email_notify" | "auto_order"
  accumulatedConsumption: number;  // integer >= 0
  isActionTriggered: boolean;
  lastResetAt?: string | null;    // ISO date or null
  updatedAt: string;        // ISO date string
}
```

- Khi **add product** từ user app: tạo document mới với đủ các field trên; `id` = Firestore document ID (trả về sau khi `set`).

### 1.2 Collection `residents` (thông tin bệnh nhân)

- **Collection ID:** `residents`
- **Document ID:** `residentId` (string, do client/admin quy định).
- **Document shape (khi tạo/sửa):**

```ts
{
  residentId: string;       // required, dùng làm document ID
  name: string;             // required
  kana?: string;
  roomNumber: string;       // required
  floor?: number | null;    // optional, 1–99
  birthDate: string;        // required, format YYYY-MM-DD
  gender: "male" | "female" | "other";
  notes?: string;
  isActive: boolean;
  createdAt: string;        // ISO date
  updatedAt: string;        // ISO date
}
```

- Validation tương đương admin: `residentId` required, max 20 ký tự; `name` required, max 100; `birthDate` regex `^\d{4}-\d{2}-\d{2}$`.

### 1.3 Collection `transition_log`

- **Collection ID:** `transition_log`
- **Document ID:** thường dùng `logId` (string, unique) hoặc auto ID.
- **Document shape:**

```ts
{
  logId: string;
  residentId: string;
  residentName: string;
  productId: string;
  productName: string;
  staffId: string;
  staffName: string;
  inputQuantity: number;
  inputUnit: string;
  convertedQuantity: number;
  unit1: string;
  status: "confirmed" | "pending" | "cancelled";
  submittedAt: string;     // ISO date, dùng để sort (desc)
  finalizedAt: string;     // ISO date
  isCancelled: boolean;
  cancelReason?: string | null;
}
```

- Khi **add transition** từ user app: tạo document mới với đủ field trên; có thể dùng `logId` làm document ID để dễ đối chiếu với admin.

---

## 2. Cách user app sử dụng cùng dữ liệu

### Option A: Cùng codebase Next.js (admin + user)

- Gọi trực tiếp **cùng API routes** đã có:
  - **Products:** `GET /api/products`, `POST /api/products`, `GET /api/products/[id]`, `PATCH`, `DELETE`.
  - **Residents:** `GET /api/residents`, `POST /api/residents`, `PATCH /api/residents/[residentId]`.
  - **Transition log:** `GET /api/transition-log` (query: `?status= &residentId= &staffId= &dateFrom= &dateTo= &category= &limit=`), `PATCH /api/transition-log/[logId]` (cancel).
- Đảm bảo user app gửi body đúng schema (products/residents/transition) như trên để dữ liệu tương thích với admin.

### Option B: User app là codebase riêng (chỉ Firebase client)

- Khởi tạo Firebase với **cùng config** (cùng `NEXT_PUBLIC_FIREBASE_*`).
- Dùng **Firestore client SDK** (`getFirestore(app)`), không dùng Firebase Admin.
- **Đọc:** `collection(db, "products")`, `collection(db, "residents")`, `collection(db, "transition_log")` với `getDocs` hoặc `onSnapshot` (realtime).
- **Ghi:**
  - **Add product:** `collection(db, "products")` → `doc()` → `set(doc)` với object đúng shape ở 1.1.
  - **Add resident:** `doc(db, "residents", residentId)` → `set(doc)` với object đúng shape ở 1.2 (document ID = `residentId`).
  - **Add transition:** `collection(db, "transition_log")` → `doc(db, "transition_log", logId)` hoặc `doc()` → `set(doc)` với object đúng shape ở 1.3.
- **Firestore Security Rules:** phải cho phép user (hoặc role tương ứng) đọc/ghi đúng 3 collection này nếu dùng client trực tiếp.

---

## 3. Realtime (nếu cần)

- Admin đã dùng `onSnapshot` cho `transition_log` (query `orderBy("submittedAt", "desc")`, `limit(500)`). User app có thể dùng cùng pattern: `collection(db, "transition_log")` + `query(..., orderBy("submittedAt", "desc"), limit(500))` + `onSnapshot`.

---

## 4. Tóm tắt

- **Cùng Firebase project** (cùng env).
- **3 collection:** `products`, `residents`, `transition_log`.
- **Add product:** document mới trong `products` với đủ field (unit1, unit2, conversionRate, threshold, action, keywords, …).
- **Add resident:** document ID = `residentId` trong `residents`, đủ field (name, kana, roomNumber, birthDate, gender, …).
- **Add transition:** document trong `transition_log` với logId, residentId, productId, staffId, số lượng, unit, status, submittedAt, finalizedAt, isCancelled.
- User app có thể gọi API của admin (Option A) hoặc ghi/đọc trực tiếp Firestore (Option B); trong mọi trường hợp phải tuân đúng **document shape** trên để admin và user app dùng chung dữ liệu.
