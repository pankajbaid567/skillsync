#!/bin/bash

BASE_URL="http://localhost:4000/api"
EMAIL="test_user_$(date +%s)@example.com"
PASSWORD="password123"
NAME="Test User"

echo "Testing API at $BASE_URL"
echo "Email: $EMAIL"

# 1. Signup
echo -e "\n1. Signup..."
SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\", \"name\": \"$NAME\"}")

echo "Signup Response: $SIGNUP_RESPONSE"

# Extract Token (using grep/sed as jq might not be available, but assuming simple json structure)
# If signup failed (e.g. user exists), try login
if [[ $SIGNUP_RESPONSE != *"success\":true"* ]]; then
    echo "Signup failed or user exists. Trying login..."
fi

# 2. Login
echo -e "\n2. Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

echo "Login Response: $LOGIN_RESPONSE"

# Extract Token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "Failed to get token."
    exit 1
fi

echo "Token: $TOKEN"

# 3. Get Profile
echo -e "\n3. Get Profile..."
PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN")

echo "Profile Response: $PROFILE_RESPONSE"

# 4. Create Swap Request
# We need a receiver ID. For testing, we might need another user.
# But let's try to create a swap with a dummy ID (might fail if foreign key constraint)
# Or we can just list swaps which should be empty.

echo -e "\n4. Get Swaps..."
SWAPS_RESPONSE=$(curl -s -X GET "$BASE_URL/swaps" \
  -H "Authorization: Bearer $TOKEN")

echo "Swaps Response: $SWAPS_RESPONSE"

echo -e "\nDone."
