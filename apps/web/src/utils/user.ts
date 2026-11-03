import type { AuthUser, UserRole } from '@gai2e/shared-types';

type Named = Pick<AuthUser, 'firstName' | 'lastName'>;

export const getName = (user?: Named | null) => (user ? `${user.firstName} ${user.lastName}`.trim() : '');

export const getInitials = (user?: Named | null) =>
  user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() : '';

// Rôles qui ont accès au back-office (/admin)
export const STAFF_ROLES: UserRole[] = ['ADMIN', 'ADVISOR'];

export const isStaff = (user?: Pick<AuthUser, 'role'> | null) => !!user && STAFF_ROLES.includes(user.role);

export const isAdmin = (user?: Pick<AuthUser, 'role'> | null) => user?.role === 'ADMIN';

// Page d'accueil après connexion, selon le rôle
export const homePathOf = (user?: Pick<AuthUser, 'role'> | null) => (isStaff(user) ? '/admin/dashboard' : '/');

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
const dateTimeFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });

export const formatDate = (iso?: string | null) => (iso ? dateFormatter.format(new Date(iso)) : '—');
export const formatDateTime = (iso?: string | null) => (iso ? dateTimeFormatter.format(new Date(iso)) : '—');
