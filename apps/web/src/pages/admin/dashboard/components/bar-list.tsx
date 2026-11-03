import type { ReactNode } from 'react';
import { cn } from '@gai2e/ui';

export type BarListItem = { id: string; label: ReactNode; value: number; title: string };

// Répartition en barres horizontales, une seule couleur (une seule série) : la longueur porte la valeur,
// la valeur est écrite en bout de ligne, le libellé à gauche. Pas de légende : le titre de la carte nomme la série.
export function BarList({ items, className }: { items: BarListItem[]; className?: string }) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return (
    <ul className={cn('space-y-3', className)}>
      {items.map((item) => (
        <li
          key={item.id}
          title={item.title}
          className="group grid grid-cols-[minmax(0,9rem)_1fr_2.5rem] items-center gap-3"
        >
          <span className="truncate text-sm text-muted-foreground">{item.label}</span>
          <span className="h-2.5 overflow-hidden rounded-full bg-muted">
            <span
              className="block h-full rounded-full bg-primary transition-[width] duration-500 group-hover:bg-primary/80"
              style={{ width: `${(item.value / max) * 100}%`, minWidth: item.value ? '0.5rem' : 0 }}
            />
          </span>
          <span className="text-right text-sm font-semibold tabular-nums">{item.value}</span>
        </li>
      ))}
    </ul>
  );
}
