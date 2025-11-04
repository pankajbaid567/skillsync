# SkillSync API Endpoints

Base URL: `http://localhost:4000/api`

## Authentication

### Register User
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "bio": "Passionate developer",
  "skillsOffered": ["React", "Node.js"],
  "skillsWanted": ["Python", "Machine Learning"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "bio": "Passionate developer",
      "skillsOffered": ["React", "Node.js"],
      "skillsWanted": ["Python", "Machine Learning"],
      "rating": 0,
      "isVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "User registered successfully"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

## Users

### Get Current User
```http
GET /users/me
Authorization: Bearer <token>
```

### Update Profile
```http
PUT /users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "bio": "Updated bio",
  "skillsOffered": ["React", "Node.js", "TypeScript"],
  "skillsWanted": ["Python"]
}
```

### Get User by ID
```http
GET /users/:id
```

## Skill Swaps

### Create Swap Request
```http
POST /swaps
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": 2,
  "skillOffered": "React",
  "skillRequested": "Python"
}
```

### Get All User Swaps
```http
GET /swaps?status=PENDING&role=requested
Authorization: Bearer <token>
```

Query Parameters:
- `status`: PENDING, ACCEPTED, IN_PROGRESS, COMPLETED, REJECTED, CANCELLED
- `role`: requested, received

### Update Swap Status
```http
PUT /swaps/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "ACCEPTED"
}
```

## Reviews

### Create Review
```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "reviewedUserId": 2,
  "swapId": 1,
  "rating": 5,
  "comment": "Great learning experience!"
}
```

### Get User Reviews
```http
GET /reviews/user/:userId?page=1&limit=10
```

## Matching

### Get AI Matches
```http
GET /match/me?limit=5
Authorization: Bearer <token>
```

### Find Matches by Skills
```http
POST /match
Content-Type: application/json

{
  "skillsOffered": ["React"],
  "skillsWanted": ["Python"]
}
```

## Discovery

### Discover Users
```http
GET /discover?q=developer&skill=React&page=1&limit=12&sortBy=rating
```

Query Parameters:
- `q`: Search query (name or bio)
- `skill`: Filter by skill
- `page`: Page number
- `limit`: Items per page
- `sortBy`: rating, newest, oldest

### Get Popular Skills
```http
GET /discover/skills?limit=20
```

## Socket.IO Events

### Connection
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Join Swap Room
```javascript
socket.emit('join', { swapId: 1 });
```

### Send Message
```javascript
socket.emit('message', {
  swapId: 1,
  content: 'Hello!'
});
```

### Listen for Messages
```javascript
socket.on('message', (message) => {
  console.log(message);
});
```

### Typing Indicator
```javascript
socket.emit('typing', {
  swapId: 1,
  isTyping: true
});
```

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error
