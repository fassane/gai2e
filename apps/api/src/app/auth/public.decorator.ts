import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Route accessible sans jeton d'accès (le JwtAuthGuard est global).
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
