import { z } from 'zod';

export enum DeploymentStatusEnum {
  PENDING = 'PENDING',
  BUILDING = 'BUILDING',
  DEPLOYED = 'DEPLOYED',
  FAILED = 'FAILED',
}

export enum DeploymentTypeEnum {
  ZIP = 'ZIP',
  GIT = 'GIT',
}

export const deploymentZod = z.object({
  id: z.string(),
  url: z.string().optional(),
  status: z.nativeEnum(DeploymentStatusEnum),
  type: z.nativeEnum(DeploymentTypeEnum),
  createdAt: z.string(),
});

export type Deployment = z.infer<typeof deploymentZod>;
