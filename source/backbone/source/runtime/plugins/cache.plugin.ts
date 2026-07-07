import { type FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import type { RedisClientType } from "redis";

import type { DependencyOverrides } from "../app";
import {
  createCache,
} from "../../modules/cache/cache-factory";
import type { ICache } from "../../modules/cache/cache-interface";
import { env } from "../../configs/env";
import { createRedisClient } from "../../configs/redis";

export default fp(
  async (fastify: FastifyInstance, overrides: DependencyOverrides) => {
    fastify.log.info("plugging: CACHE into app");

    let redisClient: RedisClientType | undefined;
    let cache: ICache;

    if (overrides.redisClient) {
      redisClient = overrides.redisClient;
      cache = createCache({ type: "redis", redisClient });
    } else if (env.DEFAULT_CACHE_IMPL === "redis") {
      redisClient = await createRedisClient();
      cache = createCache({ type: "redis", redisClient });
    } else {
      cache = createCache({ type: "memory" });
    }

    fastify.decorate("redisClient", redisClient);
    fastify.decorate("cache", cache);
  },
  { name: "cache" },
);

declare module "fastify" {
  interface FastifyInstance {
    redisClient: RedisClientType | undefined;
    cache: ICache;
  }
}