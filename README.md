# TechStore - E-Commerce Application

A full-stack e-commerce platform built with Express.js backend and vanilla JavaScript frontend.

## Quick Start

### Backend
```bash
cd backend
npm install
npm start
```
Backend runs on `http://localhost:5000`

### Frontend
```bash
cd frontend
python3 -m http.server 8000
```
Frontend runs on `http://localhost:8000`

## Features

✅ User Registration & Login (JWT Authentication)
✅ Product Listings with Categories
✅ Product Details & Stock Management
✅ Shopping Cart (localStorage)
✅ Order Processing & Checkout
✅ Order History & Details
✅ Responsive Design with Bootstrap 5

## Database Schema

**Users**: id, email, password (hashed), name, created_at
**Products**: id, name, description, price, stock, category, created_at
**Orders**: id, user_id, total_amount, status, created_at
**Order Items**: id, order_id, product_id, quantity, price

## Sample Products

- Laptop Pro - $1,299.99
- Wireless Mouse - $29.99
- USB-C Cable - $12.99
- Mechanical Keyboard - $89.99
- Monitor 4K - $399.99
- Webcam HD - $59.99

## Project Structure

```
backend/
  ├── routes/ (auth, products, orders)
  ├── middleware/ (auth)
  ├── database.js
  ├── server.js
  └── package.json

frontend/
  ├── index.html
  ├── cart.html
  ├── login.html
  ├── orders.html
  ├── app.js
  ├── cart.js
  ├── auth.js
  ├── orders.js
  ├── api.js
  └── styles.css
```

## Usage

1. Register at `/login.html`
2. Browse products at `/index.html`
3. Add items to cart
4. View cart at `/cart.html`
5. Checkout (requires login)
6. View orders at `/orders.html`