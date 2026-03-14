#!/bin/bash

# LIBGO - Fix Transform Error Script
# Run this script to fix the "Config file contains no configuration data" error

echo "🔧 Fixing LIBGO Transform Error..."
echo ""

# Step 1: Clear all caches
echo "Step 1: Clearing caches..."
rm -rf node_modules/.cache
rm -rf .expo
rm -rf /tmp/metro-*
rm -rf /tmp/haste-*

# Clear watchman (if installed)
if command -v watchman &> /dev/null; then
    echo "Clearing watchman cache..."
    watchman watch-del-all
fi

echo "✅ Caches cleared!"
echo ""

# Step 2: Reinstall dependencies (optional but recommended)
echo "Step 2: Checking dependencies..."
npm install

echo "✅ Dependencies checked!"
echo ""

# Step 3: Instructions
echo "========================================="
echo "✅ FIX COMPLETED!"
echo "========================================="
echo ""
echo "Now run these commands in separate terminals:"
echo ""
echo "Terminal 1 (Convex Backend):"
echo "  npx convex dev"
echo ""
echo "Terminal 2 (React Native App):"
echo "  npx expo start --clear"
echo ""
echo "Press 'c' to clear cache again if needed"
echo ""
echo "========================================="
