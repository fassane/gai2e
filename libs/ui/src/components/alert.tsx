import type { IconType } from 'react-icons';
import { LuInbox } from 'react-icons/lu';
import { cn } from '../lib/utils';

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
