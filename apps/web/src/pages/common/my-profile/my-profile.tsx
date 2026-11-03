import { useState } from 'react';
import { LuChevronRight, LuLock, LuPencil } from 'react-icons/lu';
import { roleLabels } from '@gai2e/shared-types';
import { Button } from '@gai2e/ui';
import { useAuth } from '@/redux/hooks';
import { getInitials, getName } from '@/utils/user';
import { useEditProfileForm } from './hooks/use-edit-profile-form';
import { ChangePasswordModal } from './modals/change-password-modal';
import { ProfileForm, ProfileSection } from './profile-form';

const PROFILE_FORM_ID = 'my-profile-form';

// Profil du compte connecté (sur le modèle de jed-app-pwa), commun à tous les espaces :
// carte d'identité, informations modifiables après « Modifier », sécurité (mot de passe dans une modale).
const MyProfile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const { form, onSubmit, isLoading, resetForm } = useEditProfileForm(() => setEditing(false));

  const roleLabel = user ? roleLabels[user.role] : '';
  const cancelEditing = () => {
    resetForm();
    setEditing(false);
  };

  // Clés distinctes : sans elles, React réutiliserait le bouton « Modifier » pour « Enregistrer » pendant le clic,
  // et le navigateur soumettrait aussitôt le formulaire.
  const actions = editing ? (
    <>
      <Button key="save" type="submit" form={PROFILE_FORM_ID} variant="cta" size="sm" isLoading={isLoading}>
        Enregistrer
      </Button>
      <Button key="cancel" variant="outline" size="sm" onClick={cancelEditing}>
        Annuler
      </Button>
    </>
  ) : (
    <Button key="edit" type="button" variant="cta" size="sm" onClick={() => setEditing(true)}>
      <LuPencil />
      Modifier
    </Button>
  );

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      {/* Carte d'en-tête */}
      <div className="overflow-hidden rounded-3xl border bg-card shadow-xs">
        <div
          aria-hidden
          className="relative h-24 overflow-hidden bg-primary [background-image:radial-gradient(circle_at_85%_40%,color-mix(in_oklch,var(--peach)_45%,transparent)_0%,transparent_55%),linear-gradient(135deg,var(--primary)_0%,color-mix(in_oklch,var(--primary)_70%,black)_100%)]"
        />
        <div className="px-6 pb-5">
          {/* relative : passe au-dessus de la bannière qu'il chevauche */}
          <div className="relative -mt-8 flex flex-wrap items-end gap-4">
            <span className="flex size-20 shrink-0 items-center justify-center self-start rounded-3xl border-4 border-card bg-secondary font-serif text-2xl font-semibold text-primary shadow-md">
              {getInitials(user)}
            </span>
            <div className="flex min-w-0 flex-1 flex-wrap items-end justify-between gap-3 pt-10 pb-1">
              <div className="min-w-0">
                <p className="truncate font-serif text-xl font-semibold">{getName(user)}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {roleLabel} · {user?.email}
                </p>
              </div>
              <div className="flex gap-2">{actions}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Informations personnelles et sécurité */}
      <div className="rounded-3xl border bg-card p-6 shadow-xs">
        <ProfileForm
          form={form}
          onSubmit={onSubmit}
          formId={PROFILE_FORM_ID}
          editing={editing}
          email={user?.email ?? ''}
          roleLabel={roleLabel}
        />

        <ProfileSection title="Sécurité">
          <button
            type="button"
            onClick={() => setPasswordOpen(true)}
            className="group flex w-full cursor-pointer items-center gap-3 rounded-2xl border p-4 text-left transition-colors hover:border-primary/30 hover:bg-secondary/60 focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:outline-none"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
              <LuLock className="size-4" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold">Changer le mot de passe</span>
              <span className="block text-xs text-muted-foreground">Recommandé tous les 6 mois</span>
            </span>
            <LuChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </button>
        </ProfileSection>

        {editing && (
          <div className="mt-6 flex gap-3">
            <Button type="submit" form={PROFILE_FORM_ID} variant="cta" className="flex-1" isLoading={isLoading}>
              Enregistrer les modifications
            </Button>
            <Button variant="outline" onClick={cancelEditing}>
              Annuler
            </Button>
          </div>
        )}
      </div>

      <ChangePasswordModal open={passwordOpen} onOpenChange={setPasswordOpen} />
    </div>
  );
};

export default MyProfile;
