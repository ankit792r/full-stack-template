import { createClient, type RedisClientType } from "redis";

let client: RedisClientType | undefined;

export async function createRedisClient(): Promise<RedisClientType> {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL,
    });

    client.on("error", console.error);

    await client.connect();
  }

  return client;
}
