import { lazy, Suspense, useState } from 'react';
import { LuPencil } from 'react-icons/lu';
import { legalPageHasText, type LegalPageId } from '@gai2e/shared-types';
import { Alert, Button, ColgateWrapper, customToast, Skeleton } from '@gai2e/ui';
import { useLegalPage } from '@/hooks/use-legal-page';
import { formatLegalDate, LegalContent } from '@/pages/extra/legal-content';
import { getApiErrorMessage } from '@/utils/api/errors';
import { useUpdateLegalPageMutation } from '@/utils/api/legal-page/legal-page.api';

const RichTextEditor = lazy(() => import('@/components/shared/rich-text-editor'));

const editorFallback = <Skeleton className="h-96 rounded-2xl" />;

// Page légale dans les Paramètres, comme sur Kodinga : lecture, puis « Modifier » ouvre l'éditeur
const LegalPageTab = ({ pageId }: { pageId: LegalPageId }) => {
  const { title, html, updatedAt, isLoading } = useLegalPage(pageId);
  const [update, { isLoading: isSaving }] = useUpdateLegalPageMutation();
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (draft === null) return;
    setError(null);
    try {
      await update({ id: pageId, content: draft }).unwrap();
      customToast.success({ message: `« ${title} » mise à jour sur le site.` });
      setDraft(null);
    } catch (saveError) {
      setError(getApiErrorMessage(saveError));
    }
  };

  return (
    <ColgateWrapper>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-semibold">{title}</h2>
          {!isLoading && (
            <p className="mt-1 text-sm text-muted-foreground">Dernière mise à jour le {formatLegalDate(updatedAt)}</p>
          )}
        </div>
        {draft === null && (
          <Button variant="outline" disabled={isLoading} onClick={() => setDraft(html)}>
            <LuPencil />
            Modifier
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="error" className="mb-5">
          {error}
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-7 w-1/3 rounded-full" />
          <Skeleton className="h-5 rounded-full" />
          <Skeleton className="h-5 w-5/6 rounded-full" />
        </div>
      ) : draft === null ? (
        <LegalContent html={html} className="max-w-3xl" />
      ) : (
        <div>
          <Suspense fallback={editorFallback}>
            <RichTextEditor value={draft} onChange={setDraft} label={title} />
          </Suspense>
          {!legalPageHasText(draft) && (
            <p role="alert" className="mt-2 text-sm text-destructive">
              Le contenu ne peut pas être vide.
            </p>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              disabled={isSaving}
              onClick={() => {
                setDraft(null);
                setError(null);
              }}
            >
              Annuler
            </Button>
            <Button
              variant="cta"
              isLoading={isSaving}
              disabled={!legalPageHasText(draft) || draft === html}
              onClick={save}
            >
              Enregistrer
            </Button>
          </div>
        </div>
      )}
    </ColgateWrapper>
  );
};

export default LegalPageTab;
