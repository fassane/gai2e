import type {
  AuthSession,
  AuthUser,
  ForgotPasswordInput,
  LoginInput,
  MessageResponse,
  ResetPasswordInput,
} from '@gai2e/shared-types';
import { onLogout, onSetSession, onSetUser } from '@/redux/slice/auth.slice';
import { BaseApi } from '../base-api';

// Authentification (apps/api/src/app/auth). Le renouvellement de session est dans auth-base-query.ts.
export const AuthApi = BaseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthSession, LoginInput>({
      query: (body) => ({ url: 'auth/login', method: 'POST', body }),
      async onQueryStarted(_input, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled.catch(() => ({ data: null }));
        if (data) dispatch(onSetSession(data));
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: 'auth/logout', method: 'POST' }),
      // Déconnecté côté front même si l'api ne répond pas ; le cache de l'utilisateur est vidé
      async onQueryStarted(_input, { dispatch, queryFulfilled }) {
        await queryFulfilled.catch(() => undefined);
        dispatch(onLogout());
        dispatch(BaseApi.util.resetApiState());
      },
    }),
    me: builder.query<AuthUser, void>({
      query: () => 'auth/me',
      providesTags: ['User'],
      async onQueryStarted(_input, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled.catch(() => ({ data: null }));
        if (data) dispatch(onSetUser(data));
      },
    }),
    forgotPassword: builder.mutation<MessageResponse, ForgotPasswordInput>({
      query: (body) => ({ url: 'auth/forgot-password', method: 'POST', body }),
    }),
    resetPassword: builder.mutation<MessageResponse, ResetPasswordInput>({
      query: (body) => ({ url: 'auth/reset-password', method: 'POST', body }),
    }),
  }),
});

export const { 
  useLoginMutation, 
  useLogoutMutation, 
  useMeQuery, 
  useForgotPasswordMutation, 
  useResetPasswordMutation, 
} = AuthApi;
