/** BizTime express application. */
const express = require("express");
const app = express();
const ExpressError = require("./expressError")
const companyRoutes = require('./routes/companies');
const invoiceRoutes = require('./routes/invoices');

// Middleware to parse JSON request bodies
app.use(express.json());


/**
 * Middleware to log the request method and path.
 */
app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request Path: ${req.path}`);
  next();
});

// Using routes from external route files for companies and invoices.
app.use('/companies', companyRoutes);
app.use('/invoices', invoiceRoutes);

/** 404 handler */
app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** General error handler */
app.use((err, req, res, next) => {
  console.error(err.stack); // This will print the error stack trace for debugging.
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;
