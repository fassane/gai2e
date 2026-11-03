import { createZodDto } from 'nestjs-zod';
import { dashboardSchema, inviteTeamMemberSchema, teamMemberSchema, updateTeamMemberSchema } from '@gai2e/shared-types';

export class DashboardDto extends createZodDto(dashboardSchema) {}
export class TeamMemberDto extends createZodDto(teamMemberSchema) {}
export class InviteTeamMemberDto extends createZodDto(inviteTeamMemberSchema) {}
export class UpdateTeamMemberDto extends createZodDto(updateTeamMemberSchema) {}
