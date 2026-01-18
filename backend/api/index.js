// Vercel Serverless Function entrypoint
// This file lets Vercel run the Express app without calling app.listen().

require("dotenv").config();
require("../config/db");

const app = require("../src/app");

module.exports = app;
