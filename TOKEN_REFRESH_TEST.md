# Token Refresh Testing - Quick Checklist

## ⚙️ Current Configuration
```env
ACCESS_TOKEN_EXPIRY=30s   ✅ SET FOR TESTING
REFRESH_TOKEN_EXPIRY=30d
```

## 🧪 Step-by-Step Testing Guide

### Test 1: Basic Token Refresh (Recommended First Test)

1. **Open the app in your browser**
   ```
   URL: http://localhost:5173 (or your local frontend URL)
   ```

2. **Open Browser DevTools**
   - Press `F12` or `Cmd+Option+I` (Mac)
   - Go to **"Network"** tab
   - Check **"Preserve log"** checkbox
   - Filter by **"Fetch/XHR"**

3. **Login to the app**
   - Email: pankajbaid567@gmail.com (or your test account)
   - You should see:
     ```
     POST /api/auth/login → 200 OK
     Response includes: accessToken, refreshToken
     ```

4. **Verify tokens in localStorage**
   - Go to **"Application"** or **"Storage"** tab
   - Look at **"Local Storage"**
   - Should see:
     ```
     skillsync_token: eyJhbGciOiJIUz... (access token)
     skillsync_refresh_token: eyJhbGciOiJIUz... (refresh token)
     ```

5. **Navigate to a protected page**
   - Click on **"Profile"** or stay on home (Dashboard)
   - You should see API calls in Network tab:
     ```
     GET /api/auth/me → 200 OK
     GET /api/swaps → 200 OK
     GET /api/match/me → 200 OK
     ```

6. **⏰ Wait 35 seconds**
   - Start a timer
   - Keep Network tab open
   - **Access token will expire after 30 seconds**

7. **Trigger a refresh by navigating**
   - Click "Profile" or "Discover"
   - OR just refresh the page (F5)
   
8. **🎯 Watch the Network Tab - You Should See:**
   ```
   1. GET /api/auth/me → 401 Unauthorized (token expired!)
   2. POST /api/auth/refresh → 200 OK (auto-refresh triggered!)
   3. GET /api/auth/me → 200 OK (retry with new token!)
   ```

✅ **SUCCESS!** If you see this flow, token refresh is working!

---

### Test 2: Console Verification

After step 7 above, open **Console** tab and run:

```javascript
// Check if new token was stored
console.log('Access Token:', localStorage.getItem('skillsync_token'));
console.log('Refresh Token:', localStorage.getItem('skillsync_refresh_token'));

// Both should exist and refresh token should be the same
// Access token should be NEW (different from before)
```

---

### Test 3: Manual API Call Test

1. **Login and wait 35 seconds**
2. **Open Console** and run:

```javascript
// This should trigger the refresh
fetch('http://localhost:4000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('skillsync_token')}`
  }
})
.then(r => r.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

3. **Check Network tab** - should see the refresh flow

---

### Test 4: Multiple Simultaneous Requests (Advanced)

This tests that the queue management works (no multiple refresh calls):

1. **Login and wait 35 seconds**
2. **Open Console** and run:

```javascript
// Make 3 API calls at the same time
Promise.all([
  fetch('http://localhost:4000/api/auth/me', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('skillsync_token')}` }
  }),
  fetch('http://localhost:4000/api/swaps', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('skillsync_token')}` }
  }),
  fetch('http://localhost:4000/api/match/me', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('skillsync_token')}` }
  })
])
.then(responses => Promise.all(responses.map(r => r.json())))
.then(data => console.log('All responses:', data));
```

3. **Check Network tab** - Should see:
   - All 3 requests fail with 401
   - **Only 1 call** to `/api/auth/refresh`
   - All 3 requests retry and succeed

✅ Queue management working!

---

## ❌ Troubleshooting

### Issue: Not seeing any API calls

**Problem:** Frontend pages aren't fetching data

**Solution:** Make sure you're on these pages:
- ✅ Profile page (`/profile`) - calls `/api/auth/me`
- ✅ Home after login (`/`) - calls `/api/swaps`, `/api/match/me`
- ❌ Landing page (before login) - no API calls

### Issue: Getting logged out instead of refresh

**Symptoms:**
- Redirected to login page after 30 seconds
- No `/api/auth/refresh` call in Network tab

**Possible causes:**
1. **Refresh token not stored**
   ```javascript
   // Check in console
   console.log(localStorage.getItem('skillsync_refresh_token'))
   // Should NOT be null
   ```

2. **Refresh endpoint returning error**
   - Check Network tab for `/api/auth/refresh`
   - Look at response - should be 200, not 401/500

3. **Backend not running**
   - Make sure Railway backend is deployed
   - Or local backend is running on port 4000

### Issue: Seeing refresh call but still getting 401

**Problem:** New token not being used in retry

**Debug:**
1. Click on the **retried request** in Network tab
2. Check **Headers** → **Request Headers**
3. Look for: `Authorization: Bearer <token>`
4. Token should be **different** from the first failed request

### Issue: Multiple refresh calls (not queueing)

**Problem:** Queue management not working

**Check:**
- Look for multiple `/api/auth/refresh` calls
- Should only be **ONE** even if multiple requests fail

---

## 📊 Expected Network Tab Flow

### Normal Flow (Token Valid):
```
GET /api/auth/me → 200 OK
GET /api/swaps → 200 OK
GET /api/match/me → 200 OK
```

### After Token Expires (30+ seconds):
```
1. GET /api/auth/me → 401 Unauthorized
   ↓
2. POST /api/auth/refresh → 200 OK
   ↓
3. GET /api/auth/me → 200 OK (RETRY)
```

### Multiple Requests Expired:
```
1. GET /api/auth/me → 401
2. GET /api/swaps → 401
3. GET /api/match/me → 401
   ↓
4. POST /api/auth/refresh → 200 OK (ONLY ONE!)
   ↓
5. GET /api/auth/me → 200 OK (RETRY)
6. GET /api/swaps → 200 OK (RETRY)
7. GET /api/match/me → 200 OK (RETRY)
```

---

## ✅ After Testing Successfully

Once you've confirmed token refresh works with 30s:

### Update for Production:

1. **Local .env** (backend/.env):
   ```env
   ACCESS_TOKEN_EXPIRY=7d    # Change from 30s
   REFRESH_TOKEN_EXPIRY=30d
   ```

2. **Railway Environment Variables**:
   - Go to Railway dashboard
   - Update: `ACCESS_TOKEN_EXPIRY=7d`
   - Redeploy

3. **Commit the change**:
   ```bash
   git add backend/.env
   git commit -m "Change ACCESS_TOKEN_EXPIRY back to 7d for production"
   git push origin main
   ```

---

## 🎯 Success Criteria

✅ Login shows both tokens in localStorage
✅ Protected pages make API calls successfully  
✅ After 30+ seconds, token expires
✅ Navigation triggers automatic refresh
✅ Network tab shows: 401 → refresh → retry → 200
✅ New access token stored in localStorage
✅ App continues working without re-login

If all above pass: **Token refresh system is working! 🎉**

---

## 📝 Notes

- **30s is for TESTING ONLY** - Change to 7d for production
- Users will only see refresh after 7 days in production
- Refresh is completely invisible to users
- No interruption in their experience
- Just keeps them logged in longer!
