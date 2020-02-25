/**
 * Small singleton wrapper around socket.io()
 */
const socketio = require('socket.io') 
class SocketIOManager {
    getIO() {
        if (this.io === undefined)
            throw Error("SocketIOManager not initialized - please call initializeSocketIO first!")
        return this.io;
    }

    initializeSocketIO(server) {
        // http://stackoverflow.com/questions/29511404/connect-to-socket-io-server-with-specific-path-and-namespace
        // 'server' is the node.js http server object where the websocket
        // upgrade happens.
        this.io = socketio(server, { path : '/api/socket.io' });

        this.io.on('connection', (client) => {
            // client:ping/server:pong for testing only.
            // Server responds with "server:pong" to client's "client:ping" event
            // Don't use "ping"/"pong" as per https://github.com/socketio/socket.io-client/issues/1022
            client.on('client:pinging', () => {
                client.emit('server:ponging');
            });
        });
    }
}

module.exports = new SocketIOManager();
