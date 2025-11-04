#!/bin/bash

# SkillSync Frontend Setup Script
# This script installs dependencies and sets up the frontend

set -e

echo "🚀 SkillSync Frontend Setup"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm found: $(npm --version)${NC}"
echo ""

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

# Install axios and socket.io-client if not already installed
echo -e "${BLUE}📦 Installing axios and socket.io-client...${NC}"
npm install axios socket.io-client

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local not found${NC}"
    if [ -f ".env.example" ]; then
        echo -e "${BLUE}📝 Creating .env.local from .env.example...${NC}"
        cp .env.example .env.local
        echo -e "${GREEN}✅ .env.local created${NC}"
        echo -e "${YELLOW}⚠️  Please update .env.local with your backend URL if needed${NC}"
    else
        echo -e "${RED}❌ .env.example not found${NC}"
        echo -e "${BLUE}Creating default .env.local...${NC}"
        cat > .env.local << EOF
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3000

# Environment
VITE_ENV=development
EOF
        echo -e "${GREEN}✅ Default .env.local created${NC}"
    fi
else
    echo -e "${GREEN}✅ .env.local already exists${NC}"
fi

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Make sure the backend is running: cd ../backend && npm run dev"
echo "2. Start the frontend: npm run dev"
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo -e "${YELLOW}📚 Documentation:${NC}"
echo "• Read FRONTEND_BACKEND_INTEGRATION.md for integration details"
echo "• Check the architecture and API patterns"
echo ""
