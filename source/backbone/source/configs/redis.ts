import { RedisClient } from "bun";
import { env } from "./env";

// export const createRedisClient = async () => {
//   const redisClient = new RedisClient(env.REDIS_URL)

//   await redisClient.connect()
//   return redisClient;
// }

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