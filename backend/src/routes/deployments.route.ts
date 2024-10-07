import fs from 'node:fs/promises';
import { z } from 'zod';
import type { FastifyZodInstance } from '../lib';
import { STATIC_HOSTING_DIR, getStaticHostingUrl } from '../lib/hosting';
import { multer } from '../lib/multer';
import { triggerBuildJob } from '../queue/queue';

export default (app: FastifyZodInstance) =>
  app
    .route({
      method: 'GET',
      url: '/deployments',
      schema: {
        response: {
          200: z.array(z.object({ url: z.string() })),
        },
      },
      handler: async (_, response) => {
        const deployments = await fs
          .readdir(STATIC_HOSTING_DIR)
          .then((files) => files.sort())
          .catch(() => []);

        return response.send(
          deployments.map((subdomain) => ({
            url: getStaticHostingUrl(subdomain),
          })),
        );
      },
    })
    .route({
      method: 'POST',
      url: '/deployments/zip',
      preValidation: multer.single('file'),
      handler: async (request, response) => {
        const { file } = request;

        if (file?.mimetype !== 'application/zip') {
          return response
            .status(400)
            .send({ message: 'Bad Request', error: 'Invalid file type' });
        }

        triggerBuildJob({
          staticBuildType: 'ZIP',
          zipFilePath: file.path ?? '',
        });

        return response.status(202).send({ message: 'Accepted' });
      },
    });
