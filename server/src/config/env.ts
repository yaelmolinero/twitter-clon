import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().default('3000').transform(Number),
  ACCESS_TOKEN_SECRET: z.string().min(32),
  REFRESH_TOKEN_SECRET: z.string().min(32),
  CLOUDINARY_API_KEY: z.string().length(15),
  CLOUDINARY_API_SECRET: z.string().length(27),
  DATABASE_URL: z.string(),
  FRONTEND_DOMAIN: z.string().url()
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.log('Variables de entorno inválidas.', _env.error.format());
  throw new Error('Variables de entorno inválidas.');
}

const envConfig = _env.data;

export default envConfig;
