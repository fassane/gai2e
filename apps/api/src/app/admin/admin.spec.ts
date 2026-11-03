import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { PrismaService, type UserRole } from '@gai2e/db';
import { AppModule } from '../app.module';
import { hashPassword } from '../auth/password';
import { MailerService, type MailMessage } from '../mail/mailer.service';

// Tests d'intégration sur la base gai2e_test (voir apps/api/test).
describe('Back-office', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const sent: MailMessage[] = [];
  const password = 'Admin-mdp1';
  const domain = '@admin.test';

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

  const cleanup = async () => {
    await prisma.dossier.deleteMany({ where: { student: { email: { endsWith: domain } } } });
    await prisma.user.deleteMany({ where: { email: { endsWith: domain } } });
    await prisma.destination.deleteMany({ where: { countryCode: 'XA' } });
  };

  beforeEach(async () => {
    sent.length = 0;
    await cleanup();
  });

  afterAll(async () => {
    await cleanup();
    await app.close();
  });

  const http = () => request(app.getHttpServer());

  async function createUser(name: string, role: UserRole) {
    return prisma.user.create({
      data: {
        email: `${name}${domain}`,
        firstName: name,
        lastName: 'Test',
        role,
        passwordHash: await hashPassword(password),
      },
    });
  }

  async function tokenOf(name: string) {
    const res = await http()
      .post('/api/auth/login')
      .send({ email: `${name}${domain}`, password })
      .expect(200);
    return `Bearer ${res.body.accessToken}`;
  }

  it('réserve le tableau de bord aux administrateurs et conseillers', async () => {
    await createUser('etudiant', 'STUDENT');
    await http().get('/api/admin/dashboard').expect(401);
    const etudiantAuth = await tokenOf('etudiant');
    await http().get('/api/admin/dashboard').set('Authorization', etudiantAuth).expect(403);
  });

  it('compte les dossiers : tous pour un admin, les siens pour un conseiller', async () => {
    await createUser('admin', 'ADMIN');
    const advisor = await createUser('conseiller', 'ADVISOR');
    const student = await createUser('etudiant', 'STUDENT');
    const destination = await prisma.destination.create({
      data: { countryCode: 'XA', slug: 'test-xa', name: 'Testland', currency: 'EUR' },
    });
    const base = { studentId: student.id, destinationId: destination.id, targetLevel: 'MASTER' as const };
    await prisma.dossier.createMany({
      data: [
        { ...base, reference: 'GAI-TEST-00001', targetIntake: new Date('2027-09-01'), status: 'SUBMITTED' },
        {
          ...base,
          reference: 'GAI-TEST-00002',
          targetIntake: new Date('2028-01-01'),
          status: 'IN_PROGRESS',
          advisorId: advisor.id,
        },
        { ...base, reference: 'GAI-TEST-00003', targetIntake: new Date('2028-09-01'), status: 'DRAFT' },
      ],
    });

    const adminAuth = await tokenOf('admin');
    const all = await http().get('/api/admin/dashboard').set('Authorization', adminAuth).expect(200);
    expect(all.body.scope).toBe('all');
    expect(all.body.kpis.activeDossiers).toBeGreaterThanOrEqual(2);
    expect(all.body.kpis.awaitingAssignment).toBeGreaterThanOrEqual(1);
    expect(all.body.dossiersByDestination).toContainEqual({ countryCode: 'XA', name: 'Testland', count: 2 });

    const conseillerAuth = await tokenOf('conseiller');
    const mine = await http().get('/api/admin/dashboard').set('Authorization', conseillerAuth).expect(200);
    expect(mine.body.scope).toBe('mine');
    expect(mine.body.kpis.activeDossiers).toBe(1);
    expect(mine.body.dossiersByStatus).toContainEqual({ status: 'IN_PROGRESS', count: 1 });
    expect(mine.body.dossiersByDestination).toContainEqual({ countryCode: 'XA', name: 'Testland', count: 1 });
  });

  it('invite un conseiller, qui active son compte avec le lien reçu', async () => {
    await createUser('admin', 'ADMIN');
    const auth = await tokenOf('admin');
    const email = `issa${domain}`;

    const invited = await http()
      .post('/api/admin/team')
      .set('Authorization', auth)
      .send({ email, firstName: 'Issa', lastName: 'Traoré', role: 'ADVISOR' })
      .expect(201);
    expect(invited.body).toMatchObject({ email, role: 'ADVISOR', invitationPending: true, isActive: true });
    expect(await prisma.advisorProfile.count({ where: { userId: invited.body.id } })).toBe(1);
    await http()
      .post('/api/admin/team')
      .set('Authorization', auth)
      .send({ email, firstName: 'Issa', lastName: 'Traoré', role: 'ADVISOR' })
      .expect(409);

    expect(sent).toHaveLength(1);
    expect(sent[0].subject).toBe('Votre accès à GAI2E Conseils');
    const link = sent[0].text.match(/https?:\/\/\S+/)?.[0] ?? '';
    const token = new URL(link).searchParams.get('token') ?? '';

    await http()
      .post('/api/auth/reset-password')
      .send({ token, password: 'Conseil-mdp1', passwordConfirmation: 'Conseil-mdp1' })
      .expect(200);
    await http().post('/api/auth/login').send({ email, password: 'Conseil-mdp1' }).expect(200);

    const team = await http().get('/api/admin/team').set('Authorization', auth).expect(200);
    expect(team.body.find((member: { email: string }) => member.email === email)).toMatchObject({
      invitationPending: false,
    });
  });

  it("désactive un membre (sessions fermées), mais pas son propre compte, et réserve l'équipe aux admins", async () => {
    const admin = await createUser('admin', 'ADMIN');
    const advisor = await createUser('conseiller', 'ADVISOR');
    const auth = await tokenOf('admin');
    const advisorLogin = await http()
      .post('/api/auth/login')
      .send({ email: `conseiller${domain}`, password })
      .expect(200);
    const advisorCookie = ([] as string[]).concat(advisorLogin.headers['set-cookie'] ?? [])[0].split(';')[0];

    await http().get('/api/admin/team').set('Authorization', `Bearer ${advisorLogin.body.accessToken}`).expect(403);
    await http().patch(`/api/admin/team/${admin.id}`).set('Authorization', auth).send({ isActive: false }).expect(400);

    const res = await http()
      .patch(`/api/admin/team/${advisor.id}`)
      .set('Authorization', auth)
      .send({ isActive: false })
      .expect(200);
    expect(res.body.isActive).toBe(false);
    await http().post('/api/auth/refresh').set('Cookie', advisorCookie).expect(401);
    await http()
      .post('/api/auth/login')
      .send({ email: `conseiller${domain}`, password })
      .expect(403);
  });

  it('modifie mon profil et mon mot de passe', async () => {
    await createUser('admin', 'ADMIN');
    const auth = await tokenOf('admin');

    const me = await http()
      .patch('/api/auth/me')
      .set('Authorization', auth)
      .send({ firstName: 'Awa', lastName: 'Ouédraogo', phone: '+22670000000', whatsappPhone: '' })
      .expect(200);
    expect(me.body).toMatchObject({ firstName: 'Awa', phone: '+22670000000', whatsappPhone: null });
    await http()
      .patch('/api/auth/me')
      .set('Authorization', auth)
      .send({ firstName: 'Awa', lastName: 'O', phone: '70 00' })
      .expect(400);

    await http()
      .post('/api/auth/change-password')
      .set('Authorization', auth)
      .send({ currentPassword: 'Mauvais-1', password: 'Nouveau-mdp2', passwordConfirmation: 'Nouveau-mdp2' })
      .expect(400);
    await http()
      .post('/api/auth/change-password')
      .set('Authorization', auth)
      .send({ currentPassword: password, password: 'Nouveau-mdp2', passwordConfirmation: 'Nouveau-mdp2' })
      .expect(200);
    await http()
      .post('/api/auth/login')
      .send({ email: `admin${domain}`, password: 'Nouveau-mdp2' })
      .expect(200);
  });
});
