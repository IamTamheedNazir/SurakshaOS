# 🚀 PRODUCTION DEPLOYMENT GUIDE
## UmrahConnect 2.0 - Complete Deployment Process

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### **1. Environment Setup**
```bash
# Required accounts:
□ AWS Account (or DigitalOcean/Heroku)
□ Domain name registered
□ SSL certificate (Let's Encrypt)
□ Email service (SendGrid/AWS SES)
□ SMS service (Twilio)
□ Payment gateways (Razorpay/Stripe)
□ Storage service (AWS S3/Cloudinary)
```

### **2. Code Preparation**
```bash
□ All tests passing
□ Environment variables configured
□ Database migrations ready
□ Seed data prepared
□ Build scripts working
□ Dependencies updated
```

---

## 🔧 DEPLOYMENT OPTIONS

### **Option 1: AWS EC2 (Recommended)**
### **Option 2: DigitalOcean Droplet**
### **Option 3: Heroku**
### **Option 4: Railway**

---

## 🌟 OPTION 1: AWS EC2 DEPLOYMENT (DETAILED)

### **Step 1: Launch EC2 Instance**

```bash
# 1. Login to AWS Console
# 2. Navigate to EC2 Dashboard
# 3. Click "Launch Instance"

# Instance Configuration:
- Name: umrahconnect-backend
- AMI: Ubuntu Server 22.04 LTS
- Instance Type: t3.medium (2 vCPU, 4GB RAM)
- Key Pair: Create new or use existing
- Security Group: 
  - SSH (22) - Your IP
  - HTTP (80) - 0.0.0.0/0
  - HTTPS (443) - 0.0.0.0/0
  - Custom TCP (3000) - 0.0.0.0/0
- Storage: 30GB gp3
```

### **Step 2: Connect to Instance**

```bash
# Download your key pair (.pem file)
chmod 400 your-key.pem

# Connect via SSH
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
```

### **Step 3: Install Dependencies**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install MySQL
sudo apt install -y mysql-server

# Secure MySQL installation
sudo mysql_secure_installation
```

### **Step 4: Setup MySQL Database**

```bash
# Login to MySQL
sudo mysql

# Create database and user
CREATE DATABASE umrahconnect;
CREATE USER 'umrah_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON umrahconnect.* TO 'umrah_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema
mysql -u umrah_user -p umrahconnect < /path/to/schema.sql
```

### **Step 5: Clone and Setup Application**

```bash
# Install Git
sudo apt install -y git

# Clone repository
cd /var/www
sudo git clone https://github.com/IamTamheedNazir/umrahconnect-2.0.git
cd umrahconnect-2.0/backend

# Install dependencies
npm install --production

# Create .env file
sudo nano .env
```

### **Step 6: Configure Environment Variables**

```env
# .env file
NODE_ENV=production
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=umrahconnect
DB_USER=umrah_user
DB_PASSWORD=your_strong_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRE=30d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
REFRESH_TOKEN_EXPIRE=90d

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# Email (SendGrid)
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=UmrahConnect

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Payment Gateways
# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=live

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=umrahconnect-uploads

# Cloudinary (Alternative)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Logging
LOG_LEVEL=info
```

### **Step 7: Configure PM2**

```bash
# Create PM2 ecosystem file
nano ecosystem.config.js
```

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'umrahconnect-api',
    script: './server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G',
    watch: false
  }]
};
```

```bash
# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd
# Run the command it outputs

# Check status
pm2 status
pm2 logs
```

### **Step 8: Configure Nginx**

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/umrahconnect
```

```nginx
# Nginx configuration
server {
    listen 80;
    server_name api.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL Configuration (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Logging
    access_log /var/log/nginx/umrahconnect-access.log;
    error_log /var/log/nginx/umrahconnect-error.log;

    # Client body size
    client_max_body_size 50M;

    # Proxy settings
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/umrahconnect /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### **Step 9: Setup SSL with Let's Encrypt**

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run

# Auto-renewal is setup automatically via cron
```

### **Step 10: Setup Firewall**

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

### **Step 11: Setup Database Backups**

```bash
# Create backup script
sudo nano /usr/local/bin/backup-db.sh
```

```bash
#!/bin/bash
# Database backup script

BACKUP_DIR="/var/backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="umrahconnect"
DB_USER="umrah_user"
DB_PASS="your_strong_password"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/umrahconnect_$DATE.sql.gz

# Delete backups older than 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: umrahconnect_$DATE.sql.gz"
```

```bash
# Make script executable
sudo chmod +x /usr/local/bin/backup-db.sh

# Setup cron job for daily backups
sudo crontab -e

# Add this line (runs daily at 2 AM)
0 2 * * * /usr/local/bin/backup-db.sh >> /var/log/backup.log 2>&1
```

### **Step 12: Setup Monitoring**

```bash
# Install monitoring tools
sudo npm install -g pm2-logrotate

# Configure log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## 🌊 OPTION 2: DIGITALOCEAN DEPLOYMENT

### **Quick Setup:**

```bash
# 1. Create Droplet
- Ubuntu 22.04
- 2GB RAM / 1 vCPU
- Add SSH key

# 2. Follow same steps as AWS EC2 (Steps 2-12)

# 3. Configure Domain
- Add A record: api.yourdomain.com -> Droplet IP
- Wait for DNS propagation (5-30 minutes)
```

---

## 🎨 OPTION 3: HEROKU DEPLOYMENT

### **Quick Setup:**

```bash
# 1. Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# 2. Login
heroku login

# 3. Create app
heroku create umrahconnect-api

# 4. Add MySQL addon
heroku addons:create jawsdb:kitefin

# 5. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
# ... set all other env vars

# 6. Create Procfile
echo "web: node server.js" > Procfile

# 7. Deploy
git push heroku main

# 8. Run migrations
heroku run npm run migrate

# 9. Check logs
heroku logs --tail
```

---

## 🚂 OPTION 4: RAILWAY DEPLOYMENT

### **Quick Setup:**

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Add MySQL database
railway add mysql

# 5. Set environment variables
railway variables set NODE_ENV=production
# ... set all other env vars

# 6. Deploy
railway up

# 7. Get deployment URL
railway domain
```

---

## 🔍 POST-DEPLOYMENT VERIFICATION

### **1. Health Check**

```bash
# Test API endpoint
curl https://api.yourdomain.com/api/health

# Expected response:
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-07T10:00:00.000Z"
}
```

### **2. Test Authentication**

```bash
# Register user
curl -X POST https://api.yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234",
    "first_name": "Test",
    "last_name": "User",
    "phone": "+1234567890"
  }'

