import 'dotenv/config';
import { parseArgs } from 'node:util';
import { createInterface } from 'node:readline/promises';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRole } from '@gai2e/db';
import { emailSchema, passwordSchema, passwordRules } from '@gai2e/shared-types';
import { hashPassword } from '../src/app/auth/password';

// Crée un compte (ou remplace le mot de passe d'un compte existant), en attendant l'inscription
// et le back-office. La base visée est celle de DATABASE_URL.
//
//   npm run user:create -- --email admin@gai2e.com --first-name Awa --last-name Ouédraogo --role ADMIN
//
// Le mot de passe est demandé dans le terminal (il ne reste pas dans l'historique du shell).
async function main() {
  const { values } = parseArgs({
    options: {
      email: { type: 'string' },
      'first-name': { type: 'string' },
      'last-name': { type: 'string' },
      role: { type: 'string', default: 'STUDENT' },
    },
  });
  const email = emailSchema.parse(values.email ?? '');
  const role = values.role as UserRole;
  if (!Object.values(UserRole).includes(role)) {
    throw new Error(`Rôle inconnu : ${values.role} (${Object.values(UserRole).join(', ')})`);
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const password = await rl.question('Mot de passe : ');
  rl.close();
  const check = passwordSchema.safeParse(password);
  if (!check.success) {
    throw new Error(
      `Mot de passe refusé. Règles : ${passwordRules.map((rule) => rule.label.toLowerCase()).join(', ')}.`,
    );
  }

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env['DATABASE_URL'] }) });
  try {
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.upsert({
      where: { email },
      update: { passwordHash, role, isActive: true },
      create: {
        email,
        role,
        passwordHash,
        firstName: values['first-name'] ?? 'Prénom',
        lastName: values['last-name'] ?? 'Nom',
        // Compte créé par l'équipe : adresse considérée comme vérifiée
        emailVerifiedAt: new Date(),
      },
    });
    console.log(`Compte ${user.role} prêt : ${user.email} (${user.id})`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
