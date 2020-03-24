const morgan = require('morgan');
const express = require('express');
const port = 3000;

const { Client } = require('pg');
const client = new Client();

const app = express();
const indexRouter =  require('./api/index');
const usersRouter = require('./api/users');

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
  })

app.listen(port, () => {
    console.debug(`Server running on port ${port}`);
});

module.exports = app;