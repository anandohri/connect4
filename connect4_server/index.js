const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');
// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketsServerPort);
console.log('listening to port 8000');

const player = {};
let id = 1;

const wsServer = new webSocketServer({
  httpServer: server
});

wsServer.on('request', function(request){
  const connection = request.accept(null, request.origin);
  connection.on('message', function(message){
    if(message.type === 'utf8'){
      const move = JSON.parse(message.utf8Data)
      if(move.type === 'login'){
        if(id <= 2){
          move['id'] = id;
          player[id] = connection;
          console.log('Sending ', move);
          player[id].sendUTF(JSON.stringify(move));
          id += 1;
        } else{
            connection.sendUTF(JSON.stringify({type: 'loginFailed'}))
        }
      }else {
        for(key in player){
          console.log(move)
          player[key].sendUTF(JSON.stringify(move));
        }
      }
    }
  });
});