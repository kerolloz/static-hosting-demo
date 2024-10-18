import fastifyMulter from 'fastify-multer';

export const multer = fastifyMulter({ dest: '/tmp' });
