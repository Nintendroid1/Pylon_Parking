/*
 * A simple client manager that broadcasts Redis messages to all
 * connected websocket clients.
 */
const redis = require('redis');
const io = require('../realtime/').getIO();

// -------
const redisClient = redis.createClient();

io.of('/').emit('hi', 'everyone');

io.on('connection', socket => {
  socket.broadcast.emit('hello', 'to all clients except sender');
  socket
    .to('room42')
    .emit('hello', "to all clients in 'room42' room except sender");
});

// channel.js exports:
// const authRedisChannel = 'socket.io#/auth#';
// const voteRedisChannel = 'socket.io#/votes#';
const { authRedisChannel, voteRedisChannel } = require('./channels');

redisClient.subscribe(authRedisChannel);
redisClient.psubscribe(`${voteRedisChannel}*`);

// -------
redisClient.on('message', (channel, message) => {
  if (channel === authRedisChannel) {
    console.log(message);
    // write code to turn message from Redis into message you want to send to the client.
    const type = 'newuser';
    io.of('/auth').emit(type, 'You dont even know');
    return;
  }
});

redisClient.on('pmessage', (pchannel, channel, message) => {
  if (channel.startsWith(voteRedisChannel)) {
    console.log('BOYS: ');
    console.log(message);
    // write code to turn message from Redis into message you want to send to the client.
    const qid = pchannel; // extract qid from channel on which message is sent
    // write code to extract message
    io.of('/votes')
      .to(qid)
      .emit('voteupdate', { message: 'Never gonna give you up' });
    return;
  }
});

io.of('/votes').on('connection', client => {
  // subscribe { qid: ... }  subscribe to vote updates for a question
  client.on('subscribe', msg => {
    client.join(msg.qid);
  });
  // unsubscribe { qid: ... }  unsubscribe from vote updates for a question
  client.on('unsubscribe', msg => {
    client.leave(msg.qid);
  });
});

// exports a 'shutdown' method (if needed)
module.exports = {
  shutdown: () => {
    redisClient.quit();
  }
};
