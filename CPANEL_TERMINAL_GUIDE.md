# 🖥️ cPanel Terminal Guide - Install Composer Dependencies

**Use cPanel's built-in Terminal to install Composer dependencies - NO local setup needed!**

---

## ✨ **THE EASIEST WAY**

Most modern cPanel hosting includes:
- ✅ Terminal access
- ✅ Composer pre-installed
- ✅ SSH access

You can install dependencies **directly on the server** without touching your local machine!

---

## 🎯 **METHOD 1: cPanel Terminal (Easiest)**

### **Step 1: Upload Files to cPanel**

1. Download repository from GitHub
2. Rename folders:
   - `backend-laravel` → `backend`
   - `installer` → `install`
3. Zip the files
4. Upload to cPanel → `public_html/`
5. Extract the ZIP

### **Step 2: Open cPanel Terminal**

1. **Login to cPanel**
2. **Search for "Terminal"** in the search bar
3. **Click "Terminal"** icon

**If you don't see Terminal:**
- Your host might have disabled it
- Use SSH instead (see Method 2 below)
- Or contact your host to enable it

### **Step 3: Navigate to Backend Directory**

In the Terminal, type:

```bash
cd public_html/backend
```

Press Enter.

### **Step 4: Run Composer Install**

Type this command:

```bash
composer install --no-dev --optimize-autoloader
```

Press Enter.

**This will:**
- ✅ Download all dependencies
- ✅ Install vendor folder
- ✅ Optimize for production
- ✅ Take 2-5 minutes

**You'll see output like:**
```
Loading composer repositories with package information
Installing dependencies from lock file
Package operations: 100 installs, 0 updates, 0 removals
  - Installing vendor/package (version)
...
Generating optimized autoload files
```

### **Step 5: Set Permissions**

Still in Terminal, run:

```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

### **Step 6: Exit Terminal**

Type:
```bash
exit
```

### **Step 7: Run Installer**

Visit: `https://yourdomain.com/install/`

**Done!** 🎉

---

## 🎯 **METHOD 2: SSH Access**

If Terminal is not available in cPanel, use SSH:

### **Step 1: Get SSH Credentials**

**In cPanel:**
1. Search for "SSH Access"
2. Click "Manage SSH Keys"
3. Or check your hosting welcome email for SSH details

**You'll need:**
- Host: `yourdomain.com` or IP address
- Port: Usually `22`
- Username: Your cPanel username
- Password: Your cPanel password

### **Step 2: Connect via SSH**

**On Windows (use PuTTY):**
1. Download PuTTY: https://www.putty.org/
2. Open PuTTY
3. Enter host and port
4. Click "Open"
5. Login with username and password

**On Mac/Linux (use Terminal):**
```bash
ssh username@yourdomain.com
```

Enter password when prompted.

### **Step 3: Navigate and Install**

```bash
cd public_html/backend
composer install --no-dev --optimize-autoloader
chmod -R 775 storage bootstrap/cache
exit
```

### **Step 4: Run Installer**

Visit: `https://yourdomain.com/install/`

---

## 🎯 **METHOD 3: Automated Script**

I've created a script that does everything automatically!

### **Step 1: Upload Files**

Upload all files to cPanel including the script:
- `install-composer-cpanel.sh`

### **Step 2: Open Terminal**

cPanel → Terminal

### **Step 3: Run Script**

```bash
cd public_html
chmod +x install-composer-cpanel.sh
./install-composer-cpanel.sh
```

**The script will:**
- ✅ Detect backend directory
- ✅ Check if Composer is available
- ✅ Install dependencies
- ✅ Set permissions
- ✅ Show next steps

**Done!** 🎉

---

## 📋 **COMPLETE WORKFLOW**

### **Quick 5-Step Process:**

```bash
# 1. Upload files to cPanel (via File Manager)

# 2. Open cPanel Terminal

# 3. Navigate to backend
cd public_html/backend

# 4. Install dependencies
composer install --no-dev --optimize-autoloader

# 5. Set permissions
chmod -R 775 storage bootstrap/cache
```

**Then visit:** `https://yourdomain.com/install/`

---

## 🔍 **TROUBLESHOOTING**

### **Issue: "composer: command not found"**

