const morgan = require('morgan');
const express = require('express');
const port = process.env.PORT || 3000;

const app = express();
const indexRouter =  require('./api/index');
const usersRouter = require('./api/users');
const zonesRouter = require('./api/zones');
const purchaseRouter = require('./api/purchase');

// Initializing socket and passing it to each app.
const server = require('http').createServer(app);
io = require('socket.io').listen(server);

// Client socket connecting to specific parking lot websocket for updates.
io.of(/^\/zone-\d+$/).on('connect', (socket) => {
  const newNamespace = socket.nsp; // newNamespace.name === '/parkingLot-101'

  // broadcast to all clients in the given sub-namespace
  // newNamespace.emit('hello');
  console.log(`Client connected to ${newNamespace} namespace.`);
});

// Client socket connecting to specific parking spot websocket for updates.
io.of(/^\/parkingSpot-\d+$/).on('connect', (socket) => {
  const newNamespace = socket.nsp; // newNamespace.name === '/parkingSpot-101' Must also denote parking lot number.

  // broadcast to all clients in the given sub-namespace
  // newNamespace.emit('hello');
  console.log(`Client connected to ${newNamespace} namespace.`);
});

// Client socket connecting to transaction history web socket.
io.of('transactionHistory').on('connect', (socket) => {
  // broadcast to all clients in the given sub-namespace
  // newNamespace.emit('hello');
  console.log(`Client connected to 'transactionHistory' namespace.`);
});

app.set('socket-api', io);

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
