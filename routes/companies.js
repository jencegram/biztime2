const express = require('express');
const router = new express.Router();
const db = require('../db');
const slugify = require('slugify');

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
        const companiesRes = await db.query('SELECT code, name FROM companies');
        return res.json({ companies: companiesRes.rows });
    } catch (e) {
        return next(e);
    }
});


/**
 * Route to get a specific company by its code.
 * 
 * Returns the company's details, associated invoices, and industries.
 */
router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const companyRes = await db.query('SELECT code, name, description FROM companies WHERE code = $1', [code]);
        const invoicesRes = await db.query('SELECT id FROM invoices WHERE comp_code = $1', [code]);
        const industriesRes = await db.query('SELECT industries.industry FROM company_industries JOIN industries ON company_industries.industry_code = industries.code WHERE company_industries.comp_code = $1', [code]);

        if (companyRes.rows.length === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }

        const company = companyRes.rows[0];
        const invoices = invoicesRes.rows.map(inv => inv.id);
        const industries = industriesRes.rows.map(row => row.industry);

        company.invoices = invoices;
        company.industries = industries;

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
        const { name, description } = req.body;

        // Generate the code from the name using slugify
        const code = slugify(name, { lower: true });

        // Insert the new company into the database
        const result = await db.query(
            'INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description',
            [code, name, description]
        );

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

        const result = await db.query(
            'UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description',
            [name, description, code]
        );

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

/**
 * Route to add a new industry.
 * 
 * Accepts industry code and name in the request body.
 */
router.post('/add-industry', async (req, res, next) => {
    try {
        const { code, name } = req.body;

        // Insert the new industry into the database
        const result = await db.query(
            'INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry',
            [code, name]
        );

        return res.status(201).json({ industry: result.rows[0] });
    } catch (e) {
        return next(e);
    }
});



/**
 * Route to list all industries with associated company codes.
 */
router.get('/list-industries', async (req, res, next) => {
    try {
        const industriesRes = await db.query(
            'SELECT industries.code AS industry_code, industries.industry, array_agg(company_industries.comp_code) AS company_codes FROM industries LEFT JOIN company_industries ON industries.code = company_industries.industry_code GROUP BY industries.code, industries.industry'
        );

        return res.json({ industries: industriesRes.rows });
    } catch (e) {
        return next(e);
    }
});




/**
 * Route to associate an industry with a company.
 * 
 * Accepts company code and industry code in the request body.
 */
router.post('/associate-industry', async (req, res, next) => {
    try {
        const { companyCode, industryCode } = req.body;

        // Insert the association into the company_industries table
        await db.query(
            'INSERT INTO company_industries (comp_code, industry_code) VALUES ($1, $2)',
            [companyCode, industryCode]
        );

        return res.status(201).json({ message: 'Industry associated with company successfully' });
    } catch (e) {
        return next(e);
    }
});


module.exports = router;