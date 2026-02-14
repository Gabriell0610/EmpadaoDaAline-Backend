import "dotenv/config";

import http from "http";
import { createApp } from "./app";
import { initSocket } from "../socket/socket";

export async function bootstrap() {
  const app = await createApp();
  const server = http.createServer(app);

  initSocket(server);

  server.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Erro ao subir a aplicação:", err);
  process.exit(1);
});
