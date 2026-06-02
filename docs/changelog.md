# 📋 Changelog

> Log every meaningful change you make to the project.

---

## Format
```
### [YYYY-MM-DD] - Short Description
- What changed
- Why it changed
- Files affected
```

---

## Log

### [2026-06-02] - Project Setup
- Backend running on port 5000
- MongoDB Atlas connected via MONGO_URI
- JWT auth implemented
- Cloudinary configured for image uploads
- Routes: auth, users, products, cart, orders, admin

### [2026-06-02] - CORS & Docs Update
- Added `cors` middleware to `app.js` for frontend cross-origin access
- Updated `API_TESTING.md` with missing admin endpoints (`GET /api/admin/users`, `PATCH /api/admin/users/:id/role`)
- Added endpoint summary table and cURL examples to admin section
- Files affected: `src/app.js`, `package.json`, `API_TESTING.md`, `docs/changelog.md`

### [2026-06-02] - Implement Real Password Recovery using Nodemailer
- Installed `nodemailer` package in `Backend`
- Added SMTP environment variable configurations to `Backend/.env`
- Implemented real email transporter and sender helper `Backend/src/utils/sendEmail.js`
- Integrated `sendEmail` into `forgotPassword` in `Backend/src/controllers/authController.js` with premium styled HTML templates
- Updated frontend recovery flow in `ForgotPassword.jsx` to direct users to check their mailboxes rather than server logs
- Enhanced `ResetPassword.jsx` with `useSearchParams` hook to support token auto-filling via URL query parameter `?token=...`
- Files affected: `Backend/package.json`, `Backend/.env`, `Backend/src/utils/sendEmail.js`, `Backend/src/controllers/authController.js`, `Frontend/vite-project/src/pages/auth/ForgotPassword.jsx`, `Frontend/vite-project/src/pages/auth/ResetPassword.jsx`


