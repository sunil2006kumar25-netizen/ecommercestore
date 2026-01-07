# Deployment Guide - TechStore E-Commerce

## Production Checklist

Before deploying to production, ensure all of these are completed:

- [ ] Environment variables are properly configured
- [ ] JWT secret is changed from default
- [ ] CORS is restricted to specific domains
- [ ] Database backups are configured
- [ ] Error logging is enabled
- [ ] HTTPS/SSL is configured
- [ ] Rate limiting is implemented
- [ ] Input validation is enhanced
- [ ] Sensitive data is not logged
- [ ] Security headers are configured

## Environment Configuration

### Backend Environment Variables

Create a `.env.production` file:

```env
PORT=5000
JWT_SECRET=<change_this_to_a_secure_random_string>
NODE_ENV=production
DATABASE_URL=/path/to/production/database.db
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Deployment Options

### Option 1: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

3. **Configure environment variables**
   ```bash
   heroku config:set JWT_SECRET=<your_secure_secret>
   heroku config:set NODE_ENV=production
   ```

4. **Deploy backend**
   ```bash
   cd backend
   git push heroku main
   ```

5. **Deploy frontend (separate)**
   - Use GitHub Pages or Netlify for frontend
   - Update API_BASE_URL in frontend/api.js

### Option 2: AWS

1. **Backend (EC2 + PM2)**
   ```bash
   # SSH into EC2 instance
   ssh -i key.pem ubuntu@instance-ip
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Clone repository and install dependencies
   git clone your-repo
   cd backend
   npm install
   
   # Start with PM2
   pm2 start server.js --name "ecommerce-backend"
   pm2 startup
   pm2 save
   ```

2. **Frontend (S3 + CloudFront)**
   ```bash
   # Build frontend (if using build tool)
   # Or directly upload to S3
   aws s3 sync frontend/ s3://your-bucket-name
   ```

### Option 3: DigitalOcean

1. **Create Droplet**
   - Ubuntu 22.04 LTS
   - Minimum: 2GB RAM, 2 vCPU

2. **Setup Backend**
   ```bash
   # SSH into droplet
   ssh root@your-droplet-ip
   
   # Update system
   apt update && apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt install -y nodejs
   
   # Install dependencies
   npm install -g pm2 nginx certbot python3-certbot-nginx
   
   # Clone and setup app
   git clone your-repo
   cd backend
   npm install
   pm2 start server.js --name "ecommerce"
   pm2 startup
   pm2 save
   ```

3. **Setup Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Setup SSL Certificate**
   ```bash
   certbot --nginx -d your-domain.com
   ```

## Database Migration to Production

### From SQLite to PostgreSQL

1. **Install PostgreSQL**
   ```bash
   npm install pg
   ```

2. **Update database.js**
   ```javascript
   const { Pool } = require('pg');
   
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
   });
   ```

3. **Migrate data** (if needed)
   - Use migration tools like `db-migrate` or `Knex.js`

## Security Recommendations

### 1. HTTPS/SSL

```bash
# Let's Encrypt (free)
sudo certbot certonly --standalone -d your-domain.com

# Self-signed for internal use
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365
```

### 2. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 3. CORS Configuration

```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### 4. Helmet Security Headers

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 5. Input Validation

```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/auth/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('name').notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // proceed
});
```

## Performance Optimization

### 1. Caching

```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache products
app.get('/api/products', async (req, res) => {
  const cached = await client.get('products');
  if (cached) return res.json(JSON.parse(cached));
  
  const products = await dbAll('SELECT * FROM products');
  await client.setex('products', 3600, JSON.stringify(products));
  res.json(products);
});
```

### 2. Database Indexing

```sql
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_order_user_id ON orders(user_id);
CREATE INDEX idx_order_item_order_id ON order_items(order_id);
CREATE INDEX idx_product_category ON products(category);
```

### 3. API Response Compression

```javascript
const compression = require('compression');
app.use(compression());
```

## Monitoring & Logging

### Using Winston Logger

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.info('App started');
```

### Using PM2 Monitoring

```bash
pm2 install pm2-logrotate
pm2 web  # Web dashboard on port 9615
```

## Backup Strategy

### Automated Daily Backups

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/ecommerce"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup database
cp /path/to/ecommerce.db $BACKUP_DIR/ecommerce_$DATE.db

# Compress
tar -czf $BACKUP_DIR/ecommerce_$DATE.tar.gz $BACKUP_DIR/ecommerce_$DATE.db

# Upload to cloud storage
aws s3 cp $BACKUP_DIR/ecommerce_$DATE.tar.gz s3://your-backup-bucket/
```

Schedule with crontab:
```bash
0 2 * * * /path/to/backup.sh
```

## Scaling Considerations

### 1. Horizontal Scaling

```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  app.listen(PORT);
}
```

### 2. Load Balancing

Use Nginx to load balance multiple Node.js instances:

```nginx
upstream backend {
  server localhost:5000;
  server localhost:5001;
  server localhost:5002;
}

server {
  location /api {
    proxy_pass http://backend;
  }
}
```

### 3. Database Connection Pooling

```javascript
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## CI/CD Pipeline Example (GitHub Actions)

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Install dependencies
      run: cd backend && npm install
    
    - name: Run tests
      run: cd backend && npm test
    
    - name: Deploy to production
      run: |
        # Your deployment script
        ./scripts/deploy.sh
```

## Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify SSL certificate
- [ ] Check database connectivity
- [ ] Monitor logs for errors
- [ ] Test user authentication
- [ ] Test order processing
- [ ] Verify email notifications (if configured)
- [ ] Check performance metrics
- [ ] Setup monitoring alerts
- [ ] Document deployment process

## Rollback Plan

1. **Keep previous version running**
   ```bash
   pm2 save
   pm2 kill
   git checkout previous-version
   npm install
   pm2 start all
   ```

2. **Database rollback**
   ```bash
   # Restore from backup
   cp /backups/ecommerce_backup.db ./ecommerce.db
   ```

## Support & Maintenance

- Regular security updates
- Database cleanup (archive old orders)
- Monitor error logs
- Update dependencies regularly
- Performance tuning based on metrics
