# SkillSync – AI-Powered Skill Exchange & Mentorship Platform

## 🌐 Live Demo

**Frontend Deployed:** [https://skillsync-green.vercel.app/](https://skillsync-green.vercel.app/)  
**Backend Deployed:** [https://skillsync-production-f827.up.railway.app](https://skillsync-production-f827.up.railway.app)

---

## 📋 Table of Contents
- [Problem Statement](#problem-statement)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [API Overview](#api-overview)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Future Enhancements](#future-enhancements)
- [Possible Outcomes](#possible-outcomes)

---

## 🎯 Problem Statement

In today's fast-paced digital world, millions of learners and professionals seek to acquire new skills — yet they struggle to find personalized, trustworthy, and affordable mentorship or collaboration opportunities.

**SkillSync** bridges this gap by enabling users to:
- 🤝 Swap skills with peers
- 🎓 Find mentors matching their learning goals
- 🚀 Collaborate on real-world projects
- 🤖 Leverage AI-based skill matching and recommendations

This creates a **global network of peer-to-peer learning and mentorship**, making skill development accessible to everyone.

---

## 🏗️ System Architecture

### Architecture Flow
```
Frontend (React) → Backend (Express API) → Database (PostgreSQL) → AI Layer (OpenAI)
                          ↓
                    Socket.IO (Real-time Chat)
```

### Stack Overview

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js with React Router for routing |
| **Backend** | Node.js + Express |
| **Database** | PostgreSQL (relational) |
| **Authentication** | JWT-based auth with bcrypt password hashing |
| **AI Layer** | Skill recommendation using OpenAI API (text similarity + profile summarization) |

### Hosting

| Component | Platform |
|-----------|----------|
| **Frontend** | Vercel |
| **Backend** | Railway |
| **Database** | PostgreSQL with Prisma ORM |

---

## 🔑 Key Features

| Category | Features |
|----------|----------|
| **Authentication & Authorization** | Secure user registration, login, logout, role-based access (user/admin) |
| **User Profiles** | Each user has a skill profile (skills offered + skills wanted) |
| **AI Skill Matching** | OpenAI-powered recommendation engine that suggests ideal skill swap partners |
| **Skill Swap Management** | Request, accept, reject, and complete skill swaps |
| **Ratings & Reviews** | Post-swap feedback for trust building |
| **Chat & Collaboration** | Real-time messaging via Socket.IO for in-app communication |
| **Dashboard** | Personalized dashboard with active swaps, requests, and recommendations |
| **Search & Discovery** | Enhanced search functionality for discovering users, filtering results by skill, sorting by ratings, and paginated lists |
| **Hosting** | Fully deployed frontend and backend with live database connection |

---

## 🛠️ Tech Stack

### Frontend
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

### Backend
- **Framework**: Express.js 4.18
- **Language**: Node.js (ES Modules)
- **Database**: PostgreSQL 15
- **ORM**: Prisma 5.7
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.IO 4.6
- **Validation**: Zod
- **Logging**: Pino
- **Testing**: Jest + Supertest

---

## 📊 API Overview

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/auth/signup` | POST | Register a new user | Public |
| `/api/auth/login` | POST | Login and get token | Public |
| `/api/users/profile` | GET | Fetch logged-in user's profile | Authenticated |
| `/api/users/match` | POST | Get AI-recommended skill partners | Authenticated |
| `/api/swaps` | POST | Create new skill swap request | Authenticated |
| `/api/swaps/:id` | PUT | Update or accept a skill swap | Authenticated |
| `/api/swaps/:id` | DELETE | Cancel swap request | Authenticated |
| `/api/reviews` | POST | Add review after completed swap | Authenticated |

For complete API documentation, see [API_DOCS.md](backend/API_DOCS.md)

---

## 🎯 Project Overview Demo

**Frontend Deployed:** [https://skillsync-green.vercel.app/](https://skillsync-green.vercel.app/)  
**Backend Deployed:** [https://skillsync-production-f827.up.railway.app](https://skillsync-production-f827.up.railway.app)

## 🎯 Project OverviewSync - Complete Full-Stack Application

## � Live Demo

**Frontend Deployed:** [https://skillsync-green.vercel.app/](https://skillsync-green.vercel.app/)

## �🎯 Project Overview

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

---

## 🚀 Future Enhancements

SkillSync has a roadmap of exciting features to further enhance the platform:

### 🤖 AI & Intelligence
- **AI-based mentorship matching** with interest-based personality analysis
- **Smart skill path recommendations** based on career goals
- **Automated skill assessment** using AI-driven quizzes

### 📅 Scheduling & Integration
- **Google Calendar API integration** for scheduling sessions
- **Automated session reminders** via email/SMS
- **Timezone-aware meeting scheduling**

### 💬 Communication
- **Video calling support** using WebRTC
- **Screen sharing** for collaborative learning
- **Voice messages** in chat

### 🎮 Gamification
- **SkillCoins reward system** for successful swaps
- **Achievement badges** and leaderboards
- **Streak tracking** for consistent engagement
- **Skill mastery levels** with certifications

### 📊 Analytics & Insights
- **Learning progress tracking**
- **Skill development analytics**
- **Mentor performance metrics**
- **Personalized learning insights**

### 🌍 Community Features
- **Skill communities and groups**
- **Public skill workshops**
- **Collaborative projects marketplace**
- **Mentorship programs**

---

## 🎯 Possible Outcomes

The potential outcomes of SkillSync will significantly impact both individual users and the broader learning community:

### 👤 Individual Impact

- **Enhanced Skill Development**: Users will have access to a diverse range of skills and mentorship, improving their personal and professional growth.

- **Increased Career Opportunities**: Through AI-powered matching, users will connect with the right mentors and partners, improving their chances of career progression and skill acquisition.

- **Better Access to Affordable Mentorship**: SkillSync's platform democratizes mentorship, offering users access to high-quality, personalized mentoring without expensive fees or geographic limitations.

### 🌐 Community Impact

- **Global Network**: By enabling a peer-to-peer skill exchange, SkillSync will create a collaborative community, reducing the reliance on traditional educational systems and promoting self-learning.

- **Community Trust & Growth**: Ratings, reviews, and a clear exchange process will build trust within the community, fostering long-term relationships between mentors and mentees.

- **Streamlined Collaboration**: Real-time messaging and collaboration tools will make working on projects with mentors and peers more seamless and efficient.

### 📈 Platform Scalability

- **Scalable Model**: The platform will be adaptable to accommodate more users and skills, growing over time to include more professions, industries, and learning opportunities.

- **Economic Impact**: By facilitating skill exchanges without monetary transactions, SkillSync creates an alternative economy based on knowledge sharing and mutual growth.

---

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
