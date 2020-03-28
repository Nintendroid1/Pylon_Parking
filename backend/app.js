const morgan = require('morgan');
const express = require('express');
const port = process.env.PORT || 3000;

const app = express();
const indexRouter =  require('./api/index');
const usersRouter = require('./api/users');
const zonesRouter = require('./api/zones');
const purchaseRouter = require('./api/purchase');

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/zones', zonesRouter);
app.use('/api/purchase', purchaseRouter);
app.use(express.json());

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
  })

app.listen(port, () => {
    console.debug(`Server running on port ${port}`);
});

module.exports = app;
// mount API routes under /api
// app.use('/api', require('./api/index.js'));
