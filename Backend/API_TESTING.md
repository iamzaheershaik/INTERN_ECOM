# 🛍️ E-Commerce API Testing Guide (Thunder Client & Postman)

This guide documents all available endpoints, query parameters, request structures, and authentication flows for testing the E-Commerce backend API using **Thunder Client**, **Postman**, or **cURL**.

---

## 🚀 Getting Started

### 1. Base Configuration
- **Base URL:** `http://localhost:5000`
- **Prefix:** `/api`
- **Content-Type:** `application/json`

> [!TIP]
> **Using Environment/Collection Variables in Thunder Client:**
> Set up an **Environment** in Thunder Client with these variables to make switching between environments simple:
> - `base_url` = `http://localhost:5000/api`
> - `token` = `[Paste the JWT token returned during registration/login]`
>
> You can then reference them in your request URLs and headers using double curly braces (e.g., `{{base_url}}/auth/login` or `Bearer {{token}}`).

> [!IMPORTANT]
> **📬 One-Click Test with Postman Collection:**
> We have created a pre-configured Postman Collection file in this project:
> [ecommerce_postman_collection.json](file:///d:/Task_MERN/Backend/ecommerce_postman_collection.json)
>
> **How to use it in Postman:**
> 1. Open **Postman**.
> 2. Click the **Import** button (top left).
> 3. Choose the [ecommerce_postman_collection.json](file:///d:/Task_MERN/Backend/ecommerce_postman_collection.json) file from this folder.
> 4. Select **Import** to load it into your Postman workspace.
> 5. **Set Variables:** Click on the collection name in Postman, navigate to the **Variables** tab:
>    - Paste your customer JWT token into the **Current Value** of the `user_token` variable.
>    - Paste your administrator JWT token into the **Current Value** of the `admin_token` variable.
>    - Click **Save** (`Ctrl+S`). All authenticated requests will automatically use their respective tokens!

### 2. Promoting a User to Admin
Some routes are restricted to **Admin** users. Because registration assigns the `'user'` role by default, you can promote a user to admin by manually modifying the MongoDB document:
1. Connect to MongoDB (e.g., via **MongoDB Compass** using the URI `mongodb://localhost:27017/ecommerce`).
2. Open the `users` collection.
3. Locate your registered user and change their `role` field from `"user"` to `"admin"`.
4. Click **Update** to save the changes.

---

## 📋 Table of Contents
1. [Authentication Endpoints (`/auth`)](#1-authentication-endpoints-auth)
2. [User Management (`/users`)](#2-user-management-users)
3. [Product Catalog (`/products`)](#3-product-catalog-products)
4. [Cart Operations (`/cart`)](#4-cart-operations-cart)
5. [Order Operations (`/orders`)](#5-order-operations-orders)
6. [Admin Dashboard (`/admin`)](#6-admin-dashboard-admin)

---

## 1. Authentication Endpoints (`/auth`)

These endpoints manage user registration, logging in, password reset requests, and password confirmations. No authorization tokens are required for these endpoints.

### A. User Registration
Creates a new standard user account.

- **Method / URL:** `POST` `http://localhost:5000/api/auth/register`
- **Headers:** 
  - `Content-Type: application/json`
- **Request Body (JSON):**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "johndoe@example.com",
  "password": "securepassword123",
  "confirmPassword": "securepassword123",
  "phone": "+1234567890"
}
```
> **cURL Command:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"johndoe@example.com","password":"securepassword123","confirmPassword":"securepassword123","phone":"+1234567890"}'
```

---

### B. User Login
Logs in an active user and returns a JSON Web Token (JWT).

- **Method / URL:** `POST` `http://localhost:5000/api/auth/login`
- **Headers:** 
  - `Content-Type: application/json`
- **Request Body (JSON):**
```json
{
  "email": "johndoe@example.com",
  "password": "securepassword123"
}
```

> **cURL Command:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"johndoe@example.com","password":"securepassword123"}'
```

---

### C. Forgot Password
Generates a random token, hashes it, saves the expiration date to the user record, and outputs the plain text token to the backend server console.

- **Method / URL:** `POST` `http://localhost:5000/api/auth/forgot-password`
- **Headers:** 
  - `Content-Type: application/json`
- **Request Body (JSON):**
```json
{
  "email": "johndoe@example.com"
}
```

> [!NOTE]
> Check the terminal output of your running Express server (where `npm run dev` is running) to copy the generated reset token.

> **cURL Command:**
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"johndoe@example.com"}'
```

---

### D. Reset Password
Resets the password of the user using the verification token retrieved from the console.

- **Method / URL:** `POST` `http://localhost:5000/api/auth/reset-password`
- **Headers:** 
  - `Content-Type: application/json`
- **Request Body (JSON):**
```json
{
  "token": "YOUR_TOKEN_FROM_SERVER_CONSOLE",
  "newPassword": "newsecurepassword123"
}
```

> **cURL Command:**
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_TOKEN_FROM_SERVER_CONSOLE","newPassword":"newsecurepassword123"}'
```

---

## 2. User Management (`/users`)

These routes allow users and admins to view or update profiles.

| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/api/users` | `GET` | **Admin Only** | Fetch all users, sorted by newest first |
| `/api/users/:id` | `GET` | **Admin or Self** | Fetch a single user profile |
| `/api/users/:id` | `PUT` | **Admin or Self** | Update a user profile (Admin only can change `role` and `isActive`) |
| `/api/users/:id` | `DELETE` | **Admin Only** | Hard delete a user account from database |

### A. Get All Users
- **Method / URL:** `GET` `http://localhost:5000/api/users`
- **Headers:**
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`

> **cURL Command:**
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```

---

### B. Update User Profile
- **Method / URL:** `PUT` `http://localhost:5000/api/users/USER_ID`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <JWT_TOKEN>`
- **Request Body (JSON) (All fields optional):**
```json
{
  "firstName": "Johnny",
  "phone": "+9876543210"
}
```

> **cURL Command:**
```bash
curl -X PUT http://localhost:5000/api/users/USER_ID \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Johnny","phone":"+9876543210"}'
```

---

## 3. Product Catalog (`/products`)

Manage products. Users can view them publicly, but only Admins can create, update, or soft-delete them.

| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/api/products` | `GET` | **Public** | Get products with search, pagination, and sorting |
| `/api/products/:id` | `GET` | **Public** | Fetch a single product's complete details |
| `/api/products` | `POST` | **Admin Only** | Add a new product into catalog |
| `/api/products/:id` | `PUT` | **Admin Only** | Update existing product details |
| `/api/products/:id` | `DELETE` | **Admin Only** | Soft-delete a product (flags `isDeleted: true`) |

### A. Create Product (Admin Only)
- **Method / URL:** `POST` `http://localhost:5000/api/products`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Request Body (JSON):**
```json
{
  "name": "Wireless Mechanical Keyboard",
  "description": "Ergonomic 75% mechanical keyboard with custom linear switches and RGB backlighting.",
  "price": 89.99,
  "quantity": 50,
  "category": "Electronics",
  "image": "https://example.com/keyboard.jpg",
  "status": "active"
}
```

> **cURL Command:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Wireless Mechanical Keyboard","description":"Ergonomic 75% mechanical keyboard with custom linear switches and RGB backlighting.","price":89.99,"quantity":50,"category":"Electronics","image":"https://example.com/keyboard.jpg","status":"active"}'
```

---

### B. Get Products (Public)
Fetches catalog items. Soft-deleted items are excluded automatically.

- **Method / URL:** `GET` `http://localhost:5000/api/products`
- **Query Parameters (Optional):**
  - `page`: Page index (default: `1`)
  - `limit`: Items per page (default: `12`)
  - `search`: Searches product `name` or `category` case-insensitively (e.g. `search=keyboard`)
  - `category`: Filters by exact category (e.g. `category=Electronics`)
  - `sort`: Fields to sort by (e.g. `sort=price` for ascending, `sort=-price` for descending, defaults to `-createdAt`)

> **Sample URL with Parameters:**
> `http://localhost:5000/api/products?page=1&limit=10&search=keyboard&sort=-price`

> **cURL Command:**
```bash
curl -X GET "http://localhost:5000/api/products?page=1&limit=10&search=keyboard&sort=-price"
```

---

### C. Update Product (Admin Only)
- **Method / URL:** `PUT` `http://localhost:5000/api/products/PRODUCT_ID`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Request Body (JSON) (All fields optional):**
```json
{
  "price": 79.99,
  "quantity": 100
}
```

---

### D. Delete Product (Admin Only)
- **Method / URL:** `DELETE` `http://localhost:5000/api/products/PRODUCT_ID`
- **Headers:**
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`

> [!NOTE]
> This executes a **soft delete** by setting `isDeleted: true` on the product. It will no longer appear in standard product listing or get product requests, but remains in the database for analytics.

---

## 4. Cart Operations (`/cart`)

Cart endpoints require an authenticated user. One cart is bound to one user ID.

| Endpoint | Method | Description |
|---|---|---|
| `/api/cart` | `GET` | Fetch items inside your cart (automatically populates product details) |
| `/api/cart/add` | `POST` | Add a product or increase quantity inside your cart |
| `/api/cart/update` | `PUT` | Update the exact quantity of an item in your cart (removes item if quantity <= 0) |
| `/api/cart/remove/:id` | `DELETE` | Remove a specific product completely from your cart |

### A. Get Cart
- **Method / URL:** `GET` `http://localhost:5000/api/cart`
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`

---

### B. Add to Cart
- **Method / URL:** `POST` `http://localhost:5000/api/cart/add`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <JWT_TOKEN>`
- **Request Body (JSON):**
```json
{
  "productId": "PRODUCT_ID",
  "quantity": 2
}
```

> [!IMPORTANT]
> The backend validates product availability and available stock quantity. Adding a quantity that exceeds stock or adding a soft-deleted item will return a `400 VALIDATION_ERROR` or `400 INSUFFICIENT_STOCK`.

---

### C. Update Cart Item
- **Method / URL:** `PUT` `http://localhost:5000/api/cart/update`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <JWT_TOKEN>`
- **Request Body (JSON):**
```json
{
  "productId": "PRODUCT_ID",
  "quantity": 5
}
```

---

### D. Remove from Cart
Removes the product from your cart completely regardless of its quantity.

- **Method / URL:** `DELETE` `http://localhost:5000/api/cart/remove/PRODUCT_ID`
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`

---

## 5. Order Operations (`/orders`)

All order operations require authentication. Creating an order checks out the cart and decreases product stock levels.

| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/api/orders` | `POST` | **User** | Check out current cart and place a pending order |
| `/api/orders` | `GET` | **User / Admin** | Admins view all system orders; Users view their own order history |
| `/api/orders/:id` | `GET` | **Admin / Buyer** | View specific order details and breakdown |

### A. Create Order (Checkout)
Checkout all items in the user's cart, verify stock, decrement product quantities, create a pending order document, and clear the cart.

- **Method / URL:** `POST` `http://localhost:5000/api/orders`
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Request Body:** *None (Uses the existing items inside the user's cart in the DB)*

---

### B. Get Orders
- **Method / URL:** `GET` `http://localhost:5000/api/orders`
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`

---

### C. Get Order by ID
- **Method / URL:** `GET` `http://localhost:5000/api/orders/ORDER_ID`
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`

---

## 6. Admin Dashboard (`/admin`)

Endpoints dedicated for business performance metrics and user management, restricted to users with `role === 'admin'`.

| Endpoint | Method | Description |
|---|---|---|
| `/api/admin/dashboard` | `GET` | Dashboard stats (totals + revenue + recent orders) |
| `/api/admin/users` | `GET` | List all users with details |
| `/api/admin/users/:id/role` | `PATCH` | Promote or demote a user's role |

### A. Get Dashboard Stats
Calculates and returns total users, total active products, total orders, aggregated total revenue, and the top 5 most recent orders.

- **Method / URL:** `GET` `http://localhost:5000/api/admin/dashboard`
- **Headers:**
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`

> **cURL Command:**
```bash
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```

---

### B. Get All Users (Admin)
Returns a list of all registered users (excluding passwords).

- **Method / URL:** `GET` `http://localhost:5000/api/admin/users`
- **Headers:**
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`

> **cURL Command:**
```bash
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```

---

### C. Update User Role (Admin)
Promote a user to admin or demote an admin back to user. Admins cannot change their own role.

- **Method / URL:** `PATCH` `http://localhost:5000/api/admin/users/USER_ID/role`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Request Body (JSON):**
```json
{
  "role": "admin"
}
```

> [!NOTE]
> Valid `role` values are `"user"` or `"admin"`. The API prevents an admin from changing their own role.

> **cURL Command:**
```bash
curl -X PATCH http://localhost:5000/api/admin/users/USER_ID/role \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}'
```

---

## 💡 Quick Integration Test Scenario

Want to run a quick test from start to finish? Follow this sequence:

1. **Register** a new user account.
2. **Copy the JWT** from the response data.
3. Promote this user to **admin** in your database using Compass or Mongo Shell.
4. **Log in** again (or use the copied token) to authenticate as Admin.
5. **Create two products** using the admin token (make sure to note down their `_id` values).
6. **Register / Log in** as a separate **regular customer** and copy their token.
7. **Add products to the cart** using the customer token and the product IDs you noted.
8. **Check your cart** to verify products were added and populated.
9. **Checkout** (Create Order) to complete the transaction.
10. Check the **Admin Dashboard Stats** using the admin token to see the updated revenue and recent orders.
11. **List all users** via `/api/admin/users` and **update a user's role** via the PATCH endpoint.

