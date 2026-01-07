# Testing Guide - TechStore E-Commerce

This guide will help you test all features of the TechStore application.

## Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:8000`

## Step-by-Step Testing

### 1. User Registration & Login

#### Test Registration
1. Open `http://localhost:8000/login.html`
2. Click the "Register" tab
3. Fill in the form:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Register"
5. Expected: Success message "Registration successful! Please login."

#### Test Login
1. Click the "Login" tab
2. Fill in credentials:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Login"
4. Expected: Redirect to home page with user name displayed in navbar

### 2. Product Browsing

#### Test Product Listing
1. After login, you should see the home page with products
2. Products should display:
   - Product image placeholder
   - Product name
   - Description
   - Price
   - Stock information
   - "View" and "Add" buttons

#### Test Product Filtering by Category
1. In the left sidebar, click different categories:
   - "All Products"
   - "Electronics"
   - "Accessories"
2. Expected: Products filter accordingly

#### Test Product Details
1. Click "View" button on any product
2. A modal should open showing:
   - Product image
   - Description
   - Price
   - Stock availability
   - Quantity selector
   - "Add to Cart" button
3. Change quantity and click "Add to Cart"
4. Expected: Success message

### 3. Shopping Cart

#### Test Add to Cart
1. From product listing, click "Add" button on multiple products
2. Check the cart count badge in the top right (should increase)
3. Go to `http://localhost:8000/cart.html`
4. Expected: All added items should appear in the cart

#### Test Cart Modifications
1. On cart page, test quantity buttons:
   - Click "+" to increase quantity
   - Click "−" to decrease quantity
   - Expected: Totals update automatically
2. Click "Remove" button on an item
   - Expected: Item disappears from cart

#### Test Cart Calculations
1. Verify the order summary shows:
   - Subtotal (sum of item prices × quantities)
   - Tax (10% of subtotal)
   - Total (subtotal + tax)
2. Update quantities and verify calculations update

### 4. Order Processing

#### Test Checkout
1. From cart page, click "Proceed to Checkout"
2. Expected outcomes:
   - If not logged in: Shows login prompt
   - If logged in: Order is processed
3. Expected: Success message with Order ID and total amount
4. Expected: Redirect to orders page

#### Test Order Creation Validation
1. Add item to cart
2. Edit quantity to exceed available stock
3. Try to checkout
4. Expected: Error message "Insufficient stock for [product name]"

### 5. Order History

#### Test View Orders
1. After successful checkout, you should be on orders page
2. Orders page should show:
   - Order ID
   - Order Date
   - Number of items
   - Total amount
   - Status (completed/pending)
   - "View" button

#### Test Order Details
1. Click "View" button on an order
2. A modal should open showing:
   - Order number and date
   - List of items with:
     - Product name
     - Quantity
     - Unit price
     - Subtotal
   - Order total breakdown (subtotal, tax, total)

### 6. Authentication & Security

#### Test JWT Token
1. Login successfully
2. Open browser DevTools (F12)
3. Go to Application → Local Storage
4. Check that `token` and `user` are stored
5. Expected: Token should be a JWT with proper format

#### Test Protected Routes
1. Clear localStorage: `localStorage.clear()`
2. Go to `http://localhost:8000/orders.html`
3. Expected: Should redirect to login page

#### Test Invalid Login
1. Go to login page
2. Enter wrong credentials
3. Click "Login"
4. Expected: Error message "Invalid credentials"

### 7. API Testing (curl commands)

#### Test Health Check
```bash
curl http://localhost:5000/api/health
```
Expected: `{"message":"Server is running"}`

#### Test Get All Products
```bash
curl http://localhost:5000/api/products
```
Expected: Array of 6 sample products

#### Test Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","password":"pass123","name":"New User"}'
```
Expected: `{"message":"User registered successfully","userId":X}`

#### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
Expected: JWT token and user info

#### Test Create Order (with token)
```bash
TOKEN="<your_token_here>"
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"items":[{"productId":1,"quantity":1}]}'
```
Expected: `{"message":"Order created successfully","orderId":X,"totalAmount":Y}`

## Error Testing

### Test Error Scenarios

1. **Missing Required Fields**
   - Try to register without email
   - Expected: Error message

2. **Duplicate Email**
   - Try to register with existing email
   - Expected: Error "User already exists"

3. **Invalid Password**
   - Try to login with wrong password
   - Expected: Error "Invalid credentials"

4. **Non-existent Product**
   - Try to access `/api/products/9999`
   - Expected: 404 error

5. **Invalid Token**
   - Add invalid token in Authorization header
   - Expected: 401 error "Invalid token"

## Performance Testing

1. **Load Multiple Products**
   - Check that all 6 sample products load correctly
   - Verify images and data display

2. **Add Many Items to Cart**
   - Add 20+ different quantity items
   - Verify cart updates smoothly

3. **Large Order Processing**
   - Create order with multiple items
   - Verify all items are saved correctly

## Browser Compatibility

Test in different browsers:
- Chrome/Chromium
- Firefox
- Safari (if available)
- Edge

Expected: Consistent UI and functionality across all browsers

## Responsive Design

1. Test on different screen sizes:
   - Desktop (1920x1080)
   - Laptop (1366x768)
   - Tablet (768x1024)
   - Mobile (375x667)

2. Expected: Layout adjusts appropriately

## Data Persistence

1. Add items to cart
2. Refresh page
3. Expected: Cart items are still there

4. Login, create order
5. Logout and login again
6. Expected: Order history still shows the order

## Cleanup After Testing

To reset the application:
1. Delete `backend/ecommerce.db` to reset database
2. Clear browser LocalStorage
3. Restart backend server

This will restore the application to initial state with sample products.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 on frontend | Ensure `python3 -m http.server 8000` is running |
| 503 on API calls | Ensure `npm start` is running in backend |
| CORS errors | Check that backend has CORS enabled |
| Products not loading | Check browser console for errors, restart server |
| Cart not saving | Ensure localStorage is enabled in browser |
| Token not working | Make sure token hasn't expired (24 hours) |

## Test Scenarios Checklist

- [ ] User Registration
- [ ] User Login
- [ ] Product Listing
- [ ] Product Filtering
- [ ] Product Details
- [ ] Add to Cart
- [ ] Update Cart Quantities
- [ ] Remove from Cart
- [ ] Cart Persistence
- [ ] Checkout Process
- [ ] Order Creation
- [ ] Order History
- [ ] Order Details
- [ ] Stock Validation
- [ ] JWT Token Storage
- [ ] Protected Routes
- [ ] Error Handling
- [ ] Responsive Design
- [ ] Cross-browser Testing
