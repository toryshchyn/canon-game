const express = require('express');
const websocketServer = require('./websocket-server');
const app = express();

websocketServer.start();

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});