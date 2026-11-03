import { createHash, randomBytes } from 'node:crypto';

// Jetons opaques (refresh token, lien de réinitialisation) : seul leur hash SHA-256 est stocké.
export function generateToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
