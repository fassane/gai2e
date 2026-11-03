import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthSession, AuthUser, LoginInput } from '@gai2e/shared-types';
import { authApi } from '@/api/auth.api';
import { refreshSession, setAccessToken, subscribeToSession } from '@/api/http';
import { AuthContext, type AuthStatus } from './auth-context';

// Session de l'utilisateur : restaurée au chargement depuis le cookie de session (refresh),
// ouverte par login, fermée par logout ou quand le refresh échoue.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);

  const applySession = useCallback((session: AuthSession | null) => {
    setUser(session?.user ?? null);
    setStatus(session ? 'authenticated' : 'anonymous');
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToSession(applySession);
    refreshSession().then(applySession);
    return unsubscribe;
  }, [applySession]);

  const login = useCallback(
    async (input: LoginInput) => {
      const session = await authApi.login(input);
      setAccessToken(session.accessToken);
      applySession(session);
      return session.user;
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setAccessToken(null);
      applySession(null);
    }
  }, [applySession]);

  const value = useMemo(() => ({ status, user, login, logout }), [status, user, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
