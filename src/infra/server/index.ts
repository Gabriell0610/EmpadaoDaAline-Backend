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
  console.log(`[Socket.IO] Novo cliente conectado: ${socket.id}`);
  
  // **AQUI você pode implementar a lógica de autenticação e rooms (salas)**
  // Ex: socket.join(`user-${socket.handshake.query.userId}`);
  
  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Cliente desconectado: ${socket.id}`);
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on path http://localhost:${process.env.PORT}`);
});


