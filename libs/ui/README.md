# @gai2e/ui

Composants React et thème partagés par les apps front (`apps/web`, et demain `apps/console`, `apps/docs`…).
Base shadcn/ui (Radix + Tailwind v4), adaptée à la charte GAI2E : crème, sarcelle, pêche, titres en Poppins, texte en Inter.

Lib **non compilée** : les apps Vite consomment directement les sources via l'alias `@gai2e/ui`.

## Brancher une app

1. CSS d'entrée de l'app :

   ```css
   @import 'tailwindcss';
   @import '../../../libs/ui/src/styles/theme.css';
   ```

   `theme.css` déclare `@source '../'` : sans lui, Tailwind ne génère pas les classes utilisées dans la lib.

2. Les polices (Inter pour le texte, Poppins pour les titres, classe `font-heading`) sont importées par `theme.css` (Fontsource) : rien à faire.
3. Le `tsconfig.json` de l'app redéfinit `paths` : y ajouter `"@gai2e/ui": ["../../libs/ui/src/index.ts"]`.
4. Pour les toasts, monter `<Toaster />` une fois à la racine.

```tsx
import { Button, Input, Badge, cn } from '@gai2e/ui';
```

## Contenu

| Famille | Composants |
| --- | --- |
| Actions | `Button` (variantes `cta`, `light`, `danger`…, prop `icon`, `isLoading`, `link`), `Badge` (statuts `success`, `warning`, `danger`, `info`) |
| Formulaires | `Input`, `InputPassword`, `SelectInput`, `TextareaInput`, `InputPhone` (E.164), `InputSwitch`, `SearchInput`, `PasswordCheck`, `FormError`, `Label`, `Select` (Radix), `Slider` |
| Affichage | `Card`, `OverviewCardItem`, `ColgateWrapper`, `TopTitle`, `MediumTitle`, `TitleWithIcon`, `Alert`, `EmptyAlert`, `Avatar`, `Progress`, `StepIndicator`, `Skeleton`, `Separator`, `Spinner`, `Logo` / `LogoMark` (logo piste A « Trajectoire »), `Flag` |
| Navigation | `Sidebar`, `NavTabs`, `RoundedNavTabs`, `FloatedNavTabs`, `Breadcrumb`, `Pagination`, `DropdownMenu` |
| Superpositions | `Dialog`, `Sheet`, `Drawer`, `Tooltip`, `Toaster` + `customToast` |
| Données | `Table`, `DataTable` (TanStack Table), `TableToolbar`, `TableSkeleton`, `DateDayFilter`, `Carousel`, `Accordion`, `Collapsible` |

Ajouter un composant shadcn : `npx shadcn add <composant>` (alias dans `components.json` à la racine), puis
l'exporter dans `src/index.ts`.

Origine : composants du projet Moovi, sans ce qui était propre au transport (bus, trajets, carte, adresses).

## Thème clair / sombre

- `ThemeProvider` (à placer à la racine de l'app) applique la classe `light` ou `dark` sur `<html>` ; choix
  `light`, `dark` ou `system` (réglage de l'appareil), gardé dans le localStorage (`gai2e-theme`).
  `useTheme()` donne `theme`, `resolvedTheme` et `setTheme`. `ThemeToggle` : bouton de choix (Clair / Sombre / Système).
- Pour éviter un flash au chargement, `index.html` applique la classe avant React (voir `apps/web/index.html`).
- Palette sombre dans `.dark` (`styles/theme.css`). Ne jamais coder une couleur en dur (`bg-white`,
  `text-slate-…`) : utiliser les tokens (`bg-card`, `text-muted-foreground`…), qui changent avec le thème.
- `bg-primary` : boutons, liens, éléments actifs (s'éclaircit en sombre, texte foncé dessus).
  `bg-brand` / `text-brand-foreground` : surfaces de marque avec du texte blanc (footer, bandeau d'appel,
  panneau de connexion), sarcelle profond dans les deux thèmes.

## Confirmations

`confirmAlert({ title, text, confirmLabel, destructive, preConfirm })` ouvre une fenêtre SweetAlert2 aux couleurs du thème (chargée à la demande). `title` et `text` sont du texte brut.
