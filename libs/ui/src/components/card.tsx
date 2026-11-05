import * as React from 'react';

import { cn } from '../lib/utils';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn('bg-card text-card-foreground flex flex-col gap-6 rounded-3xl border py-6 shadow-xs', className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-title" className={cn('font-heading text-lg font-semibold', className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-description" className={cn('text-muted-foreground text-sm', className)} {...props} />;
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-6', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card-footer" className={cn('flex items-center px-6 [.border-t]:pt-6', className)} {...props} />
  );
}

export type CardType = {
  id: string;
  label: string;
  value?: number | string;
  color?: string;
  icon?: React.JSX.Element;
};

// Indicateur chiffré (tableaux de bord). color : couleur CSS de l'icône, sarcelle par défaut.
function OverviewCardItem({ item }: { item: CardType }) {
  const color = item.color ?? 'var(--primary)';
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-xs">
      <div className="flex items-center gap-4">
        {!!item.icon && (
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full [&_svg]:size-5"
            style={{ color, backgroundColor: `color-mix(in oklch, ${color} 12%, transparent)` }}
          >
            {item.icon}
          </div>
        )}
        <div>
          <p className="font-heading text-2xl font-semibold">{item.value}</p>
          <p className="text-sm text-muted-foreground">{item.label}</p>
        </div>
      </div>
    </div>
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent, OverviewCardItem };
