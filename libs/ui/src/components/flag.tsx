import type { FlagComponent } from 'country-flag-icons/react/3x2';
import {
  AU,
  BE,
  BF,
  BJ,
  CA,
  CD,
  CG,
  CH,
  CI,
  CM,
  CN,
  DE,
  ES,
  FR,
  GA,
  GB,
  GH,
  GN,
  IE,
  IN,
  IT,
  JP,
  KR,
  MA,
  ML,
  NE,
  NG,
  NL,
  NO,
  PT,
  SN,
  TD,
  TG,
  TN,
  TR,
  US,
} from 'country-flag-icons/react/3x2';
import { cn } from '../lib/utils';

// Seuls les drapeaux utiles sont importés (pas tout le paquet) : pays d'origine des étudiants et destinations.
// Ajouter ici le code ISO d'une nouvelle destination.
const flags: Record<string, FlagComponent> = {
  AU,
  BE,
  BF,
  BJ,
  CA,
  CD,
  CG,
  CH,
  CI,
  CM,
  CN,
  DE,
  ES,
  FR,
  GA,
  GB,
  GH,
  GN,
  IE,
  IN,
  IT,
  JP,
  KR,
  MA,
  ML,
  NE,
  NG,
  NL,
  NO,
  PT,
  SN,
  TD,
  TG,
  TN,
  TR,
  US,
};

interface FlagProps {
  countryCode: string;
  className?: string;
}

// Drapeau rond : le SVG 3:2 est recadré au centre (preserveAspectRatio « slice »).
export function Flag({ countryCode, className }: FlagProps) {
  const Svg = flags[countryCode];
  return (
    <span className={cn('inline-block size-6 shrink-0 overflow-hidden rounded-full ring-1 ring-black/5', className)}>
      {Svg && <Svg aria-hidden preserveAspectRatio="xMidYMid slice" className="size-full" />}
    </span>
  );
}
