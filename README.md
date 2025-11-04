# SkillSync - Complete Full-Stack Application

## 🎯 Project Overview

SkillSync is a modern skill-swapping platform where users can exchange skills with others. Built with React (TypeScript) frontend and Express.js backend, featuring real-time chat, AI-powered matching, and comprehensive skill management.

## 📁 Project Structure

```
skillsync/
├── backend/                    # Express.js Backend
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth & error handling
│   │   └── index.js          # App entry point
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── tests/                # Test files
│   ├── .env                  # Environment variables
│   └── package.json
│
└── skill-sync-ai-77/         # React Frontend
    ├── src/
    │   ├── components/       # UI components
    │   ├── pages/            # Page components
    │   ├── contexts/         # React contexts (Auth, Socket)
    │   ├── services/         # API service layer
    │   ├── hooks/            # Custom hooks
    │   ├── lib/              # Utilities (API client)
    │   └── types/            # TypeScript types
    ├── .env.local            # Frontend environment
    └── package.json
```

## 🚀 Quick Start

### **Prerequisites**

- Node.js 18+ 
- PostgreSQL 15+
- npm, yarn, or bun

### **1. Setup Backend**

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npx prisma generate
npx prisma migrate dev --name init

# Start development server
npm run dev
```

Backend will run on `http://localhost:3000`

### **2. Setup Frontend**

```bash
cd skill-sync-ai-77

# Run setup script (installs dependencies and configures environment)
./setup-frontend.sh

# Or manually:
npm install
npm install axios socket.io-client
cp .env.example .env.local

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### **3. Test the Application**

1. Open http://localhost:5173
2. Click "Join SkillSync" to create an account
3. Login with your credentials
4. Explore features: discover users, create swaps, chat, review

## 🏗️ Architecture

### **Frontend Architecture**

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (React Components + shadcn/ui)         │
└──────────────┬──────────────────────────┘
               │
┌──────────────┴──────────────────────────┐
│      State Management Layer             │
│  • AuthContext (Global Auth State)      │
│  • SocketContext (Real-time)            │
│  • React Query (Server State Cache)     │
└──────────────┬──────────────────────────┘
               │
┌──────────────┴──────────────────────────┐
│         Service Layer                   │
│  Type-safe API calls for each domain    │
└──────────────┬──────────────────────────┘
               │
┌──────────────┴──────────────────────────┐
│        API Client Layer                 │
│  Axios with interceptors & error        │
│  handling                               │
└──────────────┬──────────────────────────┘
               │
               ▼
         Backend API
```

### **Backend Architecture**

```
Routes → Controllers → Services → Prisma → Database
                    ↓
                Middleware (Auth, Error)
```

## 🔑 Key Features

### **Authentication & Authorization**
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected routes and API endpoints
- ✅ Automatic token management
- ✅ Session persistence

### **User Management**
- ✅ User profiles with skills
- ✅ Avatar support
- ✅ Rating system
- ✅ Search and discovery

### **Skill Swapping**
- ✅ Create swap requests
- ✅ Accept/Reject/Complete swaps
- ✅ Swap status tracking
- ✅ Swap history

### **AI Matching**
- ✅ Skill-based matching algorithm
- ✅ Match scoring
- ✅ Personalized recommendations

### **Real-time Chat**
- ✅ Socket.IO integration
- ✅ Room-based messaging
- ✅ Typing indicators
- ✅ Message persistence

### **Reviews & Ratings**
- ✅ Post-swap reviews
- ✅ 5-star rating system
- ✅ User reputation tracking

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 18 + TypeScript
- **Routing**: React Router 6
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: 
  - React Context (Auth, Socket)
  - React Query (Server state)
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Forms**: React Hook Form + Zod
- **Build Tool**: Vite

### **Backend**
- **Framework**: Express.js 4.18
- **Language**: Node.js (ES Modules)
- **Database**: PostgreSQL 15
- **ORM**: Prisma 5.7
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.IO 4.6
- **Validation**: Zod
- **Logging**: Pino
- **Testing**: Jest + Supertest

## 📚 Documentation

