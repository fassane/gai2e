import { Body, Controller, Get, NotFoundException, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { legalPageIdSchema, type LegalPageId } from '@gai2e/shared-types';
import { CurrentUser, type RequestUser } from '../auth/current-user.decorator';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';
import { LegalPageDto, UpdateLegalPageDto } from './legal-pages.dto';
import { LegalPagesService } from './legal-pages.service';

function parseId(id: string): LegalPageId {
  const parsed = legalPageIdSchema.safeParse(id);
  if (!parsed.success) throw new NotFoundException('Page introuvable');
  return parsed.data;
}

@ApiTags('Pages légales')
@Controller()
export class LegalPagesController {
  constructor(private readonly legalPages: LegalPagesService) {}

  @Public()
  @Get('legal-pages/:id')
  @ApiOperation({
    summary: "Contenu d'une page légale",
    description: 'content est nul tant que la page n’a pas été modifiée : le texte par défaut du site s’applique.',
  })
  @ApiOkResponse({ type: LegalPageDto })
  get(@Param('id') id: string) {
    return this.legalPages.get(parseId(id));
  }

  @Put('admin/legal-pages/:id')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier une page légale', description: 'Le HTML est nettoyé avant enregistrement.' })
  @ApiOkResponse({ type: LegalPageDto })
  update(@Param('id') id: string, @Body() body: UpdateLegalPageDto, @CurrentUser() user: RequestUser) {
    return this.legalPages.update(parseId(id), body.content, user.id);
  }
}
