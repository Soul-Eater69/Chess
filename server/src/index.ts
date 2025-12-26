import { WebSocketServer } from './WebSocketServer';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;

const server = new WebSocketServer(PORT);

console.log(`Chess WebSocket server started on port ${PORT}`);
console.log('Waiting for players to connect...');

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.getServer().close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.getServer().close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
