import { LuBellRing, LuClockAlert, LuFileSearch, LuFolderOpen, LuGraduationCap, LuInbox } from 'react-icons/lu';
import type { Dashboard } from '@gai2e/shared-types';
import { OverviewCardItem, Skeleton, type CardType } from '@gai2e/ui';

// Indicateurs principaux. Les couleurs de la charte suffisent : chaque carte porte aussi son libellé.
const Overview = ({ kpis, scope }: { kpis?: Dashboard['kpis']; scope?: Dashboard['scope'] }) => {
  if (!kpis) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-[86px] rounded-3xl" />
        ))}
      </div>
    );
  }

  const mine = scope === 'mine';
  const cards: CardType[] = [
    {
      id: 'active-dossiers',
      value: kpis.activeDossiers,
      label: mine ? 'Mes dossiers actifs' : 'Dossiers actifs',
      icon: <LuFolderOpen />,
    },
    {
      id: 'awaiting-assignment',
      value: kpis.awaitingAssignment,
      label: 'Dossiers à assigner',
      icon: <LuInbox />,
      color: 'var(--info)',
    },
    {
      id: 'documents-to-review',
      value: kpis.documentsToReview,
      label: 'Pièces à vérifier',
      icon: <LuFileSearch />,
      color: 'var(--peach)',
    },
    {
      id: 'overdue-steps',
      value: kpis.overdueSteps,
      label: 'Étapes en retard',
      icon: <LuClockAlert />,
      color: 'var(--destructive)',
    },
    {
      id: 'new-leads',
      value: kpis.newLeads,
      label: 'Prospects à recontacter',
      icon: <LuBellRing />,
      color: 'var(--warning)',
    },
    {
      id: 'students',
      value: kpis.students,
      label: mine ? 'Mes étudiants' : 'Étudiants inscrits',
      icon: <LuGraduationCap />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <OverviewCardItem key={card.id} item={card} />
      ))}
    </div>
  );
};

export default Overview;
