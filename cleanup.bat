@echo off
REM UmrahConnect 2.0 - Repository Cleanup Script (Windows)
REM This script removes old Node.js backend and organizes the repository

echo.
echo ========================================
echo  UmrahConnect 2.0 - Repository Cleanup
echo ========================================
echo.

REM Safety check
echo WARNING: This will:
echo   1. Delete old Node.js backend folder
echo   2. Rename backend-laravel to backend
echo   3. Remove redundant documentation
echo   4. Remove old root files
echo.
set /p confirm="Continue? (yes/no): "

if not "%confirm%"=="yes" (
    echo.
    echo Cleanup cancelled
    exit /b 1
)

echo.
echo Creating backup branch...
git checkout -b backup-before-cleanup
git push origin backup-before-cleanup
git checkout main

echo.
echo Step 1: Removing old Node.js backend...
if exist "backend" (
    git rm -r backend
    git commit -m "chore: Remove old Node.js backend"
    echo Old backend removed
) else (
    echo Old backend folder not found
)

echo.
echo Step 2: Renaming backend-laravel to backend...
if exist "backend-laravel" (
    git mv backend-laravel backend
    git commit -m "chore: Rename backend-laravel to backend"
    echo Backend renamed
) else (
    echo backend-laravel folder not found
)

echo.
echo Step 3: Creating docs folder...
if not exist "docs" mkdir docs

echo.
echo Step 4: Moving essential documentation...
if exist "COMPLETE_DEPLOYMENT_PLAN.md" git mv COMPLETE_DEPLOYMENT_PLAN.md docs\DEPLOYMENT.md
if exist "BACKEND_DEPLOYMENT_STEPS.md" git mv BACKEND_DEPLOYMENT_STEPS.md docs\BACKEND_DEPLOYMENT.md
if exist "FRONTEND_DEPLOYMENT_STEPS.md" git mv FRONTEND_DEPLOYMENT_STEPS.md docs\FRONTEND_DEPLOYMENT.md
if exist "DEPLOYMENT_CHECKLIST.md" git mv DEPLOYMENT_CHECKLIST.md docs\DEPLOYMENT_CHECKLIST.md
if exist "BACKEND_API_DOCUMENTATION.md" git mv BACKEND_API_DOCUMENTATION.md docs\API_DOCUMENTATION.md
if exist "DATABASE_SCHEMA.md" git mv DATABASE_SCHEMA.md docs\DATABASE_SCHEMA.md
if exist "COMPLETE_PROJECT_SUMMARY.md" git mv COMPLETE_PROJECT_SUMMARY.md docs\PROJECT_SUMMARY.md
if exist "QUICK_FIX.md" git mv QUICK_FIX.md docs\QUICK_FIX.md
if exist "QUICK_WEBSITE_TEST.md" git mv QUICK_WEBSITE_TEST.md docs\QUICK_TEST.md
if exist "WEBSITE_FUNCTIONALITY_AUDIT.md" git mv WEBSITE_FUNCTIONALITY_AUDIT.md docs\FUNCTIONALITY_AUDIT.md

git commit -m "docs: Organize documentation into docs folder"
echo Documentation organized

echo.
echo Step 5: Removing redundant documentation...
for %%f in (
    BUILD_ERROR_FIX.md
    BUILD_PLAN.md
    BUILD_PROGRESS_REPORT.md
    CLEANUP_OLD_BACKEND.md
    COMPLETE_DEPLOYMENT_GUIDE.md
    COMPLETE_FEATURE_SET.md
    COMPLETE_PLATFORM_AUDIT.md
    CPANEL_DEPLOYMENT_GUIDE.md
    CPANEL_HOSTING_GUIDE.md
    CPANEL_SHARED_HOSTING_SOLUTION.md
    CRITICAL_FIX_PATHS.md
    DATABASE_STORAGE_VERIFICATION.md
    DEPLOYMENT_GUIDE.md
    DEPLOYMENT_FIX_GUIDE.md
    DEPLOY_BACKEND_NOW.md
    DEPLOY_TO_UMRAHCONNECT_IN.md
    DYNAMIC_SYSTEM_REQUIREMENTS.md
    FILE_STRUCTURE_AND_INSTALLATION.md
    FINAL_AUDIT_AND_GAP_ANALYSIS.md
    FINAL_CLEANUP_PLAN.md
    FINAL_COMPLETION_REPORT.md
    FINAL_PROJECT_SUMMARY.md
    IMPLEMENTATION_GUIDE.md
    INSTALLATION_FIXED.md
    INSTALLATION_GUIDE.md
    INSTALLATION_SYSTEM_COMPLETE.md
    INSTALLATION_VERIFICATION.md
    LARAVEL_BACKEND_COMPLETE.md
    LARAVEL_DEPLOYMENT_GUIDE.md
    LARAVEL_PHP_CONVERSION_PLAN.md
    MONETIZATION_FEATURES.md
    NEW_FEATURES_SUMMARY.md
    POST_INSTALLATION_SETUP.md
    PRODUCTION_DEPLOYMENT_GUIDE.md
    PROGRESS.md
    PROJECT_AUDIT.md
    PROJECT_AUDIT_COMPLETE.md
    PROJECT_AUDIT_REPORT.md
    PROJECT_COMPLETION_REPORT.md
    PROJECT_SUMMARY.md
    QUICK_REFERENCE.md
    QUICK_SETUP_MYSQL.md
    QUICK_START.md
    SETUP_FROM_ZIP.md
    SHARED_HOSTING_SETUP.md
    SIMPLE_SETUP.md
    TESTING_GUIDE.md
    WORKING_INSTALLATION_SYSTEM.md
) do (
    if exist "%%f" git rm "%%f"
)

git commit -m "chore: Remove redundant documentation files"
echo Redundant files removed

echo.
echo Step 6: Removing old root files...
if exist "docker-compose.yml" git rm docker-compose.yml
if exist "index.html" git rm index.html
if exist "index.php" git rm index.php
if exist "install.php" git rm install.php

git commit -m "chore: Remove old root files"
echo Old root files removed

echo.
echo Step 7: Pushing changes to GitHub...
git push origin main

echo.
echo ========================================
echo  Cleanup Complete!
echo ========================================
echo.
echo Summary:
echo   - Old Node.js backend removed
echo   - Laravel backend renamed to 'backend'
echo   - Documentation organized in 'docs/' folder
echo   - Redundant files removed
echo   - Repository cleaned and optimized
echo.
echo Your repository is now clean and production-ready!
echo.
echo Next steps:
echo   1. Review the changes
echo   2. Update your local clone: git pull
echo   3. Deploy to production
echo.
echo Backup branch created: backup-before-cleanup
echo (You can always revert if needed)
echo.
pause
