import { z } from 'zod';
import { throwWhenNullish } from '../errors/nullish';
import type { FastifyZodInstance } from '../index';
import { multer } from '../lib/multer';
import { triggerBuildJob } from '../queue/queue';
import { DeploymentTypeEnum } from '../shared/types';
import { deploymentZod } from '../shared/validations';
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
      handler: async (_) => {
        return await DeploymentsStore.getDeployments();
      },
    })
    .route({
      method: 'POST',
      url: '/deployments/zip',
      preValidation: multer.single('file') as any,
      schema: {
        body: z.object({
          subdomain: z.string().optional(),
        }),
        response: {
          202: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
            error: z.string(),
          }),
        },
      },
      handler: async (request, response) => {
        const { file } = request;

        console.log('Received file', { file });
        if (file?.mimetype !== 'application/zip') {
          return response
            .status(400)
            .send({ message: 'Bad Request', error: 'Invalid file type' });
        }

        console.log('Creating deployment');
        const deploymentId = await DeploymentsStore.createNewDeployment(
          DeploymentTypeEnum.ZIP,
          request.body.subdomain,
        );
        console.log('Deployment created', { deploymentId });

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
          subdomain: z.string().optional(),
          repoUrl: z.string().url(),
          branch: z.string(),
          buildCommand: z.string(),
          outputDir: z.string(),
        }),
      },
      handler: async (request, response) => {
        const deploymentId = await DeploymentsStore.createNewDeployment(
          DeploymentTypeEnum.GIT,
          request.body.subdomain,
        );

        triggerBuildJob({
          deploymentId,
          staticBuildType: 'GIT',
          ...request.body,
        });

        return response.status(202).send({ message: 'Accepted' });
      },
    })
    .route({
      method: 'GET',
      url: '/deployments/check-subdomain/:deploymentId',
      schema: {
        params: z.object({
          deploymentId: z.string(),
        }),
        response: {
          200: z.object({
            available: z.boolean(),
          }),
        },
      },
      handler: async (request) => {
        const deploymentId = request.params.deploymentId;
        const deployment = await DeploymentsStore.getDeploymentById(
          deploymentId,
        ).catch(() => null);

        return { available: deployment === null };
      },
    });
