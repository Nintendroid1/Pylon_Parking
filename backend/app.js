const morgan = require("morgan");
const express = require("express");
const port = process.env.PORT || 3000;

const app = express();
const indexRouter = require("./api/index");
const usersRouter = require("./api/users");
const zonesRouter = require("./api/zones");
const purchaseRouter = require("./api/purchase");
const sellRouter = require("./api/sell");
const historyRouter = require("./api/history")
const bountyRouter = require("./api/bounty-system")

// Initializing socket and passing it to each app.
const server = require("http").Server(app);
const io = require("socket.io").listen(server);

/*
io.on("connect", socket => {
  socket.on("request", () => {
    console.log("HEEEREE");
  });
  socket.on("error", error => {
    console.log(error);
  });
});
*/
// Client socket connecting to specific parking lot websocket for updates.
io.of("/zones").on("connect", socket => {
  const newNamespace = socket.nsp; // newNamespace.name === '/parkingLot-101'

  // broadcast to all clients in the given sub-namespace
  // newNamespace.emit('hello');
  console.log(`Client connected to ${newNamespace.name} namespace.`);
});

// Client socket connecting to specific parking spot websocket for updates.
io.of("/parking_spot").on("connect", socket => {
  const newNamespace = socket.nsp; // newNamespace.name === '/parkingSpot-101' Must also denote parking lot number.

  // broadcast to all clients in the given sub-namespace
  // newNamespace.emit('hello');
  // console.log(newNamespace);
  console.log(`Client connected to ${newNamespace.name} namespace.`);
});

// Client socket connecting to transaction history web socket.
io.of("transactionHistory").on("connect", socket => {
  // broadcast to all clients in the given sub-namespace
  // newNamespace.emit('hello');
  console.log(`Client connected to /transactionHistory namespace.`);
});

io.of("/user").on("connect", socket => {
  console.log(`Client connected to /user namespace.`);
})

app.set("socket-api", io);

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use("/api", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/zones", zonesRouter);
app.use("/api/purchase", purchaseRouter);
app.use("/api/sell", sellRouter);
app.use("/api/history", historyRouter);
app.use("/api/bounty-system", bountyRouter);
app.use('/media', express.static(__dirname + '/public/images/'));
app.use(express.json());

app.use(function(req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

server.listen(port, () => {
  console.debug(`Server running on port ${port}`);
});

module.exports = app;
// mount API routes under /api
// app.use('/api', require('./api/index.js'));
