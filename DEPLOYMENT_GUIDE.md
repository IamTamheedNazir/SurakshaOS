# 🚀 UmrahConnect 2.0 - Complete Deployment Guide

## 📋 **PRODUCTION DEPLOYMENT GUIDE**

Complete step-by-step guide to deploy UmrahConnect 2.0 to production.

---

## 🎯 **DEPLOYMENT OPTIONS**

1. **AWS (Recommended)**
2. **DigitalOcean**
3. **Google Cloud Platform**
4. **Heroku**
5. **Self-Hosted VPS**

---

## 🛠️ **AWS DEPLOYMENT (RECOMMENDED)**

### **Architecture:**
```
┌─────────────────────────────────────────────────────────┐
│                     CloudFront (CDN)                     │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
┌───────▼────────┐                    ┌────────▼────────┐
│   S3 Bucket    │                    │  Load Balancer  │
│  (Frontend)    │                    │      (ALB)      │
└────────────────┘                    └─────────────────┘
                                              │
                        ┌─────────────────────┴─────────────────────┐
                        │                                           │
                ┌───────▼────────┐                        ┌────────▼────────┐
                │   EC2 Instance │                        │  EC2 Instance   │
                │   (Backend 1)  │                        │  (Backend 2)    │
                └────────────────┘                        └─────────────────┘
                        │                                           │
                        └─────────────────────┬─────────────────────┘
                                              │
                        ┌─────────────────────┴─────────────────────┐
                        │                                           │
                ┌───────▼────────┐                        ┌────────▼────────┐
                │   RDS (PostgreSQL)                      │  ElastiCache    │
                │   (Database)   │                        │    (Redis)      │
                └────────────────┘                        └─────────────────┘
```

---

## 📦 **STEP 1: SETUP AWS SERVICES**

### **1.1 Create RDS PostgreSQL Database**
```bash
# AWS Console → RDS → Create Database
Database Engine: PostgreSQL 14
Template: Production
DB Instance: db.t3.medium (or higher)
Storage: 100 GB SSD
Multi-AZ: Yes (for high availability)
VPC: Create new VPC
Security Group: Allow port 5432 from backend servers
Backup: Automated daily backups
```

### **1.2 Create ElastiCache Redis**
```bash
# AWS Console → ElastiCache → Create Redis Cluster
Engine: Redis 7.x
Node Type: cache.t3.medium
Number of Replicas: 1
Multi-AZ: Yes
VPC: Same as RDS
Security Group: Allow port 6379 from backend servers
```

### **1.3 Create S3 Buckets**
```bash
# Create 3 buckets:
1. umrahconnect-frontend (for React build)
2. umrahconnect-uploads (for user uploads)
3. umrahconnect-backups (for database backups)

# Enable versioning and encryption
aws s3api put-bucket-versioning \
  --bucket umrahconnect-uploads \
  --versioning-configuration Status=Enabled

aws s3api put-bucket-encryption \
  --bucket umrahconnect-uploads \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'
```

### **1.4 Create EC2 Instances**
```bash
# Launch 2 EC2 instances for backend
AMI: Ubuntu 22.04 LTS
Instance Type: t3.medium (or higher)
Storage: 50 GB SSD
Security Group: 
  - Allow SSH (22) from your IP
  - Allow HTTP (80) from Load Balancer
  - Allow HTTPS (443) from Load Balancer
  - Allow Custom TCP (5000) from Load Balancer
Key Pair: Create and download
```

---

## 🔧 **STEP 2: SETUP EC2 INSTANCES**

### **2.1 Connect to EC2**
```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### **2.2 Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git

# Install PostgreSQL client
sudo apt install -y postgresql-client
```

### **2.3 Clone Repository**
```bash
cd /var/www
sudo git clone https://github.com/IamTamheedNazir/umrahconnect-2.0.git
cd umrahconnect-2.0/backend
sudo npm install
```

