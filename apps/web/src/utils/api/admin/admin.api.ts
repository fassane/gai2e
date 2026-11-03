import type {
  Dashboard,
  InviteTeamMemberInput,
  MessageResponse,
  TeamMember,
  UpdateTeamMemberInput,
} from '@gai2e/shared-types';
import { BaseApi } from '../base-api';

// Back-office (apps/api/src/app/admin)
export const AdminApi = BaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<Dashboard, void>({
      query: () => 'admin/dashboard',
      providesTags: ['Dashboard'],
    }),
    getTeam: builder.query<TeamMember[], void>({
      query: () => 'admin/team',
      providesTags: ['Team'],
    }),
    inviteTeamMember: builder.mutation<TeamMember, InviteTeamMemberInput>({
      query: (body) => ({ url: 'admin/team', method: 'POST', body }),
      invalidatesTags: ['Team'],
    }),
    resendInvitation: builder.mutation<MessageResponse, string>({
      query: (id) => ({ url: `admin/team/${id}/invitation`, method: 'POST' }),
    }),
    updateTeamMember: builder.mutation<TeamMember, { id: string } & UpdateTeamMemberInput>({
      query: ({ id, ...body }) => ({ url: `admin/team/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Team', 'Dashboard'],
    }),
  }),
});

export const {
  useGetDashboardQuery,
  useGetTeamQuery,
  useInviteTeamMemberMutation,
  useResendInvitationMutation,
  useUpdateTeamMemberMutation,
} = AdminApi;
