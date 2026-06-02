# 📦 Task_MERN - Project Overview

## Stack
- **Backend**: Node.js + Express (ESModules)
- **Database**: MongoDB Atlas (Mongoose)
- **Frontend**: React + Vite
- **Auth**: JWT (7 days expiry)
- **File Storage**: Cloudinary

---

## 📁 Project Structure

```
Task_MERN/
├── Backend/
│   ├── server.js              → Entry point, connects MongoDB, starts server
│   ├── .env                   → Environment variables
│   └── src/
│       ├── app.js             → Express app, all routes registered
│       ├── config/db.js       → MongoDB connection
│       ├── controllers/       → Business logic
│       ├── models/            → Mongoose schemas
│       ├── routes/            → API route definitions
│       └── middleware/        → errorHandler.js
└── Frontend/
    └── vite-project/          → React + Vite app
```

---

## 🌐 API Routes (Backend runs on PORT 5000)

| Route | Description |
|-------|-------------|
| `/api/auth` | Login, Register |
| `/api/users` | User management |
| `/api/products` | Product CRUD |
| `/api/cart` | Cart operations |
| `/api/orders` | Order management |
| `/api/admin` | Admin panel routes |

---

## ⚙️ Environment Variables (.env)

| Key | Purpose |
|-----|---------|
| `PORT` | 5000 |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Token signing key |
| `JWT_EXPIRE` | 7d |
| `CLOUDINARY_*` | Image upload config |

---

## 🚀 How to Run

### Backend
```bash
cd Backend
npm run dev
```

### Frontend
```bash
cd Frontend/vite-project
npm run dev
```

---

## 📝 Changelog
<!-- Add your changes below with date -->

### 2026-06-02
- Project initialized
- Backend running on port 5000
- MongoDB Atlas connected
