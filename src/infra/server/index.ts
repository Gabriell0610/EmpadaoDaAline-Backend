import "dotenv/config";

import http from "http";
import { createApp } from "./app";
import { initSocket } from "../socket/socket";
import { createLogger } from "@/libs/logger";

const serverLogger = createLogger("server");

export async function bootstrap() {
  const app = await createApp();
  const server = http.createServer(app);
  const port = Number(process.env.PORT || 1338);

  initSocket(server);

  server.listen(port, () => {
    serverLogger.info({ port }, "Server running");
  });
}

bootstrap().catch((err) => {
  serverLogger.fatal({ err }, "Failed to bootstrap application");
  process.exit(1);
});
