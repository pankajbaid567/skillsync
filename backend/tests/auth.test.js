import request from 'supertest';
import { app } from '../src/index.js';
import prisma from '../src/prisma/client.js';

describe('Auth API', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    // Clean up test database
    await prisma.review.deleteMany();
    await prisma.message.deleteMany();
    await prisma.skillSwap.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/signup', () => {
    it('should register a new user', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        bio: 'Test bio',
        skillsOffered: ['JavaScript', 'React'],
        skillsWanted: ['Python', 'Django'],
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user.email).toBe('test@example.com');

      authToken = res.body.data.token;
      testUser = res.body.data.user;
    });

    it('should not register with duplicate email', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User 2',
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should validate required fields', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        email: 'invalid-email',
        password: '123',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('user');
    });

    it('should not login with invalid password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Protected Routes', () => {
    it('should access protected route with valid token', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('test@example.com');
    });

    it('should not access protected route without token', async () => {
      const res = await request(app).get('/api/users/me');

      expect(res.status).toBe(401);
    });

    it('should not access protected route with invalid token', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
    });
  });
});
