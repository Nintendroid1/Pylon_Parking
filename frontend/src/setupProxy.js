// file: src/setupProxy.js
// as per https://github.com/facebook/create-react-app/issues/5103
const proxy = require('http-proxy-middleware');
const api_server = 'localhost';

module.exports = function(app) {
  app.use(
    proxy('/api/socket.io', { target: `http://${api_server}:3001/`, ws: true })
  );
  app.use(proxy('/api', { target: `http://${api_server}:3001/` }));
};
