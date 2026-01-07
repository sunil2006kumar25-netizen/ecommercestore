# API Documentation - TechStore E-Commerce

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

**Error (400):**
```json
{
  "error": "User already exists"
}
```

---

### Login User
**POST** `/auth/login`

Login and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

## Product Endpoints

### Get All Products
**GET** `/products`

Retrieve all products.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Laptop Pro",
    "description": "High-performance laptop",
    "price": 1299.99,
    "stock": 10,
    "category": "Electronics",
    "created_at": "2026-01-06 12:27:47"
  },
  {
    "id": 2,
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse",
    "price": 29.99,
    "stock": 50,
    "category": "Accessories",
    "created_at": "2026-01-06 12:27:47"
  }
]
```

---

### Get Product by ID
**GET** `/products/:id`

Retrieve a specific product.

**URL Parameters:**
- `id` (integer) - Product ID

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Laptop Pro",
  "description": "High-performance laptop",
  "price": 1299.99,
  "stock": 10,
  "category": "Electronics",
  "created_at": "2026-01-06 12:27:47"
}
```

**Error (404):**
```json
{
  "error": "Product not found"
}
```

---

### Get Products by Category
**GET** `/products/category/:category`

Retrieve products in a specific category.

**URL Parameters:**
- `category` (string) - Category name (e.g., "Electronics", "Accessories")

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Laptop Pro",
    "description": "High-performance laptop",
    "price": 1299.99,
    "stock": 10,
    "category": "Electronics",
    "created_at": "2026-01-06 12:27:47"
  }
]
```

---

## Order Endpoints
**All order endpoints require authentication**

### Create Order
**POST** `/orders`

Create a new order from cart items.

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "message": "Order created successfully",
  "orderId": 1,
  "totalAmount": 2659.97
}
```

**Error (400):**
```json
{
  "error": "Insufficient stock for Laptop Pro"
}
```

---

### Get User Orders
**GET** `/orders`

Retrieve all orders for the logged-in user.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "total_amount": 2659.97,
    "status": "completed",
    "created_at": "2026-01-06 13:45:22",
    "itemCount": 2
  }
]
```

---

### Get Order Details
**GET** `/orders/:id`

Retrieve detailed information about a specific order.

**URL Parameters:**
- `id` (integer) - Order ID

**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": 1,
  "total_amount": 2659.97,
  "status": "completed",
  "created_at": "2026-01-06 13:45:22",
  "items": [
    {
      "id": 1,
      "order_id": 1,
      "product_id": 1,
      "quantity": 2,
      "price": 1299.99,
      "name": "Laptop Pro",
      "description": "High-performance laptop"
    },
    {
      "id": 2,
      "order_id": 1,
      "product_id": 2,
      "quantity": 1,
      "price": 29.99,
      "name": "Wireless Mouse",
      "description": "Ergonomic wireless mouse"
    }
  ]
}
```

**Error (404):**
```json
{
  "error": "Order not found"
}
```

---

## Sample cURL Requests

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@example.com",
    "password":"password123",
    "name":"John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@example.com",
    "password":"password123"
  }'
```

### Get all products
```bash
curl http://localhost:5000/api/products
```

### Get product by ID
```bash
curl http://localhost:5000/api/products/1
```

### Get products by category
```bash
curl http://localhost:5000/api/products/category/Electronics
```

### Create order (requires token)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token_here>" \
  -d '{
    "items": [
      {"productId": 1, "quantity": 2},
      {"productId": 2, "quantity": 1}
    ]
  }'
```

### Get user orders (requires token)
```bash
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer <your_token_here>"
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid token"
}
```

### 404 Not Found
```json
{
  "error": "Product not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Status Codes

- `200` - OK (successful GET request)
- `201` - Created (successful POST request)
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Rate Limiting

No rate limiting is currently implemented. For production, consider adding rate limiting middleware.

---

## CORS

CORS is enabled for all origins in development. For production, restrict to specific domains.
