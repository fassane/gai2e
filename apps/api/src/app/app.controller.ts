import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AppService } from './app.service';
import { Public } from './auth/public.decorator';

@ApiTags('Santé')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @SkipThrottle()
  @Get('health')
  @ApiOperation({ summary: "État de l'API et de la base de données" })
  getHealth() {
    return this.appService.getHealth();
  }
}
