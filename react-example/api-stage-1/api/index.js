/*
 * Implement router for /api endpoints.
 */
const express = require('express');

const apirouter = express.Router();

apirouter.get('/', function(req, res) {
  res.json({ status: true, message: 'API is accessible' });
});

apirouter.use('/users', require('./users'));

module.exports = apirouter;
