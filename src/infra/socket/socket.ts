/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;

export function initSocket(server: any) {
  io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PATCH"],
    },
  });

  io.on("connection", (socket) => {
    const { userId } = socket.handshake.query;

    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`Cliente entrou na sala: user - ${userId}`);
    }

    socket.on("disconnect", () => {
      console.log(`[Socket.IO] Cliente desconectado: ${socket.id}`);
    });
  });

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error("Socket.IO não inicializado");
  }
  return io;
}
