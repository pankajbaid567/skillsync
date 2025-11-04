# Quick Start Guide

## Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 13
- npm or yarn

## Installation (Method 1: Manual)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database URL and JWT secret.

3. **Setup database**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

## Installation (Method 2: Setup Script)

```bash
chmod +x setup.sh
./setup.sh
```

Then update `.env` and run:
```bash
npm run dev
```

## Installation (Method 3: Docker)

```bash
docker-compose up --build
```

## Testing the API

### Health Check
```bash
curl http://localhost:4000/health
```

### Register a User
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "skillsOffered": ["React", "Node.js"],
    "skillsWanted": ["Python"]
  }'
```

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Folder Structure

```
backend/
├── src/
│   ├── controllers/       # Request handlers
│   ├── services/          # Business logic
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── prisma/            # Prisma client
│   ├── utils/             # Utility functions
│   └── index.js           # Entry point
├── tests/                 # Test files
├── prisma/
│   └── schema.prisma      # Database schema
├── .env                   # Environment variables
├── .env.example           # Environment template
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose setup
└── package.json           # Dependencies
```

## Common Issues

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Verify database exists

### Port Already in Use
- Change PORT in `.env`
- Kill process using the port: `lsof -ti:4000 | xargs kill -9`

### Prisma Errors
- Run `npx prisma generate`
- Delete `node_modules/.prisma` and regenerate

## Next Steps

1. ✅ Setup complete
2. 📖 Read API_DOCS.md for endpoint documentation
3. 🧪 Run tests: `npm test`
4. 🎨 Connect frontend (see README.md)
5. 🚀 Deploy to production

## Support

For issues or questions, check:
- README.md
- API_DOCS.md
- Prisma documentation: https://www.prisma.io/docs
