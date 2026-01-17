@echo off
REM UmrahConnect 2.0 - Automated Setup Script (Windows)
REM This script prepares the project for deployment

echo ========================================
echo  UmrahConnect 2.0 - Automated Setup
echo ========================================
echo.

REM Step 1: Rename folders
echo [Step 1] Renaming folders...
if exist "backend-laravel" (
    ren "backend-laravel" "backend"
    echo [OK] Renamed backend-laravel to backend
) else (
    echo [SKIP] backend-laravel not found (already renamed?)
)

if exist "installer" (
    ren "installer" "install"
    echo [OK] Renamed installer to install
) else (
    echo [SKIP] installer not found (already renamed?)
)

echo.

REM Step 2: Check backend directory
echo [Step 2] Checking backend directory...
if exist "backend" (
    echo [OK] Backend directory found
    
    if exist "backend\vendor" (
        echo [OK] Composer dependencies already installed
    ) else (
        echo [WARNING] Composer dependencies not found
        echo          Run: cd backend ^&^& composer install --no-dev --optimize-autoloader
    )
    
    if exist "backend\.env.example" (
        echo [OK] .env.example found
    ) else (
        echo [ERROR] .env.example not found
    )
) else (
    echo [ERROR] Backend directory not found
    pause
    exit /b 1
)

echo.

REM Step 3: Check install directory
echo [Step 3] Checking install directory...
if exist "install" (
    echo [OK] Install directory found
    
    if exist "install\index.php" (
        echo [OK] Installer found
    ) else (
        echo [ERROR] Installer index.php not found
    )
) else (
    echo [ERROR] Install directory not found
)

echo.

REM Step 4: Summary
echo ========================================
echo  Setup Summary
echo ========================================
echo.
echo Directory Structure:
dir /AD /B
echo.

REM Check if composer is installed
where composer >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Composer is installed
    echo      Run: cd backend ^&^& composer install --no-dev --optimize-autoloader
) else (
    echo [WARNING] Composer not found
    echo          Install Composer or upload vendor folder manually
)

echo.
echo ========================================
echo  Next Steps
echo ========================================
echo.
echo 1. Install Composer dependencies:
echo    cd backend
echo    composer install --no-dev --optimize-autoloader
echo.
echo 2. Upload to cPanel:
echo    - Zip all files
echo    - Upload to public_html/
echo    - Extract in cPanel File Manager
echo.
echo 3. Visit installer:
echo    https://yourdomain.com/install/
echo.
echo 4. After installation, delete install folder
echo.
echo [SUCCESS] Setup complete!
echo.
pause
