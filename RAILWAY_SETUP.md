# Railway Environment Variables Setup

## Required Actions

Your code has been deployed to Railway, but you need to add the following environment variables:

### Add These Variables in Railway Dashboard:

1. Go to: https://railway.app/
2. Select your SkillSync project
3. Click on your backend service
4. Go to the "Variables" tab
5. Add the following variables:

```
ACCESS_TOKEN_EXPIRY=7d
REFRESH_TOKEN_EXPIRY=30d
```

### Existing Variables (Make sure these are still set):
```
DATABASE_URL=<your-neon-postgresql-url>
JWT_SECRET=<your-jwt-secret>
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://skillsync-green.vercel.app
```

## After Adding Variables

1. Railway will automatically redeploy
2. Wait for deployment to complete (usually 2-3 minutes)
3. Test the application at: https://skillsync-green.vercel.app

## What Changed

✅ **Backend:**
- Access tokens now expire after 7 days
- Refresh tokens expire after 30 days
- New `/auth/refresh` endpoint for token renewal
- New `/auth/logout` endpoint to invalidate tokens
- Refresh tokens stored in database for security

✅ **Frontend:**
- Automatically refreshes access tokens when they expire
- Stores both access and refresh tokens
- Seamless user experience - no need to re-login for 30 days
- Proper logout that clears all tokens

✅ **Database:**
- New `refreshToken` field in `users` table (migration already applied)

## Testing After Deployment

1. **Login**: Should receive both accessToken and refreshToken
2. **Navigate app**: Should work normally
3. **Token refresh**: When access token expires (after 7 days), it will auto-refresh
4. **Logout**: Should clear both tokens and require re-login

## Optional: Test Token Expiry Locally

To test token refresh locally, temporarily set short expiry:

```bash
# In backend/.env (for testing only)
ACCESS_TOKEN_EXPIRY=1m
REFRESH_TOKEN_EXPIRY=5m
```

Then:
1. Login
2. Wait 1 minute
3. Try to access dashboard
4. Should auto-refresh and work seamlessly
5. Wait 5 minutes
6. Try to access dashboard
7. Should logout and redirect to login

**Remember to change back to 7d/30d after testing!**
