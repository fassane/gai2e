import { LuCalendarClock, LuUserPlus } from 'react-icons/lu';
import { dossierStatusLabels, leadStatusLabels, type LeadStatus } from '@gai2e/shared-types';
import { Alert, Badge, Button, EmptyAlert, Flag, TopTitle } from '@gai2e/ui';
import { useAuth } from '@/redux/hooks';
import { useGetDashboardQuery } from '@/utils/api/admin/admin.api';
import { getApiErrorMessage } from '@/utils/api/errors';
import { formatDate } from '@/utils/user';
import { BarList } from './components/bar-list';
import { DashboardCard } from './components/dashboard-card';
import Overview from './components/overview';

const leadBadge: Record<LeadStatus, 'warning' | 'info' | 'success' | 'muted'> = {
  NEW: 'warning',
  CONTACTED: 'info',
  CONVERTED: 'success',
  CLOSED: 'muted',
};

// Jours restants avant une échéance, en clair
function dueLabel(iso: string) {
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (days <= 0) return "Aujourd'hui";
  if (days === 1) return 'Demain';
  return `Dans ${days} jours`;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { data, isLoading, error, refetch } = useGetDashboardQuery();
  const mine = data?.scope === 'mine';

  return (
    <div>
      <TopTitle
        title="Tableau de bord"
        paragraph={`Bonjour ${user?.firstName ?? ''}, voici ${mine ? 'le point sur vos dossiers' : "l'activité de GAI2E Conseils"}.`}
      />

      {error && (
        <Alert variant="error" className="mb-6">
          {getApiErrorMessage(error, 'Impossible de charger le tableau de bord.')}{' '}
          <Button variant="link" size="sm" className="h-auto p-0" onClick={refetch}>
            Réessayer
          </Button>
        </Alert>
      )}

      <Overview kpis={data?.kpis} scope={data?.scope} />

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <DashboardCard
          title="Dossiers par statut"
          description={
            mine ? 'Vos dossiers, du brouillon à la clôture' : 'Tous les dossiers, du brouillon à la clôture'
          }
          isLoading={isLoading}
        >
          <BarList
            items={(data?.dossiersByStatus ?? []).map(({ status, count }) => ({
              id: status,
              label: dossierStatusLabels[status],
              value: count,
              title: `${dossierStatusLabels[status]} : ${count} dossier${count > 1 ? 's' : ''}`,
            }))}
          />
        </DashboardCard>

        <DashboardCard
          title="Dossiers actifs par destination"
          description="Soumis, en cours ou en pause"
          isLoading={isLoading}
        >
          {data?.dossiersByDestination.length ? (
            <BarList
              items={data.dossiersByDestination.map(({ countryCode, name, count }) => ({
                id: countryCode,
                label: (
                  <span className="flex items-center gap-2">
                    <Flag countryCode={countryCode} className="size-5" />
                    {name}
                  </span>
                ),
                value: count,
                title: `${name} : ${count} dossier${count > 1 ? 's' : ''} actif${count > 1 ? 's' : ''}`,
              }))}
            />
          ) : (
            <EmptyAlert text="Aucune destination configurée (lancer le seed)" />
          )}
        </DashboardCard>

        <DashboardCard
          title="Prochaines échéances"
          description="Étapes à terminer dans les 14 jours"
          isLoading={isLoading}
        >
          {data?.upcomingSteps.length ? (
            <ul className="divide-y">
              {data.upcomingSteps.map((step) => (
                <li key={step.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <Flag countryCode={step.countryCode} className="size-8" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{step.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {step.studentName} · {step.dossierReference}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{dueLabel(step.dueAt)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(step.dueAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyAlert icon={LuCalendarClock} text="Aucune échéance dans les 14 prochains jours" />
          )}
        </DashboardCard>

        <DashboardCard
          title="Derniers prospects"
          description="Demandes reçues par le formulaire du site"
          isLoading={isLoading}
        >
          {data?.recentLeads.length ? (
            <ul className="divide-y">
              {data.recentLeads.map((lead) => (
                <li key={lead.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  {lead.countryCode ? (
                    <Flag countryCode={lead.countryCode} className="size-8" />
                  ) : (
                    <span className="size-8 shrink-0 rounded-full bg-muted" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{lead.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {lead.destination ?? 'Destination non précisée'} · {formatDate(lead.createdAt)}
                    </p>
                  </div>
                  <Badge variant={leadBadge[lead.status]}>{leadStatusLabels[lead.status]}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyAlert icon={LuUserPlus} text="Aucun prospect pour le moment" />
          )}
        </DashboardCard>
      </div>
    </div>
  );
};

export default AdminDashboard;
