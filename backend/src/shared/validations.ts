import { z } from 'zod';
import { DeploymentStatusEnum, DeploymentTypeEnum } from './types';

export const deploymentZod = z.object({
  id: z.string(),
  url: z.string().optional(),
  status: z.nativeEnum(DeploymentStatusEnum),
  type: z.nativeEnum(DeploymentTypeEnum),
  createdAt: z.string(),
});
