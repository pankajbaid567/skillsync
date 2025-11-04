#!/bin/bash

# SkillSync Backend - Complete Setup and Test Script
# Run this script to setup database and test all API endpoints

set -e  # Exit on error

echo "🚀 SkillSync Backend - Setup and Test"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed or not in PATH${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm version: $(npm --version)${NC}"

# Check PostgreSQL
echo ""
echo -e "${BLUE}Checking PostgreSQL...${NC}"
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL not found in PATH${NC}"
    echo "Make sure PostgreSQL is installed and running"
else
    echo -e "${GREEN}✅ PostgreSQL found${NC}"
fi

# Install dependencies
echo ""
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

# Check if .env exists
echo ""
echo -e "${BLUE}⚙️  Checking environment configuration...${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found, creating from .env.example${NC}"
    cp .env.example .env
    echo -e "${RED}❗ Please update .env with your database credentials before continuing${NC}"
    exit 1
fi
echo -e "${GREEN}✅ .env file exists${NC}"

# Generate Prisma Client
echo ""
echo -e "${BLUE}🔧 Generating Prisma Client...${NC}"
npx prisma generate

# Run migrations
echo ""
echo -e "${BLUE}🗄️  Running database migrations...${NC}"
npx prisma migrate dev --name init

echo ""
echo -e "${GREEN}✅ Database setup complete!${NC}"

# Start server in background
echo ""
echo -e "${BLUE}🚀 Starting server...${NC}"
npm run dev &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 5

# Check if server is running
if ! curl -s http://localhost:4000/health > /dev/null; then
    echo -e "${RED}❌ Server failed to start${NC}"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

echo -e "${GREEN}✅ Server is running on http://localhost:4000${NC}"
echo ""

# Test API endpoints
echo -e "${BLUE}🧪 Testing API Endpoints...${NC}"
echo "=================================="

# Store token for authenticated requests
TOKEN=""

# Test 1: Health Check
echo ""
echo -e "${BLUE}Test 1: Health Check${NC}"
RESPONSE=$(curl -s http://localhost:4000/health)
echo "Response: $RESPONSE"
if echo "$RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
fi

# Test 2: User Signup
echo ""
echo -e "${BLUE}Test 2: User Signup${NC}"
SIGNUP_RESPONSE=$(curl -s -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "bio": "I am a test user",
    "skillsOffered": ["React", "Node.js", "JavaScript"],
    "skillsWanted": ["Python", "Machine Learning", "AI"]
  }')
echo "Response: $SIGNUP_RESPONSE"
if echo "$SIGNUP_RESPONSE" | grep -q "token"; then
    TOKEN=$(echo "$SIGNUP_RESPONSE" | grep -o '"token":"[^"]*' | sed 's/"token":"//')
    echo -e "${GREEN}✅ Signup successful${NC}"
    echo "Token: ${TOKEN:0:20}..."
else
    echo -e "${RED}❌ Signup failed${NC}"
fi

# Test 3: User Login
echo ""
echo -e "${BLUE}Test 3: User Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')
echo "Response: $LOGIN_RESPONSE"
if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✅ Login successful${NC}"
else
    echo -e "${RED}❌ Login failed${NC}"
fi

# Test 4: Get Current User (Protected)
echo ""
echo -e "${BLUE}Test 4: Get Current User (Protected)${NC}"
if [ -n "$TOKEN" ]; then
    USER_RESPONSE=$(curl -s http://localhost:4000/api/users/me \
      -H "Authorization: Bearer $TOKEN")
    echo "Response: $USER_RESPONSE"
    if echo "$USER_RESPONSE" | grep -q "test@example.com"; then
        echo -e "${GREEN}✅ Get current user passed${NC}"
    else
        echo -e "${RED}❌ Get current user failed${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipped (no token)${NC}"
fi

# Test 5: Update User Profile
echo ""
echo -e "${BLUE}Test 5: Update User Profile${NC}"
if [ -n "$TOKEN" ]; then
    UPDATE_RESPONSE=$(curl -s -X PUT http://localhost:4000/api/users/me \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "bio": "Updated bio - I love coding!",
        "skillsOffered": ["React", "Node.js", "JavaScript", "TypeScript"]
      }')
    echo "Response: $UPDATE_RESPONSE"
    if echo "$UPDATE_RESPONSE" | grep -q "Updated bio"; then
        echo -e "${GREEN}✅ Update profile passed${NC}"
    else
        echo -e "${RED}❌ Update profile failed${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipped (no token)${NC}"
fi

# Test 6: Create Second User for Swap Testing
echo ""
echo -e "${BLUE}Test 6: Create Second User${NC}"
SIGNUP2_RESPONSE=$(curl -s -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user2@example.com",
    "password": "password123",
    "name": "Second User",
    "skillsOffered": ["Python", "Django", "Machine Learning"],
    "skillsWanted": ["React", "JavaScript"]
  }')
echo "Response: $SIGNUP2_RESPONSE"
if echo "$SIGNUP2_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✅ Second user created${NC}"
else
    echo -e "${RED}❌ Second user creation failed${NC}"
fi

# Test 7: Discover Users
echo ""
echo -e "${BLUE}Test 7: Discover Users${NC}"
DISCOVER_RESPONSE=$(curl -s "http://localhost:4000/api/discover?limit=10")
echo "Response: $DISCOVER_RESPONSE"
if echo "$DISCOVER_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Discover users passed${NC}"
else
    echo -e "${RED}❌ Discover users failed${NC}"
fi

# Test 8: Search Users by Skill
echo ""
echo -e "${BLUE}Test 8: Search by Skill${NC}"
SEARCH_RESPONSE=$(curl -s "http://localhost:4000/api/discover?skill=React")
echo "Response: $SEARCH_RESPONSE"
if echo "$SEARCH_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Search by skill passed${NC}"
else
    echo -e "${RED}❌ Search by skill failed${NC}"
fi

# Test 9: Get Popular Skills
echo ""
echo -e "${BLUE}Test 9: Get Popular Skills${NC}"
SKILLS_RESPONSE=$(curl -s http://localhost:4000/api/discover/skills)
echo "Response: $SKILLS_RESPONSE"
if echo "$SKILLS_RESPONSE" | grep -q "React"; then
    echo -e "${GREEN}✅ Get popular skills passed${NC}"
else
    echo -e "${RED}❌ Get popular skills failed${NC}"
fi

# Test 10: Get AI Matches
echo ""
echo -e "${BLUE}Test 10: Get AI Matches${NC}"
if [ -n "$TOKEN" ]; then
    MATCH_RESPONSE=$(curl -s http://localhost:4000/api/match/me \
      -H "Authorization: Bearer $TOKEN")
    echo "Response: $MATCH_RESPONSE"
    if echo "$MATCH_RESPONSE" | grep -q "success"; then
        echo -e "${GREEN}✅ Get AI matches passed${NC}"
    else
        echo -e "${RED}❌ Get AI matches failed${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipped (no token)${NC}"
fi

# Test 11: Create Skill Swap
echo ""
echo -e "${BLUE}Test 11: Create Skill Swap${NC}"
if [ -n "$TOKEN" ]; then
    SWAP_RESPONSE=$(curl -s -X POST http://localhost:4000/api/swaps \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "receiverId": 2,
        "skillOffered": "React",
        "skillRequested": "Python"
      }')
    echo "Response: $SWAP_RESPONSE"
    if echo "$SWAP_RESPONSE" | grep -q "success"; then
        echo -e "${GREEN}✅ Create swap passed${NC}"
    else
        echo -e "${RED}❌ Create swap failed${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipped (no token)${NC}"
fi

# Test 12: Get User Swaps
echo ""
echo -e "${BLUE}Test 12: Get User Swaps${NC}"
if [ -n "$TOKEN" ]; then
    SWAPS_RESPONSE=$(curl -s http://localhost:4000/api/swaps \
      -H "Authorization: Bearer $TOKEN")
    echo "Response: $SWAPS_RESPONSE"
    if echo "$SWAPS_RESPONSE" | grep -q "success"; then
        echo -e "${GREEN}✅ Get user swaps passed${NC}"
    else
        echo -e "${RED}❌ Get user swaps failed${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipped (no token)${NC}"
fi

# Stop server
echo ""
echo -e "${BLUE}🛑 Stopping server...${NC}"
kill $SERVER_PID 2>/dev/null || true

echo ""
echo "=================================="
echo -e "${GREEN}✅ All tests completed!${NC}"
echo ""
echo "📚 Next steps:"
echo "  1. Review the test results above"
echo "  2. Check API_DOCS.md for complete endpoint documentation"
echo "  3. Start server manually: npm run dev"
echo "  4. Test Socket.IO chat functionality"
echo "  5. Connect your frontend"
echo ""
echo "🎉 Backend is ready to use!"
