import { Queue } from "bullmq";
import { redisClient } from "../lib/redis";
import { BUILD_JOB_NAME, BUILD_JOBS_QUEUE_NAME, type BuildJob } from "./config";

const buildJobsQueue = new Queue<BuildJob>(BUILD_JOBS_QUEUE_NAME, {
	connection: redisClient,
});

export const triggerBuildJob = async (data: BuildJob) => {
	console.log("Triggering: BuildJob");
	return await buildJobsQueue.add(BUILD_JOB_NAME, data);
};
