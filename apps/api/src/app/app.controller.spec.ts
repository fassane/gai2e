import { ServiceUnavailableException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@gai2e/db';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  const queryRaw = jest.fn();
  let appController: AppController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, { provide: PrismaService, useValue: { $queryRaw: queryRaw } }],
    }).compile();
    appController = app.get(AppController);
  });

  it('répond ok quand la base est joignable', async () => {
    queryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);
    await expect(appController.getHealth()).resolves.toMatchObject({ status: 'ok', database: 'ok' });
  });

  it('répond 503 quand la base est injoignable', async () => {
    queryRaw.mockRejectedValueOnce(new Error('connexion refusée'));
    await expect(appController.getHealth()).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
