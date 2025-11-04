# Manual Testing Guide

Follow these steps to set up and test the SkillSync backend API.

## Prerequisites

Make sure you have:
- Node.js >= 18.0.0 installed
- PostgreSQL running
- Terminal/Command Line access

## Step 1: Setup

```bash
# Navigate to backend folder
cd /Users/pankajbaid/PBJ/skillsync/backend

# Install dependencies
npm install

# Copy environment file (if not done already)
cp .env.example .env

# Edit .env and update DATABASE_URL with your PostgreSQL credentials
# Example: postgresql://username:password@localhost:5432/skillsync

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Start the server
npm run dev
```

Server should start at: **http://localhost:4000**

## Step 2: Test Endpoints

Open a **new terminal** window and run these curl commands:

### 1. Health Check
```bash
curl http://localhost:4000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "SkillSync API is running",
  "timestamp": "2024-11-04T..."
}
```

---

### 2. Register a User
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "name": "John Doe",
    "bio": "Passionate developer",
    "skillsOffered": ["React", "Node.js", "JavaScript"],
    "skillsWanted": ["Python", "Machine Learning"]
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      ...
    }
  },
  "message": "User registered successfully"
}
```

**⚠️ IMPORTANT: Copy the token from the response - you'll need it for authenticated requests!**

---

### 3. Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

### 4. Get Current User (Protected)
**Replace YOUR_TOKEN with the token from signup/login**

```bash
curl http://localhost:4000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 5. Update User Profile (Protected)
```bash
curl -X PUT http://localhost:4000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Updated bio - I love coding!",
    "skillsOffered": ["React", "Node.js", "JavaScript", "TypeScript"],
    "skillsWanted": ["Python", "AI"]
  }'
```

---

### 6. Register a Second User (for testing swaps)
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123",
    "name": "Jane Smith",
    "skillsOffered": ["Python", "Django", "Machine Learning"],
    "skillsWanted": ["React", "JavaScript"]
  }'
```

---

### 7. Get User by ID
```bash
curl http://localhost:4000/api/users/2
```

---

### 8. Discover Users
```bash
curl "http://localhost:4000/api/discover?page=1&limit=10"
```

---

### 9. Search Users by Skill
```bash
curl "http://localhost:4000/api/discover?skill=React"
```

---

### 10. Search Users by Query
```bash
curl "http://localhost:4000/api/discover?q=developer"
```

---

### 11. Get Popular Skills
```bash
curl http://localhost:4000/api/discover/skills
```

---

### 12. Get AI Matches (Protected)
```bash
curl http://localhost:4000/api/match/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 13. Find Matches by Skills (Public)
```bash
curl -X POST http://localhost:4000/api/match \
  -H "Content-Type: application/json" \
  -d '{
    "skillsOffered": ["React"],
    "skillsWanted": ["Python"]
  }'
```

---

### 14. Create a Skill Swap (Protected)
```bash
curl -X POST http://localhost:4000/api/swaps \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receiverId": 2,
    "skillOffered": "React",
    "skillRequested": "Python"
  }'
```

---

### 15. Get All User Swaps (Protected)
```bash
curl http://localhost:4000/api/swaps \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 16. Get Swap by ID (Protected)
```bash
curl http://localhost:4000/api/swaps/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 17. Update Swap Status (Protected)
```bash
# Accept a swap (as receiver - user 2)
curl -X PUT http://localhost:4000/api/swaps/1 \
  -H "Authorization: Bearer USER2_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ACCEPTED"
  }'
```

---

### 18. Complete a Swap (Protected)
```bash
curl -X PUT http://localhost:4000/api/swaps/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "COMPLETED"
  }'
```

---

### 19. Create a Review (Protected)
```bash
curl -X POST http://localhost:4000/api/reviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reviewedUserId": 2,
    "swapId": 1,
    "rating": 5,
    "comment": "Great learning experience! Very knowledgeable."
  }'
```

---

### 20. Get User Reviews
```bash
curl "http://localhost:4000/api/reviews/user/2?page=1&limit=10"
```

---

### 21. Get User Statistics
```bash
curl http://localhost:4000/api/users/2/stats
```

---

## Testing Socket.IO Chat

For Socket.IO testing, you'll need a JavaScript client. Here's a simple example:

Create a file `test-socket.js`:

```javascript
import { io } from 'socket.io-client';

const token = 'YOUR_JWT_TOKEN'; // Replace with actual token

const socket = io('http://localhost:4000', {
  auth: { token }
});

socket.on('connect', () => {
  console.log('✅ Connected to server');
  
  // Join a swap room
  socket.emit('join', { swapId: 1 });
});

socket.on('joined', (data) => {
  console.log('✅ Joined room:', data);
  
  // Send a message
  socket.emit('message', {
    swapId: 1,
    content: 'Hello from Socket.IO!'
  });
});

socket.on('messages', (messages) => {
  console.log('📨 Message history:', messages);
});

socket.on('message', (message) => {
  console.log('📨 New message:', message);
});

socket.on('error', (error) => {
  console.error('❌ Error:', error);
});
```

Run it:
```bash
node test-socket.js
```

---

## Expected Status Codes

- `200` - Success (GET, PUT, DELETE)
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (no permission)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

---

## Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
psql --version

# Create database if needed
createdb skillsync

# Check connection
psql -d skillsync -c "SELECT 1"
```

### Port Already in Use
```bash
# Find process on port 4000
lsof -ti:4000

# Kill it
lsof -ti:4000 | xargs kill -9
```

### Prisma Errors
```bash
# Regenerate client
npx prisma generate

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

---

## Quick Test Script

Save this as `quick-test.sh`:

```bash
#!/bin/bash

# Health check
echo "1. Health Check"
curl -s http://localhost:4000/health | jq .

# Register user
echo -e "\n2. Register User"
RESPONSE=$(curl -s -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}')
echo $RESPONSE | jq .
TOKEN=$(echo $RESPONSE | jq -r '.data.token')

# Get current user
echo -e "\n3. Get Current User"
curl -s http://localhost:4000/api/users/me \
  -H "Authorization: Bearer $TOKEN" | jq .

# Discover users
echo -e "\n4. Discover Users"
curl -s "http://localhost:4000/api/discover" | jq .

echo -e "\n✅ Basic tests complete!"
```

Run it:
```bash
chmod +x quick-test.sh
./quick-test.sh
```

---

## Success Indicators

✅ All endpoints return JSON responses
✅ Authentication works (signup/login return tokens)
✅ Protected routes require valid JWT token
✅ Database operations work (create, read, update, delete)
✅ Validation catches invalid input
✅ Error messages are clear and helpful

---

## Next Steps

1. ✅ All routes tested successfully
2. 🎨 Connect React frontend
3. 🧪 Run automated tests: `npm test`
4. 📱 Test Socket.IO chat in browser
5. 🚀 Deploy to production

For more details, see:
- **API_DOCS.md** - Complete API reference
- **README.md** - Full documentation
- **START_HERE.md** - Quick start guide
