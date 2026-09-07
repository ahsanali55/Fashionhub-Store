# FashionHub — Backend Work Needed

For Ahsan. Organized by priority. P0 is the one thing that blocks everything else —
start there. Each item includes what's currently happening on the frontend so you know
what shape of response it expects.

---

## P0 — Products are not real yet (biggest gap in the whole app)

**Current state:** `redux/slices/productsSlice.ts` has ~15 hardcoded `dummyProducts` baked
directly into the frontend. Every user sees the exact same fake products. Nothing a
supplier does (add/edit/delete) touches a real database, because there's no product API
to call yet. This is the #1 priority — supplier dashboards, search, categories, cart,
wishlist all currently run on fake data sitting in the frontend.

**Needed endpoints:**
- `GET /products` — list all products. Support query params: `?category=`, `?search=`,
  `?supplier=` (frontend already filters by name/category/supplier client-side, so
  matching query params here means minimal frontend rewrite later)
- `GET /products/:id` — single product detail
- `POST /products` — create (supplier only, must be logged in as supplier)
- `PUT /products/:id` — edit (supplier only, must own the product)
- `DELETE /products/:id` — delete (supplier only, must own the product)
- Product image upload (multer + Cloudinary or similar — need at least one image URL per product)

**Product fields needed** (matching what the frontend already expects):
`name, description, price, category, image, stock, supplier (or supplierId), rating`

---

## P1 — Core SRS-required features, not built yet

### Orders
**Current state:** `redux/slices/ordersSlice.ts` has an `addOrder` action that's exported
but never actually called anywhere — checkout doesn't create real orders. Order data is
currently either empty or fake seed data (we already cleaned that fake seed out).

**Needed:**
- `Order` model: `userId, items [{productId, name, quantity, price}], total, status, date`
- `POST /orders` — create an order (called at checkout, from the cart)
- `GET /orders/my` — customer's own order history
- `GET /orders/:id` — single order detail
- `PATCH /orders/:id/status` — update status (supplier/admin only) — `pending → processing → shipped → delivered`
- `GET /supplier/orders` — orders containing that supplier's products
- `GET /admin/orders` — all orders

### Supplier Approval Workflow
**Current state:** Anyone can register as a supplier and immediately act as one — no
approval gate exists at all, even though this is explicitly part of the SRS.

**Needed:**
- Add `status` field to User model for suppliers: `"pending" | "approved" | "rejected"`
- New suppliers default to `"pending"`
- `GET /admin/suppliers/pending` — list suppliers awaiting approval
- `PATCH /admin/suppliers/:id/approve`
- `PATCH /admin/suppliers/:id/reject`
- Middleware: block product creation if `status !== "approved"`

### Ratings & Reviews
**Current state:** Not implemented anywhere in the backend. No review model exists.

**Needed:**
- `Review` model: `productId, userId, rating (1-5), comment, createdAt`
- `POST /products/:id/reviews` — submit a review
- `GET /products/:id/reviews` — list reviews for a product
- Product's average `rating` should be recalculated whenever a review is added

### Reports & Analytics (Admin)
**Needed:**
- `GET /admin/analytics` — aggregate: total revenue, total orders, total users, total
  active suppliers, orders over time (for charts)
- `GET /admin/analytics/top-products` — best sellers

### Supplier Performance Tracking
**Needed:**
- `GET /supplier/analytics` — that supplier's own: total sales, order count, revenue over
  time, average rating across their products

---

## P2 — Smaller, but real gaps we found today

### Password Change
**Current state:** "Change Password" button exists on the frontend (Profile/Settings) but
does nothing — no endpoint behind it.

**Needed:**
- `PATCH /auth/password` — requires current password + new password, must be logged in

### Avatar / Profile Picture Upload
**Current state:** Frontend has a working local-preview UI already built (file picker,
instant preview) but nothing persists — it's session-only right now.

**Needed:**
- Add `avatar` (URL string) field to User model
- `PATCH /auth/avatar` — accepts an uploaded image, stores it (Cloudinary/S3/similar), saves
  the URL to the user
- Multer or similar for handling the multipart upload

### Notifications
**Current state:** Bell icon exists in the navbar (UI only) showing "No notifications yet" —
placeholder, no backend behind it yet.

**Needed:**
- `Notification` model: `userId, message, type, isRead, createdAt`
- `GET /notifications/my`
- `PATCH /notifications/:id/read`
- Triggers to create notifications: new order placed → notify customer + supplier; order
  status changes → notify customer; supplier approved/rejected → notify that supplier

---

## P3 — Optional, lower priority, can wait

- **Cart/Wishlist backend persistence** — currently both are client-only Redux state (fine
  for now, resets on logout/different device). Only worth backend-izing if you want
  cross-device persistence; not required by SRS.
- **Formal Category model** — categories are currently just string values on products,
  grouped client-side. Works fine as-is; a dedicated model would only matter if categories
  need their own metadata (banner images, descriptions) later.
- **Admin user management** — `GET /admin/users`, suspend/activate endpoints. Not urgent
  unless admin dashboard build reaches that point.

---

## Working in parallel — how this connects to frontend work

Awais is removing dead/unused code from the frontend at the same time. To avoid stepping
on each other:

- **Don't touch:** `app/register`, `app/login`, `app/about`, `app/categories`,
  `app/customer/*` route files, or anything in `components/Customers`, `components/Pages` —
  frontend work happening there right now.
- **Safe to build independently:** everything in this list is new backend surface area
  (new models, new routes, new controllers) — none of it requires editing existing frontend
  files to build. The frontend swap-over (replacing `dummyProducts` with real `GET /products`
  calls, wiring the notification bell to real data, etc.) happens *after* each endpoint is
  ready, as a separate step, most likely done by Awais once you confirm an endpoint works.
- **Suggested order:** P0 (products) first since everything else quietly depends on real
  products existing, then Orders and Supplier Approval together since they're both core SRS
  items, then the rest as time allows.
