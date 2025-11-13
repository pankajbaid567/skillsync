# Access Token & Protected Routes Guide

## Where Access Tokens Are Required

Access tokens are required for ALL protected (authenticated) routes. Here's the complete list:

### 🔐 Authentication Routes (`/api/auth/...`)
- ✅ `GET /api/auth/me` - Get current user profile (REQUIRES TOKEN)
- ✅ `POST /api/auth/logout` - Logout user (REQUIRES TOKEN)
- ❌ `POST /api/auth/login` - Login (NO TOKEN NEEDED)
- ❌ `POST /api/auth/signup` - Signup (NO TOKEN NEEDED)
- ❌ `POST /api/auth/refresh` - Refresh token (NO TOKEN NEEDED - uses refresh token in body)
- ❌ `POST /api/auth/verify` - Verify token (NO TOKEN NEEDED)

### 👤 User Routes (`/api/users/...`)
- ✅ `GET /api/users/me` - Get my profile (REQUIRES TOKEN)
- ✅ `PUT /api/users/me` - Update my profile (REQUIRES TOKEN)
- ✅ `GET /api/users/:id` - Get user by ID (REQUIRES TOKEN)
- ✅ `GET /api/users` - Search users (REQUIRES TOKEN)

### 🔄 Swap Routes (`/api/swaps/...`)
All swap routes require authentication:
- ✅ `POST /api/swaps` - Create swap request (REQUIRES TOKEN)
- ✅ `GET /api/swaps` - Get my swaps (REQUIRES TOKEN)
- ✅ `GET /api/swaps/:id` - Get swap by ID (REQUIRES TOKEN)
- ✅ `PUT /api/swaps/:id` - Update swap status (REQUIRES TOKEN)
- ✅ `DELETE /api/swaps/:id` - Delete swap (REQUIRES TOKEN)

### ⭐ Review Routes (`/api/reviews/...`)
- ✅ `POST /api/reviews` - Create review (REQUIRES TOKEN)
- ✅ `GET /api/reviews/user/:userId` - Get user reviews (REQUIRES TOKEN)

### 🤖 Match Routes (`/api/match/...`)
- ✅ `GET /api/match/me` - Get my AI matches (REQUIRES TOKEN)
- ⚠️ `POST /api/match` - Get matches (OPTIONAL TOKEN - works with or without)

### 🔍 Discover Routes (`/api/discover/...`)
- ✅ All discover routes (REQUIRES TOKEN)

---

## How Token Refresh Works

### Your Current Setup:
```env
ACCESS_TOKEN_EXPIRY=30s  # Token expires after 30 seconds
REFRESH_TOKEN_EXPIRY=30d # Refresh token valid for 30 days
```

### When Does Refresh Happen?

**The refresh ONLY happens when:**
1. Your access token **expires** (after 30 seconds in your case)
2. You make an API call to a **protected endpoint**
3. The backend returns a **401 Unauthorized** error
4. The frontend **automatically** calls `/api/auth/refresh`

### Why You Might Not See It:

#### Scenario 1: Not Making Protected API Calls
If you're just sitting on a page without making any API requests, the refresh won't happen because:
- No API call = No 401 error = No refresh trigger
- The token expires silently in localStorage

**To see the refresh:**
1. Login to the app
2. Wait 35 seconds (let token expire)
3. Navigate to `/profile` or `/discover` (protected pages)
4. Open Network tab
5. You should see:
   - First request fails with 401
   - `/api/auth/refresh` is called automatically
   - Original request is retried with new token

#### Scenario 2: Frontend Not Calling Protected Routes
If the frontend pages (Dashboard, Profile, etc.) aren't fetching data yet, you won't see API calls.

**Check these pages:**
- `/profile` - Should call `GET /api/auth/me` or `GET /api/users/me`
- `/discover` - Should call discover endpoints
- `/` (home after login) - May not call any protected APIs

#### Scenario 3: Token Stored But Not Used
If you're logged in but the token isn't being attached to requests.

---

## How to Test Token Refresh (Step by Step)

### Test 1: Verify Token Expiry (30 seconds)

1. **Login to the app**
   ```
   Open: https://skillsync-green.vercel.app/login
   Login with your credentials
   ```

2. **Open Browser DevTools**
   - Press F12
   - Go to "Network" tab
   - Filter by "Fetch/XHR"

3. **Check localStorage**
   - Go to "Application" or "Storage" tab
   - Look at localStorage
   - You should see:
     - `skillsync_token` (access token)
     - `skillsync_refresh_token` (refresh token)

