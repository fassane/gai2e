import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { join } from 'node:path';
import { AppModule } from './app/app.module';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableShutdownHooks();
  // Derrière Nginx : req.ip est l'IP du client (X-Forwarded-For), pour les sessions et la limite de débit
  app.set('trust proxy', 1);
  // Refresh token de session (cookie httpOnly)
  app.use(cookieParser());
  // Habillage de Swagger (CSS, favicon), copié depuis src/assets par le build
  app.useStaticAssets(join(__dirname, 'assets/docs'), { prefix: `/${globalPrefix}/docs-assets/` });
  setupSwagger(app);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
