# 🚀 SkillSync Backend - Complete & Ready!

## ✅ What's Been Built

A **production-ready Express.js backend** for SkillSync with:

### Core Features
- ✅ **Authentication**: JWT + bcrypt with signup/login
- ✅ **User Management**: Profiles with skills offered/wanted
- ✅ **Skill Swaps**: Create, manage, and track exchanges
- ✅ **Reviews & Ratings**: Rate completed swaps
- ✅ **AI Matching**: Intelligent skill-based matching
- ✅ **Real-time Chat**: Socket.IO messaging per swap
- ✅ **Discovery**: Search and filter users by skills

### Tech Stack
- Express.js (ES modules)
- PostgreSQL + Prisma ORM
- JWT + bcrypt auth
- Socket.IO real-time
- Zod validation
- Pino logging
- Jest + Supertest testing
- Docker ready

## 📦 Installation

### Prerequisites
```bash
# Required
- Node.js >= 18.0.0
- PostgreSQL >= 13
- npm or yarn

# Optional
- Docker & Docker Compose
```

### Quick Setup (Recommended)

```bash
# 1. Navigate to backend folder
cd /Users/pankajbaid/PBJ/skillsync/backend

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your database credentials

# 4. Setup database
npx prisma generate
npx prisma migrate dev --name init

# 5. Start development server
npm run dev
```

The server will start at: `http://localhost:4000`

### Docker Setup (Alternative)

```bash
# Start everything with Docker
docker-compose up --build

# Server runs at http://localhost:4000
# PostgreSQL runs at localhost:5432
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm test -- --coverage
```

## 📖 API Documentation

### Base URL
```
http://localhost:4000/api
```

### Quick Examples

#### 1. Register a User
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "name": "John Doe",
    "skillsOffered": ["React", "Node.js"],
    "skillsWanted": ["Python", "Machine Learning"]
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### 3. Get AI Matches (with token)
```bash
curl http://localhost:4000/api/match/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 4. Discover Users
```bash
curl "http://localhost:4000/api/discover?skill=React&page=1&limit=10"
```

See **API_DOCS.md** for complete endpoint documentation.

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── controllers/      # Request handlers (6 files)
│   ├── services/         # Business logic (7 files)
│   ├── routes/           # API routes (7 files)
│   ├── middleware/       # Auth & error handling
│   ├── prisma/           # Database client
│   ├── utils/            # Helper functions
│   └── index.js          # Application entry point
├── prisma/
│   └── schema.prisma     # Database schema
├── tests/                # Jest test files
├── .env.example          # Environment template
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Multi-container setup
└── package.json          # Dependencies & scripts
```

## 🔌 Connecting Frontend

### Axios Setup (React)
```javascript
// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Socket.IO Setup (React)
```javascript
// socket.js
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000', {
  auth: {
    token: localStorage.getItem('token'),
  },
});

export default socket;
```

### Frontend Environment Variables
```env
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_SOCKET_URL=http://localhost:4000
```

## 🔧 Environment Configuration

Update your `.env` file:

```env
# Server
PORT=4000
NODE_ENV=development

# Database (Update with your credentials)
DATABASE_URL="postgresql://username:password@localhost:5432/skillsync?schema=public"

# JWT (Change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Frontend
CORS_ORIGIN=http://localhost:5173
```

## 📊 Available Scripts

```bash
npm run dev          # Start with hot reload
npm start            # Start production server
npm test             # Run tests
npm run lint         # Check code quality
npm run lint:fix     # Fix linting issues
npm run format       # Format code
npm run prisma:generate   # Generate Prisma client
npm run prisma:migrate    # Run migrations
npm run prisma:studio     # Open Prisma Studio
```

## 🔍 Debugging

### Check if server is running
```bash
curl http://localhost:4000/health
```

### View database with Prisma Studio
```bash
npm run prisma:studio
```

### Check logs
The application uses Pino logger with pretty printing. All requests and errors are logged to the console.

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
pg_isready

# Create database if it doesn't exist
createdb skillsync

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

### Port Already in Use
```bash
# Find process using port 4000
lsof -ti:4000

# Kill the process
lsof -ti:4000 | xargs kill -9

# Or change PORT in .env
```

### Prisma Issues
```bash
# Regenerate Prisma client
npx prisma generate

# Format schema
npx prisma format

# View current migrations
npx prisma migrate status
```

## 📚 Documentation Files

- **README.md** - Comprehensive project documentation
- **API_DOCS.md** - Complete API endpoint reference
- **QUICKSTART.md** - Fast setup guide
- **IMPLEMENTATION_SUMMARY.md** - Feature checklist
- **THIS FILE** - Getting started guide

## 🎯 Next Steps

1. ✅ Backend is ready and running
2. 🎨 Connect your React frontend
3. 🧪 Run tests to verify everything works
4. 📱 Test Socket.IO chat functionality
5. 🚀 Deploy to production when ready

## 🚀 Production Deployment

### Environment Variables
Set these in your production environment:
- `NODE_ENV=production`
- `DATABASE_URL` (production database)
- `JWT_SECRET` (strong secret key)
- `CORS_ORIGIN` (your frontend URL)

### Database Migration
```bash
npx prisma migrate deploy
```

### Docker Production
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 💡 Tips

- Use Prisma Studio for database visualization
- Enable logging in development for debugging
- Run tests before deploying
- Keep JWT_SECRET secure and unique
- Use environment variables for all config
- Review API_DOCS.md for complete endpoint list

## 🎉 Success!

Your SkillSync backend is **complete and ready** to use!

### What You Have:
✅ 20+ REST API endpoints
✅ Real-time chat with Socket.IO
✅ JWT authentication
✅ PostgreSQL database with Prisma
✅ AI-powered matching algorithm
✅ User discovery and search
✅ Complete test suite
✅ Docker containerization
✅ Production-ready code

### Test It:
```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Test health
curl http://localhost:4000/health

# Terminal 3: Register user
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'
```

**Happy coding! 🎊**
