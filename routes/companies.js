const express = require('express');
const router = new express.Router();
const db = require('../db');

// Mock database
const companies = [
    { code: 'apple', name: 'Apple Inc', description: 'Tech company' }
];

/**
 * Route to get all companies.
 * 
 * Returns a list of companies with their code and name.
 */
router.get('/', async (req, res, next) => {
    try {
        const result = await db.query('SELECT code, name FROM companies');
        return res.json({ companies: result.rows });
    } catch (e) {
        return next(e);
    }
});

/**
 * Route to get a specific company by its code.
 * 
 * Returns the company's details and associated invoices.
 */
router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const companyRes = await db.query('SELECT code, name, description FROM companies WHERE code = $1', [code]);
        const invoicesRes = await db.query('SELECT id FROM invoices WHERE comp_code = $1', [code]);
        if (companyRes.rows.length === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }
        const company = companyRes.rows[0];
        company.invoices = invoicesRes.rows.map(inv => inv.id);
        return res.json({ company: company });
    } catch (e) {
        return next(e);
    }
});

/**
 * Route to add a new company.
 * 
 * Accepts company code, name, and description in the request body.
 */
router.post('/', async (req, res, next) => {
    try {
        const { code, name, description } = req.body;
        const result = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description', [code, name, description]);
        return res.status(201).json({ company: result.rows[0] });
    } catch (e) {
        return next(e);
    }
});

/**
 * Route to update an existing company's details by its code.
 * 
 * Accepts new name and description in the request body.
 */
router.put('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name, description } = req.body;
        const result = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description', [name, description, code]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }
        return res.json({ company: result.rows[0] });
    } catch (e) {
        return next(e);
    }
});

/**
 * Route to delete a company by its code.
 */
router.delete('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const result = await db.query('DELETE FROM companies WHERE code=$1', [code]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }
        return res.json({ status: 'deleted' });
    } catch (e) {
        return next(e);
    }
});


module.exports = router;
