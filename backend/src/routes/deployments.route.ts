import type { FastifyZodInstance } from '../lib';
import { multer } from '../lib/multer';

export default (app: FastifyZodInstance) =>
  app.route({
    method: 'POST',
    url: '/deployments/zip',
    preValidation: multer.single('file'),
    handler: async (request, response) => {
      const { file } = request;

      if (file.mimetype !== 'application/zip') {
        return response
          .status(400)
          .send({ message: 'Bad Request', error: 'Invalid file type' });
      }

      return file;
    },
  });
