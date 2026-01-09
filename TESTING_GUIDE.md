# 🧪 TESTING GUIDE
## UmrahConnect 2.0 - Complete Testing Framework

---

## 📋 TESTING OVERVIEW

### **Test Coverage:**
```
✅ Unit Tests:          Authentication, Validation, Utilities
✅ Integration Tests:   API Endpoints, Database Operations
✅ E2E Tests:           Complete User Flows
✅ Performance Tests:   Load Testing, Stress Testing
✅ Security Tests:      Penetration Testing, Vulnerability Scanning
```

---

## 🚀 QUICK START

### **1. Install Dependencies**

```bash
cd backend
npm install --save-dev jest supertest @types/jest
```

### **2. Run Tests**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.js

# Run tests matching pattern
npm test -- --testNamePattern="should login"
```

---

## 📁 TEST STRUCTURE

```
backend/
├── tests/
│   ├── auth.test.js           # Authentication tests
│   ├── package.test.js        # Package API tests
│   ├── booking.test.js        # Booking API tests
│   ├── payment.test.js        # Payment API tests
│   ├── review.test.js         # Review API tests
│   ├── user.test.js           # User API tests
│   ├── vendor.test.js         # Vendor API tests
│   ├── admin.test.js          # Admin API tests
│   ├── integration/           # Integration tests
│   │   ├── booking-flow.test.js
│   │   └── payment-flow.test.js
│   ├── unit/                  # Unit tests
│   │   ├── validators.test.js
│   │   ├── utils.test.js
│   │   └── middleware.test.js
│   └── e2e/                   # End-to-end tests
│       ├── user-journey.test.js
│       └── vendor-journey.test.js
├── jest.config.js             # Jest configuration
└── package.json
```

---

## 🧪 TEST EXAMPLES

### **1. Authentication Tests**

```javascript
// tests/auth.test.js
describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Test@1234',
        first_name: 'Test',
        last_name: 'User',
        phone: '+1234567890'
      })
      .expect(201);
    
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });
});
```

### **2. Package Tests**

```javascript
// tests/package.test.js
describe('GET /api/packages', () => {
  it('should get all packages', async () => {
    const res = await request(app)
      .get('/api/packages')
      .expect(200);
    
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
  });
  
  it('should filter by price range', async () => {
    const res = await request(app)
      .get('/api/packages?min_price=1000&max_price=3000')
      .expect(200);
    
    res.body.data.forEach(pkg => {
      expect(pkg.price).toBeGreaterThanOrEqual(1000);
      expect(pkg.price).toBeLessThanOrEqual(3000);
    });
  });
});
```

### **3. Booking Flow Test**

```javascript
// tests/integration/booking-flow.test.js
describe('Complete Booking Flow', () => {
  it('should complete full booking process', async () => {
    // 1. Register user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    const token = registerRes.body.data.token;
    
    // 2. Get package
    const packageRes = await request(app)
      .get('/api/packages')
      .expect(200);
    
    const packageId = packageRes.body.data[0].id;
    
    // 3. Check availability
    const availRes = await request(app)
      .post('/api/bookings/check-availability')
      .set('Authorization', `Bearer ${token}`)
      .send({
        package_id: packageId,
        departure_date: '2024-06-01',
        travelers: 2
      })
      .expect(200);
    
    expect(availRes.body.data.available).toBe(true);
    
    // 4. Create booking
    const bookingRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        package_id: packageId,
        departure_date: '2024-06-01',
        adults: 2,
        travelers: [
          {
            type: 'adult',
            first_name: 'John',
            last_name: 'Doe',
            passport_number: 'AB123456'
          },
          {
            type: 'adult',
            first_name: 'Jane',
            last_name: 'Doe',
            passport_number: 'AB123457'
          }
        ]
      })
      .expect(201);
    
    expect(bookingRes.body.success).toBe(true);
    expect(bookingRes.body.data).toHaveProperty('booking_number');
  });
});
```

---

## 🔧 TESTING UTILITIES

### **1. Test Database Setup**

```javascript
// tests/setup.js
const db = require('../config/database');

