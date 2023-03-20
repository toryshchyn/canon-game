const WebSocket = require('ws');

const PORT = 8180;

const wss = new WebSocket.Server({ port: PORT });

const clients = new Set();

function broadcastMessage(message) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Client connected');
  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
    broadcastMessage(message);
  });
  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

const websocketServer = {
  start: () => {
    console.log(`WebSocket server started on port ${PORT}`);
  },
  stop: () => {
    wss.close();
    console.log('WebSocket server stopped');
  },
};

module.exports = websocketServer;