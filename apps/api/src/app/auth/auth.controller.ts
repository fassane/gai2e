import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { CookieOptions, Request, Response } from 'express';
import {
  AuthSessionDto,
  AuthUserDto,
  ForgotPasswordDto,
  LoginDto,
  ChangePasswordDto,
  UpdateProfileDto,
  MessageResponseDto,
  ResetPasswordDto,
} from './auth.dto';
import { AuthService, type ClientInfo, type IssuedSession } from './auth.service';
import { CurrentUser, type RequestUser } from './current-user.decorator';
import { Public } from './public.decorator';

// Refresh token en cookie httpOnly, envoyé uniquement aux routes /api/auth
export const REFRESH_COOKIE = 'gai2e_refresh';
const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env['NODE_ENV'] === 'production',
  sameSite: 'strict',
  path: '/api/auth',
};

const minute = 60_000;

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: minute } })
  @ApiOperation({
    summary: 'Connexion par email et mot de passe',
    description: 'Pose le refresh token en cookie httpOnly.',
  })
  @ApiOkResponse({ type: AuthSessionDto })
  async login(@Body() body: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const session = await this.auth.login(body.email, body.password, clientInfo(req));
    return this.withCookie(res, session);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: minute } })
  @ApiCookieAuth(REFRESH_COOKIE)
  @ApiOperation({ summary: "Nouveau jeton d'accès à partir du cookie de session" })
  @ApiOkResponse({ type: AuthSessionDto })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      const session = await this.auth.refresh(req.cookies?.[REFRESH_COOKIE], clientInfo(req));
      return this.withCookie(res, session);
    } catch (error) {
      res.clearCookie(REFRESH_COOKIE, refreshCookieOptions);
      throw error;
    }
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCookieAuth(REFRESH_COOKIE)
  @ApiOperation({ summary: 'Déconnexion : ferme la session et efface le cookie' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.auth.logout(req.cookies?.[REFRESH_COOKIE]);
    res.clearCookie(REFRESH_COOKIE, refreshCookieOptions);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Utilisateur connecté' })
  @ApiOkResponse({ type: AuthUserDto })
  me(@CurrentUser() user: RequestUser) {
    return this.auth.me(user.id);
  }

  @Patch('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier mes informations (nom, téléphones)' })
  @ApiOkResponse({ type: AuthUserDto })
  updateMe(@CurrentUser() user: RequestUser, @Body() body: UpdateProfileDto) {
    return this.auth.updateProfile(user.id, body);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Throttle({ default: { limit: 10, ttl: minute } })
  @ApiOperation({
    summary: 'Changer mon mot de passe',
    description: "Ferme les autres sessions ouvertes ; celle d'où vient la demande reste ouverte.",
  })
  @ApiOkResponse({ type: MessageResponseDto })
  async changePassword(@CurrentUser() user: RequestUser, @Body() body: ChangePasswordDto, @Req() req: Request) {
    await this.auth.changePassword(user.id, body.currentPassword, body.password, req.cookies?.[REFRESH_COOKIE]);
    return { message: 'Votre mot de passe a été modifié.' };
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: minute } })
  @ApiOperation({
    summary: 'Demande de réinitialisation du mot de passe',
    description: 'Envoie un lien par email si un compte existe. La réponse est la même dans tous les cas.',
  })
  @ApiOkResponse({ type: MessageResponseDto })
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    await this.auth.forgotPassword(body.email);
    return {
      message: 'Si un compte existe avec cette adresse, un lien de réinitialisation vient de vous être envoyé.',
    };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: minute } })
  @ApiOperation({
    summary: 'Nouveau mot de passe à partir du lien reçu par email',
    description: 'Ferme toutes les sessions ouvertes du compte.',
  })
  @ApiOkResponse({ type: MessageResponseDto })
  async resetPassword(@Body() body: ResetPasswordDto) {
    await this.auth.resetPassword(body.token, body.password);
    return { message: 'Votre mot de passe a été modifié. Vous pouvez maintenant vous connecter.' };
  }

  private withCookie(res: Response, { refreshToken, refreshExpiresAt, ...session }: IssuedSession) {
    res.cookie(REFRESH_COOKIE, refreshToken, { ...refreshCookieOptions, expires: refreshExpiresAt });
    return session;
  }
}

function clientInfo(req: Request): ClientInfo {
  return { userAgent: req.get('user-agent') ?? undefined, ip: req.ip };
}
