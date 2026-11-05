import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { PrismaService, type UserRole } from '@gai2e/db';
import { AppModule } from '../app.module';
import { hashPassword } from '../auth/password';
import { MailerService } from '../mail/mailer.service';

// Tests d'intégration sur la base gai2e_test (voir apps/api/test).
describe('Pages légales', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const password = 'Legal-mdp1';
  const domain = '@legal.test';
  const url = '/api/admin/legal-pages/mentions-legales';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(MailerService)
      .useValue({ send: async () => undefined })
      .compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    await app.init();
    prisma = app.get(PrismaService);
  });

  const cleanup = async () => {
    await prisma.legalPage.deleteMany();
    await prisma.user.deleteMany({ where: { email: { endsWith: domain } } });
  };
  beforeEach(cleanup);
  afterAll(async () => {
    await cleanup();
    await app.close();
  });

  const http = () => request(app.getHttpServer());

  async function tokenOf(name: string, role: UserRole) {
    await prisma.user.create({
      data: {
        email: `${name}${domain}`,
        firstName: name,
        lastName: 'Test',
        role,
        passwordHash: await hashPassword(password),
      },
    });
    const res = await http()
      .post('/api/auth/login')
      .send({ email: `${name}${domain}`, password })
      .expect(200);
    return `Bearer ${res.body.accessToken}`;
  }

  it('renvoie un contenu nul tant que la page n’a pas été modifiée, 404 pour une page inconnue', async () => {
    const res = await http().get('/api/legal-pages/mentions-legales').expect(200);
    expect(res.body).toEqual({ id: 'mentions-legales', content: null, updatedAt: null });
    await http().get('/api/legal-pages/inconnue').expect(404);
  });

  it('réserve la modification aux administrateurs', async () => {
    await http().put(url).send({ content: '<p>Texte</p>' }).expect(401);
    const advisor = await tokenOf('conseiller', 'ADVISOR');
    await http().put(url).set('Authorization', advisor).send({ content: '<p>Texte</p>' }).expect(403);
  });

  it('enregistre le contenu nettoyé et le sert au site', async () => {
    const admin = await tokenOf('admin', 'ADMIN');
    await http().put(url).set('Authorization', admin).send({ content: '<p><br></p>' }).expect(400);
    await http()
      .put(url)
      .set('Authorization', admin)
      .send({ content: '<script>alert(1)</script><img src=x onerror=alert(1)>' })
      .expect(400);

    const saved = await http()
      .put(url)
      .set('Authorization', admin)
      .send({
        content:
          '<h2 onclick="alert(1)">Éditeur</h2><p>Texte<script>alert(1)</script></p><a href="javascript:alert(1)">x</a><a href="https://gai2e.com">site</a>',
      })
      .expect(200);
    expect(saved.body.content).toBe(
      '<h2>Éditeur</h2><p>Texte</p><a rel="noopener noreferrer">x</a><a href="https://gai2e.com" rel="noopener noreferrer">site</a>',
    );

    const page = await http().get('/api/legal-pages/mentions-legales').expect(200);
    expect(page.body).toEqual(saved.body);
  });
});
