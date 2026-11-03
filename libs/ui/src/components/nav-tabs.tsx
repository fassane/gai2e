import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

export type NavTab = {
  id: string;
  title: string;
  link: string;
  icon?: ReactNode;
};

type NavTabsProps = {
  tabs: NavTab[];
  wrapperClass?: string;
};

const tabClass = 'flex shrink-0 items-center gap-2 text-sm font-medium whitespace-nowrap transition-colors';

// Onglets soulignés (pages de détail)
function NavTabs({ tabs, wrapperClass }: NavTabsProps) {
  return (
    <nav className="mb-8 border-b">
      <ul className={cn('scrollbar-none flex gap-1 overflow-x-auto', wrapperClass)}>
        {tabs.map((tab) => (
          <li key={tab.id}>
            <NavLink
              to={tab.link}
              className={({ isActive }) =>
                cn(
                  tabClass,
                  'px-4 py-3 text-muted-foreground hover:text-foreground',
                  isActive && 'text-primary shadow-[inset_0_-2px_0_0_var(--primary)]',
                )
              }
            >
              {tab.icon}
              {tab.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Onglets en pilules accolées
function RoundedNavTabs({ tabs, wrapperClass }: NavTabsProps) {
  return (
    <nav className="mb-8">
      <ul
        className={cn('scrollbar-none inline-flex overflow-x-auto rounded-full border border-primary/30', wrapperClass)}
      >
        {tabs.map((tab) => (
          <li key={tab.id}>
            <NavLink
              to={tab.link}
              className={({ isActive }) =>
                cn(
                  tabClass,
                  'rounded-full px-5 py-2.5 text-muted-foreground hover:text-primary',
                  isActive && 'bg-primary text-primary-foreground hover:text-primary-foreground',
                )
              }
            >
              {tab.icon}
              {tab.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Onglets dans un bloc flottant (segmented control)
function FloatedNavTabs({ tabs, wrapperClass }: NavTabsProps) {
  return (
    <nav>
      <ul
        className={cn(
          'scrollbar-none flex gap-1 overflow-x-auto rounded-2xl bg-card p-1 shadow-lg ring-1 ring-black/5',
          wrapperClass,
        )}
      >
        {tabs.map((tab) => (
          <li key={tab.id} className="grow">
            <NavLink
              to={tab.link}
              className={({ isActive }) =>
                cn(
                  tabClass,
                  'justify-center rounded-xl px-4 py-2 text-muted-foreground hover:text-foreground',
                  isActive && 'bg-primary text-primary-foreground hover:text-primary-foreground',
                )
              }
            >
              {tab.icon}
              {tab.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export { NavTabs, RoundedNavTabs, FloatedNavTabs };
