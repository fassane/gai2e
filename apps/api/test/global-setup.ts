import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import { TEST_DATABASE_URL } from './test-database';

// Applique les migrations sur la base de test (créée si besoin) avant la suite.
export default function globalSetup() {
  execSync('npx prisma migrate deploy', {
    cwd: resolve(__dirname, '../../..'),
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
    stdio: 'pipe',
  });
}
