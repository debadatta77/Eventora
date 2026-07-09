# 🎟️ Eventora

Eventora is a high-performance, enterprise-grade MERN stack Event Management & Ticket Booking platform. It features secure 2FA OTP verification, dynamic role-based dashboards, interactive ticket passes, and search/category filtering.

---

## 🚀 Key Features

* **🔒 Secure Authentication & 2FA:** User registration and login protected by secure password hashing (Bcrypt.js), JWT session tokens, and automated email OTP verification (via Nodemailer).
* **🎫 Interactive Ticket Passes:** Confirmed bookings generate beautiful, high-fidelity ticket stubs in the dashboard, complete with perforated side-cuts, mock QR Codes, and direct browser print capabilities.
* **📅 Calendar & Map Integrations:** One-click integration to add events to **Google Calendar** and open location coordinates instantly on **Google Maps** for directions.
* **⚡ Modern Responsive UI:** Polished layout built with React & Tailwind CSS featuring animated skeleton loaders, horizontal swipe-to-scroll category chips, and smooth hover micro-animations.
* **📊 Admin Dashboard:** Admin console to create, edit, or delete events, monitor total platform revenue, and confirm or cancel pending user booking requests.
* **🧹 Database Utility Tools:** Includes seeding scripts to pre-populate dummy datasets (with optional randomized booking histories) and clean up test data.

---

## 🛠️ Technology Stack

* **Frontend:** React, Vite, Tailwind CSS, Axios, React Icons, React Router DOM.
* **Backend:** Node.js, Express, MongoDB, Mongoose, Nodemailer, JSON Web Tokens (JWT), Bcrypt.js.

---

## 📂 Project Structure

```text
Eventora/
├── package.json         # Unified build/install script config for hosting platforms
├── client/              # Frontend React application
│   ├── src/             # Source files (components, contexts, pages)
│   ├── vercel.json      # SPA routing configuration for Vercel
│   └── vite.config.js   # Vite configuration
└── server/              # Backend Express API
    ├── controllers/     # API request controllers
    ├── middleware/      # Authentication & authorization middlewares
    ├── models/          # Mongoose database schemas
    ├── routes/          # API route files
    ├── seed.js          # Database seeding script
    └── index.js         # Entry point for the server
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `server` directory and configure the following variables:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_jwt_signature_secret
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_app_specific_gmail_password
FRONTEND_URL=http://localhost:5173
```

---

## 🏁 Getting Started

### 1. Installation
Run the unified installer script in the root directory to install dependencies for both the frontend and backend:
```bash
npm run install-all
```

### 2. Seeding the Database (Optional)
To seed the database with 12 high-quality dummy events and test users:
```bash
# Run inside the 'server' directory
node seed.js

# To also include randomized test bookings & transactions:
node seed.js --with-bookings
```

### 3. Local Development
Start the frontend and backend servers concurrently:
```bash
# Start backend (inside 'server' folder)
npm run dev

# Start frontend (inside 'client' folder)
npm run dev
```

---

## 🚀 Deployment Guide (Separate Hosting)

Eventora is optimized for separate deployment (Vercel for Frontend and Render for Backend):

### 1. Frontend on Vercel
1. Link your repository to **Vercel** and select the **`client`** directory as the root folder.
2. Vercel will auto-detect **Vite** as the framework.
3. Add the following **Environment Variable** in the Vercel dashboard:
   * `VITE_API_URL` = `https://your-backend.onrender.com/api` *(Your Render server API URL)*

### 2. Backend on Render
1. Create a new **Web Service** on **Render** and link your repository.
2. Set the **Root Directory** to `server`.
3. Configure the commands:
   * **Build Command:** `npm install`
   * **Start Command:** `node index.js`
4. Add the **Environment Variables** (`MONGODB_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, `NODE_ENV=production`) in Render's dashboard.
5. Set `FRONTEND_URL` to your Vercel address (e.g. `https://eventora.vercel.app`) to authorize CORS access.
