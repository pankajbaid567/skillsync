# Manual Installation Instructions

Since npm isn't available in your current terminal PATH, follow these instructions to install dependencies.

## Option 1: Use a Terminal with Node.js (Recommended)

### **VS Code Integrated Terminal**
1. Open VS Code
2. Open the frontend folder: `skill-sync-ai-77`
3. Open integrated terminal (Terminal → New Terminal)
4. Run:
   ```bash
   npm install
   npm install axios socket.io-client
   npm run dev
   ```

### **New Terminal Session**
1. Open a fresh terminal window
2. Navigate to project:
   ```bash
   cd /Users/pankajbaid/PBJ/skillsync/skill-sync-ai-77
   npm install
   npm install axios socket.io-client
   ```

## Option 2: Add Node.js to PATH

### **Find Node Installation**
```bash
# Check if node is installed anywhere
which -a node
# Or
find /usr/local -name node 2>/dev/null
find ~/Library -name node 2>/dev/null
```

### **Temporary PATH Fix**
```bash
# If you have nvm
export PATH="$HOME/.nvm/versions/node/v18.x.x/bin:$PATH"

# If installed via Homebrew
export PATH="/usr/local/bin:$PATH"

# If using system Node
export PATH="/usr/local/bin:/usr/bin:$PATH"

# Test
node --version
npm --version
```

### **Permanent PATH Fix**
Add to `~/.zshrc`:
```bash
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## Option 3: Install Node.js

If Node.js isn't installed:

### **Using Homebrew (Recommended)**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node
```

### **Using nvm (Node Version Manager)**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc
nvm install 18
nvm use 18
```

### **Direct Download**
Visit https://nodejs.org/ and download the macOS installer.

## Required Dependencies

After you have npm working, install:

```bash
cd /Users/pankajbaid/PBJ/skillsync/skill-sync-ai-77

# Core dependencies (already in package.json)
npm install

# Additional dependencies for backend integration
npm install axios socket.io-client
```

## Verify Installation

```bash
# Check versions
node --version  # Should be 18.x or higher
npm --version   # Should be 9.x or higher

# Check installed packages
npm list axios
npm list socket.io-client
```

## Manual package.json Update

If you need to manually add dependencies to `package.json`:

```json
{
  "dependencies": {
    // ... existing dependencies ...
    "axios": "^1.6.0",
    "socket.io-client": "^4.6.2"
  }
}
```

Then run: `npm install`

## Alternative: Use Yarn or Bun

### **Yarn**
```bash
# Install yarn globally
npm install -g yarn

# Use yarn instead
yarn install
yarn add axios socket.io-client
yarn dev
```

### **Bun** (if available)
```bash
bun install
bun add axios socket.io-client
bun run dev
```

## What You Need

### **Frontend Dependencies**
- ✅ All existing dependencies in package.json
- ✅ `axios@^1.6.0` - HTTP client
- ✅ `socket.io-client@^4.6.2` - Real-time messaging

### **Backend Dependencies** (already installed)
- ✅ Express.js
- ✅ Prisma
- ✅ Socket.IO server
- ✅ JWT, bcrypt, etc.

## After Installation

1. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local if needed
   ```

2. **Start backend**
   ```bash
   cd ../backend
   npm run dev
   ```

3. **Start frontend**
   ```bash
   npm run dev
   ```

4. **Open browser**
   - Visit http://localhost:5173
   - Test signup/login

## Troubleshooting

### **Error: EACCES permission denied**
```bash
sudo chown -R $(whoami) ~/.npm
```

### **Error: Cannot find module**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **Error: Port already in use**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

## Quick Test

Once installed, test the integration:

```bash
# Terminal 1 - Backend
cd /Users/pankajbaid/PBJ/skillsync/backend
npm run dev

# Terminal 2 - Frontend
cd /Users/pankajbaid/PBJ/skillsync/skill-sync-ai-77  
npm run dev

# Terminal 3 - Test
curl http://localhost:3000/api/health
curl http://localhost:5173
```

## Success Checklist

- [ ] Node.js and npm are in PATH
- [ ] `npm install` completes successfully
- [ ] `axios` and `socket.io-client` are installed
- [ ] Backend starts on port 3000
- [ ] Frontend starts on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can signup/login successfully

## Need Help?

1. **Check Node.js**: `which node` or `node --version`
2. **Check PATH**: `echo $PATH`
3. **Use VS Code terminal**: Often has correct PATH
4. **Install Node.js**: Use Homebrew or download from nodejs.org

---

**Note**: All the code files are already created. You just need to install the dependencies!
