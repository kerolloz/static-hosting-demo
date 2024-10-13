export const BUILD_JOBS_QUEUE_NAME = 'BUILD_JOBS_QUEUE';
export const BUILD_JOB_NAME = 'BUILD_JOB';

type ZipBuildJob = {
  staticBuildType: 'ZIP';
  zipFilePath: string;
};

type GitBuildJob = {
  staticBuildType: 'GIT';
  repoUrl: string;
  buildCommand: string;
  branch: string;
  outputDir: string;
};

export type BuildJob = (ZipBuildJob | GitBuildJob) & { deploymentId: string };
