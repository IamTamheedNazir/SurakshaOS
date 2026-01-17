#!/bin/bash

# Script to remove old Node.js backend and install folder
# This will clean up the repository to only have the Laravel backend

echo "🧹 Cleaning up old backend files..."

# Remove old Node.js backend folder
if [ -d "backend" ]; then
    echo "Removing old Node.js backend folder..."
    git rm -rf backend
    echo "✅ Old backend folder removed"
else
    echo "⚠️  Old backend folder not found"
fi

# Remove old install folder
if [ -d "install" ]; then
    echo "Removing old install folder..."
    git rm -rf install
    echo "✅ Old install folder removed"
else
    echo "⚠️  Old install folder not found"
fi

# Commit changes
echo "📝 Committing changes..."
git commit -m "chore: Remove old Node.js backend and install folder - keeping only Laravel backend"

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Repository now contains:"
echo "  ✅ backend-laravel/ (Laravel backend)"
echo "  ✅ frontend/ (React frontend)"
echo "  ✅ database/ (Database files)"
echo ""
echo "To push changes to GitHub:"
echo "  git push origin main"
