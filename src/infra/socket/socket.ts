/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server as SocketIOServer } from "socket.io";
import { createLogger } from "@/libs/logger";

let io: SocketIOServer | null = null;
const socketLogger = createLogger("socket");

export function initSocket(server: any) {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.BASE_URL,
      methods: ["GET", "POST", "PATCH"],
    },
  });

  io.on("connection", (socket) => {
    const rawUserId = socket.handshake.query.userId;
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

    if (userId) {
      socket.join(`user:${userId}`);
      socketLogger.info({ socketId: socket.id, userId: String(userId) }, "Client joined user room");
    }

    socket.on("disconnect", () => {
      socketLogger.info({ socketId: socket.id }, "Client disconnected from socket");
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
