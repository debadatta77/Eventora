# 🎟️ Eventora — Complete Interview & Project Architecture Notes

> **One-liner Pitch:** Eventora is a full-stack MERN event discovery and booking management platform featuring role-based access control (RBAC), two-factor OTP verification for bookings, automated transactional emails with cloud-port bypass, and dynamic light/dark glassmorphic UI.

---

## 1. 🏗️ High-Level System Architecture & Tech Stack

### Technology Stack
* **Frontend:** React 19, Vite, Tailwind CSS v4, React Router v7, React Icons, Axios.
* **Backend:** Node.js, Express.js (REST API architecture).
* **Database:** MongoDB Atlas (Mongoose ODM).
* **Authentication & Security:** JWT (JSON Web Tokens), bcryptjs (password hashing), CORS origin filtering, 2FA OTP verification.
* **Mailing / External Services:** Nodemailer (SMTP) with automatic HTTPS API fallback (Brevo / Resend) over Port 443.

### Directory Architecture
```text
Eventora/
├── client/
│   ├── src/
│   │   ├── components/       # Navbar, ProfileModal (React Portal)
│   │   ├── context/          # AuthContext, ThemeContext, ToastContext
│   │   ├── pages/            # Home, EventDetail, UserDashboard, AdminDashboard, Auth
│   │   └── utils/            # Axios instance with base URL & interceptors
├── server/
│   ├── controllers/          # authController, eventController, bookingController
│   ├── middleware/           # auth.js (protect, admin RBAC guards)
│   ├── models/               # user.js, event.js, booking.js, OTP.js
│   ├── routes/               # auth.js, event.js, booking.js
│   └── utils/                # email.js (Dual-engine SMTP/HTTPS), generateOTP.js
```

---

## 2. 🔄 Core Flows (Interview Deep Dive)

### A. Authentication & Verification Lifecycle
1. **Registration:**
   * User submits `name`, `email`, `password`.
   * Password is encrypted via `bcrypt.hash(password, 10)`.
   * User is saved with `isVerified: false`.
   * A 6-digit random OTP is generated and saved in MongoDB `OTP` collection with a 5-minute TTL (`expiresAt`).
   * An OTP email is dispatched to the user.
2. **OTP Verification:**
   * User sends OTP to `/api/auth/verify-otp`.
   * Server validates matching email, OTP, and checks expiration.
   * On success: `user.isVerified` set to `true`, OTP document is purged, and a signed JWT token is issued.
3. **Login:**
   * User enters credentials. Server compares hash via `bcrypt.compare`.
   * If `user.isVerified === false`, login rejects with `needsVerification: true` and dispatches a fresh OTP automatically.
   * If verified, server signs JWT payload `{ id: user._id, role: user.role }` with `process.env.JWT_SECRET`.
4. **Authorization Middleware (`protect` & `admin`):**
   * `protect`: Extracts `Bearer <token>` from HTTP `Authorization` header, verifies with `jwt.verify()`, and attaches `req.user` (excluding password).
   * `admin`: Checks if `req.user.role === 'admin'`. Rejects with 403 Forbidden if not authorized.

---

### B. Two-Factor Event Booking Lifecycle
1. **Step 1 — Booking Intent & OTP Request (`POST /api/bookings/send-otp`):**
   * Authenticated user initiates booking.
   * Any prior booking OTPs for this user are purged from MongoDB.
   * A fresh 6-digit OTP is created with 5-min expiration.
   * OTP is dispatched via email (and logged in server logs for testing).
2. **Step 2 — OTP Verification & Booking Creation (`POST /api/bookings`):**
   * User submits `{ eventId, otp }`.
   * Server validates OTP and checks:
     * Event existence and `availableSeats > 0`.
     * Existing active booking (`Booking.findOne({ userId, eventId })`) to prevent duplicate bookings.
   * Server creates Booking record with:
     * `status: "pending"`
     * `paymentStatus: "nonpaid"`
     * `amount: event.ticketPrice`
   * OTP record is consumed and deleted.
3. **Step 3 — Admin Review & Confirmation (`PUT /api/bookings/:id/confirm`):**
   * Admin approves booking as `paid` or `nonpaid`.
   * Server validates seat availability again.
   * Server marks `booking.status = "confirmed"`.
   * Decrements `event.availableSeats -= 1`.
   * Asynchronously triggers automated confirmation email to the user.
4. **Step 4 — Ticket Pass & Printing:**
   * Once confirmed, User Dashboard renders a visual Event Pass ticket with ticket cutouts, details grid, and printable QR code via `window.print()`.

---

## 3. 🧠 Key Engineering Challenges Solved (Great for Interviews!)

### 1. Cloud Provider SMTP Port Blocking Bypass
* **Problem:** Cloud hosts (like Render free tier) block standard outbound SMTP ports (`25`, `465`, `587`) to prevent spam, causing Nodemailer connections to timeout.
* **Solution:** Implemented a **smart dual-engine mailer** in `server/utils/email.js`:
  * Detects API key prefixes (e.g. `re_` for Resend, `xkeysib-`/`xsmtpsib-` for Brevo).
  * Automatically switches from raw SMTP to direct **HTTPS REST API calls over open Port 443** using native `fetch`.
  * Falls back to standard Nodemailer SMTP for local development.

