# REST API Specification

This document provides a complete technical specification for all Next.js server route handlers implemented under `src/app/api/`.

---

## 1. Authentication & Users

### 1.1. User Registration
Creates a new customer account using email and password credentials.

- **Endpoint**: `/api/register`
- **Method**: `POST`
- **Access Level**: Public
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Validation**:
  - `email` and `password` are mandatory.
  - `password` must be at least 5 characters.
  - `email` must not already exist in the database.
- **Responses**:
  - **`201 Created`**:
    ```json
    {
      "_id": "66f7f2b18c0e2b4d9a123456",
      "name": "John Doe",
      "email": "john@example.com",
      "admin": false,
      "createdAt": "2026-09-29T10:00:00.000Z",
      "updatedAt": "2026-09-29T10:00:00.000Z"
    }
    ```
  - **`400 Bad Request`**:
    ```json
    { "error": "User with this email already exists" }
    ```

---

### 1.2. NextAuth Authentication Handler
Handles login with credentials (email/password), Google OAuth 2.0 exchange, session verification, and token generation.

- **Endpoint**: `/api/auth/[...nextauth]`
- **Method**: `GET` / `POST`
- **Access Level**: Public
- **Supported Providers**:
  - `CredentialsProvider`: Validates email and bcrypt password hash against MongoDB `User`.
  - `GoogleProvider`: Signs in or links account via Google OAuth 2.0.

---

### 1.3. User Profile
Fetches and updates the profile, contact, and address data for the logged-in user or allows admins to inspect/edit other users.

#### `GET /api/profile`
- **Access Level**: Authenticated User (or Admin with query parameter)
- **Query Parameters**:
  - `_id` *(Optional)*: MongoDB ID of the user to fetch (Restricted to Admin only).
- **Responses**:
  - **`200 OK`**:
    ```json
    {
      "_id": "66f7f2b18c0e2b4d9a123456",
      "name": "John Doe",
      "email": "john@example.com",
      "image": "https://res.cloudinary.com/...",
      "phone": "+91 9876543210",
      "streetAddress": "123 Main St",
      "city": "Pune",
      "postalCode": "411001",
      "country": "India",
      "admin": false
    }
    ```
  - **`401 Unauthorized`**: If user session is not present.
  - **`403 Forbidden`**: If non-admin attempts to supply `_id` parameter.

#### `PUT /api/profile`
- **Access Level**: Authenticated User
- **Request Body**:
  ```json
  {
    "_id": "optional_user_id_if_admin_updating_another_user",
    "name": "John Doe Updated",
    "image": "https://res.cloudinary.com/...",
    "phone": "+91 9876543210",
    "streetAddress": "Flat 402, Sunshine Apts",
    "city": "Pune",
    "postalCode": "411001",
    "country": "India",
    "admin": false
  }
  ```
- **Security Check**: Non-admin users cannot alter their own `admin` status (the field is stripped if caller lacks admin rights).

---

### 1.4. Users Directory (Admin Only)
Fetches a list of all registered users for administration.

- **Endpoint**: `/api/users`
- **Method**: `GET`
- **Access Level**: Admin Only (`isAdmin() === true`)
- **Responses**:
  - **`200 OK`**: Array of user documents.
  - **`403 Forbidden`**: If non-admin requests this endpoint.

---

## 2. Categories Management

### 2.1. List Categories
- **Endpoint**: `/api/categories`
- **Method**: `GET`
- **Access Level**: Public
- **Response `200 OK`**:
  ```json
  [
    {
      "_id": "66f80123a1b2c3d4e5f67890",
      "name": "Pizza",
      "createdAt": "2026-09-29T10:00:00.000Z"
    }
  ]
  ```

### 2.2. Create Category
- **Endpoint**: `/api/categories`
- **Method**: `POST`
- **Access Level**: Admin Only
- **Request Body**: `{ "name": "Desserts" }`
- **Response `201 Created`**: `{ "success": true, "category": { ... } }`

### 2.3. Update Category
- **Endpoint**: `/api/categories`
- **Method**: `PUT`
- **Access Level**: Admin Only
- **Request Body**: `{ "_id": "66f80123a1b2c3d4e5f67890", "name": "Artisan Pizzas" }`
- **Response `200 OK`**: `{ "success": true }`

### 2.4. Delete Category
- **Endpoint**: `/api/categories?_id=<categoryId>`
- **Method**: `DELETE`
- **Access Level**: Admin Only
- **Response `200 OK`**: `{ "success": true }`

---

## 3. Menu Items Management

### 3.1. List Menu Items
- **Endpoint**: `/api/menu-items`
- **Method**: `GET`
- **Access Level**: Public
- **Response `200 OK`**: Array of menu item objects including sizes and extra ingredient pricing.

