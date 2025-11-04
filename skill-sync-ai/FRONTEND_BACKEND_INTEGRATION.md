# Frontend-Backend Integration Guide

## 🏗️ Architecture Overview

This guide documents the industry-standard integration between the React frontend and Express.js backend for SkillSync.

### **Architecture Pattern: Layered Architecture with Service Pattern**

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│  React Components (Pages, UI Components)                    │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────────────────┐
│                   STATE MANAGEMENT LAYER                     │
│  • React Context (Auth, Socket)                             │
│  • React Query (Server State Cache)                         │
│  • Custom Hooks (useAuth, useSocket, useApi)                │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────────────────┐
│                    SERVICE LAYER                             │
│  • API Services (auth, user, swap, review, match)           │
│  • Type-safe API calls                                       │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────────────────┐
│                  API CLIENT LAYER                            │
│  • Axios Instance with Interceptors                         │
│  • Request/Response transformation                          │
│  • Error handling & Token management                        │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTP/WebSocket
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API                               │
│  Express.js REST API + Socket.IO                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Installation

### **1. Install Required Dependencies**

```bash
cd skill-sync-ai-77

# Install axios for HTTP requests and socket.io-client for real-time features
npm install axios socket.io-client

# Or using yarn
yarn add axios socket.io-client

# Or using bun (if using bun)
bun add axios socket.io-client
```

### **2. Environment Configuration**

Create a `.env.local` file in the frontend root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3000

# Environment
VITE_ENV=development
```

---

## 🔑 Key Components

### **1. API Client (`src/lib/api-client.ts`)**

**Purpose**: Centralized Axios configuration with interceptors

**Features**:
- ✅ Automatic JWT token attachment to requests
- ✅ Request/Response logging in development
- ✅ Global error handling with toast notifications
- ✅ Token management (storage, retrieval, removal)
- ✅ Automatic logout on 401 errors

**Usage**:
```typescript
import apiClient from '@/lib/api-client';

// API client is already configured, just use it
const response = await apiClient.get('/users/123');
```

---

### **2. Authentication Context (`src/contexts/AuthContext.tsx`)**

**Purpose**: Global authentication state management

**Provides**:
- `user`: Current user data
- `isAuthenticated`: Boolean auth status
- `isLoading`: Loading state
- `login(email, password)`: Login function
- `signup(name, email, password)`: Signup function
- `logout()`: Logout function
- `refreshUser()`: Refresh user data

**Usage**:
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

### **3. Socket Context (`src/contexts/SocketContext.tsx`)**

**Purpose**: Real-time messaging with Socket.IO

**Provides**:
- `socket`: Socket.IO instance
- `isConnected`: Connection status
- `joinSwapRoom(swapId)`: Join a chat room
- `leaveSwapRoom(swapId)`: Leave a chat room
- `sendMessage(swapId, content)`: Send a message
- `sendTyping(swapId, isTyping)`: Send typing indicator
- `onMessage(callback)`: Listen for messages
- `onTyping(callback)`: Listen for typing events

**Usage**:
```typescript
import { useSocket } from '@/contexts/SocketContext';

function ChatComponent({ swapId }: { swapId: number }) {
  const { joinSwapRoom, sendMessage, onMessage, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (isConnected) {
      joinSwapRoom(swapId);
      
      const cleanup = onMessage((message) => {
        setMessages(prev => [...prev, message]);
      });

      return cleanup;
    }
  }, [swapId, isConnected]);

  const handleSend = (content: string) => {
    sendMessage(swapId, content);
  };

  // ... render UI
}
```

---

### **4. API Services (`src/services/`)**

**Purpose**: Organized API calls by domain

**Services**:
- `auth.service.ts`: Authentication operations
- `user.service.ts`: User CRUD operations
- `swap.service.ts`: Skill swap management
- `review.service.ts`: Review operations
- `match.service.ts`: AI matching and discovery
- `message.service.ts`: Message operations (REST fallback)

**Example**:
```typescript
import * as swapService from '@/services/swap.service';

// Create a swap
const newSwap = await swapService.createSwap({
  providerId: 123,
  skillOffered: "React",
  skillRequested: "Node.js",
  description: "Let's swap skills!"
});

