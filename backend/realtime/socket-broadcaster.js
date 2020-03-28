/*
io.on('connection', socket => {
  console.log(`Client with socket id ${socket.id} connected with server!`)
})
*/

// Broadcast updated information to all clients viewing info on parking lot
// specified by parkingLotId.
// 
// parkingLotId should be an integer value.
function broadcastZoneInfo(zoneId, data) {
  if (io === null) {
    console.log('Socket has not been initilized');
  }

  io.of(`zone-${zoneId}`).emit('zone info', data);
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
  initSocket,
  broadcastZoneInfo,
  broadcastParkingSpotInfo,
  broadcastTransactionHistoryInfo,
}