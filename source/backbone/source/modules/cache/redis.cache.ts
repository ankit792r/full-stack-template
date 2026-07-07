import type { RedisClientType } from "redis";
import type { ICache } from "./cache-interface";

export class RedisCache implements ICache {
  constructor(private readonly client: RedisClientType) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async set<T>(key: string, value: T, ttlMillis?: number): Promise<void> {
    const serialized = JSON.stringify(value);

    if (ttlMillis !== undefined) {
      await this.client.set(key, serialized, {
        PX: ttlMillis, // TTL in milliseconds
      });
    } else {
      await this.client.set(key, serialized);
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}