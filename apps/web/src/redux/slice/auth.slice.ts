import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthSession, AuthUser } from '@gai2e/shared-types';

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

export type AuthState = {
  status: AuthStatus;
  user: AuthUser | null;
  // Jeton d'accès en mémoire seulement, jamais dans le localStorage : après un rechargement,
  // la session est restaurée par /auth/refresh grâce au cookie httpOnly (voir restoreSession).
  accessToken: string | null;
};

const initialState: AuthState = { status: 'loading', user: null, accessToken: null };

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Connexion ou session renouvelée
    onSetSession: (state, action: PayloadAction<AuthSession>) => {
      state.status = 'authenticated';
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    onSetUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },
    // Déconnexion, ou session expirée / absente
    onLogout: (state) => {
      state.status = 'anonymous';
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { onSetSession, onSetUser, onLogout } = AuthSlice.actions;

export default AuthSlice.reducer;