### **2.4 Setup Environment Variables**
```bash
sudo nano .env

# Add all production environment variables
NODE_ENV=production
PORT=5000
API_URL=https://api.umrahconnect.com
FRONTEND_URL=https://umrahconnect.com

# Database (RDS endpoint)
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_PORT=5432
DB_NAME=umrahconnect
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Redis (ElastiCache endpoint)
REDIS_HOST=your-elasticache-endpoint.cache.amazonaws.com
REDIS_PORT=6379

# ... (all other env variables)
```

### **2.5 Run Database Migrations**
```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### **2.6 Start Application with PM2**
```bash
pm2 start server.js --name umrahconnect
pm2 save
pm2 startup
```

---

## 🌐 **STEP 3: SETUP NGINX**

### **3.1 Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/umrahconnect

# Add configuration:
server {
    listen 80;
    server_name api.umrahconnect.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/umrahconnect /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### **3.2 Setup SSL with Let's Encrypt**
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.umrahconnect.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## ⚖️ **STEP 4: SETUP LOAD BALANCER**

### **4.1 Create Application Load Balancer**
```bash
# AWS Console → EC2 → Load Balancers → Create
Type: Application Load Balancer
Scheme: Internet-facing
Listeners: HTTP (80), HTTPS (443)
Availability Zones: Select 2+ zones
Security Group: Allow HTTP/HTTPS from anywhere

# Create Target Group
Target Type: Instances
Protocol: HTTP
Port: 80
Health Check: /health
Targets: Add both EC2 instances
```

### **4.2 Configure SSL Certificate**
```bash
# AWS Console → Certificate Manager
Request Certificate: api.umrahconnect.com
Validation: DNS
Add CNAME records to your domain

# Add certificate to Load Balancer
Listeners → HTTPS:443 → Add certificate
```

---

## 🎨 **STEP 5: DEPLOY FRONTEND**

### **5.1 Build React App**
```bash
cd /var/www/umrahconnect-2.0/frontend
npm install
npm run build
```

### **5.2 Upload to S3**
```bash
# Install AWS CLI
sudo apt install -y awscli

# Configure AWS CLI
aws configure

# Upload build to S3
aws s3 sync build/ s3://umrahconnect-frontend --delete

