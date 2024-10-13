import fastifyMulter from 'fastify-multer';
import 'fastify-multer/typings/fastify/index.d.ts';

export const multer = fastifyMulter({ dest: '/tmp' });
