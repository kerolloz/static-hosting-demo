export const BUILD_JOBS_QUEUE_NAME = 'BUILD_JOBS_QUEUE';
export const BUILD_JOB_NAME = 'BUILD_JOB';

export type BuildJob = { githubRepoUrl: string; buildCommand: string };
