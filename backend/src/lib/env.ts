// Bun automatically loads the .env file and sets the environment variables
// https://bun.sh/guides/runtime/set-env
import z from 'zod';

const envList = z.object({
  PORT: z.coerce.number().default(3000),
  REDIS_URL: z.string().url().describe('the url to connect to Redis'),
});

const safeEnv = envList.parse(process.env);

export const env = <T extends keyof typeof envList.shape>(key: T) =>
  safeEnv[key];