// Accept a swap
await swapService.acceptSwap(swapId);
```

---

### **5. React Query Hooks (`src/hooks/useApi.ts`)**

**Purpose**: Type-safe, cached API operations with optimistic updates

**Features**:
- ✅ Automatic caching and refetching
- ✅ Optimistic updates
- ✅ Loading and error states
- ✅ Query invalidation
- ✅ Type safety

**Available Hooks**:

**Queries (Data Fetching)**:
- `useUser(userId)` - Get user by ID
- `useSwaps()` - Get all swaps
- `useSwap(swapId)` - Get swap by ID
- `useUserReviews(userId)` - Get user reviews
- `useMatches()` - Get AI matches
- `useDiscoverUsers(filters)` - Discover users
- `useMessages(swapId)` - Get swap messages

**Mutations (Data Modification)**:
- `useUpdateProfile()` - Update user profile
- `useCreateSwap()` - Create new swap
- `useUpdateSwap()` - Update swap status
- `useDeleteSwap()` - Delete swap
- `useAcceptSwap()` - Accept swap request
- `useRejectSwap()` - Reject swap request
- `useCompleteSwap()` - Complete swap
- `useCreateReview()` - Create review
- `useDeleteReview()` - Delete review

**Usage Examples**:

```typescript
// Query example
function SwapsList() {
  const { data: swaps, isLoading, error } = useSwaps();

  if (isLoading) return <Loader />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      {swaps?.map(swap => <SwapCard key={swap.id} swap={swap} />)}
    </div>
  );
}

// Mutation example
function CreateSwapButton({ providerId }: { providerId: number }) {
  const createSwap = useCreateSwap();

  const handleCreate = () => {
    createSwap.mutate({
      providerId,
      skillOffered: "React",
      skillRequested: "Node.js",
    });
  };

  return (
    <button 
      onClick={handleCreate} 
      disabled={createSwap.isPending}
    >
      {createSwap.isPending ? 'Creating...' : 'Create Swap'}
    </button>
  );
}
```

---

### **6. Protected Routes (`src/components/ProtectedRoute.tsx`)**

**Purpose**: Route guards for authentication

**Components**:
- `ProtectedRoute`: Requires authentication (redirects to /login)
- `PublicOnlyRoute`: Only for non-authenticated users (redirects to /dashboard)

**Usage in App.tsx**:
```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/login"
  element={
    <PublicOnlyRoute>
      <Login />
    </PublicOnlyRoute>
  }
/>
```

---

## 🔄 Complete Integration Flow

### **User Registration Flow**

```
1. User fills signup form → Signup.tsx
2. Form validation
3. useAuth().signup(name, email, password)
4. AuthContext → authService.signup()
5. API Client → POST /api/auth/signup
6. Backend creates user, returns JWT + user data
7. Token stored in localStorage
8. User data stored in React Context
9. Redirect to /dashboard
```

### **User Login Flow**

```
1. User fills login form → Login.tsx
2. Form validation
3. useAuth().login(email, password)
4. AuthContext → authService.login()
5. API Client → POST /api/auth/login
6. Backend validates, returns JWT + user data
7. Token stored in localStorage
8. User data stored in React Context
9. Redirect to intended page or /dashboard
```

### **Authenticated API Request Flow**

```
1. Component calls API hook → useSwaps()
2. React Query checks cache
3. If stale/missing → Service layer (swapService.getMySwaps())
4. API Client interceptor adds Authorization header
5. Request → GET /api/swaps
6. Backend validates JWT
7. Backend returns data
8. API Client returns response
9. React Query caches data
10. Component receives data
```

### **Real-time Chat Flow**

```
1. User opens chat for swap → Chat.tsx
2. useSocket().joinSwapRoom(swapId)
3. Socket.IO emits 'join' event
4. Backend validates JWT, adds user to room
5. User types message
6. useSocket().sendMessage(swapId, content)
7. Socket.IO emits 'message' event
8. Backend saves message, broadcasts to room
9. useSocket().onMessage() receives message
10. UI updates with new message
```

---

## 🛠️ Development Workflow

### **1. Start Backend**

```bash
cd backend
npm run dev
# Server runs on http://localhost:3000
```

### **2. Start Frontend**

```bash
cd skill-sync-ai-77
npm run dev
# Frontend runs on http://localhost:5173
```

### **3. Test Integration**

1. Open http://localhost:5173
2. Click "Join SkillSync" → Signup
3. Fill form and submit
4. Check Network tab → POST /api/auth/signup
5. Should redirect to /dashboard
6. Check localStorage → token should be stored
7. Navbar should show user avatar and name

---

## 🔐 Security Best Practices

### **Implemented Security Measures**:

1. **JWT Token Management**:
   - Stored in localStorage
   - Automatically attached to requests
   - Removed on logout/401 errors

2. **Request Interceptors**:
   - Add Authorization header automatically
   - Log requests in development only

3. **Response Interceptors**:
   - Handle 401 → Auto logout
   - Handle validation errors (422)
   - Global error notifications

4. **Protected Routes**:
   - Check authentication before rendering
   - Redirect unauthenticated users
   - Preserve intended destination

5. **CORS**:
   - Backend configured for frontend origin
   - Credentials included in requests

6. **Socket.IO Security**:
   - JWT authentication on connection
   - Room-based access control
   - Event validation

---

## 📊 State Management Strategy

### **Server State (React Query)**:
- User data
- Swaps, reviews, matches
- Messages history
- Automatic caching & refetching

### **Client State (React Context)**:
- Auth state (current user, isAuthenticated)
- Socket connection state
- Real-time messages

### **Local State (useState)**:
- Form inputs
- UI state (modals, dropdowns)
- Temporary data

---

## 🧪 Testing Integration

### **Test Backend API**:
```bash
cd backend
./test-api.sh
```

### **Manual Frontend Testing**:

1. **Authentication**:
   - [ ] Signup creates account
   - [ ] Login works with correct credentials
   - [ ] Login fails with wrong credentials
   - [ ] Logout clears session
   - [ ] Protected routes redirect when not authenticated
   - [ ] Token persists on page refresh

2. **API Calls**:
   - [ ] Create swap request
   - [ ] View my swaps
   - [ ] Accept/reject swap
   - [ ] Leave review
   - [ ] View AI matches
   - [ ] Discover users

3. **Real-time Chat**:
   - [ ] Connect to Socket.IO
   - [ ] Join chat room
   - [ ] Send message
   - [ ] Receive message
   - [ ] Typing indicators
   - [ ] Disconnect handling

---

## 🚨 Common Issues & Solutions

### **Issue: CORS errors**

**Solution**: 
- Backend CORS is configured for http://localhost:5173
- If using different port, update backend `.env`

### **Issue: 401 Unauthorized on API calls**

**Solution**:
- Check token in localStorage
- Check token expiry (7 days by default)
- Check Authorization header in Network tab
- Verify backend JWT_SECRET matches

### **Issue: Socket.IO not connecting**

**Solution**:
- Check VITE_WS_URL in .env.local
- Verify user is authenticated
- Check browser console for connection errors
- Verify backend Socket.IO is running

### **Issue: TypeScript errors**

**Solution**:
- Run `npm install` to ensure all types are installed
- Check `@types/node` is installed
- Restart TypeScript server in VS Code

---

## 📝 Code Examples

### **Example: Creating a Swap Request**

```typescript
import { useCreateSwap } from '@/hooks/useApi';
import { SwapStatus } from '@/types';

