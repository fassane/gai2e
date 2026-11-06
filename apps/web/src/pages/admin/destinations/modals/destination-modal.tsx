import type { AdminDestination } from '@gai2e/shared-types';
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
  TextareaInput,
} from '@gai2e/ui';
import { useDestinationForm } from '../hooks/use-destination-form';

function DestinationForm({ destination, onClose }: { destination?: AdminDestination; onClose: () => void }) {
  const { register, errors, onSubmit, isLoading } = useDestinationForm(destination, onClose);

  return (
    <form onSubmit={onSubmit} noValidate>
      {errors.root && (
        <Alert variant="error" className="mb-5">
          {errors.root.message}
        </Alert>
      )}
      <Input label="Nom du pays" required placeholder="Canada" {...register('name')} error={errors.name} />
      <div className="grid gap-x-4 sm:grid-cols-2">
        <Input
          label="Code pays (ISO)"
          required
          maxLength={2}
          placeholder="CA"
          disabled={!!destination}
          fieldHelp={destination ? 'Ne change pas après la création.' : 'Ne pourra plus changer ensuite.'}
          {...register('countryCode')}
          error={errors.countryCode}
        />
        <Input
          label="Devise"
          required
          maxLength={3}
          placeholder="CAD"
          {...register('currency')}
          error={errors.currency}
        />
      </div>
      <TextareaInput
        label="Résumé"
        rows={3}
        placeholder="Ce qui rend cette destination intéressante pour un étudiant…"
        fieldHelp="Affiché sur la carte et en haut de la fiche publique."
        {...register('summary')}
        error={errors.summary}
      />
      <DialogFooter className="mt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" variant="cta" isLoading={isLoading}>
          Enregistrer
        </Button>
      </DialogFooter>
    </form>
  );
}

export function DestinationModal({
  open,
  destination,
  onOpenChange,
}: {
  open: boolean;
  destination?: AdminDestination;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {destination ? `Modifier : ${destination.name}` : 'Ajouter une destination'}
          </DialogTitle>
          <DialogDescription>
            {destination
              ? 'Les changements apparaissent aussitôt sur le site.'
              : "L'adresse de la fiche est créée à partir du nom. Ajoutez ensuite les étapes de la procédure."}
          </DialogDescription>
        </DialogHeader>
        {/* Démonté à la fermeture : le formulaire repart des bonnes valeurs à chaque ouverture */}
        {open && <DestinationForm destination={destination} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}
