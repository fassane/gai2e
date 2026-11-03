import { Link, useLocation } from 'react-router-dom';
import { LuExternalLink, LuLogOut, LuSettings, LuUserRound } from 'react-icons/lu';
import {
  Avatar,
  AvatarFallback,
  Button,
  CustomBreadcrumb,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarTrigger,
  ThemeToggle,
} from '@gai2e/ui';
import { useLogout } from '@/pages/auth/hooks/use-logout';
import { useAuth } from '@/redux/hooks';
import { getInitials, getName, isAdmin } from '@/utils/user';
import { pageLabelOf } from './dashboard-menu';

const DashboardHeader = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { onLogout } = useLogout();

  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <div className="[&_.breadcrumb]:mb-0">
            <CustomBreadcrumb
              items={[{ label: 'Back-office', to: '/admin/dashboard' }, { label: pageLabelOf(pathname) }]}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/">
              <LuExternalLink />
              Voir le site
            </Link>
          </Button>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Mon compte">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-secondary font-semibold text-primary">
                    {getInitials(user)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel className="font-normal">
                <p className="truncate text-sm font-semibold">{getName(user)}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin/profile">
                  <LuUserRound />
                  Mon profil
                </Link>
              </DropdownMenuItem>
              {isAdmin(user) && (
                <DropdownMenuItem asChild>
                  <Link to="/admin/settings">
                    <LuSettings />
                    Paramètres
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <LuLogOut />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
