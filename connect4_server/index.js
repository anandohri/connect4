const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');
// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketsServerPort);
console.log('listening to port 8000');

const player = {};
let numOfPlayer = 0;

const wsServer = new webSocketServer({
  httpServer: server
});

wsServer.on('request', function(request){
  const connection = request.accept(null, request.origin);
    if(numOfPlayer < 2){
      connection.on('message', function(message){
        if(message.type === 'utf8'){
          const move = JSON.parse(message.utf8Data)
          if(move.type === 'login'){
            console.log('New user connected');
            numOfPlayer += 1;
            player[numOfPlayer] = connection;
            move['id'] = numOfPlayer;
            console.log('Sending ', move);
          }
          for(key in player){
            player[key].sendUTF(JSON.stringify(move));
          }
        }
      });
    }
});