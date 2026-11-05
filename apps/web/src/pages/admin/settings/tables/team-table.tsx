import type { ColumnDef } from '@tanstack/react-table';
import { LuMailPlus, LuPower } from 'react-icons/lu';
import { roleLabels, type TeamMember } from '@gai2e/shared-types';
import { Alert, Badge, Button, DataTable, Tooltip, TooltipContent, TooltipTrigger, customToast } from '@gai2e/ui';
import { useAuth } from '@/redux/hooks';
import { useGetTeamQuery, useResendInvitationMutation, useUpdateTeamMemberMutation } from '@/utils/api/admin/admin.api';
import { getApiErrorMessage } from '@/utils/api/errors';
import { formatDateTime, getInitials, getName } from '@/utils/user';

function MemberStatus({ member }: { member: TeamMember }) {
  if (!member.isActive) return <Badge variant="muted">Désactivé</Badge>;
  if (member.invitationPending) return <Badge variant="warning">Invitation envoyée</Badge>;
  return <Badge variant="success">Actif</Badge>;
}

function MemberActions({ member }: { member: TeamMember }) {
  const { user } = useAuth();
  const [resend, { isLoading: isResending }] = useResendInvitationMutation();
  const [update, { isLoading: isUpdating }] = useUpdateTeamMemberMutation();
  const isMe = member.id === user?.id;

  const onResend = async () => {
    try {
      await resend(member.id).unwrap();
      customToast.success({ message: `Invitation renvoyée à ${member.email}.` });
    } catch (error) {
      customToast.error({ message: getApiErrorMessage(error) });
    }
  };

  const onToggle = async () => {
    if (member.isActive && !window.confirm(`Désactiver le compte de ${getName(member)} ? Il sera déconnecté.`)) return;
    try {
      await update({ id: member.id, isActive: !member.isActive }).unwrap();
      customToast.success({ message: member.isActive ? 'Compte désactivé.' : 'Compte réactivé.' });
    } catch (error) {
      customToast.error({ message: getApiErrorMessage(error) });
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {member.isActive && member.invitationPending && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon-sm"
              aria-label="Renvoyer l'invitation"
              isLoading={isResending}
              onClick={onResend}
            >
              <LuMailPlus />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Renvoyer l'invitation</TooltipContent>
        </Tooltip>
      )}
      {!isMe && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={member.isActive ? 'danger' : 'secondary'}
              size="icon-sm"
              aria-label={member.isActive ? 'Désactiver' : 'Réactiver'}
              isLoading={isUpdating}
              onClick={onToggle}
            >
              <LuPower />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{member.isActive ? 'Désactiver le compte' : 'Réactiver le compte'}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

const columns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: 'firstName',
    header: 'Membre',
    cell: ({ row }) => {
      const member = row.original;
      return (
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-primary">
            {getInitials(member)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium">{getName(member)}</p>
            <p className="truncate text-xs text-muted-foreground">{member.email}</p>
          </div>
        </div>
      );
    },
  },
  { accessorKey: 'role', header: 'Rôle', cell: ({ row }) => roleLabels[row.original.role] },
  {
    accessorKey: 'activeDossiers',
    header: 'Dossiers actifs',
    cell: ({ row }) => <span className="tabular-nums">{row.original.activeDossiers}</span>,
  },
  { accessorKey: 'isActive', header: 'Statut', cell: ({ row }) => <MemberStatus member={row.original} /> },
  {
    accessorKey: 'lastLoginAt',
    header: 'Dernière connexion',
    cell: ({ row }) => <span className="text-muted-foreground">{formatDateTime(row.original.lastLoginAt)}</span>,
  },
  { id: 'actions', header: '', cell: ({ row }) => <MemberActions member={row.original} /> },
];

export default function TeamTable() {
  const { data, isLoading, error } = useGetTeamQuery();

  return (
    <>
      {error && (
        <Alert variant="error" className="mb-4">
          {getApiErrorMessage(error, "Impossible de charger l'équipe.")}
        </Alert>
      )}
      <DataTable columns={columns} data={data} isLoading={isLoading} />
    </>
  );
}
