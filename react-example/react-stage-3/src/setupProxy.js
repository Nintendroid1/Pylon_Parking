// file: src/setupProxy.js
// as per https://github.com/facebook/create-react-app/issues/5103
const proxy = require('http-proxy-middleware')
 
module.exports = function(app) {
  app.use(proxy('/api/socket.io', { target: 'http://localhost:3001/', ws: true }))
  app.use(proxy('/api', { target: 'http://localhost:3001/' }))
}
