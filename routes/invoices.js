const express = require('express');
const router = new express.Router();
const db = require('../db');

/**
 * GET /invoices
 * 
 * Route to retrieve all invoices. Returns an array of invoice ids and associated company codes.
 */
router.get('/', async (req, res, next) => {
  try {
    const results = await db.query('SELECT id, comp_code FROM invoices');
    return res.json({ invoices: results.rows });
  } catch (e) {
    return next(e);
  }
});

/**
 * GET /invoices/[id]
 * 
 * Route to retrieve a specific invoice by its id.
 * Also fetches the associated company data for the invoice.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    const invoice = result.rows[0];
    const company = await db.query('SELECT code, name, description FROM companies WHERE code = $1', [invoice.comp_code]);
    invoice.company = company.rows[0];
    return res.json({ invoice: invoice });
  } catch (e) {
    return next(e);
  }
});

/**
 * POST /invoices
 * 
 * Route to add a new invoice. Requires a company code and an amount to be passed in the request body.
 */
router.post('/', async (req, res, next) => {
  try {
    const { comp_code, amt } = req.body;
    const result = await db.query('INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date', [comp_code, amt]);
    return res.status(201).json({ invoice: result.rows[0] });
  } catch (e) {
    return next(e);
  }
});

/**
 * PUT /invoices/[id]
 * 
 * Route to update the amount for a specific invoice by its id.
 */
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amt } = req.body;
    const result = await db.query('UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING id, comp_code, amt, paid, add_date, paid_date', [amt, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    return res.json({ invoice: result.rows[0] });
  } catch (e) {
    return next(e);
  }
});

/**
 * DELETE /invoices/[id]
 * 
 * Route to delete a specific invoice by its id.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM invoices WHERE id=$1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    return res.json({ status: 'deleted' });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
