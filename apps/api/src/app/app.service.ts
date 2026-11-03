import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '@gai2e/db';

export interface HealthStatus {
  status: 'ok';
  database: 'ok';
  // Commit déployé (IMAGE_TAG, fourni par la CI), `dev` en local
  version: string;
}

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  // Utilisé par la CI après chaque déploiement (et par une éventuelle supervision)
  async getHealth(): Promise<HealthStatus> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      throw new ServiceUnavailableException('Base de données injoignable');
    }
    return { status: 'ok', database: 'ok', version: process.env['APP_VERSION'] ?? 'dev' };
  }
}
