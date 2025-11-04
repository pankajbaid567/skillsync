Perfect ✅ — going pure **Express (JavaScript)** is a solid call for speed and early MVP work.
Below is the **updated Copilot prompt** rewritten *step-by-step* for a **JavaScript Express backend** (no TypeScript). It’s optimized for **SkillSync**, with **Prisma + PostgreSQL**, **JWT Auth**, **Socket.io chat**, and **AI match stubs** — all ready to connect to your React frontend.

---

# 🧠 Prompt for GitHub Copilot

**Goal:** Build and connect a production-ready **Express.js (JavaScript)** backend for **SkillSync**, step by step.

---

## ⚙️ 0. Project Overview

**Prompt to paste first:**

> Build a scalable Express.js backend for a platform called **SkillSync** where users can exchange skills (like bartering knowledge). Stack:
>
> * **Backend:** Express.js (JavaScript, ES modules)
> * **Database:** PostgreSQL with Prisma ORM
> * **Auth:** JWT + bcrypt
> * **Realtime:** Socket.io for chat between matched users
> * **AI:** Placeholder endpoint for AI-based skill matching
> * **Extras:** Helmet, CORS, dotenv, validation, ESLint/Prettier, Jest/Supertest for tests
>
> Create a clean modular folder structure:
>
> ```
> /src
>   /controllers
>   /routes
>   /services
>   /middleware
>   /prisma
>   /models
>   /utils
> tests/
> ```
>
> Expose REST APIs, use environment variables, handle errors cleanly, and follow production-grade patterns.

---

## 🧱 1. Setup Project Scaffold

**Prompt:**

