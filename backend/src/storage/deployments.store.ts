import { getStaticHostingUrl } from '../lib/hosting';
import { redisClient } from '../lib/redis';
import {
  type Deployment,
  DeploymentStatusEnum,
  type DeploymentTypeEnum,
} from '../shared/types';
import { deploymentZod } from '../shared/validations';

/**
 * This is a simple in-memory Redis store that stores deployments.
 */
export namespace DeploymentsStore {
  export async function getDeployments(): Promise<Deployment[]> {
    const keys = await redisClient.keys('deployment:*');
    if (!keys.length) return [];
    const deployments = await redisClient.mget(keys);
    return keys
      .map((key, index) => {
        const deploymentData = JSON.parse(deployments[index] ?? '{}');
        const { success, data } = deploymentZod.safeParse(deploymentData);
        if (!success) return null;
        const id = key.replace('deployment:', '');
        return {
          ...data,
          id,
          ...(data.status === DeploymentStatusEnum.DEPLOYED
            ? { url: getStaticHostingUrl(id) }
            : {}),
        };
      })
      .filter((d) => d !== null)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  }

  export async function getDeploymentById(
    deploymentId: string,
  ): Promise<Deployment | null> {
    const deploymentData = await redisClient.get(`deployment:${deploymentId}`);
    if (!deploymentData) return null;
    return JSON.parse(deploymentData);
  }

  export async function createDeployment(
    deployment: Deployment,
  ): Promise<void> {
    await redisClient.set(
      `deployment:${deployment.id}`,
      JSON.stringify(deployment),
    );
  }

  export async function updateDeployment(
    deploymentId: string,
    updatedData: Partial<Deployment>,
  ): Promise<void> {
    const existingDeployment = await getDeploymentById(deploymentId);
    if (!existingDeployment) throw new Error('Deployment not found');
    const updatedDeployment = { ...existingDeployment, ...updatedData };
    await redisClient.set(
      `deployment:${deploymentId}`,
      JSON.stringify(updatedDeployment),
    );
  }

  export async function deleteDeployment(deploymentId: string): Promise<void> {
    await redisClient.del(`deployment:${deploymentId}`);
  }

  export async function setDeploymentStatus(
    deploymentId: string,
    status: DeploymentStatusEnum,
  ): Promise<void> {
    const existingDeployment = await getDeploymentById(deploymentId);
    if (!existingDeployment) throw new Error('Deployment not found');
    existingDeployment.status = status;
    await redisClient.set(
      `deployment:${deploymentId}`,
      JSON.stringify(existingDeployment),
    );
  }

  export async function createNewDeployment(
    type: DeploymentTypeEnum,
  ): Promise<string> {
    const deploymentId = `${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
    const newDeployment: Deployment = {
      id: deploymentId,
      status: DeploymentStatusEnum.PENDING,
      type,
      createdAt: new Date().toISOString(),
    };
    await createDeployment(newDeployment);
    return deploymentId;
  }
}