**Solution 1: Check if Composer is installed elsewhere**
```bash
which composer
/usr/local/bin/composer --version
/opt/cpanel/composer/bin/composer --version
```

**Solution 2: Install Composer on the server**
```bash
cd ~
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
chmod +x /usr/local/bin/composer
```

**Solution 3: Use full path**
```bash
php /usr/local/bin/composer install --no-dev
```

**Solution 4: Contact your host**
Ask them to install Composer or enable it for your account.

---

### **Issue: "Terminal not available in cPanel"**

**Solution 1: Enable SSH**
1. cPanel → SSH Access
2. Manage SSH Keys
3. Generate new key or enable password authentication

**Solution 2: Ask your host**
Contact support to enable Terminal or SSH access.

**Solution 3: Use alternative method**
Upload vendor folder manually (see DIRECT_UPLOAD_GUIDE.md)

---

### **Issue: "Permission denied"**

**Solution:**
```bash
chmod +x install-composer-cpanel.sh
```

Or run with bash:
```bash
bash install-composer-cpanel.sh
```

---

### **Issue: "PHP version too old"**

**Solution:**
```bash
# Check PHP version
php -v

# If old, use specific PHP version
/usr/bin/php81 /usr/local/bin/composer install --no-dev
```

Or change PHP version in cPanel:
1. cPanel → Select PHP Version
2. Choose PHP 8.1 or higher
3. Apply

---

## 💡 **PRO TIPS**

### **Tip 1: Check Composer Version**
```bash
composer --version
```

Should show Composer 2.x

### **Tip 2: Clear Composer Cache**
If installation fails:
```bash
composer clear-cache
composer install --no-dev --optimize-autoloader
```

### **Tip 3: Increase Memory Limit**
If you get memory errors:
```bash
php -d memory_limit=512M /usr/local/bin/composer install --no-dev
```

### **Tip 4: Verbose Output**
To see detailed installation progress:
```bash
composer install --no-dev --optimize-autoloader -vvv
```

---

## 🎯 **COMPARISON: Local vs Server Installation**

### **Local Installation (Traditional Way)**
```
❌ Install Composer on your computer
❌ Install PHP on your computer
❌ Run composer install locally
❌ Upload vendor folder (100+ MB)
❌ Wait for slow upload
⏱️ Total time: 30-60 minutes
```

### **Server Installation (This Method)**
```
✅ Upload code only (5-10 MB)
✅ Run composer in cPanel Terminal
✅ Dependencies install directly on server
✅ Fast server internet connection
⏱️ Total time: 5-10 minutes
```

**Server installation is 5-6x faster!** 🚀

---

## 📊 **WHICH METHOD TO USE?**

| Method | Difficulty | Time | Requirements |
|--------|-----------|------|--------------|
| **cPanel Terminal** | ⭐ Easy | 5 min | Terminal access |
| **SSH** | ⭐⭐ Medium | 5 min | SSH access |
| **Automated Script** | ⭐ Easy | 3 min | Terminal/SSH |
| **Manual Upload** | ⭐⭐⭐ Hard | 30 min | Local Composer |

**Recommended: cPanel Terminal** (easiest and fastest!)

---

## 🎉 **SUMMARY**

**Instead of:**
1. ❌ Installing Composer locally
2. ❌ Running commands on your computer
3. ❌ Uploading huge vendor folder

**Just do:**
1. ✅ Upload code to cPanel
2. ✅ Open Terminal
3. ✅ Run: `composer install`
4. ✅ Done!

**No local setup needed!**  
**No Composer on your computer!**  
**Everything happens on the server!**

---

## 📞 **NEED HELP?**

**Check if your host supports Terminal:**
1. Login to cPanel
2. Search for "Terminal"
3. If found → Use Method 1
4. If not found → Use Method 2 (SSH)
5. If neither → Use DIRECT_UPLOAD_GUIDE.md

**Most popular hosts with Terminal:**
- ✅ Hostinger
- ✅ SiteGround
- ✅ A2 Hosting
- ✅ InMotion
- ✅ Bluehost (newer plans)

---

**This is the EASIEST way to deploy UmrahConnect 2.0!** 🚀

**No local Composer needed!** ✨