> Initialize a new Express.js project (ESM, `"type": "module"` in package.json`).
> Include dependencies:
>
> ```
> express, prisma, @prisma/client, dotenv, cors, helmet, bcrypt, jsonwebtoken, socket.io, pino, zod
> ```
>
> Dev dependencies:
>
> ```
> nodemon, eslint, prettier, jest, supertest
> ```
>
> Scripts:
>
> * `"dev": "nodemon src/index.js"`
> * `"start": "node src/index.js"`
> * `"lint": "eslint ."`
> * `"test": "jest"`
>
> Create:
>
> * `src/index.js` — entry point (express, dotenv, helmet, cors)
> * `src/routes/index.js` — combine all routes
> * `src/prisma/client.js` — export Prisma client
> * `.env.example` — show `PORT`, `DATABASE_URL`, `JWT_SECRET`

---

## 🧩 2. Prisma Schema

**Prompt:**

> Create `prisma/schema.prisma` for PostgreSQL with the following models:
>
> ```prisma
> model User {
>   id             Int      @id @default(autoincrement())
>   email          String   @unique
>   passwordHash   String
>   name           String
>   bio            String?
>   avatarUrl      String?
>   skillsOffered  String[]
>   skillsWanted   String[]
>   rating         Float    @default(0)
>   isVerified     Boolean  @default(false)
>   createdAt      DateTime @default(now())
>   updatedAt      DateTime @updatedAt
>   swapsRequested SkillSwap[] @relation("RequestedSwaps")
>   swapsReceived  SkillSwap[] @relation("ReceivedSwaps")
>   reviewsGiven   Review[]    @relation("GivenReviews")
>   reviewsGot     Review[]    @relation("GotReviews")
>   messages       Message[]
> }
>
> model SkillSwap {
>   id             Int      @id @default(autoincrement())
>   requester      User     @relation("RequestedSwaps", fields: [requesterId], references: [id])
>   requesterId    Int
>   receiver       User     @relation("ReceivedSwaps", fields: [receiverId], references: [id])
>   receiverId     Int
>   skillOffered   String
>   skillRequested String
>   status         String   @default("PENDING")
>   createdAt      DateTime @default(now())
>   updatedAt      DateTime @updatedAt
>   messages       Message[]
>   reviews        Review[]
> }
>
> model Review {
>   id              Int      @id @default(autoincrement())
>   reviewer        User     @relation("GivenReviews", fields: [reviewerId], references: [id])
>   reviewerId      Int
>   reviewedUser    User     @relation("GotReviews", fields: [reviewedUserId], references: [id])
>   reviewedUserId  Int
>   swap            SkillSwap @relation(fields: [swapId], references: [id])
>   swapId          Int
>   rating          Int
>   comment         String?
>   createdAt       DateTime  @default(now())
> }
>
> model Message {
>   id        Int      @id @default(autoincrement())
>   swap      SkillSwap @relation(fields: [swapId], references: [id])
>   swapId    Int
>   sender    User     @relation(fields: [senderId], references: [id])
>   senderId  Int
>   content   String
>   createdAt DateTime @default(now())
> }
> ```
>
> Then run:
>
> ```
> npx prisma generate
> npx prisma migrate dev --name init
> ```

---

## 🔐 3. Auth (Signup / Login)

**Prompt:**

> Create `auth.routes.js`, `auth.controller.js`, and `auth.service.js`.
> Implement:
>
> * `POST /api/auth/signup` — register user (hash password)
> * `POST /api/auth/login` — verify password, return JWT
>
> JWT payload: `{ id, email }`
> Token expiry: 7 days
> Middleware: `authMiddleware.js` that validates JWT and sets `req.user`
> Return format:
>
> ```js
> { success: true, data: { token, user } }
> ```

---

## 👤 4. User Routes

**Prompt:**

> Implement:
>
> * `GET /api/users/me` — get logged-in user
> * `PUT /api/users/me` — update profile (bio, avatarUrl, skills arrays)
> * `GET /api/users/:id` — public profile (include avg rating)
>
> Only the owner can update self.
> Use Prisma to query/update. Validate input with zod or Joi.

---

## 🔄 5. SkillSwap Routes

**Prompt:**

> Implement `swaps.routes.js` and related service/controller.
> Endpoints:
>
> * `POST /api/swaps` — create new swap
> * `PUT /api/swaps/:id` — update status (accept/reject/complete)
> * `GET /api/swaps` — list user swaps (filter by role/status)
> * `DELETE /api/swaps/:id` — cancel
>
> Validate requester/receiver permissions.

---

## ⭐ 6. Reviews

**Prompt:**

> Add `reviews.routes.js`.
> `POST /api/reviews` — create review after swap completion.
> Update user rating (avg).
> Enforce that reviewer participated in that swap.

---

## 🧠 7. AI Match Stub

**Prompt:**

> Create `match.routes.js`.
> `POST /api/match` — input: `{ skillsOffered, skillsWanted }` or current user’s.
> Return top 5 matching users with overlap/complement scores.
> Add placeholder for AI embedding-based match (commented).
> Example response:
>
> ```js
> { matches: [{ userId, score, name, skills }] }
> ```

---

## 💬 8. Socket.io Chat

**Prompt:**

> Add Socket.io integration in `index.js`.
> Create `chat.service.js`:
>
> * Rooms: `swap:<swapId>`
> * Events: `join`, `message`, `typing`, `disconnect`
> * Save messages in DB on `message`
>
> Example:
>
> ```js
> io.on('connection', (socket) => {
>   const user = verifyToken(socket.handshake.auth.token);
>   socket.on('join', ({ swapId }) => socket.join(`swap:${swapId}`));
>   socket.on('message', async ({ swapId, content }) => {
>     await prisma.message.create({ data: { senderId: user.id, swapId, content }});
>     io.to(`swap:${swapId}`).emit('message', { content, senderId: user.id });
>   });
> });
> ```

---

## 🔍 9. Discover (Search + Filters)

**Prompt:**

> Add `GET /api/discover?q=&skill=&page=&limit=&sortBy=`
> Use Prisma filters on `skillsOffered` or `skillsWanted` arrays.
> Return paginated users with `{ items, total, page }`.

---

## 🧪 10. Testing

**Prompt:**

> Setup Jest + Supertest.
> Write integration tests for:
>
> * Signup/Login flow
> * Protected route access
> * Swap creation/acceptance
> * Review creation
>   Use test DB (`DATABASE_URL_TEST`).

---

## 🐳 11. Docker

**Prompt:**

> Create `Dockerfile`:
>
> ```dockerfile
> FROM node:18-alpine
> WORKDIR /app
> COPY package*.json ./
> RUN npm ci
> COPY . .
> EXPOSE 4000
> CMD ["npm", "start"]
> ```
>
> Create `docker-compose.yml` for local dev with Postgres container.
> Example service names: `api`, `db`.

---

## 🔗 12. Frontend Connection (React)

**Prompt:**

> Document how frontend connects:
>
> * Base URL: `process.env.REACT_APP_API_URL`
> * Socket URL: `process.env.REACT_APP_SOCKET_URL`
> * JWT stored in localStorage
> * Axios instance adds `Authorization` header
>
> Example frontend `axios.js`:
>
> ```js
> import axios from "axios";
> const api = axios.create({ baseURL: process.env.REACT_APP_API_URL });
> api.interceptors.request.use((config) => {
>   const token = localStorage.getItem("token");
>   if (token) config.headers.Authorization = `Bearer ${token}`;
>   return config;
> });
> export default api;
> ```

---

## 🧱 Folder Structure Summary

```
src/
  index.js
  prisma/client.js
  routes/
    index.js
    auth.routes.js
    users.routes.js
    swaps.routes.js
    reviews.routes.js
    match.routes.js
  controllers/
  services/
  middleware/
  utils/
tests/
.env
.env.example
Dockerfile
docker-compose.yml
```

---

## ✅ Final Deliverables Checklist

* [ ] Express + Prisma setup
* [ ] Auth with JWT
* [ ] User CRUD
* [ ] SkillSwap + Reviews
* [ ] Socket.io chat
* [ ] AI match stub
* [ ] Search/filter endpoints
* [ ] Tests + Docker + CI
* [ ] Frontend connected (Axios + Socket.io)


