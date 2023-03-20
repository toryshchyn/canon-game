const createWebSocketClient = (url) => {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
  
      ws.addEventListener('open', () => {
        resolve(ws);
      });
  
      ws.addEventListener('error', (error) => {
        reject(error);
      });
    });
  };
  
  export default createWebSocketClient;