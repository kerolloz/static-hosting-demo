import { redisClient } from './redis';

class Cache {
  async get(key: string) {
    return await redisClient.get(key);
  }

  async set(key: string, value: string) {
    return await redisClient.set(key, value);
  }
}

export const cache = new Cache();
