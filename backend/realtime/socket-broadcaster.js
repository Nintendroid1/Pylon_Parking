const io = null;

// Client socket connecting to specific parking lot websocket for updates.
io.of(/^\/parkingLot-\d+$/).on('connect', (socket) => {
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

/*
io.on('connection', socket => {
  console.log(`Client with socket id ${socket.id} connected with server!`)
})
*/

// Initializes the sockets to be used.
function initSocket(expressApp) {
  const server = require('http').createServer(app);
  io = require('socket.io').listen(server);
}

// Broadcast updated information to all clients viewing info on parking lot
// specified by parkingLotId.
// 
// parkingLotId should be an integer value.
function broadcastParkingLotInfo(parkingLotId, data) {
  if (io === null) {
    console.log('Socket has not been initilized');
  }

  io.of(`parkingLot-${parkingLotId}`).emit('parking lot info', data);
}


// Broadcasting updated info to specific parking spot.
//
// parkingSpotId should be a specific parking spot, regardless of parking lot.
function broadcastParkingSpotInfo(parkingSpotId, data) {
  if (io === null) {
    console.log('Socket has not been initilized');
  }

  io.of(`parkingSpot-${parkingSpotId}`).emit('parking spot info', data);
}

// Broadcasting updated info on new transaction that has been made.
function broadcastTransactionHistoryInfo(data) {
  if (io === null) {
    console.log('Socket has not been initilized');
  }

  io.emit('transactionHistory', data);
}

module.exports= {
  broadcastParkingLotInfo,
  broadcastParkingSpotInfo,
  broadcastTransactionHistoryInfo,
}