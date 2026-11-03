import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { PrismaService } from '@gai2e/db';
import { AppModule } from '../app.module';
import { MailerService, type MailMessage } from '../mail/mailer.service';
import { REFRESH_COOKIE } from './auth.controller';
import { hashPassword } from './password';

// Tests d'intégration sur la base gai2e_test (voir apps/api/test).
describe('Authentification', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const sent: MailMessage[] = [];
  const email = 'awa.ouedraogo@auth.test';
  const password = 'Ancien-mdp1';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(MailerService)
      .useValue({ send: async (message: MailMessage) => void sent.push(message) })
      .compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    await app.init();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    sent.length = 0;
    await prisma.user.deleteMany({ where: { email: { endsWith: '@auth.test' } } });
    await prisma.user.create({
      data: { email, firstName: 'Awa', lastName: 'Ouédraogo', passwordHash: await hashPassword(password) },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { endsWith: '@auth.test' } } });
    await app.close();
  });

  const http = () => request(app.getHttpServer());
  // Cookie de session posé par la réponse, au format `nom=valeur` à renvoyer
  const refreshCookie = (res: request.Response): string => {
    const cookie = ([] as string[])
      .concat(res.headers['set-cookie'] ?? [])
      .find((c) => c.startsWith(`${REFRESH_COOKIE}=`));
    if (!cookie) throw new Error('Cookie de session absent');
    return cookie;
  };

  it('connecte avec le bon mot de passe et pose le cookie de session', async () => {
    const res = await http().post('/api/auth/login').send({ email: 'Awa.Ouedraogo@auth.test ', password }).expect(200);
    expect(res.body).toMatchObject({ expiresIn: 900, user: { email, firstName: 'Awa', role: 'STUDENT' } });
    expect(res.body.refreshToken).toBeUndefined();
    expect(refreshCookie(res)).toMatch(/HttpOnly/);

    const me = await http().get('/api/auth/me').set('Authorization', `Bearer ${res.body.accessToken}`).expect(200);
    expect(me.body.email).toBe(email);
  });

  it('refuse un mauvais mot de passe ou un email inconnu avec le même message', async () => {
    const wrong = await http().post('/api/auth/login').send({ email, password: 'Mauvais-mdp1' }).expect(401);
    const unknown = await http().post('/api/auth/login').send({ email: 'inconnu@auth.test', password }).expect(401);
    expect(wrong.body.message).toBe(unknown.body.message);
  });

  it('protège les routes privées', async () => {
    await http().get('/api/auth/me').expect(401);
    await http().get('/api/auth/me').set('Authorization', 'Bearer faux').expect(401);
  });

  it('renouvelle la session avec rotation du cookie, puis la ferme à la déconnexion', async () => {
    const login = await http().post('/api/auth/login').send({ email, password }).expect(200);
    const first = refreshCookie(login).split(';')[0];

    const refreshed = await http().post('/api/auth/refresh').set('Cookie', first).expect(200);
    const second = refreshCookie(refreshed).split(';')[0];
    expect(second).not.toBe(first);
    // L'ancien refresh token ne sert plus
    await http().post('/api/auth/refresh').set('Cookie', first).expect(401);

    await http().post('/api/auth/logout').set('Cookie', second).expect(204);
    await http().post('/api/auth/refresh').set('Cookie', second).expect(401);
  });

  it('réinitialise le mot de passe avec le lien reçu par email, une seule fois', async () => {
    const login = await http().post('/api/auth/login').send({ email, password }).expect(200);
    const session = refreshCookie(login).split(';')[0];

    const forgot = await http().post('/api/auth/forgot-password').send({ email }).expect(200);
    // Même réponse pour un email inconnu, et aucun email envoyé
    const unknown = await http().post('/api/auth/forgot-password').send({ email: 'inconnu@auth.test' }).expect(200);
    expect(unknown.body.message).toBe(forgot.body.message);

    await new Promise((resolve) => setImmediate(resolve));
    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({ to: email, subject: 'Réinitialisation de votre mot de passe' });
    expect(sent[0].html).toContain('Bonjour Awa,');
    expect(sent[0].html).toContain('Choisir un nouveau mot de passe');
    expect(sent[0].text).toContain('Choisir un nouveau mot de passe : http');
    const link = sent[0].text.match(/https?:\/\/\S+/)?.[0] ?? '';
    const token = new URL(link).searchParams.get('token') ?? '';
    expect(token).not.toBe('');

    const newPassword = 'Nouveau-mdp2';
    await http()
      .post('/api/auth/reset-password')
      .send({ token, password: 'faible', passwordConfirmation: 'faible' })
      .expect(400);
    await http()
      .post('/api/auth/reset-password')
      .send({ token, password: newPassword, passwordConfirmation: newPassword })
      .expect(200);
    await http()
      .post('/api/auth/reset-password')
      .send({ token, password: newPassword, passwordConfirmation: newPassword })
      .expect(400);

    // Sessions fermées, ancien mot de passe refusé, nouveau accepté
    await http().post('/api/auth/refresh').set('Cookie', session).expect(401);
    await http().post('/api/auth/login').send({ email, password }).expect(401);
    const relogin = await http().post('/api/auth/login').send({ email, password: newPassword }).expect(200);
    expect(relogin.body.user.emailVerified).toBe(true);
  });
});
