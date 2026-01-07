# 📚 TechStore E-Commerce - Documentation Index

## Getting Started

### For the First Time
1. **Start Here**: [QUICK_REFERENCE.txt](./QUICK_REFERENCE.txt) - Visual quick start guide
2. **Setup**: [README.md](./README.md) - Installation instructions
3. **Run**: Backend on port 5000, Frontend on port 8000

### Project Overview
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete project overview and features

## Development & Testing

### API Development
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference
  - All endpoints documented
  - Request/response examples
  - cURL command examples
  - Error codes explained

### Testing & QA
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Comprehensive testing guide
  - Step-by-step test scenarios
  - API endpoint testing
  - Error testing
  - Performance testing
  - Browser compatibility
  - Troubleshooting guide

## Production & Deployment

### Deployment
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Production deployment guide
  - Heroku deployment
  - AWS (EC2, S3, CloudFront)
  - DigitalOcean setup
  - Docker containerization
  - Security hardening
  - Performance optimization
  - Monitoring & logging
  - Backup strategies
  - Scaling considerations

## Project Structure

```
ecommercestore/
├── README.md                  ← Start here for setup
├── QUICK_REFERENCE.txt        ← Quick visual guide
├── PROJECT_SUMMARY.md         ← Project overview
├── API_DOCUMENTATION.md       ← API reference
├── TESTING_GUIDE.md          ← Testing procedures
├── DEPLOYMENT_GUIDE.md       ← Production guide
├── setup.sh                  ← Setup script
│
├── backend/                   ← Express.js server
│   ├── server.js             ← Main app
│   ├── database.js           ← SQLite setup
│   ├── package.json          ← Dependencies
│   ├── .env                  ← Config
│   ├── routes/               ← API endpoints
│   │   ├── auth.js
│   │   ├── products.js
│   │   └── orders.js
│   └── middleware/           ← Auth middleware
│       └── auth.js
│
└── frontend/                  ← HTML/CSS/JavaScript
    ├── index.html            ← Product listing
    ├── cart.html             ← Shopping cart
    ├── login.html            ← Auth page
    ├── orders.html           ← Order history
    ├── app.js                ← Main logic
    ├── api.js                ← API client
    ├── auth.js               ← Auth logic
    ├── cart.js               ← Cart logic
    ├── orders.js             ← Orders logic
    └── styles.css            ← Styling
```

## Quick Commands Reference

### Backend
```bash
cd backend
npm install          # Install dependencies
npm start           # Start server on port 5000
npm run dev         # Development mode with auto-reload
```

### Frontend
```bash
cd frontend
python3 -m http.server 8000    # Start on port 8000
```

### Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Get all products
curl http://localhost:5000/api/products

# See TESTING_GUIDE.md for more examples
```

## Key Features Implemented

✅ **User Management**
- Registration with password hashing
- Login with JWT tokens
- Protected routes

✅ **Product Catalog**
- Browse all products
- Filter by category
- View product details
- Real-time stock info

✅ **Shopping Cart**
- Add/remove items
- Update quantities
- Persistent storage
- Price calculations

✅ **Order Processing**
- Secure checkout
- Stock validation
- Order history
- Order details

✅ **Security**
- Password hashing (bcryptjs)
- JWT authentication
- Protected endpoints
- Input validation
- CORS enabled

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend Framework | Express.js |
| Database | SQLite3 |
| Authentication | JWT + bcryptjs |
| Frontend Framework | Bootstrap 5 |
| Frontend Language | Vanilla JavaScript |
| HTTP Client | Fetch API |
| Storage | localStorage |

## Database Schema

### Users Table
- id (PRIMARY KEY)
- email (UNIQUE)
- password (HASHED)
- name
- created_at

### Products Table
- id (PRIMARY KEY)
- name
- description
- price
- stock
- category
- created_at

### Orders Table
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- total_amount
- status
- created_at

### Order Items Table
- id (PRIMARY KEY)
- order_id (FOREIGN KEY)
- product_id (FOREIGN KEY)
- quantity
- price

## Sample Data

6 pre-loaded products:
1. Laptop Pro - $1,299.99
2. Wireless Mouse - $29.99
3. USB-C Cable - $12.99
4. Mechanical Keyboard - $89.99
5. Monitor 4K - $399.99
6. Webcam HD - $59.99

**Test Account:**
- Email: john@example.com
- Password: password123

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get by category

### Orders (Protected)
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

### Health
- `GET /api/health` - Check server status

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Backend won't start | Run `npm install` first, then `npm start` |
| Frontend not loading | Make sure `python3 -m http.server 8000` is running |
| CORS errors | Verify both servers running on ports 5000 & 8000 |
| Cart not saving | Check localStorage is enabled |
| Login fails | Try creating new account first |
| Products not showing | Check browser console, restart backend |

## Deployment Paths

Choose based on your needs:

- **Development**: Local setup (see README.md)
- **Free Tier**: Heroku (basic setup)
- **Scalable**: AWS (EC2 + S3 + CloudFront)
- **Simple VPS**: DigitalOcean
- **Containerized**: Docker deployment

See DEPLOYMENT_GUIDE.md for detailed instructions.

## Next Steps

1. **Development**
   - Follow README.md for setup
   - Use TESTING_GUIDE.md for QA
   - Refer to API_DOCUMENTATION.md for API details

2. **Production**
   - Choose deployment option from DEPLOYMENT_GUIDE.md
   - Configure environment variables
   - Set up monitoring and backups
   - Enable HTTPS/SSL

3. **Scaling**
   - Database optimization
   - Caching layer (Redis)
   - Load balancing
   - CDN for static assets

## Support & Resources

- **Errors?** Check TESTING_GUIDE.md troubleshooting section
- **API Help?** See API_DOCUMENTATION.md with examples
- **Deploy?** Follow DEPLOYMENT_GUIDE.md step-by-step
- **Code Issues?** Review PROJECT_SUMMARY.md for architecture

## Final Checklist

- [ ] Backend dependencies installed (`npm install`)
- [ ] Backend server running (`npm start`)
- [ ] Frontend server running (`python3 -m http.server 8000`)
- [ ] Can access `http://localhost:8000`
- [ ] Can register new account
- [ ] Can login with test credentials
- [ ] Can browse products
- [ ] Can add to cart
- [ ] Can checkout
- [ ] Can view orders

## License

MIT License - Feel free to use for learning and development.

---

**Last Updated:** January 6, 2026  
**Version:** 1.0.0  
**Status:** ✅ Complete & Ready to Use
