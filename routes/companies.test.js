const request = require('supertest');
const app = require('../app');

describe("Companies Routes", () => {
  test("should retrieve all companies", async () => {
    const response = await request(app).get('/companies');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.companies)).toBeTruthy();
  });

  // ... additional tests for other company routes ...
});
