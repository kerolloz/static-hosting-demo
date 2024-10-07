import { Worker } from 'bullmq';
import { redisClient } from '../lib/redis';
import { BUILD_JOBS_QUEUE_NAME, type BuildJob } from './config';

const buildJobsWorker = new Worker<BuildJob>(
  BUILD_JOBS_QUEUE_NAME,
  async (job) => {},
  { connection: redisClient },
);