4. **Navigate to Profile Page**
   ```
   Go to: /profile
   ```
   - Should see API call to `/api/auth/me` or `/api/users/me`
   - Should succeed (200 OK)

5. **Wait 35 seconds**
   - Access token expires after 30 seconds
   - Wait a bit more to be sure

6. **Refresh the Profile Page or Navigate Away and Back**
   - In Network tab, you should see:
     1. Request to `/api/auth/me` → **401 Unauthorized**
     2. Automatic request to `/api/auth/refresh` → **200 OK**
     3. Retry of `/api/auth/me` → **200 OK** (with new token)

### Test 2: Manual API Call After Expiry

1. Login and wait 35 seconds
2. Open Browser Console
3. Run this code:
   ```javascript
   fetch('https://skillsync-production-f827.up.railway.app/api/auth/me', {
     headers: {
       'Authorization': `Bearer ${localStorage.getItem('skillsync_token')}`
     }
   }).then(r => r.json()).then(console.log)
   ```
4. First call should fail with 401
5. Frontend should auto-refresh and retry

### Test 3: Check if Protected Pages Are Fetching Data

Open these pages and check Network tab:

1. **Profile Page (`/profile`)**
   - Should call: `GET /api/auth/me`
   - Status: 200 OK

2. **Dashboard Page (`/` after login)**
   - Should call: `GET /api/swaps` (for active swaps)
   - Should call: `GET /api/match/me` (for AI matches)
   - Status: 200 OK for both

3. **Discover Page (`/discover`)**
   - Should call: `GET /api/discover` or similar
   - Status: 200 OK

---

## Production vs Testing Setup

### For Testing (Current):
```env
ACCESS_TOKEN_EXPIRY=30s   # See refresh happen quickly
REFRESH_TOKEN_EXPIRY=30d
```

### For Production (Recommended):
```env
ACCESS_TOKEN_EXPIRY=7d    # User stays logged in for a week
REFRESH_TOKEN_EXPIRY=30d  # Can refresh for 30 days
```

---

## Troubleshooting

### Issue: Not Seeing Any API Calls

**Cause:** Frontend pages might not be fetching data yet.

**Solution:** Check if Dashboard and Profile pages are actually calling the backend:

1. Open Network tab
2. Navigate to `/profile`
3. Look for:
   - `GET /api/auth/me`
   - `GET /api/users/me`
   - Any API calls to your Railway backend

If no calls are made, the pages aren't fetching data yet.

### Issue: Refresh Token Not Working

**Symptoms:**
- User gets logged out after 30 seconds
- No `/api/auth/refresh` call in Network tab
- Redirect to login page

**Possible Causes:**
1. Refresh token not stored in localStorage
2. API client not catching 401 errors
3. Refresh endpoint not working

**Debug Steps:**
```javascript
// Check tokens in console
console.log('Access Token:', localStorage.getItem('skillsync_token'))
console.log('Refresh Token:', localStorage.getItem('skillsync_refresh_token'))
```

### Issue: Token Refresh Happens But Still Get 401

**Cause:** New token not being used for retry

**Check:** Look at the retried request headers in Network tab:
- Should have: `Authorization: Bearer <new-token>`

---

## Code References

### Frontend Auto-Refresh Logic
Location: `skill-sync-ai/src/lib/api-client.ts`

The interceptor that handles 401 errors and triggers refresh:
```typescript
// When 401 error occurs
case 401:
  // Try to refresh the token
  const newToken = await refreshAccessToken();
  // Retry original request with new token
  return apiClient(originalRequest);
```

### Backend Refresh Endpoint
Location: `backend/src/controllers/auth.controller.js`

```javascript
// POST /api/auth/refresh
refresh: asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const { accessToken } = await authService.refreshAccessToken(refreshToken);
  // Returns new access token
})
```

---

## Quick Summary

**Access tokens are required for:**
- ✅ All `/api/users/*` routes
- ✅ All `/api/swaps/*` routes  
- ✅ All `/api/reviews/*` routes
- ✅ Most `/api/auth/*` routes (except login, signup, refresh)
- ✅ `/api/match/me`
- ✅ All discover routes

**Refresh happens when:**
1. Token expires (30s in your test setup)
2. You make an API call to a protected route
3. Backend returns 401
4. Frontend auto-calls `/api/auth/refresh`

**To see it in action:**
1. Login
2. Wait 35 seconds
3. Navigate to `/profile` or any protected page
4. Watch Network tab for the refresh flow
