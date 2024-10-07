import redis from 'ioredis';
import { env } from './env';

export const redisClient = new redis(env('REDIS_URL'), {
  maxRetriesPerRequest: null
});

redisClient.on('connect', () =>
  console.log('Connected to Redis at', env('REDIS_URL') ?? 'localhost'),
);
redisClient.on('error', console.error);
