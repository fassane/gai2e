import { cn } from '../lib/utils';

// Logo GAI2E Conseils, piste A « Trajectoire » : chaque point est une étape, jusqu'à la destination.
// Couleurs : tokens --logo-* du thème (vert profond et ambre foncé en clair, crème et ambre en sombre).
// light : version claire forcée, pour les surfaces de marque (footer, panneau de connexion).

// Le symbole seul (favicon, sidebar repliée). light : version claire pour les fonds sombres.
export function LogoMark({ light = false, className }: { light?: boolean; className?: string }) {
  const dot = light ? '#ffffff' : 'var(--logo-ink)';
  return (
    <svg viewBox="0 0 144 144" aria-hidden className={cn('size-9 shrink-0', className)}>
      <circle cx="15" cy="129" r="13" fill={dot} />
      <circle cx="25" cy="109" r="5" fill={dot} />
      <circle cx="37" cy="91" r="5.5" fill={dot} />
      <circle cx="51" cy="74" r="5.5" fill={dot} />
      <circle cx="67" cy="60" r="5.5" fill={dot} />
      <circle cx="85" cy="48" r="5.5" fill={dot} />
      <circle cx="117" cy="27" r="25" fill="var(--logo-sun)" />
    </svg>
  );
}

// Symbole + nom. Le nom est le dernier enfant : `[&>span:last-child]:hidden` n'affiche que le symbole.
export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)} aria-label="GAI2E Conseils" role="img">
      <LogoMark light={light} />
      <span className="flex flex-col leading-none" aria-hidden>
        <span
          className="font-heading text-[1.35rem] font-bold tracking-tight"
          style={{ color: light ? '#ffffff' : 'var(--logo-ink)' }}
        >
          GAI<span style={{ color: light ? 'var(--logo-sun)' : 'var(--logo-two)' }}>2</span>E
        </span>
        <span
          className="mt-1 text-[0.55rem] font-medium tracking-[0.42em] uppercase"
          style={{ color: light ? 'rgb(255 255 255 / 0.85)' : 'var(--logo-sub)' }}
        >
          Conseils
        </span>
      </span>
    </span>
  );
}
