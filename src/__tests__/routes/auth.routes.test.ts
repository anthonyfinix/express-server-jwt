import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import { User } from '../../models/user.model';

declare global {
  var __MONGO_URI__: string;
}

describe('Auth Routes Test', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /auth/register', () => {
    it('should register new user', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@test.com',
          password: 'password123',
          name: 'Test User',
        });

      expect(res.status).toBe(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.token).toBeDefined();
    });

    it('should not register user with existing email', async () => {
      const userData = {
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User',
      };

      await request(app).post('/auth/register').send(userData);
      const res = await request(app).post('/auth/register').send(userData);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('User already exists');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/auth/register')
        .send({
          email: 'test@test.com',
          password: 'password123',
          name: 'Test User',
        });
    });

    it('should login existing user', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@test.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.token).toBeDefined();
    });

    it('should not login with wrong password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@test.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });
  });

  describe('GET /auth/protected', () => {
    let token: string;

    beforeEach(async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@test.com',
          password: 'password123',
          name: 'Test User',
        });
      token = res.body.token;
    });

    it('should access protected route with valid token', async () => {
      const res = await request(app)
        .get('/auth/protected')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('This is a protected route');
      expect(res.body.user).toBeDefined();
    });

    it('should not access protected route without token', async () => {
      const res = await request(app).get('/auth/protected');

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Please authenticate');
    });
  });
});