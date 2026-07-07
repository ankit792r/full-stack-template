import type { RedisClientType } from "redis";
import type { ICache } from "./cache-interface";
import { MemoryCache } from "./memory.cache";
import { RedisCache } from "./redis.cache";
import { env } from "../../configs/env";

export type CreateCacheOptions = {
    type: typeof env.DEFAULT_CACHE_IMPL;
    redisClient?: RedisClientType;
};

/**
 *  check the env DEFAULT_CACHE_IMPL and return the cache impl ICache
 *  this method can be extend by modifying param to accept cosmos. inMemory
 *  @param redis redis client (optional, only required if using Redis cache)
 *  @returns ICache instance
 */
export function createDefaultCache(
    redisClient: RedisClientType | undefined,
): ICache {
    return createCache({
        type: env.DEFAULT_CACHE_IMPL,
        redisClient: redisClient,
    });
}

export function createCache(options: CreateCacheOptions) {
    switch (options.type) {
        case "redis":
            if (!options.redisClient) {
                throw new Error(
                    "Redis client must be provided for Redis cache implementation.",
                );
            }
            return new RedisCache(options.redisClient);
        case "memory":
            return new MemoryCache();
        default:
            throw new Error(`Invalid cache type: ${options.type}`);
    }
}
