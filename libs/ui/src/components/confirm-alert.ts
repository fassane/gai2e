// Demande de confirmation (SweetAlert2), aux couleurs du thème clair ou sombre.
// Chargée à la première ouverture : SweetAlert n'alourdit pas les pages qui n'en ont pas besoin.

const buttonClass =
  'inline-flex h-10 cursor-pointer items-center justify-center rounded-full px-5 text-sm font-semibold outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50';

export type ConfirmAlertOptions<T> = {
  // Texte brut uniquement (titleText / text) : un nom saisi par un utilisateur n'est jamais interprété comme du HTML
  title: string;
  text?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  // Action irréversible ou sensible : bouton rouge
  destructive?: boolean;
  // Action lancée à la confirmation : la fenêtre reste ouverte avec un loader jusqu'à sa fin
  preConfirm?: () => Promise<T>;
};

export async function confirmAlert<T = unknown>({
  title,
  text,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  destructive = false,
  preConfirm,
}: ConfirmAlertOptions<T>): Promise<{ isConfirmed: boolean; value?: T }> {
  const { default: Swal } = await import('sweetalert2');
  const { isConfirmed, value } = await Swal.fire({
    titleText: title,
    text,
    icon: 'warning',
    iconColor: destructive ? 'var(--destructive)' : 'var(--primary)',
    showCancelButton: true,
    confirmButtonText: confirmLabel,
    cancelButtonText: cancelLabel,
    reverseButtons: true,
    focusCancel: destructive,
    showLoaderOnConfirm: !!preConfirm,
    preConfirm,
    allowOutsideClick: () => !Swal.isLoading(),
    // Sinon SweetAlert force la hauteur du <body> et casse les mises en page en pleine hauteur
    heightAuto: false,
    buttonsStyling: false,
    customClass: {
      popup: 'gai2e-swal',
      actions: 'gap-2',
      confirmButton: `${buttonClass} ${destructive ? 'bg-destructive text-white' : 'bg-cta text-cta-foreground'}`,
      cancelButton: `${buttonClass} border bg-card text-foreground`,
    },
  });
  return { isConfirmed, value };
}
