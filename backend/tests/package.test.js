const request = require('supertest');
const app = require('../server');
const db = require('../config/database');

describe('Package API', () => {
  let authToken;
  let vendorToken;
  let packageId;
  
  const testVendor = {
    email: 'vendor@example.com',
    password: 'Vendor@1234',
    first_name: 'Test',
    last_name: 'Vendor',
    phone: '+1234567891',
    role: 'vendor'
  };
  
  const testPackage = {
    title: 'Premium Umrah Package 2024',
    description: 'Complete Umrah package with 5-star hotels and guided tours. Includes visa processing, accommodation, and transportation.',
    price: 2500.00,
    duration_days: 14,
    available_seats: 50,
    destination: 'Makkah & Madinah',
    package_type: 'umrah',
    status: 'published'
  };
  
  beforeAll(async () => {
    // Register vendor
    const vendorRes = await request(app)
      .post('/api/auth/register')
      .send(testVendor);
    
    vendorToken = vendorRes.body.data.token;
    
    // Register customer
    const customerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'customer@example.com',
        password: 'Customer@1234',
        first_name: 'Test',
        last_name: 'Customer',
        phone: '+1234567892'
      });
    
    authToken = customerRes.body.data.token;
  });
  
  afterAll(async () => {
    // Cleanup
    await db.query('DELETE FROM users WHERE email IN (?, ?)', 
      [testVendor.email, 'customer@example.com']);
    await db.end();
  });
  
  describe('GET /api/packages', () => {
    it('should get all packages without authentication', async () => {
      const res = await request(app)
        .get('/api/packages')
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.pagination).toBeDefined();
    });
    
    it('should filter packages by price range', async () => {
      const res = await request(app)
        .get('/api/packages?min_price=1000&max_price=3000')
        .expect(200);
      
      expect(res.body.success).toBe(true);
      res.body.data.forEach(pkg => {
        expect(pkg.price).toBeGreaterThanOrEqual(1000);
        expect(pkg.price).toBeLessThanOrEqual(3000);
      });
    });
    
    it('should filter packages by duration', async () => {
      const res = await request(app)
        .get('/api/packages?duration_days=14')
        .expect(200);
      
      expect(res.body.success).toBe(true);
      res.body.data.forEach(pkg => {
        expect(pkg.duration_days).toBe(14);
      });
    });
    
    it('should search packages by keyword', async () => {
      const res = await request(app)
        .get('/api/packages?search=umrah')
        .expect(200);
      
      expect(res.body.success).toBe(true);
    });
    
    it('should paginate results', async () => {
      const res = await request(app)
        .get('/api/packages?page=1&limit=5')
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeLessThanOrEqual(5);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(5);
    });
    
    it('should sort packages', async () => {
      const res = await request(app)
        .get('/api/packages?sort=price&order=ASC')
        .expect(200);
      
      expect(res.body.success).toBe(true);
      
      // Check if sorted by price ascending
      for (let i = 1; i < res.body.data.length; i++) {
        expect(res.body.data[i].price).toBeGreaterThanOrEqual(
          res.body.data[i - 1].price
        );
      }
    });
  });
  
  describe('GET /api/packages/featured', () => {
    it('should get featured packages', async () => {
      const res = await request(app)
        .get('/api/packages/featured')
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });
    
    it('should limit featured packages', async () => {
      const res = await request(app)
        .get('/api/packages/featured?limit=3')
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeLessThanOrEqual(3);
    });
  });
  
  describe('GET /api/packages/popular', () => {
    it('should get popular packages', async () => {
      const res = await request(app)
        .get('/api/packages/popular')
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  });
  
  describe('GET /api/packages/search', () => {
    it('should search packages', async () => {
      const res = await request(app)
        .get('/api/packages/search?q=umrah')
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });
    
    it('should require search query', async () => {
      const res = await request(app)
        .get('/api/packages/search')
        .expect(400);
      
      expect(res.body.success).toBe(false);
    });
  });
  
  describe('GET /api/packages/:id', () => {
    it('should get package by ID', async () => {
      // First get a package
      const packagesRes = await request(app)
        .get('/api/packages')
        .expect(200);
      
      if (packagesRes.body.data.length > 0) {
        const packageId = packagesRes.body.data[0].id;
        
        const res = await request(app)
          .get(`/api/packages/${packageId}`)
          .expect(200);
        
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(packageId);
        expect(res.body.data).toHaveProperty('images');
        expect(res.body.data).toHaveProperty('inclusions');
        expect(res.body.data).toHaveProperty('exclusions');
      }
    });
    
    it('should return 404 for non-existent package', async () => {
      const res = await request(app)
        .get('/api/packages/00000000-0000-0000-0000-000000000000')
        .expect(404);
      
      expect(res.body.success).toBe(false);
    });
    
    it('should validate UUID format', async () => {
      const res = await request(app)
        .get('/api/packages/invalid-id')
        .expect(400);
      
      expect(res.body.success).toBe(false);
    });
  });
  
  describe('GET /api/packages/:id/reviews', () => {
    it('should get package reviews', async () => {
      // Get a package first
      const packagesRes = await request(app)
        .get('/api/packages')
        .expect(200);
      
      if (packagesRes.body.data.length > 0) {
        const packageId = packagesRes.body.data[0].id;
        
        const res = await request(app)
          .get(`/api/packages/${packageId}/reviews`)
          .expect(200);
        
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.pagination).toBeDefined();
      }
    });
    
    it('should paginate reviews', async () => {
      const packagesRes = await request(app)
        .get('/api/packages')
        .expect(200);
      
      if (packagesRes.body.data.length > 0) {
        const packageId = packagesRes.body.data[0].id;
        
        const res = await request(app)
          .get(`/api/packages/${packageId}/reviews?page=1&limit=5`)
          .expect(200);
        
        expect(res.body.success).toBe(true);
        expect(res.body.data.length).toBeLessThanOrEqual(5);
      }
    });
  });
});
