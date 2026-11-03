import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserRole } from '@gai2e/db';

// Utilisateur extrait du jeton d'accès par le JwtAuthGuard.
export type RequestUser = { id: string; role: UserRole };

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): RequestUser => context.switchToHttp().getRequest().user,
);