### 2. CSS Containing Block Context Trap (Fixed with React Portals)
* **Problem:** A profile modal inside a navbar with `backdrop-filter: blur()` failed to display full-screen because CSS spec dictates that `backdrop-filter` creates a new containing block for `fixed` elements.
* **Solution:** Implemented `ReactDOM.createPortal(modalJSX, document.body)` in `ProfileModal.jsx`. This mounts the modal outside the navbar DOM hierarchy directly to `<body>`, allowing full viewport coverage and seamless backdrop click-to-dismiss.

### 3. DNS SRV Timeout Workaround for MongoDB Atlas
* **Problem:** Local ISP/Node.js DNS resolution failures when resolving `mongodb+srv://` connection strings.
* **Solution:** Explicitly configured Google & Cloudflare DNS servers directly in `server/index.js` via `dns.setServers(["1.1.1.1", "1.0.0.1"])`.

### 4. Dynamic Light/Dark Mode with CSS Variables & Tailwind v4
* **Problem:** Inconsistent text/card contrast when switching themes.
* **Solution:** Integrated `@custom-variant dark (&:where(.dark, .dark *))` in Tailwind CSS v4, built a persistent `ThemeContext` backed by `localStorage`, and synced ticket cutout backgrounds dynamically to match light (`bg-slate-50`) and dark (`bg-slate-950`) canvas backgrounds.

---

## 4. 🗄️ Database Schemas & Data Model

### `User` Schema
| Field | Type | Details |
|---|---|---|
| `name` | String | Required, trimmed |
| `email` | String | Required, unique, trimmed |
| `password` | String | Hashed with bcrypt |
| `role` | String | Enum: `["user", "admin"]`, default: `"user"` |
| `isVerified` | Boolean | Default: `false` (set `true` post-OTP) |

### `Event` Schema
| Field | Type | Details |
|---|---|---|
| `title` | String | Required, trimmed |
| `description`| String | Required |
| `date` | Date | Required |
| `location` | String | Required |
| `category` | String | Required (e.g., Tech, Music, Sports) |
| `totalSeats` | Number | Required |
| `availableSeats`| Number | Required |
| `ticketPrice`| Number | Required (0 for free) |
| `imageUrl` | String | Optional image banner |

### `Booking` Schema
| Field | Type | Details |
|---|---|---|
| `userId` | ObjectId | Ref to `User` |
| `eventId` | ObjectId | Ref to `Event` |
| `status` | String | Enum: `["pending", "confirmed", "cancelled"]` |
| `paymentStatus`| String | Enum: `["nonpaid", "paid"]` |
| `amount` | Number | Ticket price at booking time |
| `timestamps` | Boolean | Auto-generates `createdAt` and `updatedAt` |

### `OTP` Schema
| Field | Type | Details |
|---|---|---|
| `email` | String | Required, associated account |
| `otp` | String | Required (6-digit string) |
| `action` | String | Enum: `["register", "event_booking"]` |
| `expiresAt` | Date | Expiration timestamp (5 minutes) |

---

## 5. 🎯 Top Interview Questions & How to Answer

### Q1: How do you handle authentication and authorization in this project?
> **Answer:** "Authentication uses a two-phase flow: credentials verification (email/password hashed with bcrypt) and mandatory email OTP verification. Once verified, a stateless JWT is issued containing user ID and role. Authorization is handled via Express middleware: `protect` verifies and decodes the JWT, while `admin` acts as a Role-Based Access Control (RBAC) guard to restrict administrative routes."

### Q2: How did you prevent race conditions or overselling of seats?
> **Answer:** "In Eventora, seat availability is validated at two checkpoints: when the booking is requested and again before the admin confirms the booking (`availableSeats > 0`). In a high-concurrency production environment, I would enhance this using MongoDB's atomic operator:
> ```javascript
> await Event.findOneAndUpdate(
>   { _id: eventId, availableSeats: { $gt: 0 } },
>   { $inc: { availableSeats: -1 } }
> );
> ```
> This ensures atomic seat decrements at the database engine level without distributed race conditions."

### Q3: What happens if the third-party email service goes down or ports are blocked?
> **Answer:** "I implemented a resilient fallback architecture in `utils/email.js`. Instead of relying solely on standard SMTP (which hosts like Render block on ports 25, 465, and 587), the system inspects the API credentials and automatically routes requests via HTTPS REST APIs (Port 443) using Resend or Brevo. For local testing or unexpected delivery lags, generated OTPs are also logged to the backend console."

### Q4: How is responsive frontend state and performance managed?
> **Answer:** "State is modularized into React Contexts (`AuthContext`, `ThemeContext`, `ToastContext`) to avoid prop drilling while preventing unnecessary top-level re-renders. Search queries on the landing page are debounced by 400ms to eliminate API spam. Modals utilize React Portals to prevent CSS containment traps, and assets are built with Vite for optimal chunk splitting and fast cold starts."

### Q5: What security practices are implemented?
> **Answer:**
> 1. Passwords are never stored in plaintext (salted and hashed via bcrypt).
> 2. Passwords are excluded from user query projections (`.select("-password")`).
> 3. CORS whitelist explicitly restricts origins to trusted domains.
> 4. Short-lived OTPs (5-minute TTL) are purged upon consumption.
> 5. Input environment strings are sanitized to eliminate hidden newline characters.
