const request = require('supertest');
const app = require('../app');

describe("Invoices Routes", () => {

  test("should retrieve all invoices", async () => {
    const response = await request(app).get('/invoices');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.invoices)).toBeTruthy();
  });


  // Tests for GET /invoices/[id]

  // test("should retrieve a specific invoice by ID", async () => {
  //   const response = await request(app).get('/invoices/1');

  //   expect(response.statusCode).toBe(200);
  //   expect(response.body.invoice.id).toBe(1);
  // });

  // test("should return 404 for invalid invoice ID", async () => {
  //   const response = await request(app).get('/invoices/9999999');

  //   expect(response.statusCode).toBe(404);
  //   expect(response.body.error).toBe('Invoice not found');
  // });

  // test("should retrieve associated company data correctly", async () => {
  //   const response = await request(app).get('/invoices/1');

  //   expect(response.statusCode).toBe(200);
  //   expect(response.body.invoice.company).toBeDefined();
  //   expect(response.body.invoice.company.code).toBeDefined();
  //   expect(response.body.invoice.company.name).toBeDefined();
  //   expect(response.body.invoice.company.description).toBeDefined();
  // });

  // Tests for POST /invoices

  // test("should create a new invoice for Apple", async () => {
  //   const newInvoice = {
  //     comp_code: "apple",  
  //     amt: 500  // New amount for Apple
  //   };

  //   const response = await request(app)
  //     .post('/invoices')
  //     .send(newInvoice);

  //   expect(response.statusCode).toBe(201);
  //   expect(response.body.invoice.comp_code).toBe(newInvoice.comp_code);
  //   expect(response.body.invoice.amt).toBe(newInvoice.amt);
  //   expect(response.body.invoice.id).toBeDefined();
  // });

  // Tests for PUT /invoices/[id]

  test("should update an Apple invoice's amount with a valid ID", async () => {
    const updatedAmt = 550;
    const validId = 2;  // Update the 2nd invoice of Apple in test data

    const response = await request(app)
      .put(`/invoices/${validId}`)
      .send({ amt: updatedAmt });

    expect(response.statusCode).toBe(200);
    expect(response.body.invoice.amt).toBe(updatedAmt);
    expect(response.body.invoice.id).toBe(validId);
  });

  // Tests for DELETE /invoices/[id]

  // test("should delete an invoice with a valid ID", async () => {
  //   const validId = 1;  // Assuming this ID exists in your test database

  //   const response = await request(app).delete(`/invoices/${validId}`);

  //   expect(response.statusCode).toBe(200);
  //   expect(response.body.status).toBe("deleted");
  // });

  test("should return a 404 error when provided an invalid ID for deletion", async () => {
    const invalidId = 9999;  // This ID should NOT exist in your test database

    const response = await request(app).delete(`/invoices/${invalidId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Invoice not found");
  });

});






