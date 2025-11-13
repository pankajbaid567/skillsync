# Token System Implementation

## Overview
The SkillSync application now uses a dual-token authentication system with:
- **Access Token**: Short-lived (7 days) - used for API requests
- **Refresh Token**: Long-lived (30 days) - used to obtain new access tokens

## Token Expiry Configuration

### Backend Environment Variables
Add these to your Railway environment variables:

```bash
ACCESS_TOKEN_EXPIRY=7d
REFRESH_TOKEN_EXPIRY=30d
```

### How It Works

1. **Login/Signup**: User receives both access token and refresh token
2. **API Requests**: Access token is sent with every request
3. **Token Expiry**: When access token expires (401 error):
   - Frontend automatically calls `/auth/refresh` with refresh token
   - New access token is issued
   - Original request is retried with new token
4. **Refresh Token Expiry**: When refresh token expires:
   - User is logged out
   - Redirected to login page

## New API Endpoints

### POST /api/auth/refresh
Exchange a refresh token for a new access token.

**Request:**
```json
{
  "refreshToken": "your-refresh-token-here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new-access-token",
    "token": "new-access-token"
  },
  "message": "Access token refreshed successfully"
}
```

### POST /api/auth/logout
Invalidate the refresh token (requires authentication).

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Updated Response Structure

### Login Response
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token",
    "token": "jwt-access-token",  // For backward compatibility
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "User Name",
      ...
    }
  },
  "message": "Welcome back, User Name!"
}
```

### Signup Response
Same structure as login response.

## Frontend Changes

### Token Storage
- Access token: `localStorage.getItem('skillsync_token')`
- Refresh token: `localStorage.getItem('skillsync_refresh_token')`

### Automatic Token Refresh
The frontend API client (`api-client.ts`) automatically:
1. Detects 401 errors (expired access token)
2. Calls `/auth/refresh` with refresh token
3. Updates access token in localStorage
4. Retries the failed request
5. Queues multiple failed requests during refresh

### Error Handling
- If refresh token is invalid/expired: User is logged out and redirected to login
- If refresh endpoint fails: Session is cleared

## Database Changes

### User Model
Added `refreshToken` field to store the current valid refresh token:

```prisma
model User {
  id             Int         @id @default(autoincrement())
  email          String      @unique
  passwordHash   String
  name           String
  bio            String?
  avatarUrl      String?
  skillsOffered  String[]
  skillsWanted   String[]
  rating         Float       @default(0)
  isVerified     Boolean     @default(false)
  refreshToken   String?     // NEW FIELD
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
  
  // Relations...
}
```

### Migration
A Prisma migration has been created and applied:
- Migration name: `20251113052752_add_refresh_token`
- Adds nullable `refreshToken` column to `users` table

## Deployment Steps

### Railway (Backend)

1. Go to your Railway project
2. Navigate to Variables tab
3. Add new environment variables:
   ```
   ACCESS_TOKEN_EXPIRY=7d
   REFRESH_TOKEN_EXPIRY=30d
   ```
4. Redeploy the service (will happen automatically after git push)

### Vercel (Frontend)
No changes needed - frontend will automatically work with the new token system.

## Testing

### Test Access Token Refresh
1. Login to the application
2. Wait for access token to expire (or manually expire it in backend .env for testing: `ACCESS_TOKEN_EXPIRY=10s`)
3. Make an API request (e.g., navigate to Dashboard)
4. Frontend should automatically refresh the token and request should succeed

### Test Refresh Token Expiry
1. Login to the application
2. Wait for refresh token to expire (or manually expire: `REFRESH_TOKEN_EXPIRY=30s`)
3. Make an API request after refresh token expires
4. User should be logged out and redirected to login page

### Test Logout
1. Login to the application
2. Click logout
3. Check that both tokens are cleared from localStorage
4. Verify refresh token is cleared from database
5. Try to use old refresh token - should fail

## Security Improvements

1. **Refresh tokens stored in database**: Can be revoked server-side
2. **Logout invalidates refresh token**: Prevents reuse after logout
3. **Shorter access token expiry**: Reduces window of vulnerability if token is stolen
4. **Automatic token rotation**: Fresh access tokens issued regularly
5. **Queue management**: Prevents multiple simultaneous refresh requests

## Backward Compatibility

The `token` field is included in responses alongside `accessToken` for backward compatibility with older clients. Both contain the same access token value.

## Troubleshooting

### Issue: "Session expired" immediately after login
- Check that ACCESS_TOKEN_EXPIRY and REFRESH_TOKEN_EXPIRY are properly set in Railway
- Verify JWT_SECRET is the same in all environments
- Check browser console for any token storage errors

### Issue: Token refresh fails with 401
- Refresh token may have expired
- Refresh token in database may not match sent token
- Check that `/auth/refresh` endpoint is accessible

### Issue: User logged out unexpectedly
- Check if refresh token expired
- Verify backend is properly handling refresh token validation
- Check for any database connection issues

## Next Steps

Consider implementing:
1. **Token rotation**: Issue new refresh token on each access token refresh
2. **Device tracking**: Store refresh tokens per device
3. **Revoke all sessions**: Endpoint to invalidate all refresh tokens for a user
4. **Remember me**: Longer refresh token expiry for "remember me" option
