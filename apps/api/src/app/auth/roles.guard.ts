import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { UserRole } from '@gai2e/db';
import type { RequestUser } from './current-user.decorator';
import { ROLES_KEY } from './roles.decorator';

// Guard global, après JwtAuthGuard : vérifie le rôle demandé par @Roles(...).
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) return true;
    const user = context.switchToHttp().getRequest<{ user?: RequestUser }>().user;
    if (!user || !roles.includes(user.role)) throw new ForbiddenException("Vous n'avez pas accès à cette page");
    return true;
  }
}
