import { execSync } from 'node:child_process';
import { Worker } from 'bullmq';
import { STATIC_HOSTING_DIR } from '../lib/hosting';
import { redisClient } from '../lib/redis';
import { BUILD_JOBS_QUEUE_NAME, type BuildJob } from './config';

const createUUid = () =>
  `${Date.now()}${Math.random().toString(36).slice(2, 6)}`;

const buildJobsWorker = new Worker<BuildJob>(
  BUILD_JOBS_QUEUE_NAME,
  async (job) => {
    console.log('Processing job', job.id, job.data);
    if (job.data.staticBuildType === 'ZIP') {
      const jobUuid = createUUid();
      // 1. Extract the zip file into the shared static-hosting directory
      // 2. Update Caddy to do static file server for the new directory
      const { zipFilePath } = job.data;
      execSync(`unzip -o ${zipFilePath} -d ${STATIC_HOSTING_DIR}/${jobUuid}`);
      const domain = `http://${jobUuid}.lvh.me`;

      console.log('Domain:', domain);
    }
  },
  { connection: redisClient },
);

buildJobsWorker.on('ready', () => console.log('Worker ready'));
