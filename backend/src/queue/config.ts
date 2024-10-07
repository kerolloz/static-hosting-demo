export const BUILD_JOBS_QUEUE_NAME = 'BUILD_JOBS_QUEUE';
export const BUILD_JOB_NAME = 'BUILD_JOB';

type ZipBuildJob = {
  staticBuildType: 'ZIP';
  zipFilePath: string;
};

type GithubBuildJob = {
  staticBuildType: 'GITHUB';
  githubRepoUrl: string;
  buildCommand: string;
};

export type BuildJob = ZipBuildJob | GithubBuildJob;
