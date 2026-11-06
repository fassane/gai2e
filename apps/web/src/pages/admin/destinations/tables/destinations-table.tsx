import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import { LuArrowDown, LuArrowUp, LuListChecks, LuPencil, LuPower } from 'react-icons/lu';
import type { AdminDestination } from '@gai2e/shared-types';
import {
  Alert,
  Badge,
  Button,
  DataTable,
  Flag,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  confirmAlert,
  customToast,
} from '@gai2e/ui';
import {
  useGetAdminDestinationsQuery,
  useReorderDestinationsMutation,
  useUpdateDestinationMutation,
} from '@/utils/api/destination/destination.api';
import { getApiErrorMessage } from '@/utils/api/errors';
import { formatDate } from '@/utils/user';
import { DestinationModal } from '../modals/destination-modal';

function IconAction({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function DestinationActions({ destination, ids }: { destination: AdminDestination; ids: string[] }) {
  const [open, setOpen] = useState(false);
  const [update] = useUpdateDestinationMutation();
  const [reorder, { isLoading: isReordering }] = useReorderDestinationsMutation();
  const index = ids.indexOf(destination.id);

  const move = async (offset: number) => {
    const next = [...ids];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    try {
      await reorder(next).unwrap();
    } catch (error) {
      customToast.error({ message: getApiErrorMessage(error) });
    }
  };

  const onToggle = async () => {
    const { isActive, name } = destination;
    const { isConfirmed, value: error } = await confirmAlert<string | null>({
      title: `${isActive ? 'Désactiver' : 'Réactiver'} ${name} ?`,
      text: isActive
        ? 'Sa fiche disparaît du site. Les dossiers en cours ne changent pas.'
        : 'Sa fiche réapparaît sur le site.',
      confirmLabel: isActive ? 'Désactiver' : 'Réactiver',
      destructive: isActive,
      preConfirm: () =>
        update({ id: destination.id, isActive: !isActive })
          .unwrap()
          .then(() => null)
          .catch((updateError: unknown) => getApiErrorMessage(updateError)),
    });
    if (!isConfirmed) return;
    if (error) customToast.error({ message: error });
    else customToast.success({ message: isActive ? 'Destination désactivée.' : 'Destination réactivée.' });
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      <IconAction label="Monter">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Monter ${destination.name}`}
          disabled={index === 0 || isReordering}
          onClick={() => move(-1)}
        >
          <LuArrowUp />
        </Button>
      </IconAction>
      <IconAction label="Descendre">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Descendre ${destination.name}`}
          disabled={index === ids.length - 1 || isReordering}
          onClick={() => move(1)}
        >
          <LuArrowDown />
        </Button>
      </IconAction>
      <IconAction label="Gérer les étapes">
        <Button asChild variant="secondary" size="icon-sm">
          <Link to={`/admin/destinations/${destination.id}`} aria-label={`Gérer les étapes de ${destination.name}`}>
            <LuListChecks />
          </Link>
        </Button>
      </IconAction>
      <IconAction label="Modifier">
        <Button
          variant="secondary"
          size="icon-sm"
          aria-label={`Modifier ${destination.name}`}
          onClick={() => setOpen(true)}
        >
          <LuPencil />
        </Button>
      </IconAction>
      <IconAction label={destination.isActive ? 'Désactiver' : 'Réactiver'}>
        <Button
          variant={destination.isActive ? 'danger' : 'secondary'}
          size="icon-sm"
          aria-label={`${destination.isActive ? 'Désactiver' : 'Réactiver'} ${destination.name}`}
          onClick={onToggle}
        >
          <LuPower />
        </Button>
      </IconAction>
      <DestinationModal open={open} destination={destination} onOpenChange={setOpen} />
    </div>
  );
}

export default function DestinationsTable() {
  const { data, isLoading, error } = useGetAdminDestinationsQuery();
  const ids = data?.map(({ id }) => id) ?? [];

  const columns: ColumnDef<AdminDestination>[] = [
    {
      accessorKey: 'name',
      header: 'Destination',
      cell: ({ row }) => {
        const destination = row.original;
        return (
          <Link to={`/admin/destinations/${destination.id}`} className="flex items-center gap-3 hover:underline">
            <Flag countryCode={destination.countryCode} className="size-8" />
            <span>
              <span className="block font-medium">{destination.name}</span>
              <span className="block text-xs text-muted-foreground">
                {destination.countryCode} · {destination.currency}
              </span>
            </span>
          </Link>
        );
      },
    },
    {
      accessorKey: 'activeStepCount',
      header: 'Étapes actives',
      cell: ({ row }) => <span className="tabular-nums">{row.original.activeStepCount}</span>,
    },
    {
      accessorKey: 'isActive',
      header: 'Statut',
      cell: ({ row }) =>
        row.original.isActive ? <Badge variant="success">Publiée</Badge> : <Badge variant="muted">Désactivée</Badge>,
    },
    {
      accessorKey: 'updatedAt',
      header: 'Modifiée le',
      cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.updatedAt)}</span>,
    },
    { id: 'actions', header: '', cell: ({ row }) => <DestinationActions destination={row.original} ids={ids} /> },
  ];

  return (
    <>
      {error && (
        <Alert variant="error" className="mb-4">
          {getApiErrorMessage(error, 'Impossible de charger les destinations.')}
        </Alert>
      )}
      <DataTable columns={columns} data={data} isLoading={isLoading} />
    </>
  );
}
