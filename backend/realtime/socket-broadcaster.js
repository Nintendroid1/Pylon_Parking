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

  io.of(`parking_spot`).emit(`parkingSpot-${parkingSpotId}`, data);
}

// Broadcasting money to be added to specific user.
// Used when a parking spot the user was selling was sold.
function broadcastUserInfo(io, userId, data) {
  if (io === null) {
    console.log("Socket has not been initialized");
  }

  io.of(`user`).emit(`userInfo-${userId}`, data);
}

// Broadcasting to the specific user that a parking spot was sold.
function broadcastSellSuccess(io, userId, data) {
  if (io === null) {
    console.log("Socket has not been initialized");
  }

  io.of(`user`).emit(`sell-${userId}`, data);
}

// Sending the parking spot that was just put up for sale to the 
// specific user.
function broadcastSellPageInfo(io, userId, data) {
  if (io === null) {
    console.log("Socket has not been initialized");
  }

  io.of(`user`).emit(`user-${userId}`, data);
}

// Broadcasting updated info on new transaction that has been made.
function broadcastTransactionHistoryInfo(io, data) {
  if (io === null) {
    console.log('Socket has not been initilized');
  }

  io.of('transactionHistory').emit('transactionHistory', data);
}

module.exports= {
  broadcastZoneInfo,
  broadcastParkingSpotInfo,
  broadcastTransactionHistoryInfo,
  broadcastUserInfo,
  broadcastSellPageInfo,
  broadcastSellSuccess
}
