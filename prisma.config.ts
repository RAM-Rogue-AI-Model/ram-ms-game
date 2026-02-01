import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { config } from './src/utils/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: config.DATABASE_URL,
  },
});
