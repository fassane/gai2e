import { NavLink, useLocation } from 'react-router-dom';
import { LuLogOut } from 'react-icons/lu';
import { roleLabels } from '@gai2e/shared-types';
import {
  Logo,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useSidebar,
} from '@gai2e/ui';
import { useLogout } from '@/pages/auth/hooks/use-logout';
import { useAuth } from '@/redux/hooks';
import { getInitials, getName } from '@/utils/user';
import { dashboardMenu } from './dashboard-menu';

function SidebarUserCard() {
  const { user } = useAuth();
  const { onLogout } = useLogout();
  const { open, isMobile, setOpenMobile } = useSidebar();
  const name = getName(user);
  const roleLabel = user ? roleLabels[user.role] : '';

  const avatar = (
    <span
      aria-hidden
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
    >
      {getInitials(user)}
    </span>
  );

  // Sidebar repliée : l'avatar seul, qui déconnecte
  if (!open && !isMobile) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onLogout}
            aria-label={`${name}, se déconnecter`}
            className="mx-auto cursor-pointer rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {avatar}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">{name} · Se déconnecter</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="flex items-center gap-2.5 rounded-2xl bg-sidebar-accent p-2.5">
      <NavLink
        to="/admin/profile"
        title="Mon profil"
        onClick={() => isMobile && setOpenMobile(false)}
        className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {avatar}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{name}</span>
          <span className="block text-xs text-muted-foreground">{roleLabel}</span>
        </span>
      </NavLink>
      <button
        type="button"
        onClick={onLogout}
        aria-label="Se déconnecter"
        title="Se déconnecter"
        className="shrink-0 cursor-pointer rounded-full p-2 text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <LuLogOut className="size-4" />
      </button>
    </div>
  );
}

export function DashboardSidebar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { open, isMobile, setOpenMobile } = useSidebar();

  const sections = dashboardMenu
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.roles || (user && item.roles.includes(user.role))),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 justify-center px-3">
        <NavLink to="/" title="Voir le site" className="flex items-center">
          {open || isMobile ? <Logo /> : <Logo className="[&>span:last-child]:hidden" />}
        </NavLink>
      </SidebarHeader>
      <SidebarContent className="px-1">
        {sections.map((section) => (
          <SidebarGroup key={section.id}>
            <SidebarGroupLabel className="text-[11px] font-semibold tracking-wider uppercase">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    {/* Hauteur confortable une fois ouverte ; repliée, la sidebar impose son carré d'icône */}
                    <SidebarMenuButton
                      asChild
                      className="h-10 rounded-xl"
                      isActive={pathname.startsWith(item.path)}
                      tooltip={item.label}
                    >
                      <NavLink to={item.path} onClick={() => isMobile && setOpenMobile(false)}>
                        {item.icon}
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-3">
        <SidebarUserCard />
      </SidebarFooter>
    </Sidebar>
  );
}
