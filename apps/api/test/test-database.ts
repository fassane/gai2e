// Base dédiée aux tests d'intégration, jamais la base de dev :
// TEST_DATABASE_URL, sinon `gai2e_test` sur le Postgres du docker compose local.
export const TEST_DATABASE_URL =
  process.env['TEST_DATABASE_URL'] ??
  'postgresql://gai2e:gai2e@localhost:5434/gai2e_test';
