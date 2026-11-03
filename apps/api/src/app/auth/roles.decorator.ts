import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@gai2e/db';

export const ROLES_KEY = 'roles';

// Restreint une route (ou un contrôleur) à certains rôles. Sans @Roles, tout utilisateur connecté passe.
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
