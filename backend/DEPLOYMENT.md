# 🚀 VPS Deployment Guide - UmrahConnect 2.0

Complete guide for deploying UmrahConnect backend on VPS/Dedicated/GPU server with Wasabi S3 storage.

---

## 📋 **PREREQUISITES**

### **Server Requirements:**
- **OS:** Ubuntu 20.04 LTS or higher (recommended)
- **RAM:** Minimum 2GB (4GB+ recommended)
- **CPU:** 2+ cores
- **Storage:** 20GB+ SSD
- **Network:** Static IP address

### **Required Software:**
- Node.js 18+ & npm
- PostgreSQL 14+
- Nginx (reverse proxy)
- PM2 (process manager)
- SSL Certificate (Let's Encrypt)

---

## 🔧 **STEP 1: SERVER SETUP**

### **1.1 Update System**
```bash
sudo apt update && sudo apt upgrade -y
```

### **1.2 Install Node.js 18+**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should be 18+
npm --version
```

### **1.3 Install PostgreSQL**
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### **1.4 Install Nginx**
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### **1.5 Install PM2**
```bash
sudo npm install -g pm2
```

---

## 🗄️ **STEP 2: DATABASE SETUP**

### **2.1 Create PostgreSQL Database**
```bash
sudo -u postgres psql

# Inside PostgreSQL shell:
CREATE DATABASE umrahconnect_db;
CREATE USER umrahconnect_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE umrahconnect_db TO umrahconnect_user;
\q
```

### **2.2 Configure PostgreSQL for Remote Access (if needed)**
```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
# Change: listen_addresses = 'localhost' to listen_addresses = '*'

sudo nano /etc/postgresql/14/main/pg_hba.conf
# Add: host all all 0.0.0.0/0 md5

sudo systemctl restart postgresql
```

---

## ☁️ **STEP 3: WASABI S3 SETUP**

### **3.1 Create Wasabi Account**
1. Go to https://wasabi.com
2. Sign up for an account
3. Choose your region (us-east-1, eu-central-1, etc.)

### **3.2 Create Access Keys**
1. Go to **Access Keys** in Wasabi console
2. Click **Create New Access Key**
3. Save **Access Key ID** and **Secret Access Key**

### **3.3 Create Bucket**
1. Go to **Buckets** in Wasabi console
2. Click **Create Bucket**
3. Name: `umrahconnect-storage`
4. Region: Choose closest to your VPS
5. Set permissions: **Public** (for user uploads)

### **3.4 Note Your Endpoint**
Based on your region:
- **US East 1:** https://s3.wasabisys.com
- **US East 2:** https://s3.us-east-2.wasabisys.com
- **US West 1:** https://s3.us-west-1.wasabisys.com
- **EU Central 1:** https://s3.eu-central-1.wasabisys.com
- **AP Northeast 1:** https://s3.ap-northeast-1.wasabisys.com

---

## 📦 **STEP 4: DEPLOY APPLICATION**

### **4.1 Clone Repository**
```bash
cd /var/www
sudo git clone https://github.com/IamTamheedNazir/umrahconnect-2.0.git
cd umrahconnect-2.0/backend
```

### **4.2 Install Dependencies**
```bash
npm install --production
```

### **4.3 Create Environment File**
```bash
cp .env.example .env
nano .env
```

### **4.4 Configure Environment Variables**
```env
# Server
NODE_ENV=production
PORT=5000
BASE_URL=https://api.umrahconnect.com
FRONTEND_URL=https://umrahconnect.com

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=umrahconnect_db
DB_USER=umrahconnect_user
DB_PASSWORD=your_secure_password
DB_SSL=false

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_min_32_chars
JWT_REFRESH_EXPIRE=30d

# Wasabi S3
WASABI_ENDPOINT=https://s3.wasabisys.com
WASABI_REGION=us-east-1
WASABI_ACCESS_KEY_ID=your_wasabi_access_key
WASABI_SECRET_ACCESS_KEY=your_wasabi_secret_key
WASABI_BUCKET_NAME=umrahconnect-storage

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password
EMAIL_FROM=noreply@umrahconnect.com
EMAIL_FROM_NAME=UmrahConnect

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://api.umrahconnect.com/api/v1/auth/google/callback

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=https://api.umrahconnect.com/api/v1/auth/facebook/callback

# Security
BCRYPT_SALT_ROUNDS=10
PASSWORD_RESET_TOKEN_EXPIRE=60
EMAIL_VERIFICATION_TOKEN_EXPIRE=24

# CORS
CORS_ORIGIN=https://umrahconnect.com,https://www.umrahconnect.com
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5

# Logging
LOG_LEVEL=info
DEBUG=false
```

### **4.5 Set Proper Permissions**
```bash
sudo chown -R $USER:$USER /var/www/umrahconnect-2.0
chmod -R 755 /var/www/umrahconnect-2.0
```

---

## 🔄 **STEP 5: PM2 PROCESS MANAGER**

### **5.1 Create PM2 Ecosystem File**
```bash
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'umrahconnect-api',
    script: './server.js',
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G',
    watch: false,
  }],
};
```

### **5.2 Start Application**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### **5.3 PM2 Commands**
```bash
pm2 status              # Check status
pm2 logs                # View logs
pm2 restart all         # Restart app
pm2 stop all            # Stop app
pm2 delete all          # Delete app
pm2 monit               # Monitor resources
```

---

## 🌐 **STEP 6: NGINX REVERSE PROXY**

### **6.1 Create Nginx Configuration**
```bash
sudo nano /etc/nginx/sites-available/umrahconnect-api
```

```nginx
server {
    listen 80;
    server_name api.umrahconnect.com;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy settings
    location / {
        proxy_pass http://localhost:5000;
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

    # File upload size
    client_max_body_size 10M;

    # Logging
    access_log /var/log/nginx/umrahconnect-api-access.log;
    error_log /var/log/nginx/umrahconnect-api-error.log;
}
```

### **6.2 Enable Site**
```bash
sudo ln -s /etc/nginx/sites-available/umrahconnect-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 **STEP 7: SSL CERTIFICATE (Let's Encrypt)**

### **7.1 Install Certbot**
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### **7.2 Obtain SSL Certificate**
```bash
sudo certbot --nginx -d api.umrahconnect.com
```

### **7.3 Auto-Renewal**
```bash
sudo certbot renew --dry-run
```

---

## 🔥 **STEP 8: FIREWALL SETUP**

### **8.1 Configure UFW**
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 5432/tcp  # PostgreSQL (if remote access needed)
sudo ufw enable
sudo ufw status
```

---

## 📊 **STEP 9: MONITORING & MAINTENANCE**

### **9.1 Monitor Logs**
```bash
# Application logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/umrahconnect-api-access.log
sudo tail -f /var/log/nginx/umrahconnect-api-error.log

# System logs
sudo journalctl -u nginx -f
```

### **9.2 Database Backup**
```bash
# Create backup script
nano /home/ubuntu/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -U umrahconnect_user umrahconnect_db > $BACKUP_DIR/db_backup_$DATE.sql
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete
```

```bash
chmod +x /home/ubuntu/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /home/ubuntu/backup-db.sh
```

### **9.3 Monitor Server Resources**
```bash
# Install htop
sudo apt install -y htop

# Monitor
htop
pm2 monit
```

---

## 🔄 **STEP 10: DEPLOYMENT UPDATES**

### **10.1 Update Application**
```bash
cd /var/www/umrahconnect-2.0/backend
git pull origin main
npm install --production
pm2 restart all
```

### **10.2 Database Migrations**
```bash
npm run migrate
```

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] Server accessible via SSH
- [ ] Node.js 18+ installed
- [ ] PostgreSQL running
- [ ] Database created and accessible
- [ ] Wasabi S3 bucket created
- [ ] Environment variables configured
- [ ] Application running via PM2
- [ ] Nginx reverse proxy configured
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Logs accessible
- [ ] Backup script configured

---

## 🆘 **TROUBLESHOOTING**

### **Application won't start:**
```bash
pm2 logs  # Check error logs
pm2 restart all
```

### **Database connection failed:**
```bash
sudo systemctl status postgresql
sudo -u postgres psql -c "SELECT version();"
```

### **Nginx errors:**
```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### **Port already in use:**
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

---

## 📞 **SUPPORT**

For deployment issues:
- Email: support@umrahconnect.com
- Documentation: https://docs.umrahconnect.com

---

**🎉 Deployment Complete! Your UmrahConnect API is now live on VPS with Wasabi S3 storage!**
