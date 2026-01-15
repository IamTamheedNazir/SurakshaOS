@echo off
REM UmrahConnect 2.0 - cPanel Deployment Script (Windows)
REM This script builds the project and prepares it for cPanel deployment

echo.
echo ========================================
echo UmrahConnect 2.0 - cPanel Deployment
echo ========================================
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo [ERROR] package.json not found!
    echo Please run this script from the frontend directory.
    pause
    exit /b 1
)

echo [1/4] Installing dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Dependencies installed
echo.

echo [2/4] Building production bundle...
call npm run build
if errorlevel 1 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)
echo [SUCCESS] Build completed
echo.

echo [3/4] Preparing deployment files...

REM Create deployment directory
set DEPLOY_DIR=cpanel-deploy
if exist %DEPLOY_DIR% rmdir /s /q %DEPLOY_DIR%
mkdir %DEPLOY_DIR%

REM Copy build files
xcopy /E /I /Y dist\* %DEPLOY_DIR%\ >nul

REM Copy .htaccess
if exist ".htaccess.example" (
    copy /Y .htaccess.example %DEPLOY_DIR%\.htaccess >nul
    echo [SUCCESS] .htaccess file copied
) else (
    echo [WARNING] .htaccess.example not found, creating basic .htaccess
    (
        echo ^<IfModule mod_rewrite.c^>
        echo   RewriteEngine On
        echo   RewriteBase /
        echo   RewriteCond %%{REQUEST_FILENAME} !-f
        echo   RewriteCond %%{REQUEST_FILENAME} !-d
        echo   RewriteRule ^ index.html [L]
        echo ^</IfModule^>
    ) > %DEPLOY_DIR%\.htaccess
)

REM Create robots.txt
(
    echo User-agent: *
    echo Allow: /
    echo.
    echo Sitemap: https://yourdomain.com/sitemap.xml
) > %DEPLOY_DIR%\robots.txt
echo [SUCCESS] robots.txt created

REM Create deployment info
(
    echo UmrahConnect 2.0 - Deployment Package
    echo ======================================
    echo.
    echo Build Date: %date% %time%
    echo Build Version: 2.0.0
    echo.
    echo Deployment Instructions:
    echo 1. Upload all files to your cPanel public_html directory
    echo 2. Ensure .htaccess file is present
    echo 3. Set file permissions: 644 for files, 755 for directories
    echo 4. Configure SSL certificate in cPanel
    echo 5. Test the deployment at your domain
    echo.
    echo Files included:
    echo - index.html (main entry point^)
    echo - assets/ (JavaScript, CSS, images^)
    echo - .htaccess (Apache configuration^)
    echo - robots.txt (SEO^)
    echo.
    echo For detailed instructions, see CPANEL_DEPLOYMENT.md
    echo.
    echo Support: support@umrahconnect.com
) > %DEPLOY_DIR%\DEPLOY_INFO.txt

echo [SUCCESS] Deployment files prepared
echo.

echo [4/4] Creating deployment package...
REM Note: Windows doesn't have built-in zip, so we'll just create the folder
echo [INFO] Deployment folder created: %DEPLOY_DIR%
echo [INFO] You can manually ZIP this folder or use the folder directly
echo.

echo ========================================
echo Deployment package ready!
echo ========================================
echo.
echo Deployment files location:
echo   - Folder: .\%DEPLOY_DIR%\
echo.
echo Next steps:
echo   1. ZIP the %DEPLOY_DIR% folder (right-click ^> Send to ^> Compressed folder)
echo   2. Login to your cPanel
echo   3. Go to File Manager
echo   4. Navigate to public_html
echo   5. Upload and extract the ZIP file
echo   6. Verify .htaccess is present
echo   7. Test your deployment
echo.
echo For detailed instructions, see:
echo   CPANEL_DEPLOYMENT.md
echo.
echo Your site will be live at:
echo   https://yourdomain.com
echo.
echo Good luck with your deployment!
echo.
pause