### **Essential Guides**
- **[Frontend-Backend Integration Guide](skill-sync-ai-77/FRONTEND_BACKEND_INTEGRATION.md)** - Complete integration documentation
- **[Backend API Documentation](backend/API_DOCS.md)** - All API endpoints
- **[Backend Quick Start](backend/QUICKSTART.md)** - Backend setup guide
- **[Testing Guide](backend/TESTING_GUIDE.md)** - API testing with curl

### **Code Examples**

#### **Authentication**
```typescript
// Login
const { login } = useAuth();
await login(email, password);

// Access user data
const { user, isAuthenticated } = useAuth();
```

#### **API Calls with React Query**
```typescript
// Fetch data
const { data: swaps, isLoading } = useSwaps();

// Mutation
const createSwap = useCreateSwap();
createSwap.mutate({
  providerId: 123,
  skillOffered: "React",
  skillRequested: "Node.js"
});
```

#### **Real-time Chat**
```typescript
const { sendMessage, onMessage, joinSwapRoom } = useSocket();

// Join room
joinSwapRoom(swapId);

// Send message
sendMessage(swapId, "Hello!");

// Listen for messages
useEffect(() => {
  const cleanup = onMessage((message) => {
    console.log(message);
  });
  return cleanup;
}, []);
```

## 🔐 Environment Variables

### **Backend (.env)**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/skillsync"
JWT_SECRET="your-secret-key-here"
PORT=3000
NODE_ENV=development
```

### **Frontend (.env.local)**
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3000
VITE_ENV=development
```

## 🧪 Testing

### **Backend Tests**
```bash
cd backend

# Run all tests
npm test

# Test with coverage
npm run test:coverage

# Test API endpoints
./test-api.sh
```

### **Frontend Testing Checklist**
- [ ] Signup creates account
- [ ] Login authentication works
- [ ] Protected routes redirect properly
- [ ] API calls function correctly
- [ ] Socket.IO connects and sends messages
- [ ] Token persists on refresh
- [ ] Logout clears session

## 🚢 Deployment

### **Backend Deployment**

**Using Docker**:
```bash
cd backend
docker-compose up -d
```

**Manual**:
```bash
npm run build
NODE_ENV=production npm start
```

### **Frontend Deployment**

```bash
cd skill-sync-ai-77

# Build for production
npm run build

# Preview build
npm run preview
```

Deploy `dist/` folder to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting

## 📊 API Endpoints

### **Authentication**
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### **Users**
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update profile
- `GET /api/users/search` - Search users

### **Swaps**
- `GET /api/swaps` - Get my swaps
- `POST /api/swaps` - Create swap
- `PUT /api/swaps/:id` - Update swap
- `DELETE /api/swaps/:id` - Delete swap

### **Reviews**
- `POST /api/reviews` - Create review
- `GET /api/reviews/user/:userId` - Get user reviews

### **Matching**
- `GET /api/matches` - Get AI matches
- `GET /api/discover` - Discover users

### **Messages**
- `GET /api/messages/:swapId` - Get swap messages

### **Socket.IO Events**
- `join` - Join swap room
- `message` - Send/receive messages
- `typing` - Typing indicators
- `leave` - Leave room

## 🐛 Common Issues

### **Backend won't start**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Run `npx prisma generate`

### **Frontend can't connect to backend**
- Check backend is running on port 3000
- Verify VITE_API_BASE_URL in .env.local
- Check CORS settings in backend

### **Authentication not working**
- Clear localStorage
- Check JWT_SECRET matches between sessions
- Verify token format in Network tab

### **Socket.IO not connecting**
- Check VITE_WS_URL matches backend
- Verify user is authenticated
- Check browser console for errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Built with ❤️ by the SkillSync team

## 🔗 Links

- [Frontend Repository](https://github.com/pankajbaid567/skill-sync-ai-77)
- [Documentation](./FRONTEND_BACKEND_INTEGRATION.md)
- [Issue Tracker](https://github.com/pankajbaid567/skill-sync-ai-77/issues)

---

**Version**: 1.0.0  
**Last Updated**: November 2025

For detailed integration patterns and code examples, see [FRONTEND_BACKEND_INTEGRATION.md](skill-sync-ai-77/FRONTEND_BACKEND_INTEGRATION.md)
