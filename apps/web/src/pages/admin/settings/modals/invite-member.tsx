import { roleLabels } from '@gai2e/shared-types';
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  SelectInput,
} from '@gai2e/ui';
import { useInviteMemberForm } from '../hooks/use-invite-member-form';

const roleOptions = [
  { value: 'ADVISOR', label: `${roleLabels.ADVISOR} : suit les dossiers qui lui sont assignés` },
  { value: 'ADMIN', label: `${roleLabels.ADMIN} : accès complet et gestion de l'équipe` },
];

export function InviteMemberModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { register, errors, onSubmit, isLoading, reset } = useInviteMemberForm(() => onOpenChange(false));

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) reset();
        onOpenChange(value);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Inviter un membre</DialogTitle>
          <DialogDescription>
            Il recevra un email pour choisir son mot de passe. Le lien est valable 7 jours.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} noValidate>
          {errors.root && (
            <Alert variant="error" className="mb-5">
              {errors.root.message}
            </Alert>
          )}
          <div className="grid gap-x-4 sm:grid-cols-2">
            <Input label="Prénom" required {...register('firstName')} error={errors.firstName} />
            <Input label="Nom" required {...register('lastName')} error={errors.lastName} />
          </div>
          <Input
            label="Adresse email"
            type="email"
            required
            placeholder="prenom.nom@gai2e.com"
            {...register('email')}
            error={errors.email}
          />
          <SelectInput label="Rôle" required options={roleOptions} {...register('role')} error={errors.role} />
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="cta" isLoading={isLoading}>
              Envoyer l'invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
