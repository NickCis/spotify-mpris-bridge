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

function isAllowed(req) {
  console.log('origin', req.origin);
  return true;
}

const connections = [];

wsServer.on('request', req => {
  if (!isAllowed(req)) {
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
        break;

      default:
        console.log('Unknown msg.type', msg.type);
        break;
    }
  });

  conn.on('close', (reasonCode, description) => {
    console.log(`Peer ${conn.remoteAddress} disconnected.`);
    const index = connections.indexOf(conn);

    if (index > -1) connections.splice(index, 1);
  });
});

['next', 'previous', 'pause', 'playpause', 'stop', 'play'].forEach(type => {
  player.on(type, (...args) => {
    const msg = JSON.stringify({
      type,
      args,
    });

    connections.forEach(conn => {
      conn.sendUTF(msg);
    });
  });
});
