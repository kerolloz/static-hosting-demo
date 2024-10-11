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
    const jobUuid = createUUid();

    if (job.data.staticBuildType === 'ZIP') {
      // Handle ZIP build type
      const { zipFilePath } = job.data;
      execSync(`unzip -o ${zipFilePath} -d ${STATIC_HOSTING_DIR}/${jobUuid}`);
      const domain = `http://${jobUuid}.lvh.me`;

      console.log('Domain:', domain);
    } else if (job.data.staticBuildType === 'GIT') {
      // Handle GIT build type
      const { repoUrl, branch, buildCommand, outputDir } = job.data;
      const tmpDir = `/tmp/${jobUuid}`;

      // Clone the repository and checkout the specified branch
      execSync(`git clone ${repoUrl} ${tmpDir} --depth 1`);
      execSync(`git -C ${tmpDir} checkout ${branch}`);

      // Run the build command
      execSync(`cd ${tmpDir} && ${buildCommand}`);

      // Move the output directory to the static hosting directory
      execSync(`mv ${tmpDir}/${outputDir} ${STATIC_HOSTING_DIR}/${jobUuid}`);

      const domain = `http://${jobUuid}.lvh.me`;

      console.log('Domain:', domain);
    }
  },
  { connection: redisClient },
);

buildJobsWorker.on('ready', () => console.log('Worker ready'));
