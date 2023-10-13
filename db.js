/** Database setup for BizTime. */

// Loads env variables from a .env file
require('dotenv').config();

const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

// Initiate connection to database
client.connect();

module.exports = client;


