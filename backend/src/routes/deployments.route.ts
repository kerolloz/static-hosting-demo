import { z } from 'zod';
import { throwWhenNullish } from '../errors/nullish';
import type { FastifyZodInstance } from '../index';
import { multer } from '../lib/multer';
import { triggerBuildJob } from '../queue/queue';
import { DeploymentTypeEnum, deploymentZod } from '../shared/types';
import { DeploymentsStore } from '../storage/deployments.store';

export default (app: FastifyZodInstance) =>
  app
    .route({
      method: 'GET',
      url: '/deployments',
      schema: {
        response: {
          200: z.array(deploymentZod),
        },
      },
      handler: async (_, response) => {
        return await DeploymentsStore.getDeployments();
      },
    })
    .route({
      method: 'POST',
      url: '/deployments/zip',
      preHandler: multer.single('file'),
      handler: async (request, response) => {
        const { file } = request;

        if (file?.mimetype !== 'application/zip') {
          return response
            .status(400)
            .send({ message: 'Bad Request', error: 'Invalid file type' });
        }

        const deploymentId = await DeploymentsStore.createNewDeployment(
          DeploymentTypeEnum.ZIP,
        );

        triggerBuildJob({
          deploymentId,
          staticBuildType: 'ZIP',
          zipFilePath:
            file.path ?? throwWhenNullish(new Error('File path is nullish')),
        });

        return response.status(202).send({ message: 'Accepted' });
      },
    })
    .route({
      method: 'POST',
      url: '/deployments/git',
      schema: {
        body: z.object({
          repoUrl: z.string().url(),
          branch: z.string(),
          buildCommand: z.string(),
          outputDir: z.string(),
        }),
      },
      handler: async (request, response) => {
        const deploymentId = await DeploymentsStore.createNewDeployment(
          DeploymentTypeEnum.GIT,
        );

        triggerBuildJob({
          deploymentId,
          staticBuildType: 'GIT',
          ...request.body,
        });

        return response.status(202).send({ message: 'Accepted' });
      },
    });