# Set bucket policy for public access
aws s3api put-bucket-policy \
  --bucket umrahconnect-frontend \
  --policy '{
    "Version": "2012-10-17",
    "Statement": [{
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::umrahconnect-frontend/*"
    }]
  }'

# Enable static website hosting
aws s3 website s3://umrahconnect-frontend \
  --index-document index.html \
  --error-document index.html
```

### **5.3 Setup CloudFront CDN**
```bash
# AWS Console → CloudFront → Create Distribution
Origin Domain: umrahconnect-frontend.s3-website-region.amazonaws.com
Viewer Protocol: Redirect HTTP to HTTPS
Alternate Domain Names: umrahconnect.com, www.umrahconnect.com
SSL Certificate: Request from ACM
Default Root Object: index.html
Error Pages: 
  - 403 → /index.html (for React Router)
  - 404 → /index.html (for React Router)
```

---

## 🔐 **STEP 6: SECURITY SETUP**

### **6.1 Setup Security Groups**
```bash
# Backend Security Group
Inbound Rules:
  - SSH (22) from your IP only
  - HTTP (80) from Load Balancer
  - HTTPS (443) from Load Balancer
  - Custom TCP (5000) from Load Balancer

# Database Security Group
Inbound Rules:
  - PostgreSQL (5432) from Backend Security Group

# Redis Security Group
Inbound Rules:
  - Redis (6379) from Backend Security Group
```

### **6.2 Setup IAM Roles**
```bash
# Create IAM role for EC2
Permissions:
  - AmazonS3FullAccess (for uploads)
  - AmazonSESFullAccess (for emails)
  - CloudWatchLogsFullAccess (for logging)

# Attach role to EC2 instances
```

### **6.3 Enable CloudWatch Monitoring**
```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb

# Configure CloudWatch
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -s \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/config.json
```

---

## 📊 **STEP 7: MONITORING & LOGGING**

### **7.1 Setup PM2 Monitoring**
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### **7.2 Setup Application Monitoring**
```bash
# Install New Relic (optional)
npm install newrelic
# Add newrelic.js configuration

# Or use AWS CloudWatch
# Logs are automatically sent to CloudWatch
```

---

## 🔄 **STEP 8: SETUP CI/CD**

### **8.1 GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_KEY }}
          script: |
            cd /var/www/umrahconnect-2.0/backend
            git pull origin main
            npm install
            pm2 restart umrahconnect

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build and Deploy
        run: |
          cd frontend
          npm install
          npm run build
          aws s3 sync build/ s3://umrahconnect-frontend --delete
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
```

---

## 🔧 **STEP 9: BACKUP STRATEGY**

### **9.1 Database Backups**
```bash
# Automated RDS backups (already enabled)
# Manual backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h your-rds-endpoint.rds.amazonaws.com \
  -U postgres \
  -d umrahconnect \
  | gzip > backup_$DATE.sql.gz

# Upload to S3
aws s3 cp backup_$DATE.sql.gz s3://umrahconnect-backups/

# Add to crontab
crontab -e
0 2 * * * /path/to/backup-script.sh
```

### **9.2 File Backups**
```bash
# S3 versioning is already enabled
# Additional backup to Glacier
aws s3 sync s3://umrahconnect-uploads s3://umrahconnect-glacier --storage-class GLACIER
```

---

## 📈 **STEP 10: PERFORMANCE OPTIMIZATION**

### **10.1 Enable Caching**
```javascript
// Add Redis caching in backend
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

// Cache frequently accessed data
app.get('/api/packages', async (req, res) => {
  const cacheKey = 'packages:all';
  const cached = await client.get(cacheKey);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  const packages = await Package.findAll();
  await client.setex(cacheKey, 3600, JSON.stringify(packages));
  res.json(packages);
});
```

### **10.2 Enable Compression**
```javascript
// Already added in app.js
const compression = require('compression');
app.use(compression());
```

### **10.3 Optimize Database**
```sql
-- Add indexes
CREATE INDEX idx_packages_search ON packages USING GIN(to_tsvector('english', title || ' ' || description));

-- Analyze tables
ANALYZE packages;
ANALYZE bookings;
ANALYZE users;
```

---

## ✅ **DEPLOYMENT CHECKLIST**

### **Pre-Deployment:**
- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates installed
- [ ] Security groups configured
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Load testing completed

### **Post-Deployment:**
- [ ] Health check passing
- [ ] SSL working
- [ ] API endpoints responding
- [ ] Frontend loading
- [ ] Payment gateways working
- [ ] Email/SMS sending
- [ ] File uploads working
- [ ] Database connections stable
- [ ] Redis caching working
- [ ] Monitoring alerts configured

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues:**

**1. Database Connection Failed**
```bash
# Check security group
# Verify RDS endpoint
# Test connection
psql -h your-rds-endpoint -U postgres -d umrahconnect
```

**2. Redis Connection Failed**
```bash
# Check security group
# Verify ElastiCache endpoint
# Test connection
redis-cli -h your-elasticache-endpoint
```

**3. PM2 Not Starting**
```bash
# Check logs
pm2 logs umrahconnect

# Restart
pm2 restart umrahconnect

# Check status
pm2 status
```

**4. Nginx 502 Error**
```bash
# Check backend is running
pm2 status

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

---

## 📞 **SUPPORT**

For deployment support:
- Email: support@umrahconnect.com
- Documentation: https://docs.umrahconnect.com
- GitHub Issues: https://github.com/IamTamheedNazir/umrahconnect-2.0/issues

---

## 🎉 **DEPLOYMENT COMPLETE!**

Your UmrahConnect 2.0 platform is now live and ready to serve customers! 🚀

**Production URLs:**
- Frontend: https://umrahconnect.com
- API: https://api.umrahconnect.com
- Admin: https://umrahconnect.com/admin

**Next Steps:**
1. Monitor application performance
2. Setup alerts for errors
3. Configure auto-scaling
4. Optimize based on usage
5. Regular security audits

---

**Built with ❤️ for UmrahConnect 2.0**
**Ready to revolutionize the Umrah travel industry!** 🕌✨
