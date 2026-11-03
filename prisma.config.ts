import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'libs/db/prisma/schema.prisma',
  migrations: {
    path: 'libs/db/prisma/migrations',
    seed: 'tsx libs/db/prisma/seed.ts',
  },
  datasource: {
    // Optionnelle : `prisma generate` (postinstall, CI) n'a pas besoin de la base.
    url: process.env['DATABASE_URL'] ?? '',
  },
});
