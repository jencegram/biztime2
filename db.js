/** Database setup for BizTime. */

// Loads env variables from a .env file
require('dotenv').config();

const { Client } = require("pg");

const isTestMode = process.env.NODE_ENV === 'test';
const connectionString = isTestMode ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

// const client = new Client({
//   connectionString: process.env.DATABASE_URL
// });

const client = new Client({
  connectionString: connectionString
});

// Initiate connection to database
client.connect();

module.exports = client;


