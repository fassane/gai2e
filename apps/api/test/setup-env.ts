import { TEST_DATABASE_URL } from './test-database';

// Défini avant le chargement de l'app : ConfigModule ne remplace pas une variable
// déjà présente par celle du .env (base de dev).
process.env['DATABASE_URL'] = TEST_DATABASE_URL;
