import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type RequestUser } from '../auth/current-user.decorator';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';
import { SiteConfigDto, UpdateSiteConfigDto } from './site-config.dto';
import { SiteConfigService } from './site-config.service';

@ApiTags('Configuration du site')
@Controller()
export class SiteConfigController {
  constructor(private readonly siteConfig: SiteConfigService) {}

  @Public()
  @Get('site-config')
  @ApiOperation({
    summary: 'Réglages publics du site',
    description:
      'Présentation, coordonnées et réseaux sociaux (landing, footer). Valeurs par défaut si rien n’est enregistré.',
  })
  @ApiOkResponse({ type: SiteConfigDto })
  get() {
    return this.siteConfig.get();
  }

  @Put('admin/site-config')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier les réglages du site' })
  @ApiOkResponse({ type: SiteConfigDto })
  update(@Body() body: UpdateSiteConfigDto, @CurrentUser() user: RequestUser) {
    return this.siteConfig.update(body, user.id);
  }
}
