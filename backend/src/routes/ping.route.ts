import z from 'zod';
import type { FastifyZodInstance } from '../index';

export default (app: FastifyZodInstance) =>
  app.route({
    method: 'GET',
    url: '/ping',
    schema: {
      response: {
        200: z.object({
          message: z.string(),
        }),
      },
    },
    handler: async () => ({ message: 'pong' }),
  });
