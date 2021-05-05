const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');
// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketsServerPort);
console.log('listening to port 8000');

const wsServer = new webSocketServer({
  httpServer: server
});

wsServer.on('request', function(request){
    console.log('New user connected');
});