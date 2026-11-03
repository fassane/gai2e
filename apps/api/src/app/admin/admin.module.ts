import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';
import { DashboardService } from './dashboard.service';
import { TeamService } from './team.service';

@Module({
  imports: [AuthModule],
  controllers: [AdminController],
  providers: [DashboardService, TeamService],
})
export class AdminModule {}