### 3.2. Create Menu Item
- **Endpoint**: `/api/menu-items`
- **Method**: `POST`
- **Access Level**: Admin Only
- **Request Body**:
  ```json
  {
    "name": "Pepperoni Pizza",
    "description": "Loaded with premium pepperoni and mozzarella cheese.",
    "category": "66f80123a1b2c3d4e5f67890",
    "basePrice": 299,
    "image": "https://res.cloudinary.com/...",
    "sizes": [
      { "name": "Medium", "price": 100 },
      { "name": "Large", "price": 200 }
    ],
    "extraIngredientPrices": [
      { "name": "Extra Cheese", "price": 50 },
      { "name": "Olives", "price": 30 }
    ]
  }
  ```
- **Response `201 Created`**: Created `MenuItem` document.

### 3.3. Update Menu Item
- **Endpoint**: `/api/menu-items`
- **Method**: `PUT`
- **Access Level**: Admin Only
- **Request Body**: Same schema as POST with `_id` specified.
- **Response `200 OK`**: `true`

### 3.4. Delete Menu Item
- **Endpoint**: `/api/menu-items?_id=<menuItemId>`
- **Method**: `DELETE`
- **Access Level**: Admin Only
- **Response `200 OK`**: `{ "success": true }`

---

## 4. Checkout & Payment Lifecycle

### 4.1. Initialize Order & Razorpay Transaction
Registers an unpaid order in MongoDB and creates a corresponding Razorpay order with the amount converted to paise ($1 \text{ INR} = 100 \text{ paise}$).

- **Endpoint**: `/api/checkout`
- **Method**: `POST`
- **Access Level**: Authenticated User
- **Request Body**:
  ```json
  {
    "address": {
      "phone": "+91 9876543210",
      "address": "402 Royal Residency",
      "city": "Pune",
      "postalCode": "411001"
    },
    "cartProducts": [
      {
        "_id": "66f801...",
        "name": "Pepperoni Pizza",
        "basePrice": 299,
        "size": { "name": "Medium", "price": 100 },
        "extras": [{ "name": "Extra Cheese", "price": 50 }]
      }
    ]
  }
  ```
- **Responses**:
  - **`200 OK`**:
    ```json
    {
      "razorpayOrderId": "order_P3h2vK8nJ7aBcD",
      "orderId": "66f81a7b0e2b4d9a98765432"
    }
    ```
  - **`400 Bad Request`**: Cart is empty.
  - **`401 Unauthorized`**: If user is not logged in.

---

### 4.2. Verify Payment Signature
Verifies the cryptographic HMAC SHA-256 signature returned by the Razorpay client modal to ensure the transaction wasn't tampered with, then marks the order as paid.

- **Endpoint**: `/api/verify-payment`
- **Method**: `POST`
- **Access Level**: Public / Authenticated
- **Request Body**:
  ```json
  {
    "razorpay_payment_id": "pay_P3h5gQ7dK8nXYZ",
    "razorpay_order_id": "order_P3h2vK8nJ7aBcD",
    "razorpay_signature": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    "orderId": "66f81a7b0e2b4d9a98765432"
  }
  ```
- **Responses**:
  - **`200 OK`**:
    ```json
    { "success": true, "message": "Payment verified successfully" }
    ```
  - **`400 Bad Request`**: Signature mismatch / verification failed.
  - **`404 Not Found`**: Target `orderId` does not exist in database.

---

## 5. Orders & Tracking

### 5.1. Fetch Orders
- **Endpoint**: `/api/orders`
- **Method**: `GET`
- **Access Level**: Authenticated User
- **Query Parameters**:
  - `_id` *(Optional)*: Specific order ID.
- **Behavior**:
  - If `_id` is supplied: Customer can view their own order; Admin can view any order.
  - If no `_id` is supplied: Admin receives all orders in the system; Customer receives only orders matching their `session.user.email`.
- **Response `200 OK`**: Single order object or array of order objects.

---

## 6. Media Uploads

### 6.1. Upload Image to Cloudinary
Streams multipart file data to Cloudinary CDN and returns a secure HTTPS URL.

- **Endpoint**: `/api/upload`
- **Method**: `POST`
- **Access Level**: Authenticated
- **Request Format**: `multipart/form-data`
  - Field: `file` (Image file blob)
- **Response `200 OK`**:
  ```json
  {
    "link": "https://res.cloudinary.com/dbsdxqnvz/image/upload/v1727600000/food-ordering/abcdef123.jpg"
  }
  ```
- **Response `400 Bad Request`**: `{ "message": "No file found" }`
