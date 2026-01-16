#!/bin/bash

# UmrahConnect 2.0 - Repository Cleanup Script
# This script removes old Node.js backend and organizes the repository

echo "🧹 UmrahConnect 2.0 - Repository Cleanup"
echo "========================================"
echo ""

# Safety check
echo "⚠️  WARNING: This will:"
echo "  1. Delete old Node.js backend folder"
echo "  2. Rename backend-laravel to backend"
echo "  3. Remove redundant documentation"
echo "  4. Remove old root files"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Cleanup cancelled"
    exit 1
fi

echo ""
echo "📦 Creating backup branch..."
git checkout -b backup-before-cleanup
git push origin backup-before-cleanup
git checkout main

echo ""
echo "🗑️  Step 1: Removing old Node.js backend..."
if [ -d "backend" ]; then
    git rm -r backend
    git commit -m "chore: Remove old Node.js backend"
    echo "✅ Old backend removed"
else
    echo "⚠️  Old backend folder not found (may already be removed)"
fi

echo ""
echo "🔄 Step 2: Renaming backend-laravel to backend..."
if [ -d "backend-laravel" ]; then
    git mv backend-laravel backend
    git commit -m "chore: Rename backend-laravel to backend"
    echo "✅ Backend renamed"
else
    echo "⚠️  backend-laravel folder not found"
fi

echo ""
echo "📁 Step 3: Creating docs folder..."
mkdir -p docs

echo ""
echo "📝 Step 4: Moving essential documentation..."

# Move essential docs to docs folder
[ -f "COMPLETE_DEPLOYMENT_PLAN.md" ] && git mv COMPLETE_DEPLOYMENT_PLAN.md docs/DEPLOYMENT.md
[ -f "BACKEND_DEPLOYMENT_STEPS.md" ] && git mv BACKEND_DEPLOYMENT_STEPS.md docs/BACKEND_DEPLOYMENT.md
[ -f "FRONTEND_DEPLOYMENT_STEPS.md" ] && git mv FRONTEND_DEPLOYMENT_STEPS.md docs/FRONTEND_DEPLOYMENT.md
[ -f "DEPLOYMENT_CHECKLIST.md" ] && git mv DEPLOYMENT_CHECKLIST.md docs/DEPLOYMENT_CHECKLIST.md
[ -f "BACKEND_API_DOCUMENTATION.md" ] && git mv BACKEND_API_DOCUMENTATION.md docs/API_DOCUMENTATION.md
[ -f "DATABASE_SCHEMA.md" ] && git mv DATABASE_SCHEMA.md docs/DATABASE_SCHEMA.md
[ -f "COMPLETE_PROJECT_SUMMARY.md" ] && git mv COMPLETE_PROJECT_SUMMARY.md docs/PROJECT_SUMMARY.md
[ -f "QUICK_FIX.md" ] && git mv QUICK_FIX.md docs/QUICK_FIX.md
[ -f "QUICK_WEBSITE_TEST.md" ] && git mv QUICK_WEBSITE_TEST.md docs/QUICK_TEST.md
[ -f "WEBSITE_FUNCTIONALITY_AUDIT.md" ] && git mv WEBSITE_FUNCTIONALITY_AUDIT.md docs/FUNCTIONALITY_AUDIT.md

git commit -m "docs: Organize documentation into docs folder"
echo "✅ Documentation organized"

echo ""
echo "🗑️  Step 5: Removing redundant documentation..."

# List of redundant files to remove
redundant_files=(
    "BUILD_ERROR_FIX.md"
    "BUILD_PLAN.md"
    "BUILD_PROGRESS_REPORT.md"
    "CLEANUP_OLD_BACKEND.md"
    "COMPLETE_DEPLOYMENT_GUIDE.md"
    "COMPLETE_FEATURE_SET.md"
    "COMPLETE_PLATFORM_AUDIT.md"
    "CPANEL_DEPLOYMENT_GUIDE.md"
    "CPANEL_HOSTING_GUIDE.md"
    "CPANEL_SHARED_HOSTING_SOLUTION.md"
    "CRITICAL_FIX_PATHS.md"
    "DATABASE_STORAGE_VERIFICATION.md"
    "DEPLOYMENT_GUIDE.md"
    "DEPLOYMENT_FIX_GUIDE.md"
    "DEPLOY_BACKEND_NOW.md"
    "DEPLOY_TO_UMRAHCONNECT_IN.md"
    "DYNAMIC_SYSTEM_REQUIREMENTS.md"
    "FILE_STRUCTURE_AND_INSTALLATION.md"
    "FINAL_AUDIT_AND_GAP_ANALYSIS.md"
    "FINAL_CLEANUP_PLAN.md"
    "FINAL_COMPLETION_REPORT.md"
    "FINAL_PROJECT_SUMMARY.md"
    "IMPLEMENTATION_GUIDE.md"
    "INSTALLATION_FIXED.md"
    "INSTALLATION_GUIDE.md"
    "INSTALLATION_SYSTEM_COMPLETE.md"
    "INSTALLATION_VERIFICATION.md"
    "LARAVEL_BACKEND_COMPLETE.md"
    "LARAVEL_DEPLOYMENT_GUIDE.md"
    "LARAVEL_PHP_CONVERSION_PLAN.md"
    "MONETIZATION_FEATURES.md"
    "NEW_FEATURES_SUMMARY.md"
    "POST_INSTALLATION_SETUP.md"
    "PRODUCTION_DEPLOYMENT_GUIDE.md"
    "PROGRESS.md"
    "PROJECT_AUDIT.md"
    "PROJECT_AUDIT_COMPLETE.md"
    "PROJECT_AUDIT_REPORT.md"
    "PROJECT_COMPLETION_REPORT.md"
    "PROJECT_SUMMARY.md"
    "QUICK_REFERENCE.md"
    "QUICK_SETUP_MYSQL.md"
    "QUICK_START.md"
    "SETUP_FROM_ZIP.md"
    "SHARED_HOSTING_SETUP.md"
    "SIMPLE_SETUP.md"
    "TESTING_GUIDE.md"
    "WORKING_INSTALLATION_SYSTEM.md"
)

for file in "${redundant_files[@]}"; do
    if [ -f "$file" ]; then
        git rm "$file"
    fi
done

git commit -m "chore: Remove redundant documentation files"
echo "✅ Redundant files removed"

echo ""
echo "🗑️  Step 6: Removing old root files..."

# Remove old root files
[ -f "docker-compose.yml" ] && git rm docker-compose.yml
[ -f "index.html" ] && git rm index.html
[ -f "index.php" ] && git rm index.php
[ -f "install.php" ] && git rm install.php

git commit -m "chore: Remove old root files"
echo "✅ Old root files removed"

echo ""
echo "📤 Step 7: Pushing changes to GitHub..."
git push origin main

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 Summary:"
echo "  ✅ Old Node.js backend removed"
echo "  ✅ Laravel backend renamed to 'backend'"
echo "  ✅ Documentation organized in 'docs/' folder"
echo "  ✅ Redundant files removed"
echo "  ✅ Repository cleaned and optimized"
echo ""
echo "🎉 Your repository is now clean and production-ready!"
echo ""
echo "📝 Next steps:"
echo "  1. Review the changes"
echo "  2. Update your local clone: git pull"
echo "  3. Deploy to production"
echo ""
echo "💾 Backup branch created: backup-before-cleanup"
echo "   (You can always revert if needed)"
