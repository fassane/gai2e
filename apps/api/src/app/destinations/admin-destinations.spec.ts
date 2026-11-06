import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { PrismaService, type UserRole } from '@gai2e/db';
import { AppModule } from '../app.module';
import { hashPassword } from '../auth/password';
import { MailerService } from '../mail/mailer.service';

// Tests d'intégration sur la base gai2e_test (voir apps/api/test).
describe('Back-office : destinations', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const password = 'Dest-mdp1';
  const domain = '@admin-dest.test';
  const doc = 'TEST_ADMIN_DEST_DOC';
  const stepInput = {
    title: 'Préparer le visa',
    description: 'Description',
    category: 'VISA',
    dueDaysBeforeIntake: 90,
    isOptional: false,
    externalUrl: '',
    documentTypeCodes: [doc],
  };

  const cleanup = async () => {
    await prisma.destination.deleteMany({ where: { countryCode: { in: ['XE', 'XF'] } } });
    await prisma.documentType.deleteMany({ where: { code: doc } });
    await prisma.user.deleteMany({ where: { email: { endsWith: domain } } });
  };

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
    await cleanup();
    await prisma.documentType.create({ data: { code: doc, label: 'Pièce de test' } });
  });

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

  const createDestination = async (auth: string, name = 'Xéland', countryCode = 'xe') =>
    http()
      .post('/api/admin/destinations')
      .set('Authorization', auth)
      .send({ countryCode, name, currency: 'eur', summary: 'Résumé' })
      .expect(201);

  it('réserve la gestion aux administrateurs', async () => {
    await http().get('/api/admin/destinations').expect(401);
    const advisor = await tokenOf('conseiller', 'ADVISOR');
    await http().get('/api/admin/destinations').set('Authorization', advisor).expect(403);
    await http()
      .post('/api/admin/destinations')
      .set('Authorization', advisor)
      .send({ countryCode: 'XE', name: 'X', currency: 'EUR', summary: '' })
      .expect(403);
  });

  it('crée une destination (adresse déduite du nom) et refuse les doublons', async () => {
    const admin = await tokenOf('admin', 'ADMIN');
    const res = await createDestination(admin);
    expect(res.body).toMatchObject({ slug: 'xeland', countryCode: 'XE', currency: 'EUR', isActive: true });
    await http()
      .post('/api/admin/destinations')
      .set('Authorization', admin)
      .send({ countryCode: 'XE', name: 'Autre', currency: 'EUR', summary: '' })
      .expect(409);
    await http()
      .post('/api/admin/destinations')
      .set('Authorization', admin)
      .send({ countryCode: 'XXX', name: 'Autre', currency: 'EUR', summary: '' })
      .expect(400);
  });

  it('une modification se répercute sur la fiche publique, y compris la désactivation', async () => {
    const admin = await tokenOf('admin', 'ADMIN');
    const { body: destination } = await createDestination(admin);
    const url = `/api/admin/destinations/${destination.id}`;

    const { body: step } = await http().post(`${url}/steps`).set('Authorization', admin).send(stepInput).expect(201);
    expect(step).toMatchObject({ code: 'preparer-le-visa', dueDaysBeforeIntake: 90, documents: [{ code: doc }] });

    await http()
      .patch(`${url}/steps/${step.id}`)
      .set('Authorization', admin)
      .send({ title: 'Visa étudiant', documentTypeCodes: [] })
      .expect(200);
    let fiche = await http().get('/api/destinations/xeland').expect(200);
    expect(fiche.body.steps[0]).toMatchObject({ title: 'Visa étudiant', documents: [] });
    expect(fiche.body.steps[0].code).toBe('preparer-le-visa');

    await http().patch(`${url}/steps/${step.id}`).set('Authorization', admin).send({ isActive: false }).expect(200);
    fiche = await http().get('/api/destinations/xeland').expect(200);
    expect(fiche.body.steps).toEqual([]);

    await http().patch(url).set('Authorization', admin).send({ isActive: false }).expect(200);
    await http().get('/api/destinations/xeland').expect(404);
    const detail = await http().get(url).set('Authorization', admin).expect(200);
    expect(detail.body).toMatchObject({ isActive: false, activeStepCount: 0, steps: [{ isActive: false }] });
  });

  it('réordonne les étapes et refuse une liste incomplète ou une pièce inconnue', async () => {
    const admin = await tokenOf('admin', 'ADMIN');
    const { body: destination } = await createDestination(admin);
    const url = `/api/admin/destinations/${destination.id}`;
    const { body: first } = await http().post(`${url}/steps`).set('Authorization', admin).send(stepInput).expect(201);
    const { body: second } = await http().post(`${url}/steps`).set('Authorization', admin).send(stepInput).expect(201);
    expect(second.code).toBe('preparer-le-visa-2');

    await http()
      .post(`${url}/steps`)
      .set('Authorization', admin)
      .send({ ...stepInput, documentTypeCodes: ['INCONNU'] })
      .expect(400);
    await http()
      .put(`${url}/steps/order`)
      .set('Authorization', admin)
      .send({ ids: [second.id] })
      .expect(400);
    await http()
      .put(`${url}/steps/order`)
      .set('Authorization', admin)
      .send({ ids: [second.id, first.id] })
      .expect(204);
    const detail = await http().get(url).set('Authorization', admin).expect(200);
    expect(detail.body.steps.map((step: { id: string }) => step.id)).toEqual([second.id, first.id]);
  });
});
