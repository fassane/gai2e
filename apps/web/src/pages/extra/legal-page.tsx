import { Link } from 'react-router-dom';
import type { LegalPageId } from '@gai2e/shared-types';
import { ColgateWrapper, Skeleton } from '@gai2e/ui';
import { PageBanner } from '@/components/shared/page-banner';
import { useLegalPage } from '@/hooks/use-legal-page';
import { formatLegalDate, LegalContent } from './legal-content';

// Page légale publique : bannière, date de mise à jour, contenu (modifiable dans le back-office > Paramètres)
export function LegalPage({ pageId, related }: { pageId: LegalPageId; related: { label: string; to: string } }) {
  const { title, intro, html, updatedAt, isLoading } = useLegalPage(pageId);

  return (
    <div>
      <PageBanner title={title} paragraph={intro}>
        {!isLoading && (
          <p className="mt-4 text-sm text-muted-foreground">Dernière mise à jour le {formatLegalDate(updatedAt)}</p>
        )}
      </PageBanner>

      <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
        <ColgateWrapper className="md:p-10">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-7 w-1/3 rounded-full" />
              <Skeleton className="h-5 rounded-full" />
              <Skeleton className="h-5 w-5/6 rounded-full" />
              <Skeleton className="h-5 w-2/3 rounded-full" />
            </div>
          ) : (
            <LegalContent html={html} />
          )}
          <p className="mt-10 border-t pt-6 text-sm text-muted-foreground">
            À lire aussi :{' '}
            <Link to={related.to} className="font-medium text-primary hover:underline">
              {related.label}
            </Link>
          </p>
        </ColgateWrapper>
      </div>
    </div>
  );
}
