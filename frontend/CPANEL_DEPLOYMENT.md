# 🚀 cPanel Deployment Guide for UmrahConnect 2.0

## 📋 Prerequisites

Before deploying to cPanel, ensure you have:

- ✅ cPanel hosting account with SSH access (recommended)
- ✅ Node.js support (version 18+) on your hosting
- ✅ Domain or subdomain configured
- ✅ FTP/SFTP access credentials
- ✅ File Manager access in cPanel

---

## 🛠️ Method 1: Build Locally & Upload (Recommended)

This is the easiest and most reliable method for cPanel hosting.

### Step 1: Build the Project Locally

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Create production build
npm run build
```

This will create a `dist/` folder with optimized production files.

### Step 2: Upload to cPanel

#### Option A: Using File Manager

1. **Login to cPanel**
   - Go to your cPanel URL (usually: yourdomain.com/cpanel)
   - Enter your credentials

2. **Navigate to File Manager**
   - Click on "File Manager" icon
   - Navigate to `public_html` (or your domain's root directory)

3. **Upload Files**
   - Click "Upload" button
   - Create a ZIP file of the `dist` folder contents first (optional but faster)
   - Upload the ZIP file
   - Extract it in the `public_html` directory
   
   OR
   
   - Upload all files from `dist/` folder directly to `public_html`

4. **Verify Structure**
   ```
   public_html/
   ├── index.html
   ├── assets/
   │   ├── index-[hash].js
   │   ├── index-[hash].css
   │   └── ...
   └── vite.svg
   ```

#### Option B: Using FTP/SFTP (FileZilla)

1. **Connect via FTP**
   - Host: ftp.yourdomain.com
   - Username: Your cPanel username
   - Password: Your cPanel password
   - Port: 21 (FTP) or 22 (SFTP)

2. **Upload Files**
   - Navigate to `public_html` on remote
   - Upload all contents from `dist/` folder
   - Wait for upload to complete

### Step 3: Configure .htaccess for React Router

Create a `.htaccess` file in `public_html`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Rewrite everything else to index.html
  RewriteRule ^ index.html [L]
</IfModule>

# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

### Step 4: Test Your Deployment

1. Visit your domain: `https://yourdomain.com`
2. Test all routes:
   - Homepage: `/`
   - Packages: `/packages`
   - About: `/about`
   - Login: `/login`
   - etc.

3. Check browser console for errors
4. Test responsive design on mobile

---

## 🛠️ Method 2: Build on Server (Advanced)

If your cPanel has Node.js support and SSH access:

### Step 1: Enable SSH Access

1. Login to cPanel
2. Go to "Terminal" or "SSH Access"
3. Generate SSH key if needed

### Step 2: Connect via SSH

```bash
ssh username@yourdomain.com
# Enter password when prompted
```

### Step 3: Upload Source Code

```bash
# Using Git (if available)
cd public_html
git clone https://github.com/yourusername/umrahconnect-2.0.git
cd umrahconnect-2.0/frontend

# OR upload via FTP and extract
```

### Step 4: Install Node.js (if not available)