# Login
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234"
  }'
```

### **3. Monitor Logs**

```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/umrahconnect-access.log
sudo tail -f /var/log/nginx/umrahconnect-error.log

# Application logs
tail -f /var/www/umrahconnect-2.0/backend/logs/combined-*.log
```

---

## 📊 PERFORMANCE OPTIMIZATION

### **1. Enable Gzip Compression**

```nginx
# Add to Nginx config
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
```

### **2. Setup Redis Caching**

```bash
# Install Redis
sudo apt install -y redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set: maxmemory 256mb
# Set: maxmemory-policy allkeys-lru

# Restart Redis
sudo systemctl restart redis

# Install Redis client in app
npm install redis
```

### **3. Database Optimization**

```sql
-- Add indexes
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_package_id ON bookings(package_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_packages_vendor_id ON packages(vendor_id);
CREATE INDEX idx_packages_status ON packages(status);
CREATE INDEX idx_reviews_package_id ON reviews(package_id);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);

-- Optimize tables
OPTIMIZE TABLE bookings;
OPTIMIZE TABLE packages;
OPTIMIZE TABLE users;
```

---

## 🔒 SECURITY HARDENING

### **1. Setup Fail2Ban**

```bash
# Install Fail2Ban
sudo apt install -y fail2ban

# Configure
sudo nano /etc/fail2ban/jail.local
```

```ini
[sshd]
enabled = true
port = 22
maxretry = 3
bantime = 3600

[nginx-http-auth]
enabled = true
port = http,https
maxretry = 5
```

```bash
# Restart Fail2Ban
sudo systemctl restart fail2ban
```

### **2. Disable Root Login**

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Set:
PermitRootLogin no
PasswordAuthentication no

# Restart SSH
sudo systemctl restart sshd
```

### **3. Setup Automatic Updates**

```bash
# Install unattended-upgrades
sudo apt install -y unattended-upgrades

# Enable
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 📈 MONITORING & ALERTS

### **1. Setup PM2 Monitoring**

```bash
# Link to PM2 Plus (optional)
pm2 link your_secret_key your_public_key

# Or use PM2 web interface
pm2 web
```

### **2. Setup Error Tracking (Sentry)**

```bash
# Install Sentry
npm install @sentry/node

# Add to server.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: 'your_sentry_dsn',
  environment: process.env.NODE_ENV
});
```

---

## 🔄 CONTINUOUS DEPLOYMENT

### **Setup GitHub Actions**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to EC2
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.EC2_HOST }}
        username: ubuntu
        key: ${{ secrets.EC2_SSH_KEY }}
        script: |
          cd /var/www/umrahconnect-2.0
          git pull origin main
          cd backend
          npm install --production
          pm2 restart umrahconnect-api
```

---

## ✅ DEPLOYMENT CHECKLIST

```
□ Server provisioned
□ Domain configured
□ SSL certificate installed
□ Database setup complete
□ Application deployed
□ Environment variables set
□ PM2 running
□ Nginx configured
□ Firewall enabled
□ Backups configured
□ Monitoring setup
□ Health checks passing
□ Performance optimized
□ Security hardened
□ Documentation updated
□ Team notified
```

---

## 🎉 CONGRATULATIONS!

**Your UmrahConnect 2.0 backend is now LIVE in production!** 🚀

**API URL:** https://api.yourdomain.com

---

## 📞 SUPPORT

For deployment issues:
- Check logs: `pm2 logs`
- Check Nginx: `sudo nginx -t`
- Check database: `mysql -u umrah_user -p`
- Check firewall: `sudo ufw status`

---

**Happy Deploying!** 🎊
