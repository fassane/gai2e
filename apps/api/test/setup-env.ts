import { TEST_DATABASE_URL } from './test-database';

// Défini avant le chargement de l'app : ConfigModule ne remplace pas une variable
// déjà présente par celle du .env (base de dev).
process.env['DATABASE_URL'] = TEST_DATABASE_URL;
process.env['JWT_ACCESS_SECRET'] = 'test-secret';
// Jamais d'envoi réel pendant les tests
delete process.env['RESEND_API_KEY'];
delete process.env['SMTP_URL'];