```bash
# Check if Node.js is installed
node --version

# If not installed, use Node Version Manager (nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

### Step 5: Build the Project

```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build
```

### Step 6: Move Build Files

```bash
# Move dist contents to public_html
cp -r dist/* ../../../public_html/

# OR create a symbolic link
ln -s /home/username/umrahconnect-2.0/frontend/dist /home/username/public_html
```

---

## 🔧 Configuration for cPanel

### 1. Environment Variables

Since cPanel doesn't support `.env` files directly, you have two options:

#### Option A: Build with Environment Variables

Before building, create `.env.production`:

```env
VITE_API_URL=https://yourdomain.com/api
VITE_APP_NAME=UmrahConnect
VITE_APP_ENV=production
```

Then build:
```bash
npm run build
```

#### Option B: Use Config File

Create `public/config.js`:

```javascript
window.APP_CONFIG = {
  API_URL: 'https://yourdomain.com/api',
  APP_NAME: 'UmrahConnect',
  APP_ENV: 'production'
};
```

Add to `index.html` before other scripts:
```html
<script src="/config.js"></script>
```

### 2. API Proxy Configuration

If your backend is on the same server, update `.htaccess`:

```apache
# API Proxy
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://localhost:5000/api/$1 [P,L]
```

### 3. Custom Domain Setup

1. **Add Domain in cPanel**
   - Go to "Domains" or "Addon Domains"
   - Add your domain
   - Point document root to `public_html`

2. **SSL Certificate**
   - Go to "SSL/TLS Status"
   - Enable AutoSSL or install Let's Encrypt
   - Force HTTPS in `.htaccess`:

```apache
# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## 📁 Recommended Directory Structure

```
public_html/
├── .htaccess              # React Router & optimization
├── index.html             # Main HTML file
├── config.js              # Optional: Runtime config
├── assets/                # JS, CSS, images
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── images/
├── vite.svg              # Favicon
└── robots.txt            # SEO
```

---

## 🔍 Troubleshooting

### Issue 1: Blank Page After Deployment

**Solution:**
- Check browser console for errors
- Verify all files uploaded correctly
- Check `.htaccess` is present
- Ensure base path is correct in `vite.config.js`

### Issue 2: 404 on Page Refresh

**Solution:**
- Add `.htaccess` file with rewrite rules (see above)
- Ensure `mod_rewrite` is enabled in Apache

### Issue 3: Assets Not Loading

**Solution:**
- Check file permissions (644 for files, 755 for directories)
- Verify asset paths in browser DevTools
- Clear browser cache
- Check if assets folder uploaded correctly

### Issue 4: API Calls Failing

**Solution:**
- Update API URL in environment variables
- Check CORS settings on backend
- Verify API proxy in `.htaccess`
- Check browser console for CORS errors

### Issue 5: Slow Loading

**Solution:**
- Enable GZIP compression in `.htaccess`
- Enable browser caching
- Optimize images before upload
- Use CDN for static assets

---

## 🚀 Performance Optimization

### 1. Enable Compression

Already included in `.htaccess` above.

### 2. Browser Caching

Already included in `.htaccess` above.

### 3. Image Optimization

Before uploading:
```bash
# Install image optimization tools
npm install -g imagemin-cli

# Optimize images
imagemin dist/assets/*.{jpg,png} --out-dir=dist/assets/
```

### 4. CDN Integration

For better performance, use a CDN:
- Cloudflare (Free)
- BunnyCDN
- AWS CloudFront

---

## 📊 Monitoring & Analytics

### 1. Google Analytics

Add to `index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Error Tracking

Use services like:
- Sentry
- LogRocket
- Bugsnag

---

## 🔒 Security Best Practices

### 1. File Permissions

```bash
# Set correct permissions
find public_html -type f -exec chmod 644 {} \;
find public_html -type d -exec chmod 755 {} \;
```

### 2. Disable Directory Listing

Add to `.htaccess`:
```apache
Options -Indexes
```

### 3. Protect Sensitive Files

```apache
# Protect .env files
<FilesMatch "^\.env">
  Order allow,deny
  Deny from all
</FilesMatch>
```

---

## 📝 Deployment Checklist

Before going live:

- [ ] Build project locally (`npm run build`)
- [ ] Test build locally (`npm run preview`)
- [ ] Upload all files from `dist/` to `public_html`
- [ ] Create `.htaccess` file
- [ ] Configure environment variables
- [ ] Set up SSL certificate
- [ ] Test all routes
- [ ] Test on mobile devices
- [ ] Check browser console for errors
- [ ] Verify API connections
- [ ] Set up Google Analytics
- [ ] Configure error tracking
- [ ] Test form submissions
- [ ] Check page load speed
- [ ] Verify SEO meta tags
- [ ] Test social media sharing

---

## 🆘 Support

If you encounter issues:

1. **Check cPanel Error Logs**
   - Go to cPanel → Metrics → Errors
   - Check for recent errors

2. **Browser Console**
   - Open DevTools (F12)
   - Check Console and Network tabs

3. **Contact Hosting Support**
   - Provide error messages
   - Share what you've tried

---

## 🎉 Success!

Once deployed, your app will be live at:
- `https://yourdomain.com`

Test thoroughly and enjoy your deployed UmrahConnect 2.0 application!

---

**Need Help?** Contact support@umrahconnect.com
