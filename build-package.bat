@echo off
REM UmrahConnect 2.0 - Pre-Built Package Builder (Windows)
REM This script creates a complete deployment package with vendor and built frontend

echo ==========================================
echo   UmrahConnect 2.0 Package Builder
echo ==========================================
echo.

REM Check if we're in the right directory
if not exist "package.json" if not exist "backend-laravel" (
    echo [ERROR] Please run this script from the repository root
    pause
    exit /b 1
)

echo [Step 1] Preparing directories...

REM Create build directory
set BUILD_DIR=umrahconnect-complete
if exist "%BUILD_DIR%" rmdir /s /q "%BUILD_DIR%"
mkdir "%BUILD_DIR%"

echo [OK] Build directory created
echo.

REM Step 2: Copy backend
echo [Step 2] Preparing backend...

if exist "backend-laravel" (
    xcopy /E /I /Q "backend-laravel" "%BUILD_DIR%\backend"
    echo [OK] Backend copied
) else if exist "backend" (
    xcopy /E /I /Q "backend" "%BUILD_DIR%\backend"
    echo [OK] Backend copied
) else (
    echo [ERROR] Backend directory not found!
    pause
    exit /b 1
)

REM Step 3: Install Composer dependencies
echo.
echo [Step 3] Installing Composer dependencies...
echo This may take 2-5 minutes...
echo.

cd "%BUILD_DIR%\backend"

where composer >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    composer install --no-dev --optimize-autoloader --no-interaction
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Composer dependencies installed
    ) else (
        echo [ERROR] Composer installation failed
        cd ..\..
        pause
        exit /b 1
    )
) else (
    echo [ERROR] Composer not found!
    echo Please install Composer: https://getcomposer.org/download/
    cd ..\..
    pause
    exit /b 1
)

cd ..\..

REM Step 4: Build frontend
echo.
echo [Step 4] Building frontend...
echo This may take 2-5 minutes...
echo.

cd frontend

if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
)

echo Building production frontend...
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo [OK] Frontend built successfully
) else (
    echo [ERROR] Frontend build failed
    cd ..
    pause
    exit /b 1
)

REM Copy built frontend to package
xcopy /E /I /Q "dist\*" "..\%BUILD_DIR%\"

cd ..

echo [OK] Frontend copied to package

REM Step 5: Copy installer
echo.
echo [Step 5] Copying installer...

if exist "installer" (
    xcopy /E /I /Q "installer" "%BUILD_DIR%\install"
    echo [OK] Installer copied
) else if exist "install" (
    xcopy /E /I /Q "install" "%BUILD_DIR%\install"
    echo [OK] Installer copied
) else (
    echo [WARNING] Installer directory not found (optional)
)

REM Step 6: Copy database files
echo.
echo [Step 6] Copying database files...

if exist "database" (
    xcopy /E /I /Q "database" "%BUILD_DIR%\database"
    echo [OK] Database files copied
) else (
    echo [WARNING] Database directory not found (optional)
)

REM Step 7: Copy documentation
echo.
echo [Step 7] Copying documentation...

if exist "README.md" copy /Y "README.md" "%BUILD_DIR%\" >nul
if exist "PRE_BUILT_PACKAGE_GUIDE.md" copy /Y "PRE_BUILT_PACKAGE_GUIDE.md" "%BUILD_DIR%\DEPLOYMENT_GUIDE.md" >nul
if exist "LICENSE" copy /Y "LICENSE" "%BUILD_DIR%\" >nul

echo [OK] Documentation copied

REM Step 8: Create .htaccess
echo.
echo [Step 8] Creating .htaccess...

(
echo ^<IfModule mod_rewrite.c^>
echo     RewriteEngine On
echo.    
echo     # Force HTTPS
echo     RewriteCond %%{HTTPS} off
echo     RewriteRule ^^(.*)$ https://%%{HTTP_HOST}%%{REQUEST_URI} [L,R=301]
echo.    
echo     # API requests to Laravel backend
echo     RewriteCond %%{REQUEST_URI} ^^/backend/
echo     RewriteRule ^^backend/(.*)$ backend/public/$1 [L]
echo.    
echo     # Frontend routing
echo     RewriteCond %%{REQUEST_FILENAME} !-f
echo     RewriteCond %%{REQUEST_FILENAME} !-d
echo     RewriteRule ^^(.*)$ index.html [L]
echo ^</IfModule^>
echo.
echo # Security Headers
echo ^<IfModule mod_headers.c^>
echo     Header set X-Content-Type-Options "nosniff"
echo     Header set X-Frame-Options "SAMEORIGIN"
echo     Header set X-XSS-Protection "1; mode=block"
echo ^</IfModule^>
echo.
echo # Disable directory browsing
echo Options -Indexes
echo.
echo # Protect sensitive files
echo ^<FilesMatch "^^\\."^>
echo     Order allow,deny
echo     Deny from all
echo ^</FilesMatch^>
) > "%BUILD_DIR%\.htaccess"

echo [OK] .htaccess created

REM Step 9: Create ZIP package
echo.
echo [Step 9] Creating ZIP package...
echo This may take 1-2 minutes...
echo.

REM Check if PowerShell is available for zipping
powershell -Command "Compress-Archive -Path '%BUILD_DIR%\*' -DestinationPath 'umrahconnect-complete.zip' -Force"

if %ERRORLEVEL% EQU 0 (
    for %%A in (umrahconnect-complete.zip) do set PACKAGE_SIZE=%%~zA
    set /a PACKAGE_SIZE_MB=%PACKAGE_SIZE% / 1048576
    echo [OK] Package created: umrahconnect-complete.zip (!PACKAGE_SIZE_MB! MB)
) else (
    echo [ERROR] Failed to create ZIP package
    echo Please install 7-Zip or WinRAR and zip the folder manually
    pause
    exit /b 1
)

REM Step 10: Summary
echo.
echo ==========================================
echo   [OK] Package Build Complete!
echo ==========================================
echo.
echo Package: umrahconnect-complete.zip
echo.
echo What's included:
echo   [OK] Backend with vendor folder (Composer dependencies)
echo   [OK] Frontend built for production
echo   [OK] Installation wizard
echo   [OK] Database files
echo   [OK] Documentation
echo   [OK] .htaccess configured
echo.
echo Next steps:
echo   1. Upload umrahconnect-complete.zip to cPanel
echo   2. Extract to public_html/
echo   3. Set permissions (775 for storage and cache)
echo   4. Create database in cPanel
echo   5. Visit https://umrahconnect.in/install/
echo   6. Follow installation wizard
echo   7. Delete install folder after installation
echo.
echo Deployment time: ~20 minutes
echo.
echo Read DEPLOYMENT_GUIDE.md in the package for detailed instructions!
echo.
pause
