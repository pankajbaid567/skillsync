#!/bin/bash

# Build Script for SkillSync Frontend
# This script builds the frontend for production

set -e

echo "🏗️  SkillSync Frontend Build Script"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found${NC}"
    echo "Please run this script from the skill-sync-ai directory"
    exit 1
fi

echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

echo ""
echo -e "${BLUE}📦 Installing axios and socket.io-client...${NC}"
npm install axios socket.io-client

echo ""
echo -e "${BLUE}🔍 Running TypeScript check...${NC}"
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ TypeScript check passed${NC}"
else
    echo -e "${RED}❌ TypeScript errors found. Please fix them before building.${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🏗️  Building for production...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Build successful!${NC}"
    echo ""
    echo -e "${BLUE}📦 Build output in: ${NC}dist/"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Test production build: npm run preview"
    echo "2. Deploy dist/ folder to your hosting provider"
    echo ""
    echo -e "${GREEN}🎉 Ready for deployment!${NC}"
else
    echo ""
    echo -e "${RED}❌ Build failed${NC}"
    echo "Please check the errors above and fix them."
    exit 1
fi
