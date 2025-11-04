# SkillSync Backend API

A production-ready Express.js backend for SkillSync - a platform where users can exchange skills through peer-to-peer learning.

## 🚀 Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **User Management**: Profile management, skill listing, and user discovery
- **Skill Swaps**: Create, manage, and track skill exchange requests
- **Reviews & Ratings**: Rate and review completed skill swaps
- **AI Matching**: Intelligent skill-based matching algorithm (expandable with ML)
- **Real-time Chat**: Socket.IO powered real-time messaging for skill swaps
- **Search & Discovery**: Advanced user discovery with filtering and pagination
- **PostgreSQL + Prisma**: Type-safe database access with migrations

## 📋 Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 13
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 4000)
- `CORS_ORIGIN`: Frontend URL for CORS

4. **Setup database**
```bash
npx prisma generate
npx prisma migrate dev --name init
```

## 🏃 Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### With Docker
```bash
docker-compose up --build
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm test -- --coverage
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify JWT token

### Users
- `GET /api/users/me` - Get current user profile (protected)
- `PUT /api/users/me` - Update current user profile (protected)
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/stats` - Get user statistics

### Skill Swaps
- `POST /api/swaps` - Create a skill swap request (protected)
- `GET /api/swaps` - Get user's swaps (protected)
- `GET /api/swaps/:id` - Get swap by ID (protected)
- `PUT /api/swaps/:id` - Update swap status (protected)
- `DELETE /api/swaps/:id` - Delete swap (protected)

### Reviews
- `POST /api/reviews` - Create a review (protected)
- `GET /api/reviews/user/:userId` - Get reviews for a user
- `GET /api/reviews/:id` - Get review by ID

### Matching
- `POST /api/match` - Get AI-powered matches
- `GET /api/match/me` - Get matches for authenticated user (protected)

### Discovery
- `GET /api/discover` - Discover users with filters
- `GET /api/discover/skills` - Get popular skills

## 🔌 Socket.IO Events

### Client -> Server
- `join` - Join a swap chat room
- `message` - Send a message
- `typing` - Send typing indicator
- `leave` - Leave a room

### Server -> Client
- `joined` - Successfully joined room
- `messages` - Receive message history
- `message` - Receive new message
- `typing` - Receive typing indicator
- `error` - Error notification

## 🗂️ Project Structure

```
src/
├── controllers/     # Request handlers
├── services/        # Business logic
├── routes/          # API routes
├── middleware/      # Custom middleware
├── prisma/          # Prisma client
├── utils/           # Utility functions
└── index.js         # Entry point

tests/               # Test files
prisma/
└── schema.prisma    # Database schema
```

## 🔧 Environment Variables

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/skillsync
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

## 🐳 Docker Deployment

Build and run with Docker Compose:
```bash
docker-compose up -d
```

The API will be available at `http://localhost:4000`

## 🔐 Security

- Helmet.js for security headers
- CORS configuration
- JWT token expiration
- Password hashing with bcrypt
- Input validation with Zod
- SQL injection prevention (Prisma ORM)

## 📝 Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name <migration-name>

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## 🤝 Frontend Integration

Example Axios setup:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
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

Example Socket.IO setup:
```javascript
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL, {
  auth: {
    token: localStorage.getItem('token'),
  },
});
```

## 📄 License

MIT

## 👥 Contributors

SkillSync Team