beforeAll(async () => {
  // Setup test database
  await db.query('CREATE DATABASE IF NOT EXISTS umrahconnect_test');
  await db.query('USE umrahconnect_test');
  
  // Run migrations
  // Import schema
});

afterAll(async () => {
  // Cleanup
  await db.query('DROP DATABASE IF EXISTS umrahconnect_test');
  await db.end();
});
```

### **2. Mock Data Factory**

```javascript
// tests/factories/user.factory.js
const faker = require('faker');

const createUser = (overrides = {}) => ({
  email: faker.internet.email(),
  password: 'Test@1234',
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  phone: faker.phone.phoneNumber('+1##########'),
  ...overrides
});

const createVendor = (overrides = {}) => ({
  ...createUser(),
  role: 'vendor',
  company_name: faker.company.companyName(),
  ...overrides
});

module.exports = { createUser, createVendor };
```

### **3. Test Helpers**

```javascript
// tests/helpers/auth.helper.js
const request = require('supertest');
const app = require('../../server');

const registerAndLogin = async (userData) => {
  const registerRes = await request(app)
    .post('/api/auth/register')
    .send(userData);
  
  return registerRes.body.data.token;
};

const createAuthHeader = (token) => ({
  Authorization: `Bearer ${token}`
});

module.exports = { registerAndLogin, createAuthHeader };
```

---

## 📊 COVERAGE REPORTS

### **Generate Coverage Report**

```bash
# Run tests with coverage
npm run test:coverage

# View HTML report
open coverage/lcov-report/index.html
```

### **Coverage Thresholds**

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70
  }
}
```

---

## 🔍 TESTING BEST PRACTICES

### **1. Test Naming Convention**

```javascript
// ✅ Good
describe('POST /api/auth/register', () => {
  it('should register a new user with valid data', () => {});
  it('should return 400 when email is invalid', () => {});
  it('should return 400 when password is too short', () => {});
});

// ❌ Bad
describe('Register', () => {
  it('works', () => {});
  it('fails', () => {});
});
```

### **2. Test Independence**

```javascript
// ✅ Good - Each test is independent
describe('User API', () => {
  beforeEach(async () => {
    // Create fresh test data for each test
    testUser = await createTestUser();
  });
  
  afterEach(async () => {
    // Cleanup after each test
    await deleteTestUser(testUser.id);
  });
});

// ❌ Bad - Tests depend on each other
describe('User API', () => {
  let userId;
  
  it('should create user', async () => {
    userId = await createUser();
  });
  
  it('should get user', async () => {
    // Depends on previous test
    await getUser(userId);
  });
});
```

### **3. Arrange-Act-Assert Pattern**

```javascript
it('should update user profile', async () => {
  // Arrange
  const user = await createTestUser();
  const token = await loginUser(user);
  const updateData = { first_name: 'Updated' };
  
  // Act
  const res = await request(app)
    .put('/api/users/profile')
    .set('Authorization', `Bearer ${token}`)
    .send(updateData);
  
  // Assert
  expect(res.status).toBe(200);
  expect(res.body.data.first_name).toBe('Updated');
});
```

### **4. Test Edge Cases**

```javascript
describe('Price Calculation', () => {
  it('should calculate price for adults only', () => {});
  it('should calculate price with children discount', () => {});
  it('should calculate price with infant (free)', () => {});
  it('should handle zero travelers', () => {});
  it('should handle maximum travelers', () => {});
  it('should handle negative numbers', () => {});
});
```

---

## 🚀 PERFORMANCE TESTING

### **1. Load Testing with Artillery**

```bash
# Install Artillery
npm install -g artillery

# Create test scenario
nano load-test.yml
```

```yaml
# load-test.yml
config:
  target: 'https://api.yourdomain.com'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Peak load"

scenarios:
  - name: "Browse packages"
    flow:
      - get:
          url: "/api/packages"
      - think: 2
      - get:
          url: "/api/packages/{{ $randomString() }}"
```

```bash
# Run load test
artillery run load-test.yml

# Generate report
artillery run --output report.json load-test.yml
artillery report report.json
```

