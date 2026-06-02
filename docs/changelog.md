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

