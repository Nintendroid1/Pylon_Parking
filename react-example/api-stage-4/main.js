const nconf = require('nconf');

nconf
  .argv()
  .env()
  .file({ file: 'config/default.json' });

// start the user REST API server
const api = require('./api');

const port = process.env.PORT || 3000;

const server = require('http').Server(api); // get http server

const socketIOManager = require('./realtime/');
socketIOManager.initializeSocketIO(server);

require('./realtime/redis-broadcaster.js');

server.listen(port, () => {
  console.log(`socket.io enabled Server running on port ${port}`);
});
