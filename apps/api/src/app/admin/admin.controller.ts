import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type RequestUser } from '../auth/current-user.decorator';
import { MessageResponseDto } from '../auth/auth.dto';
import { Roles } from '../auth/roles.decorator';
import { DashboardDto, InviteTeamMemberDto, TeamMemberDto, UpdateTeamMemberDto } from './admin.dto';
import { DashboardService } from './dashboard.service';
import { TeamService } from './team.service';

@ApiTags('Back-office')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(
    private readonly dashboard: DashboardService,
    private readonly team: TeamService,
  ) {}

  @Get('dashboard')
  @Roles('ADMIN', 'ADVISOR')
  @ApiOperation({
    summary: 'Tableau de bord',
    description: 'Tous les dossiers pour un administrateur, ceux qui lui sont assignés pour un conseiller.',
  })
  @ApiOkResponse({ type: DashboardDto })
  getDashboard(@CurrentUser() user: RequestUser) {
    return this.dashboard.get(user);
  }

  @Get('team')
  @Roles('ADMIN')
  @ApiOperation({ summary: "Membres de l'équipe (conseillers et administrateurs)" })
  @ApiOkResponse({ type: [TeamMemberDto] })
  listTeam() {
    return this.team.list();
  }

  @Post('team')
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Inviter un membre',
    description: 'Crée le compte et envoie par email un lien pour choisir son mot de passe.',
  })
  @ApiOkResponse({ type: TeamMemberDto })
  invite(@Body() body: InviteTeamMemberDto, @CurrentUser() user: RequestUser) {
    return this.team.invite(body, user);
  }

  @Post('team/:id/invitation')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Renvoyer l'invitation", description: 'Le lien précédent ne fonctionne plus.' })
  @ApiOkResponse({ type: MessageResponseDto })
  async resendInvitation(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    await this.team.resendInvitation(id, user);
    return { message: 'Invitation renvoyée.' };
  }

  @Patch('team/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Activer ou désactiver un membre', description: 'Désactiver ferme ses sessions.' })
  @ApiOkResponse({ type: TeamMemberDto })
  update(@Param('id') id: string, @Body() body: UpdateTeamMemberDto, @CurrentUser() user: RequestUser) {
    return this.team.setActive(id, body.isActive, user);
  }
}
