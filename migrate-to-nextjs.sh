#!/bin/bash

# Migration Helper Script for Internify Pulse - Vite to Next.js

echo "🚀 Starting Internify Pulse Migration to Next.js..."

# Step 1: Backup original files
echo "📦 Creating backup of original files..."
mkdir -p backup
cp package.json backup/package-original.json
cp -r src backup/src-original

# Step 2: Update package.json
echo "📝 Updating package.json..."
if [ -f "package-next.json" ]; then
    mv package.json package-vite.json
    mv package-next.json package.json
    echo "✅ Package.json updated for Next.js"
fi

# Step 3: Update TypeScript config
echo "🔧 Updating TypeScript configuration..."
if [ -f "tsconfig-next.json" ]; then
    mv tsconfig.json tsconfig-vite.json  
    mv tsconfig-next.json tsconfig.json
    echo "✅ TypeScript config updated"
fi

# Step 4: Update Tailwind config
echo "🎨 Updating Tailwind configuration..."
if [ -f "tailwind.config-next.js" ]; then
    mv tailwind.config.ts tailwind.config-vite.ts
    mv tailwind.config-next.js tailwind.config.js
    echo "✅ Tailwind config updated"
fi

# Step 5: Update ESLint config
echo "🔍 Updating ESLint configuration..."
if [ -f ".eslintrc-next.json" ]; then
    mv eslint.config.js eslint.config-vite.js
    mv .eslintrc-next.json .eslintrc.json
    echo "✅ ESLint config updated"
fi

# Step 6: Copy remaining UI components
echo "🧩 Copying remaining UI components..."
for file in src/components/ui/*.tsx; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        if [ ! -f "components/ui/$filename" ]; then
            cp "$file" "components/ui/"
            echo "📋 Copied $filename"
        fi
    fi
done

# Step 7: Copy modal components  
echo "🪟 Copying modal components..."
if [ -d "src/components/modals" ]; then
    cp -r src/components/modals/* components/modals/
    echo "✅ Modal components copied"
fi

# Step 8: Create next-env.d.ts
echo "🔗 Creating Next.js type definitions..."
cat > next-env.d.ts << 'EOF'
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
EOF

# Step 9: Update .gitignore for Next.js
echo "📋 Updating .gitignore..."
cat >> .gitignore << 'EOF'

# Next.js
/.next/
/out/

# production
/build

# misc
*.tsbuildinfo
next-env.d.ts

# environment variables
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
EOF

echo "🎉 Migration setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Run: npm install"
echo "2. Update .env.local with your configuration"
echo "3. Run: npm run dev"
echo "4. Test the application"
echo ""
echo "📚 See README-nextjs.md for detailed information"