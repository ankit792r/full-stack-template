import { env } from "./configs/env.ts";
import { createServer } from "./runtime/server.ts";

const host = env.HOST;
const port = env.PORT;

async function bootstrap() {
  const server = await createServer();
  await server.listen({ host, port });

  process.on("SIGINT", () => {
    console.log("\nShutting down...\n");
    server.close();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    console.log("\nShutting down...\n");
    server.close();
    process.exit(0);
  });

  server.log.info(`[bonefire] is running on: http://${host}:${port}`);
}

bootstrap().catch((err) => {
  console.log("failed to boot server ", err);
  process.exit(1);
});
