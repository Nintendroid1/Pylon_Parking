const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Default Page");
});

module.exports = router;