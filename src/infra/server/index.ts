import "dotenv/config";

import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { createApp } from "./app";

async function bootstrap() {
  const app = await createApp();
  const server = http.createServer(app);

  const io = new SocketIOServer(server, {
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

  server.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Erro ao subir a aplicação:", err);
  process.exit(1);
});
