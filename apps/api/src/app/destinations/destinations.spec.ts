import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { PrismaService } from '@gai2e/db';
import { AppModule } from '../app.module';

// Tests d'intégration sur la base gai2e_test (voir apps/api/test).
describe('Destinations publiques', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const codes = ['XC', 'XD'];
  const documentCodes = ['TEST_DEST_PASSPORT', 'TEST_DEST_VISA'];

  const cleanup = async () => {
    await prisma.destination.deleteMany({ where: { countryCode: { in: codes } } });
    await prisma.documentType.deleteMany({ where: { code: { in: documentCodes } } });
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    prisma = app.get(PrismaService);
    await cleanup();

    const passport = await prisma.documentType.create({ data: { code: documentCodes[0], label: 'Passeport test' } });
    const visa = await prisma.documentType.create({ data: { code: documentCodes[1], label: 'Visa test' } });
    const destination = await prisma.destination.create({
      data: {
        countryCode: 'XC',
        slug: 'test-xc',
        name: 'Testland',
        currency: 'EUR',
        summary: 'Résumé',
        displayOrder: 99,
      },
    });
    await prisma.destination.create({
      data: { countryCode: 'XD', slug: 'test-xd', name: 'Inactif', currency: 'EUR', isActive: false },
    });
    const step = {
      destinationId: destination.id,
      description: 'Description',
      category: 'VISA' as const,
    };
    await prisma.procedureStepTemplate.create({
      data: {
        ...step,
        code: 'second',
        title: 'Deuxième',
        position: 2,
        requiredDocumentTypes: { connect: [{ id: passport.id }, { id: visa.id }] },
      },
    });
    await prisma.procedureStepTemplate.create({
      data: {
        ...step,
        code: 'premier',
        title: 'Première',
        position: 1,
        defaultDueDaysBeforeIntake: 90,
        isOptional: true,
        requiredDocumentTypes: { connect: [{ id: passport.id }] },
      },
    });
    await prisma.procedureStepTemplate.create({
      data: { ...step, code: 'masquee', title: 'Masquée', position: 3, isActive: false },
    });
  });

  afterAll(async () => {
    await cleanup();
    await app.close();
  });

  const http = () => request(app.getHttpServer());

  it('liste les destinations actives sans authentification', async () => {
    const res = await http().get('/api/destinations').expect(200);
    expect(res.body).toContainEqual({
      countryCode: 'XC',
      slug: 'test-xc',
      name: 'Testland',
      summary: 'Résumé',
      stepCount: 2,
    });
    expect(res.body.find((d: { slug: string }) => d.slug === 'test-xd')).toBeUndefined();
  });

  it('renvoie la fiche : étapes actives dans l’ordre et pièces sans doublon', async () => {
    const res = await http().get('/api/destinations/test-xc').expect(200);
    expect(res.body.steps.map((s: { title: string }) => s.title)).toEqual(['Première', 'Deuxième']);
    expect(res.body.steps[0]).toMatchObject({ dueDaysBeforeIntake: 90, isOptional: true });
    expect(res.body.documents.map((d: { code: string }) => d.code).sort()).toEqual(documentCodes);
  });

  it('répond 404 pour une destination inconnue ou inactive', async () => {
    await http().get('/api/destinations/inconnue').expect(404);
    await http().get('/api/destinations/test-xd').expect(404);
  });
});
