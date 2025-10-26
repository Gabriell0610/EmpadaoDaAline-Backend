import "dotenv/config";

import app from "./app";
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

const server = http.createServer(app);

export const io = new SocketIOServer(server, {
  cors: {
    // É importante configurar o CORS aqui também para o WebSocket
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PATCH"]
  }
});

io.on('connection', (socket) => {
  const { userId } = socket.handshake.query;

  if (userId) {
    socket.join(`user:${userId}`);
    console.log(`Cliente entrou na sala: user - ${userId}`);
  }

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Cliente desconectado: ${socket.id}`);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on path http://localhost:${process.env.PORT!}`);
});


