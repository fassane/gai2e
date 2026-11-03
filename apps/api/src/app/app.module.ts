import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { DbModule } from '@gai2e/db';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Gai2eValidationPipe } from './validation.pipe';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DbModule],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: Gai2eValidationPipe }],
})
export class AppModule {}
