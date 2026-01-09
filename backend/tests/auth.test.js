const request = require('supertest');
const app = require('../server');
const db = require('../config/database');

describe('Authentication API', () => {
  let authToken;
  let userId;
  
  // Test user data
  const testUser = {
    email: 'test@example.com',
    password: 'Test@1234',
    first_name: 'Test',
    last_name: 'User',
    phone: '+1234567890'
  };
  
  // Cleanup before tests
  beforeAll(async () => {
    // Delete test user if exists
    await db.query('DELETE FROM users WHERE email = ?', [testUser.email]);
  });
  
  // Cleanup after tests
  afterAll(async () => {
    // Delete test user
    await db.query('DELETE FROM users WHERE email = ?', [testUser.email]);
    // Close database connection
    await db.end();
  });
  
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);
      
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe(testUser.email);
      
      userId = res.body.data.user.id;
      authToken = res.body.data.token;
    });
    
    it('should not register user with existing email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);
      
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });
    
    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: '123' // too short
        })
        .expect(400);
      
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
    
    it('should validate email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          email: 'invalid-email'
        })
        .expect(400);
      
      expect(res.body.success).toBe(false);
    });
    
    it('should validate password strength', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          email: 'another@example.com',
          password: 'weak'
        })
        .expect(400);
      
      expect(res.body.success).toBe(false);
    });
  });
  
  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe(testUser.email);
      
      authToken = res.body.data.token;
    });
    
    it('should not login with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        })
        .expect(401);
      
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid credentials');
    });
    
    it('should not login with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123'
        })
        .expect(401);
      
      expect(res.body.success).toBe(false);
    });
    
    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email
          // missing password
        })
        .expect(400);
      
      expect(res.body.success).toBe(false);
    });
  });
  
  describe('GET /api/auth/me', () => {
    it('should get current user with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testUser.email);
    });
    
    it('should not get user without token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .expect(401);
      
      expect(res.body.success).toBe(false);
    });
    
    it('should not get user with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
      
      expect(res.body.success).toBe(false);
    });
  });
  
  describe('POST /api/auth/forgot-password', () => {
    it('should send reset email for valid email', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: testUser.email
        })
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('reset link');
    });
    
    it('should not reveal if email does not exist', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'nonexistent@example.com'
        })
        .expect(200);
      
      expect(res.body.success).toBe(true);
    });
    
    it('should validate email format', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'invalid-email'
        })
        .expect(400);
      
      expect(res.body.success).toBe(false);
    });
  });
  
  describe('PUT /api/auth/change-password', () => {
    it('should change password with valid current password', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: testUser.password,
          newPassword: 'NewTest@1234'
        })
        .expect(200);
      
      expect(res.body.success).toBe(true);
      
      // Update test user password
      testUser.password = 'NewTest@1234';
    });
    
    it('should not change password with wrong current password', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'WrongPassword123',
          newPassword: 'NewTest@1234'
        })
        .expect(401);
      
      expect(res.body.success).toBe(false);
    });
    
    it('should validate new password strength', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: testUser.password,
          newPassword: 'weak'
        })
        .expect(400);
      
      expect(res.body.success).toBe(false);
    });
  });
  
  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(res.body.success).toBe(true);
    });
  });
});
