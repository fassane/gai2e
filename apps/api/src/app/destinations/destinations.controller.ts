import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { DestinationDetailDto, DestinationSummaryDto } from './destinations.dto';
import { DestinationsService } from './destinations.service';

@ApiTags('Destinations')
@Public()
@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinations: DestinationsService) {}

  @Get()
  @ApiOperation({ summary: 'Destinations ayant une procédure configurée' })
  @ApiOkResponse({ type: [DestinationSummaryDto] })
  list() {
    return this.destinations.list();
  }

  @Get(':slug')
  @ApiOperation({ summary: "Fiche d'une destination : étapes de la procédure et pièces à prévoir" })
  @ApiOkResponse({ type: DestinationDetailDto })
  get(@Param('slug') slug: string) {
    return this.destinations.get(slug);
  }
}
