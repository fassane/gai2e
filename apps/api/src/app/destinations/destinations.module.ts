import { Module } from '@nestjs/common';
import { AdminDestinationsController } from './admin-destinations.controller';
import { AdminDestinationsService } from './admin-destinations.service';
import { DestinationsController } from './destinations.controller';
import { DestinationsService } from './destinations.service';

@Module({
  controllers: [DestinationsController, AdminDestinationsController],
  providers: [DestinationsService, AdminDestinationsService],
})
export class DestinationsModule {}
