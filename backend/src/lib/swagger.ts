import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import type { FastifyZodInstance } from './types';

export const SWAGGER_ROUTE = '/swagger' as const;

export const registerSwagger = (app: FastifyZodInstance) => {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'SampleCrud',
        description: 'SampleCrud',
        contact: {
          name: 'Kerollos Magdy',
          url: 'https://kerolloz.dev',
          email: 'kerolloz@yahoo.com',
        },
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            description:
              'RSA256 JWT signed by private key, with username in payload',
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  });

  app.register(fastifySwaggerUI, {
    routePrefix: SWAGGER_ROUTE,
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: (_request, _reply, next) => next(),
      preHandler: (_request, _reply, next) => next(),
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, _request, _reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
};
