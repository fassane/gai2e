import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { AdminDestinationsService } from './admin-destinations.service';
import {
  AdminDestinationDetailDto,
  AdminDestinationDto,
  CreateDestinationDto,
  CreateProcedureStepDto,
  DocumentTypeOptionDto,
  ReorderDto,
  UpdateDestinationDto,
  UpdateProcedureStepDto,
} from './destinations.dto';

@ApiTags('Back-office : destinations')
@ApiBearerAuth()
@Roles('ADMIN')
@Controller('admin')
export class AdminDestinationsController {
  constructor(private readonly destinations: AdminDestinationsService) {}

  @Get('document-types')
  @ApiOperation({ summary: 'Types de pièces disponibles pour une étape' })
  @ApiOkResponse({ type: [DocumentTypeOptionDto] })
  listDocumentTypes() {
    return this.destinations.listDocumentTypes();
  }

  @Get('destinations')
  @ApiOperation({ summary: 'Toutes les destinations, actives ou non' })
  @ApiOkResponse({ type: [AdminDestinationDto] })
  list() {
    return this.destinations.list();
  }

  @Post('destinations')
  @ApiOperation({ summary: 'Ajouter une destination', description: "L'adresse de la fiche est déduite du nom." })
  @ApiOkResponse({ type: AdminDestinationDto })
  create(@Body() body: CreateDestinationDto) {
    return this.destinations.create(body);
  }

  // Avant :id, pour que « order » ne soit pas lu comme un identifiant
  @Put('destinations/order')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Changer l'ordre des destinations" })
  reorder(@Body() body: ReorderDto) {
    return this.destinations.reorder(body.ids);
  }

  @Get('destinations/:id')
  @ApiOperation({ summary: "Détail d'une destination, avec toutes ses étapes" })
  @ApiOkResponse({ type: AdminDestinationDetailDto })
  get(@Param('id') id: string) {
    return this.destinations.get(id);
  }

  @Patch('destinations/:id')
  @ApiOperation({ summary: 'Modifier, activer ou désactiver une destination' })
  @ApiOkResponse({ type: AdminDestinationDto })
  update(@Param('id') id: string, @Body() body: UpdateDestinationDto) {
    return this.destinations.update(id, body);
  }

  @Post('destinations/:id/steps')
  @ApiOperation({ summary: 'Ajouter une étape à la fin de la procédure' })
  createStep(@Param('id') id: string, @Body() body: CreateProcedureStepDto) {
    return this.destinations.createStep(id, body);
  }

  @Put('destinations/:id/steps/order')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Changer l'ordre des étapes" })
  reorderSteps(@Param('id') id: string, @Body() body: ReorderDto) {
    return this.destinations.reorderSteps(id, body.ids);
  }

  @Patch('destinations/:id/steps/:stepId')
  @ApiOperation({ summary: 'Modifier, activer ou désactiver une étape' })
  updateStep(@Param('id') id: string, @Param('stepId') stepId: string, @Body() body: UpdateProcedureStepDto) {
    return this.destinations.updateStep(id, stepId, body);
  }
}
