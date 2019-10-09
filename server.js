const http = require('http');
const { server: WebSocketServer } = require('websocket');
const Player = require('mpris-service');

const port = process.env.PORT || 8079;
const server = http.createServer((req, res) => {
  res.writeHead(404);
  res.rend();
});
const player = new Player({
  name: 'spotify-web-player',
  identity: 'Spotify Web Player ',
  supportedInterfaces: ['player'],
});

server.listen(port, () => {
  console.log(`Listening to ${port}`);
});

wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

function isAllowedOrigin(origin) {
  console.log('isAllowedOrigin', origin);
  return true;
}

const connections = [];

wsServer.on('request', req => {
  if (!isAllowedOrigin(req.origin)) {
    req.reject();
    return;
  }

  const conn = req.accept('mpris-service', req.origin);
  console.log('New Connection accepted.');

  connections.push(conn);

  conn.on('message', msg => {
    switch (msg.type) {
      case 'utf8':
        console.log('Received Message:', msg.utf8Data);
        // connection.sendUTF(msg.utf8Data);
        break;

      case 'binary':
        console.log(
          'Received Binary Message of',
          msg.binaryData.length,
          'bytes'
        );
        // connection.sendBytes(msg.binaryData);
        break;

      default:
        console.log('Unknown msg.type', msg.type);
        break;
    }
  });

  conn.on('close', function(reasonCode, description) {
    console.log(`Peer ${conn.remoteAddress} disconnected.`);
    const index = connections.indexOf(conn);

    if (index > -1) connections.splice(index, 1);
  });
});

['next', 'previous', 'pause', 'playpause', 'stop', 'play'].forEach(type => {
  player.on(type, (...args) => {
    console.log('Event:', type, args);
    const msg = JSON.stringify({
      type,
      args,
    });

    connections.forEach(conn => {
      conn.sendUTF(msg);
    });
  });
});
