import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastify from 'fastify';
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { ZodError } from 'zod';
import { env } from './lib/env';
import { SWAGGER_ROUTE, registerSwagger } from './lib/swagger';
import { registerAllRoutes } from './routes';
import { multer } from './lib/multer';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(cors);
app.register(helmet);
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(multer.contentParser);

registerSwagger(app);

app.setErrorHandler((error, _, reply) =>
  error instanceof ZodError
    ? reply.status(400).send({ message: 'Bad Request', error: error.issues })
    : reply.send(error),
);

app.after(() => registerAllRoutes(app));

app.listen({ host:'127.0.0.1', port: env('PORT') }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
  console.log(`Swagger available at ${address}${SWAGGER_ROUTE}`);
});
