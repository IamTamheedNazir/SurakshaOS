# UmrahConnect 2.0 - Pre-Built Package Builder (PowerShell)
# This script creates a complete deployment package with vendor and built frontend

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  UmrahConnect 2.0 Package Builder" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$BUILD_DIR = "umrahconnect-complete"

# Step 1: Check if build folder exists and create it
Write-Host "[Step 1] Preparing directories..." -ForegroundColor Blue

if (Test-Path $BUILD_DIR) {
    Remove-Item -Recurse -Force $BUILD_DIR
}
New-Item -ItemType Directory -Path $BUILD_DIR | Out-Null

Write-Host "[OK] Build directory created" -ForegroundColor Green
Write-Host ""

# Step 2: Copy backend
Write-Host "[Step 2] Preparing backend..." -ForegroundColor Blue

if (Test-Path "backend-laravel") {
    Copy-Item -Recurse "backend-laravel" "$BUILD_DIR\backend"
    Write-Host "[OK] Backend copied" -ForegroundColor Green
} elseif (Test-Path "backend") {
    Copy-Item -Recurse "backend" "$BUILD_DIR\backend"
    Write-Host "[OK] Backend copied" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Backend directory not found!" -ForegroundColor Red
    exit 1
}

# Step 3: Install Composer dependencies
Write-Host ""
Write-Host "[Step 3] Installing Composer dependencies..." -ForegroundColor Blue
Write-Host "This may take 2-5 minutes..." -ForegroundColor Yellow
Write-Host ""

Push-Location "$BUILD_DIR\backend"

if (Get-Command composer -ErrorAction SilentlyContinue) {
    composer install --no-dev --optimize-autoloader --no-interaction
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Composer dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Composer installation failed" -ForegroundColor Red
        Pop-Location
        exit 1
    }
} else {
    Write-Host "[ERROR] Composer not found!" -ForegroundColor Red
    Write-Host "Please install Composer: https://getcomposer.org/download/" -ForegroundColor Yellow
    Pop-Location
    exit 1
}

Pop-Location

# Step 4: Build frontend
Write-Host ""
Write-Host "[Step 4] Building frontend..." -ForegroundColor Blue
Write-Host "This may take 2-5 minutes..." -ForegroundColor Yellow
Write-Host ""

Push-Location "frontend"

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "Building production frontend..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Frontend built successfully" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Frontend build failed" -ForegroundColor Red
    Pop-Location
    exit 1
}

# Copy built frontend to package
Copy-Item -Recurse "dist\*" "..\$BUILD_DIR\"

Pop-Location

Write-Host "[OK] Frontend copied to package" -ForegroundColor Green

# Step 5: Copy installer
Write-Host ""
Write-Host "[Step 5] Copying installer..." -ForegroundColor Blue

if (Test-Path "installer") {
    Copy-Item -Recurse "installer" "$BUILD_DIR\install"
    Write-Host "[OK] Installer copied" -ForegroundColor Green
} elseif (Test-Path "install") {
    Copy-Item -Recurse "install" "$BUILD_DIR\install"
    Write-Host "[OK] Installer copied" -ForegroundColor Green
} else {
    Write-Host "[WARNING] Installer directory not found (optional)" -ForegroundColor Yellow
}

# Step 6: Copy database files
Write-Host ""
Write-Host "[Step 6] Copying database files..." -ForegroundColor Blue

if (Test-Path "database") {
    Copy-Item -Recurse "database" "$BUILD_DIR\database"
    Write-Host "[OK] Database files copied" -ForegroundColor Green
} else {
    Write-Host "[WARNING] Database directory not found (optional)" -ForegroundColor Yellow
}

# Step 7: Copy documentation
Write-Host ""
Write-Host "[Step 7] Copying documentation..." -ForegroundColor Blue

if (Test-Path "README.md") { Copy-Item "README.md" "$BUILD_DIR\" }
if (Test-Path "PRE_BUILT_PACKAGE_GUIDE.md") { Copy-Item "PRE_BUILT_PACKAGE_GUIDE.md" "$BUILD_DIR\DEPLOYMENT_GUIDE.md" }
if (Test-Path "LICENSE") { Copy-Item "LICENSE" "$BUILD_DIR\" }

Write-Host "[OK] Documentation copied" -ForegroundColor Green

# Step 8: Create .htaccess
Write-Host ""
Write-Host "[Step 8] Creating .htaccess..." -ForegroundColor Blue

$htaccess = @"
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Force HTTPS
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
    
    # API requests to Laravel backend
    RewriteCond %{REQUEST_URI} ^/backend/
    RewriteRule ^backend/(.*)$ backend/public/$1 [L]
    
    # Frontend routing
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Disable directory browsing
Options -Indexes

# Protect sensitive files
<FilesMatch "^\.">
    Order allow,deny
    Deny from all
</FilesMatch>
"@

Set-Content -Path "$BUILD_DIR\.htaccess" -Value $htaccess

Write-Host "[OK] .htaccess created" -ForegroundColor Green

# Step 9: Create ZIP package
Write-Host ""
Write-Host "[Step 9] Creating ZIP package..." -ForegroundColor Blue
Write-Host "This may take 1-2 minutes..." -ForegroundColor Yellow
Write-Host ""

try {
    Compress-Archive -Path "$BUILD_DIR\*" -DestinationPath "umrahconnect-complete.zip" -Force
    $size = (Get-Item "umrahconnect-complete.zip").Length / 1MB
    Write-Host "[OK] Package created: umrahconnect-complete.zip ($([math]::Round($size, 2)) MB)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed to create ZIP package" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Step 10: Summary
Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  [OK] Package Build Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Package: umrahconnect-complete.zip" -ForegroundColor Cyan
Write-Host "Size: $([math]::Round($size, 2)) MB" -ForegroundColor Cyan
Write-Host ""
Write-Host "What's included:" -ForegroundColor Yellow
Write-Host "  [OK] Backend with vendor folder (Composer dependencies)" -ForegroundColor Green
Write-Host "  [OK] Frontend built for production" -ForegroundColor Green
Write-Host "  [OK] Installation wizard" -ForegroundColor Green
Write-Host "  [OK] Database files" -ForegroundColor Green
Write-Host "  [OK] Documentation" -ForegroundColor Green
Write-Host "  [OK] .htaccess configured" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Upload umrahconnect-complete.zip to cPanel" -ForegroundColor White
Write-Host "  2. Extract to public_html/" -ForegroundColor White
Write-Host "  3. Set permissions (775 for storage and cache)" -ForegroundColor White
Write-Host "  4. Create database in cPanel" -ForegroundColor White
Write-Host "  5. Visit https://umrahconnect.in/install/" -ForegroundColor White
Write-Host "  6. Follow installation wizard" -ForegroundColor White
Write-Host "  7. Delete install folder after installation" -ForegroundColor White
Write-Host ""
Write-Host "Deployment time: ~20 minutes" -ForegroundColor Cyan
Write-Host ""
Write-Host "Read DEPLOYMENT_GUIDE.md in the package for detailed instructions!" -ForegroundColor Yellow
Write-Host ""
