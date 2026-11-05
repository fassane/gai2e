import type { ReactNode } from 'react';
import { cn, ColgateWrapper, Skeleton } from '@gai2e/ui';

// Carte d'un bloc du tableau de bord : titre, description, contenu (squelette pendant le chargement)
export function DashboardCard({
  title,
  description,
  action,
  isLoading,
  className,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  isLoading?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <ColgateWrapper className={cn('flex flex-col', className)}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-6 rounded-full" />
          ))}
        </div>
      ) : (
        children
      )}
    </ColgateWrapper>
  );
}
