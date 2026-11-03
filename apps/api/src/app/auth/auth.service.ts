import { ForbiddenException, Injectable, Logger, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenType, PrismaService, type User } from '@gai2e/db';
import { renderEmail } from '@gai2e/email-templates';
import type { AuthSession, AuthUser, UpdateProfileInput } from '@gai2e/shared-types';
import { MailerService } from '../mail/mailer.service';
import { SiteConfigService } from '../site-config/site-config.service';
import type { AccessTokenPayload } from './jwt-auth.guard';
import { dummyPasswordHash, hashPassword, verifyPassword } from './password';
import { generateToken, hashToken } from './tokens';

const dayMs = 24 * 60 * 60 * 1000;

// Contexte de la requête, conservé sur la session (liste des appareils connectés)
export type ClientInfo = { userAgent?: string; ip?: string };

// Session ouverte : la réponse pour le client et le refresh token à poser en cookie
export type IssuedSession = AuthSession & { refreshToken: string; refreshExpiresAt: Date };

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  readonly accessTokenTtl: number;
  readonly refreshTokenTtlDays: number;
  private readonly resetTokenTtlMinutes: number;
  private readonly invitationTtlDays: number;
  private readonly webUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mailer: MailerService,
    private readonly siteConfig: SiteConfigService,
    config: ConfigService,
  ) {
    this.accessTokenTtl = Number(config.get('JWT_ACCESS_TTL') ?? 900);
    this.refreshTokenTtlDays = Number(config.get('REFRESH_TOKEN_TTL_DAYS') ?? 30);
    this.resetTokenTtlMinutes = Number(config.get('PASSWORD_RESET_TTL_MINUTES') ?? 60);
    this.invitationTtlDays = Number(config.get('INVITATION_TTL_DAYS') ?? 7);
    this.webUrl = (config.get<string>('WEB_URL') ?? 'http://localhost:4200').replace(/\/$/, '');
  }

  async login(email: string, password: string, client: ClientInfo): Promise<IssuedSession> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Toujours vérifier un hash, même pour un email inconnu : même temps de réponse
    const valid = await verifyPassword(password, user?.passwordHash ?? dummyPasswordHash);
    if (!user || !user.passwordHash || !valid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    if (!user.isActive) {
      throw new ForbiddenException('Ce compte est désactivé. Contactez GAI2E Conseils.');
    }

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return this.openSession(user, client);
  }

  // Échange un refresh token valide contre un nouveau jeton d'accès, avec rotation du refresh token.
  async refresh(refreshToken: string | undefined, client: ClientInfo): Promise<IssuedSession> {
    if (!refreshToken) throw new UnauthorizedException('Session expirée');
    const session = await this.prisma.session.findUnique({
      where: { refreshTokenHash: hashToken(refreshToken) },
      include: { user: true },
    });
    if (!session || session.revokedAt || session.expiresAt <= new Date() || !session.user.isActive) {
      throw new UnauthorizedException('Session expirée');
    }

    const nextToken = generateToken();
    const expiresAt = new Date(Date.now() + this.refreshTokenTtlDays * dayMs);
    // updateMany sur l'ancien hash : deux refresh simultanés ne peuvent pas tous les deux réussir
    const { count } = await this.prisma.session.updateMany({
      where: { id: session.id, refreshTokenHash: session.refreshTokenHash, revokedAt: null },
      data: {
        refreshTokenHash: hashToken(nextToken),
        expiresAt,
        lastUsedAt: new Date(),
        userAgent: client.userAgent ?? session.userAgent,
        ip: client.ip ?? session.ip,
      },
    });
    if (count !== 1) throw new UnauthorizedException('Session expirée');

    return this.issue(session.user, nextToken, expiresAt);
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) return;
    await this.prisma.session.updateMany({
      where: { refreshTokenHash: hashToken(refreshToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async me(userId: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isActive) throw new UnauthorizedException('Session expirée');
    return toAuthUser(user);
  }

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<AuthUser> {
    const user = await this.prisma.user.update({ where: { id: userId }, data: input });
    return toAuthUser(user);
  }

  // Les autres sessions sont fermées ; celle d'où vient la demande reste ouverte.
  async changePassword(
    userId: string,
    currentPassword: string,
    password: string,
    currentRefreshToken?: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.passwordHash || !(await verifyPassword(currentPassword, user.passwordHash))) {
      throw new BadRequestException('Mot de passe actuel incorrect');
    }
    const passwordHash = await hashPassword(password);
    const keep = currentRefreshToken ? hashToken(currentRefreshToken) : undefined;
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: userId }, data: { passwordHash } }),
      this.prisma.session.updateMany({
        where: { userId, revokedAt: null, ...(keep && { refreshTokenHash: { not: keep } }) },
        data: { revokedAt: new Date() },
      }),
    ]);
  }

  // Ne révèle jamais si l'email correspond à un compte : la réponse est toujours la même.
  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) return;

    const token = await this.createPasswordToken(user.id, this.resetTokenTtlMinutes * 60 * 1000);

    // Sans attendre l'envoi : le temps de réponse ne trahit pas l'existence du compte
    this.sendResetEmail(user, token).catch((error: Error) =>
      this.logger.error(`Échec de l'envoi du lien de réinitialisation à ${user.email} : ${error.message}`, error.stack),
    );
  }

  // Invitation d'un membre de l'équipe : lien pour choisir son mot de passe (même parcours que la
  // réinitialisation, /reset-password), valable plus longtemps. Renvoyer l'invitation invalide la précédente.
  async sendInvitation(user: User, invitedBy: string): Promise<void> {
    const token = await this.createPasswordToken(user.id, this.invitationTtlDays * 24 * 60 * 60 * 1000);
    const link = `${this.webUrl}/reset-password?token=${encodeURIComponent(token)}&invitation=1`;
    const email = renderEmail(
      'auth/invitation',
      { firstName: user.firstName, invitedBy, link, days: this.invitationTtlDays },
      {
        locale: user.locale,
        webUrl: this.webUrl,
        preheader: `${invitedBy} vous invite sur GAI2E Conseils.`,
        brand: await this.siteConfig.brand(),
      },
    );
    await this.mailer.send({ to: user.email, ...email });
  }

  // Jeton à usage unique pour choisir un mot de passe : seul le dernier émis reste valable
  private async createPasswordToken(userId: string, ttlMs: number): Promise<string> {
    const token = generateToken();
    await this.prisma.$transaction([
      this.prisma.authToken.deleteMany({
        where: { userId, type: AuthTokenType.PASSWORD_RESET, usedAt: null },
      }),
      this.prisma.authToken.create({
        data: {
          userId,
          type: AuthTokenType.PASSWORD_RESET,
          tokenHash: hashToken(token),
          expiresAt: new Date(Date.now() + ttlMs),
        },
      }),
    ]);
    return token;
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const authToken = await this.prisma.authToken.findUnique({
      where: { tokenHash: hashToken(token) },
      include: { user: true },
    });
    if (
      !authToken ||
      authToken.type !== AuthTokenType.PASSWORD_RESET ||
      authToken.usedAt ||
      authToken.expiresAt <= new Date() ||
      !authToken.user.isActive
    ) {
      throw new BadRequestException('Ce lien de réinitialisation est invalide ou a expiré');
    }

    const passwordHash = await hashPassword(password);
    const now = new Date();
    await this.prisma.$transaction(async (tx) => {
      // Usage unique, même en cas de double soumission
      const { count } = await tx.authToken.updateMany({
        where: { id: authToken.id, usedAt: null },
        data: { usedAt: now },
      });
      if (count !== 1) throw new BadRequestException('Ce lien de réinitialisation est invalide ou a expiré');

      await tx.user.update({
        where: { id: authToken.userId },
        // Le lien reçu par email prouve que l'adresse est bien la sienne
        data: { passwordHash, emailVerifiedAt: authToken.user.emailVerifiedAt ?? now },
      });
      // Toutes les sessions ouvertes sont fermées (mot de passe peut-être compromis)
      await tx.session.updateMany({
        where: { userId: authToken.userId, revokedAt: null },
        data: { revokedAt: now },
      });
    });
  }

  private async openSession(user: User, client: ClientInfo): Promise<IssuedSession> {
    const refreshToken = generateToken();
    const expiresAt = new Date(Date.now() + this.refreshTokenTtlDays * dayMs);
    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: hashToken(refreshToken),
        userAgent: client.userAgent?.slice(0, 500),
        ip: client.ip,
        expiresAt,
      },
    });
    return this.issue(user, refreshToken, expiresAt);
  }

  private async issue(user: User, refreshToken: string, refreshExpiresAt: Date): Promise<IssuedSession> {
    const payload: AccessTokenPayload = { sub: user.id, role: user.role };
    const accessToken = await this.jwt.signAsync(payload, { expiresIn: this.accessTokenTtl });
    return { accessToken, expiresIn: this.accessTokenTtl, user: toAuthUser(user), refreshToken, refreshExpiresAt };
  }

  private async sendResetEmail(user: User, token: string) {
    const link = `${this.webUrl}/reset-password?token=${encodeURIComponent(token)}`;
    const email = renderEmail(
      'auth/password-reset',
      { firstName: user.firstName, link, minutes: this.resetTokenTtlMinutes },
      {
        locale: user.locale,
        webUrl: this.webUrl,
        preheader: 'Choisissez un nouveau mot de passe pour votre compte GAI2E Conseils.',
        brand: await this.siteConfig.brand(),
      },
    );
    await this.mailer.send({ to: user.email, ...email });
  }
}

export function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    emailVerified: !!user.emailVerifiedAt,
    phone: user.phone,
    whatsappPhone: user.whatsappPhone,
  };
}
