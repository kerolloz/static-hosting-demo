import pino from 'pino';

const transport = pino.transport({
  targets: [
    {
      target: 'pino-pretty',
      options: { colorize: true, destination: 1 },
    },
  ],
});

export const logger = pino(transport);