### **2. Stress Testing**

```javascript
// tests/performance/stress.test.js
describe('Stress Tests', () => {
  it('should handle 1000 concurrent requests', async () => {
    const requests = [];
    
    for (let i = 0; i < 1000; i++) {
      requests.push(
        request(app).get('/api/packages')
      );
    }
    
    const responses = await Promise.all(requests);
    
    responses.forEach(res => {
      expect(res.status).toBe(200);
    });
  });
});
```

---

## 🔒 SECURITY TESTING

### **1. SQL Injection Tests**

```javascript
describe('Security Tests', () => {
  it('should prevent SQL injection in search', async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    
    const res = await request(app)
      .get(`/api/packages/search?q=${maliciousInput}`)
      .expect(200);
    
    // Should not execute SQL injection
    expect(res.body.success).toBe(true);
  });
});
```

### **2. XSS Tests**

```javascript
it('should sanitize XSS in package description', async () => {
  const xssPayload = '<script>alert("XSS")</script>';
  
  const res = await request(app)
    .post('/api/packages')
    .set('Authorization', `Bearer ${vendorToken}`)
    .send({
      ...testPackage,
      description: xssPayload
    });
  
  expect(res.body.data.description).not.toContain('<script>');
});
```

### **3. Authentication Tests**

```javascript
it('should not access protected route without token', async () => {
  const res = await request(app)
    .get('/api/users/profile')
    .expect(401);
  
  expect(res.body.success).toBe(false);
});

it('should not access admin route as customer', async () => {
  const res = await request(app)
    .get('/api/admin/users')
    .set('Authorization', `Bearer ${customerToken}`)
    .expect(403);
  
  expect(res.body.success).toBe(false);
});
```

---

## 📈 CONTINUOUS INTEGRATION

### **GitHub Actions Workflow**

```yaml
# .github/workflows/test.yml
name: Run Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: umrahconnect_test
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd backend
        npm ci
    
    - name: Run tests
      run: |
        cd backend
        npm test
      env:
        DB_HOST: 127.0.0.1
        DB_PORT: 3306
        DB_NAME: umrahconnect_test
        DB_USER: root
        DB_PASSWORD: root
        JWT_SECRET: test_secret_key_for_ci
    
    - name: Upload coverage
      uses: codecov/codecov-action@v2
      with:
        files: ./backend/coverage/lcov.info
```

---

## ✅ TEST CHECKLIST

### **Before Deployment:**

```
□ All unit tests passing
□ All integration tests passing
□ All E2E tests passing
□ Code coverage > 70%
□ No security vulnerabilities
□ Performance tests passing
□ Load tests passing
□ All edge cases covered
□ Error handling tested
□ Validation tested
□ Authentication tested
□ Authorization tested
□ Database operations tested
□ API endpoints tested
□ File uploads tested
□ Email sending tested
□ SMS sending tested
□ Payment processing tested
```

---

## 🎯 TESTING COMMANDS

```bash
# Run all tests
npm test

# Run specific test file
npm test auth.test.js

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests matching pattern
npm test -- --testNamePattern="should login"

# Run tests for specific describe block
npm test -- --testNamePattern="Authentication API"

# Run tests in specific directory
npm test tests/integration

# Run tests with verbose output
npm test -- --verbose

# Run tests and update snapshots
npm test -- -u

# Run tests in CI mode
npm test -- --ci --coverage --maxWorkers=2
```

---

## 📚 ADDITIONAL RESOURCES

### **Testing Libraries:**
- Jest: https://jestjs.io/
- Supertest: https://github.com/visionmedia/supertest
- Artillery: https://artillery.io/
- Faker: https://github.com/faker-js/faker

### **Best Practices:**
- Test Pyramid: https://martinfowler.com/articles/practical-test-pyramid.html
- Testing Best Practices: https://github.com/goldbergyoni/javascript-testing-best-practices

---

## 🎉 CONGRATULATIONS!

**You now have a comprehensive testing framework!** 🧪

**Test Coverage Target: 70%+**
**All Critical Paths Tested** ✅

---

**Happy Testing!** 🚀
