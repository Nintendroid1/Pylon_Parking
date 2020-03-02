/**
 * Main module for API server
 */
const express = require('express');
const app = express();

app.use(express.json()); // include JSON parsing middleware

// mount API routes under /api
app.use('/api', require('./api/index.js'));
module.exports = app;
