# @gai2e/ui

Composants React et thème partagés par les apps front (`apps/web`, et demain `apps/console`, `apps/docs`…).
Base shadcn/ui (Radix + Tailwind v4), adaptée à la charte GAI2E : crème, sarcelle, pêche, titres en Fraunces.

Lib **non compilée** : les apps Vite consomment directement les sources via l'alias `@gai2e/ui`.

## Brancher une app

1. CSS d'entrée de l'app :

   ```css
   @import 'tailwindcss';
   @import '../../../libs/ui/src/styles/theme.css';
   ```

   `theme.css` déclare `@source '../'` : sans lui, Tailwind ne génère pas les classes utilisées dans la lib.

2. Les polices (Plus Jakarta Sans, Fraunces) sont importées par `theme.css` (Fontsource) : rien à faire.
3. Le `tsconfig.json` de l'app redéfinit `paths` : y ajouter `"@gai2e/ui": ["../../libs/ui/src/index.ts"]`.
4. Pour les toasts, monter `<Toaster />` une fois à la racine.

```tsx
import { Button, Input, Badge, cn } from '@gai2e/ui';
```

## Contenu

| Famille | Composants |
| --- | --- |
| Actions | `Button` (variantes `cta`, `light`, `danger`…, prop `icon`, `isLoading`, `link`), `Badge` (statuts `success`, `warning`, `danger`, `info`) |
| Formulaires | `Input`, `InputPassword`, `SelectInput`, `TextareaInput`, `InputPhone` (E.164), `InputSwitch`, `SearchInput`, `FormError`, `Label`, `Select` (Radix), `Slider` |
| Affichage | `Card`, `OverviewCardItem`, `ColgateWrapper`, `TopTitle`, `MediumTitle`, `TitleWithIcon`, `EmptyAlert`, `Avatar`, `Progress`, `StepIndicator`, `Skeleton`, `Separator`, `Spinner`, `Logo`, `Flag` |
| Navigation | `Sidebar`, `NavTabs`, `RoundedNavTabs`, `FloatedNavTabs`, `Breadcrumb`, `Pagination`, `DropdownMenu` |
| Superpositions | `Dialog`, `Sheet`, `Drawer`, `Tooltip`, `Toaster` + `customToast` |
| Données | `Table`, `DataTable` (TanStack Table), `TableToolbar`, `TableSkeleton`, `DateDayFilter`, `Carousel`, `Accordion`, `Collapsible` |

Ajouter un composant shadcn : `npx shadcn add <composant>` (alias dans `components.json` à la racine), puis
l'exporter dans `src/index.ts`.

Origine : composants du projet Moovi, sans ce qui était propre au transport (bus, trajets, carte, adresses).
