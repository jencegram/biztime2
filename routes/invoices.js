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
    const { amt, paid } = req.body;

    // Check if the invoice exists
    const invoiceQuery = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);
    const invoice = invoiceQuery.rows[0];

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Determine the new paid_date based on the payment status
    let paidDate;
    if (paid === true && !invoice.paid) {
      paidDate = new Date();
    } else if (paid === false) {
      paidDate = null;
    } else {
      paidDate = invoice.paid_date;
    }

    // Update the invoice with the new amount and paid_date
    const result = await db.query(
      'UPDATE invoices SET amt=$1, paid=$2, paid_date=$3 WHERE id=$4 RETURNING id, comp_code, amt, paid, add_date, paid_date',
      [amt, paid, paidDate, id]
    );

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
