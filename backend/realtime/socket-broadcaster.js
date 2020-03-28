/*
io.on('connection', socket => {
  console.log(`Client with socket id ${socket.id} connected with server!`)
})
*/

// Broadcast updated information to all clients viewing info on parking lot
// specified by parkingLotId.
//
// parkingLotId should be an integer value.
function broadcastZoneInfo(io, zoneId, data) {
  if (io === null) {
    console.log('Socket has not been initilized');
  }
  // console.log(io);

  io.of(`zones`).emit(`zone-${zoneId}`, data);
}


// Broadcasting updated info to specific parking spot.
//
// parkingSpotId should be a specific parking spot, regardless of parking lot.
function broadcastParkingSpotInfo(io, parkingSpotId, data) {
  if (io === null) {
    console.log('Socket has not been initilized');
  }

  io.of(`parking_spot-${parkingSpotId}`).emit('parking spot info', data);
}

// Broadcasting updated info on new transaction that has been made.
function broadcastTransactionHistoryInfo(io, data) {
  if (io === null) {
    console.log('Socket has not been initilized');
  }

  io.emit('transactionHistory', data);
}

module.exports= {
  broadcastZoneInfo,
  broadcastParkingSpotInfo,
  broadcastTransactionHistoryInfo,
}
