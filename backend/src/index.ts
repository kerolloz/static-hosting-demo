import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastify from 'fastify';
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { ZodError } from 'zod';
import { HttpError } from './errors';
import { env } from './lib/env';
import { logger } from './lib/logger';
import { multer } from './lib/multer';
import { SWAGGER_ROUTE, registerSwagger } from './lib/swagger';
import { registerAllRoutes } from './routes';

const app = fastify({ logger }).withTypeProvider<ZodTypeProvider>();

app.register(cors);
app.register(helmet);
app.register(multer.contentParser);
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

registerSwagger(app);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError)
    return reply
      .status(400)
      .send({ message: 'Bad Request', error: error.issues });

  if (error instanceof HttpError)
    return reply.status(error.statusCode).send({ message: error.message });

  app.log.error(error);
  return reply.status(500).send({ message: 'Internal Server Error' });
});

app.after(() => registerAllRoutes(app));

app.listen({ host: '0.0.0.0', port: env('PORT') }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Swagger available at ${address}${SWAGGER_ROUTE}`);
});

export type FastifyZodInstance = typeof app;
