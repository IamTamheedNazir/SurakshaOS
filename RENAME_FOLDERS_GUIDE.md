# 📁 Folder Renaming Guide

After downloading from GitHub, rename these folders:

## ✅ Required Renames

```
backend-laravel  →  backend
installer        →  install
```

## 📋 Step-by-Step

### **1. Download Repository**
```bash
git clone https://github.com/IamTamheedNazir/umrahconnect-2.0.git
cd umrahconnect-2.0
```

### **2. Rename Folders**

**On Linux/Mac:**
```bash
mv backend-laravel backend
mv installer install
```

**On Windows (Command Prompt):**
```cmd
ren backend-laravel backend
ren installer install
```

**On Windows (PowerShell):**
```powershell
Rename-Item -Path "backend-laravel" -NewName "backend"
Rename-Item -Path "installer" -NewName "install"
```

### **3. Your Final Structure**
```
umrahconnect-2.0/
├── backend/          ← Renamed from backend-laravel
├── frontend/         ← Keep as is
├── install/          ← Renamed from installer
├── database/         ← Keep as is
└── README.md
```

## 🚀 Quick Upload to cPanel

After renaming:

1. **Zip the entire folder**
2. **Upload to cPanel** → public_html/
3. **Extract** in cPanel
4. **Visit:** https://yourdomain.com/install/

## ⚡ Automated Rename Script

Create `rename.sh` in the root:

```bash
#!/bin/bash
echo "Renaming folders for deployment..."
mv backend-laravel backend 2>/dev/null || echo "backend-laravel already renamed or doesn't exist"
mv installer install 2>/dev/null || echo "installer already renamed or doesn't exist"
echo "✅ Done! Folders renamed."
ls -la
```

Run it:
```bash
chmod +x rename.sh
./rename.sh
```

## 📝 Note

The installer code automatically detects both folder names:
- Works with `backend` ✅
- Works with `backend-laravel` ✅
- Works with `install` ✅
- Works with `installer` ✅

So renaming is optional but recommended for cleaner structure.
