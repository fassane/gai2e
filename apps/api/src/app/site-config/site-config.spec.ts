import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { PrismaService, type UserRole } from '@gai2e/db';
import { defaultSiteConfig } from '@gai2e/shared-types';
import { AppModule } from '../app.module';
import { hashPassword } from '../auth/password';
import { MailerService } from '../mail/mailer.service';

// Tests d'intégration sur la base gai2e_test (voir apps/api/test).
describe('Configuration du site', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const password = 'Config-mdp1';
  const domain = '@config.test';

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

  beforeEach(async () => {
    await prisma.siteConfig.deleteMany();
    await prisma.user.deleteMany({ where: { email: { endsWith: domain } } });
  });

  afterAll(async () => {
    await prisma.siteConfig.deleteMany();
    await prisma.user.deleteMany({ where: { email: { endsWith: domain } } });
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

  const input = {
    description: 'Accompagnement des étudiants vers les universités du monde entier.',
    contactEmail: 'Hello@GAI2E.com',
    whatsappPhone: '+22670000000',
    phone: '',
    address: 'Ouagadougou, Burkina Faso',
    openingHours: 'Du lundi au vendredi, 8 h – 17 h',
    facebookUrl: 'https://facebook.com/gai2e',
    instagramUrl: '',
    linkedinUrl: null,
    tiktokUrl: '',
    youtubeUrl: '',
    xUrl: '',
  };

  it('renvoie les valeurs par défaut tant que rien n’est enregistré (route publique)', async () => {
    const res = await http().get('/api/site-config').expect(200);
    expect(res.body).toEqual(defaultSiteConfig);
  });

  it('réserve la modification aux administrateurs', async () => {
    await http().put('/api/admin/site-config').send(input).expect(401);
    const advisor = await tokenOf('conseiller', 'ADVISOR');
    await http().put('/api/admin/site-config').set('Authorization', advisor).send(input).expect(403);
  });

  it('enregistre les réglages et les sert ensuite au site', async () => {
    const admin = await tokenOf('admin', 'ADMIN');
    await http()
      .put('/api/admin/site-config')
      .set('Authorization', admin)
      .send({ ...input, facebookUrl: 'pas-un-lien' })
      .expect(400);

    const saved = await http().put('/api/admin/site-config').set('Authorization', admin).send(input).expect(200);
    expect(saved.body).toMatchObject({
      contactEmail: 'hello@gai2e.com',
      phone: null,
      instagramUrl: null,
      facebookUrl: 'https://facebook.com/gai2e',
    });
    expect(saved.body.updatedAt).toEqual(expect.any(String));

    const publicConfig = await http().get('/api/site-config').expect(200);
    expect(publicConfig.body).toEqual(saved.body);
  });
});
