import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DossierStatus, PrismaService, type User } from '@gai2e/db';
import type { InviteTeamMemberInput, TeamMember } from '@gai2e/shared-types';
import { AuthService } from '../auth/auth.service';
import type { RequestUser } from '../auth/current-user.decorator';

const activeStatuses: DossierStatus[] = [DossierStatus.SUBMITTED, DossierStatus.IN_PROGRESS, DossierStatus.ON_HOLD];

// Équipe GAI2E : conseillers et administrateurs, invités par un administrateur.
@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
  ) {}

  async list(): Promise<TeamMember[]> {
    const users = await this.prisma.user.findMany({
      where: { role: { in: ['ADVISOR', 'ADMIN'] } },
      orderBy: [{ isActive: 'desc' }, { firstName: 'asc' }, { lastName: 'asc' }],
      include: { _count: { select: { advisedDossiers: { where: { status: { in: activeStatuses } } } } } },
    });
    return users.map((user) => toTeamMember(user, user._count.advisedDossiers));
  }

  async invite(input: InviteTeamMemberInput, inviter: RequestUser): Promise<TeamMember> {
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new ConflictException('Un compte existe déjà avec cette adresse email');

    const user = await this.prisma.user.create({
      data: {
        ...input,
        // Le conseiller a son profil (destinations, plafond de dossiers) dès la création
        ...(input.role === 'ADVISOR' && { advisorProfile: { create: {} } }),
      },
    });
    await this.sendInvitation(user, inviter);
    return toTeamMember(user, 0);
  }

  // Nouveau lien d'invitation (le précédent ne fonctionne plus)
  async resendInvitation(id: string, inviter: RequestUser): Promise<void> {
    const user = await this.findMember(id);
    if (user.passwordHash) throw new BadRequestException('Ce membre a déjà activé son compte');
    if (!user.isActive) throw new BadRequestException("Réactivez ce compte avant de renvoyer l'invitation");
    await this.sendInvitation(user, inviter);
  }

  // Désactiver ferme aussi toutes ses sessions
  async setActive(id: string, isActive: boolean, actor: RequestUser): Promise<TeamMember> {
    if (id === actor.id) throw new BadRequestException('Vous ne pouvez pas désactiver votre propre compte');
    await this.findMember(id);
    const [user] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id },
        data: { isActive },
        include: { _count: { select: { advisedDossiers: { where: { status: { in: activeStatuses } } } } } },
      }),
      ...(isActive
        ? []
        : [
            this.prisma.session.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } }),
          ]),
    ]);
    return toTeamMember(user, user._count.advisedDossiers);
  }

  private async findMember(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || user.role === 'STUDENT') throw new NotFoundException('Membre introuvable');
    return user;
  }

  private async sendInvitation(user: User, inviter: RequestUser) {
    const sender = await this.prisma.user.findUnique({ where: { id: inviter.id } });
    const invitedBy = sender ? `${sender.firstName} ${sender.lastName}` : "L'équipe GAI2E Conseils";
    try {
      await this.auth.sendInvitation(user, invitedBy);
    } catch (error) {
      this.logger.error(`Échec de l'envoi de l'invitation à ${user.email} : ${(error as Error).message}`);
      throw new BadRequestException("Le compte est créé mais l'invitation n'a pas pu être envoyée. Réessayez l'envoi.");
    }
  }
}

function toTeamMember(user: User, activeDossiers: number): TeamMember {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role as TeamMember['role'],
    isActive: user.isActive,
    invitationPending: !user.passwordHash,
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    activeDossiers,
    createdAt: user.createdAt.toISOString(),
  };
}
