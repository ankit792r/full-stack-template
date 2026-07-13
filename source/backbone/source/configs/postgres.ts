import { Client } from "pg";
import { env } from "./env.ts";

export const createPostgresClient = async () => {
  const client = new Client({
    connectionString: env.POSTGRES_URI,
    application_name: env.APP_NAME,
  });

  await client.connect();
  return client;
};
