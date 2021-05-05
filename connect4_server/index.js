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
    console.log('New user connected');
    if(numOfPlayer < 2){
      numOfPlayer += 1;
      connection = request.accept(null, request.origin);
      player[numOfPlayer] = connection;
      console.log('Connected: ' + numOfPlayer + ' with ' + Object.getOwnPropertyNames(player));

      connection.on('message', function(message){
        if(message.type === 'utf8'){
          console.log(message.utf8Data + ' Joined')
          for(key in player){
            player[key].sendUTF(message.utf8Data);
            console.log('Sent message to: ', player[key]);
          }
        }
      });
    }
});