function CreateSwapModal({ providerId, onClose }: Props) {
  const [formData, setFormData] = useState({
    skillOffered: '',
    skillRequested: '',
    description: '',
  });

  const createSwap = useCreateSwap();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createSwap.mutateAsync({
        providerId,
        ...formData,
      });
      onClose();
    } catch (error) {
      // Error already handled by API client
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.skillOffered}
        onChange={(e) => setFormData({ ...formData, skillOffered: e.target.value })}
        placeholder="Skill you offer"
      />
      <input
        value={formData.skillRequested}
        onChange={(e) => setFormData({ ...formData, skillRequested: e.target.value })}
        placeholder="Skill you want"
      />
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Description"
      />
      <button type="submit" disabled={createSwap.isPending}>
        {createSwap.isPending ? 'Creating...' : 'Create Swap'}
      </button>
    </form>
  );
}
```

### **Example: Real-time Chat Component**

```typescript
import { useEffect, useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useMessages } from '@/hooks/useApi';
import { Message } from '@/types';

function SwapChat({ swapId }: { swapId: number }) {
  const { data: initialMessages } = useMessages(swapId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  
  const { 
    isConnected, 
    joinSwapRoom, 
    leaveSwapRoom, 
    sendMessage, 
    onMessage,
    sendTyping 
  } = useSocket();

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (isConnected) {
      joinSwapRoom(swapId);

      const cleanup = onMessage((message) => {
        setMessages(prev => [...prev, message]);
      });

      return () => {
        leaveSwapRoom(swapId);
        cleanup?.();
      };
    }
  }, [swapId, isConnected]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(swapId, input);
      setInput('');
    }
  };

  const handleTyping = () => {
    sendTyping(swapId, true);
    // Debounce logic here
  };

  return (
    <div>
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id}>{msg.content}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          handleTyping();
        }}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
```

---

## 🎯 Next Steps

1. **Install Dependencies**: Run `npm install axios socket.io-client`
2. **Configure Environment**: Copy `.env.example` to `.env.local`
3. **Start Backend**: `cd backend && npm run dev`
4. **Start Frontend**: `npm run dev`
5. **Test Integration**: Try signup, login, and creating a swap
6. **Build Features**: Use the hooks and services to build your pages

---

## 📚 Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/)
- [Socket.IO Client Documentation](https://socket.io/docs/v4/client-api/)
- [React Context API](https://react.dev/reference/react/useContext)

---

**Created**: November 2025  
**Last Updated**: November 2025  
**Version**: 1.0.0
