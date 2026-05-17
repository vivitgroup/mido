#!/bin/bash

echo "======================================"
echo "Vivit CRM - Build Verification"
echo "======================================"

# Check Node version
echo "Node version: $(node -v)"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "ERROR: package.json not found!"
    exit 1
fi

# Check critical files
echo ""
echo "Checking critical files..."
files=(
    "next.config.ts"
    "tsconfig.json"
    "tailwind.config.ts"
    "postcss.config.js"
    "prisma/schema.prisma"
    ".env.local"
    "app/layout.tsx"
    "app/page.tsx"
    "app/(auth)/login/page.tsx"
    "app/(dashboard)/layout.tsx"
    "app/(dashboard)/dashboard/page.tsx"
    "lib/auth.ts"
    "lib/prisma.ts"
    "lib/utils.ts"
    "lib/permissions.ts"
    "middleware.ts"
    "scripts/seed.ts"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file MISSING"
    fi
done

# Check logo
echo ""
echo "Checking assets..."
if [ -f "public/logo/vivit-logo.jpg" ]; then
    echo "  ✅ Logo found"
else
    echo "  ❌ Logo missing"
fi

echo ""
echo "======================================"
echo "Setup Instructions:"
echo "======================================"
echo "1. npm install"
echo "2. npx prisma generate"
echo "3. npx prisma migrate dev --name init"
echo "4. npm run db:seed"
echo "5. npm run dev"
echo ""
echo "Open http://localhost:3000"
echo "======================================"
