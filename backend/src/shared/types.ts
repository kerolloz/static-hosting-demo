import type { z } from 'zod';
import type { deploymentZod } from './validations';

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

export type Deployment = z.infer<typeof deploymentZod>;
