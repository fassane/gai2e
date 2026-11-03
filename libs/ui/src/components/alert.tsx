import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { LuCircleAlert, LuCircleCheck, LuInbox, LuInfo } from 'react-icons/lu';
import { cn } from '../lib/utils';

const alertVariants = {
  error: { icon: LuCircleAlert, className: 'border-destructive/20 bg-destructive-soft text-destructive' },
  success: { icon: LuCircleCheck, className: 'border-primary/20 bg-secondary text-primary' },
  info: { icon: LuInfo, className: 'border-info/20 bg-sky-soft text-info' },
};

// Message dans le flux de la page (erreur d'un formulaire, confirmation…)
export function Alert({
  variant = 'info',
  children,
  className,
}: {
  variant?: keyof typeof alertVariants;
  children: ReactNode;
  className?: string;
}) {
  const { icon: Icon, className: variantClass } = alertVariants[variant];
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn('flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm', variantClass, className)}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

interface EmptyAlertProps {
  text?: string;
  icon?: IconType;
  className?: string;
}

// État vide (liste sans résultat, dossier sans pièce…)
export function EmptyAlert({ text, icon: Icon = LuInbox, className }: EmptyAlertProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center gap-3 rounded-3xl border border-dashed bg-muted/50 px-4 py-10 text-center',
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
        <Icon className="size-6" />
      </span>
      <p className="text-sm font-medium text-muted-foreground">{text || 'Aucune donnée pour le moment'}</p>
    </div>
  );
}
