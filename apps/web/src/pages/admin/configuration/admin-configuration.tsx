import { useState } from 'react';
import { LuInfo, LuPhone, LuSave, LuShare2 } from 'react-icons/lu';
import { Alert, Button, cn, ColgateWrapper, Skeleton, TopTitle } from '@gai2e/ui';
import { getApiErrorMessage } from '@/utils/api/errors';
import { formatDateTime } from '@/utils/user';
import { useSiteConfigForm } from './hooks/use-site-config-form';
import { ContactTab } from './tabs/contact-tab';
import { PresentationTab } from './tabs/presentation-tab';
import { SocialsTab } from './tabs/socials-tab';

type ConfigTab = 'presentation' | 'contact' | 'socials';

const tabs: { id: ConfigTab; label: string; icon: typeof LuInfo; fields: string[] }[] = [
  { id: 'presentation', label: 'Présentation', icon: LuInfo, fields: ['description'] },
  {
    id: 'contact',
    label: 'Coordonnées',
    icon: LuPhone,
    fields: ['contactEmail', 'whatsappPhone', 'phone', 'address', 'openingHours'],
  },
  {
    id: 'socials',
    label: 'Réseaux sociaux',
    icon: LuShare2,
    fields: ['facebookUrl', 'instagramUrl', 'linkedinUrl', 'tiktokUrl', 'youtubeUrl', 'xUrl'],
  },
];

// Configuration du site (sur le modèle de Moovi et yov-app) : réglages globaux en onglets, un seul enregistrement.
const AdminConfiguration = () => {
  const [activeTab, setActiveTab] = useState<ConfigTab>('presentation');
  // Erreur de validation : on affiche le premier onglet concerné
  const showInvalidTab = (fields: string[]) => {
    const tab = tabs.find((candidate) => candidate.fields.some((field) => fields.includes(field)));
    if (tab) setActiveTab(tab.id);
  };
  const { form, onSubmit, isLoading, isFetching, fetchError, updatedAt } = useSiteConfigForm(showInvalidTab);
  const errors = form.formState.errors;

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <TopTitle
          title="Configuration"
          paragraph="Présentation, coordonnées et réseaux sociaux affichés sur le site et dans les emails."
          wrapperClassName="mb-0"
        />
        <div className="flex flex-col items-end gap-1">
          <Button type="submit" variant="cta" isLoading={isLoading} disabled={isFetching || !!fetchError}>
            <LuSave />
            Enregistrer
          </Button>
          <p className="text-xs text-muted-foreground">
            {updatedAt ? `Modifié le ${formatDateTime(updatedAt)}` : 'Valeurs par défaut, jamais modifiées'}
          </p>
        </div>
      </div>

      {(fetchError || errors.root) && (
        <Alert variant="error" className="mb-5">
          {errors.root?.message ?? getApiErrorMessage(fetchError, 'Impossible de charger la configuration.')}
        </Alert>
      )}

      <ColgateWrapper>
        <div role="tablist" className="scrollbar-none -mx-1 mb-6 flex gap-1 overflow-x-auto border-b">
          {tabs.map(({ id, label, icon: Icon, fields }) => {
            const hasError = fields.some((field) => field in errors);
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activeTab === id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'flex shrink-0 cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors',
                  activeTab === id
                    ? 'text-primary shadow-[inset_0_-2px_0_0_var(--primary)]'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="size-4" />
                {label}
                {hasError && <span className="size-1.5 rounded-full bg-destructive" aria-label="contient une erreur" />}
              </button>
            );
          })}
        </div>

        {isFetching ? (
          <div className="space-y-4">
            <Skeleton className="h-12 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
        ) : (
          <>
            {/* Onglets masqués plutôt que démontés : les valeurs saisies restent dans le formulaire */}
            <div hidden={activeTab !== 'presentation'}>
              <PresentationTab form={form} />
            </div>
            <div hidden={activeTab !== 'contact'}>
              <ContactTab form={form} />
            </div>
            <div hidden={activeTab !== 'socials'}>
              <SocialsTab form={form} />
            </div>
          </>
        )}
      </ColgateWrapper>
    </form>
  );
};

export default AdminConfiguration;
