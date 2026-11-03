import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LuLogOut, LuMenu, LuX } from 'react-icons/lu';
import { Button, Logo, cn, customToast } from '@gai2e/ui';
import { useAuth } from '@/auth/auth-context';
import { navItems, siteData } from '@/data';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMenu = () => setMobileMenuOpen(false);
  const { status, user, logout } = useAuth();

  const handleLogout = async () => {
    closeMenu();
    await logout();
    customToast.success({ message: 'Vous êtes déconnecté.' });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" title={siteData.name} onClick={closeMenu}>
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link
                to={item.to}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {status === 'authenticated' && user ? (
            <>
              <span className="hidden text-sm text-muted-foreground md:inline">Bonjour, {user.firstName}</span>
              <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={handleLogout}>
                <LuLogOut />
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button link="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
                Connexion
              </Button>
              <Button asChild variant="cta" size="sm" className="hidden sm:inline-flex">
                <Link to={siteData.preRegistrationPath}>Commencer</Link>
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <LuX className="size-6" /> : <LuMenu className="size-6" />}
          </Button>
        </div>
      </nav>

      <div
        className={cn(
          'overflow-hidden border-t bg-background transition-[max-height] duration-300 ease-in-out lg:hidden',
          mobileMenuOpen ? 'max-h-[28rem]' : 'max-h-0 border-t-0',
        )}
      >
        <ul className="flex flex-col gap-1 px-4 py-4">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link
                to={item.to}
                onClick={closeMenu}
                className="block rounded-md px-3 py-2.5 font-medium text-foreground hover:bg-accent"
              >
                {item.title}
              </Link>
            </li>
          ))}
          {status === 'authenticated' ? (
            <li className="mt-3">
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                <LuLogOut />
                Déconnexion
              </Button>
            </li>
          ) : (
            <>
              <li className="mt-3">
                <Button asChild variant="cta" className="w-full">
                  <Link to={siteData.preRegistrationPath} onClick={closeMenu}>
                    Commencer mon inscription
                  </Link>
                </Button>
              </li>
              <li>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login" onClick={closeMenu}>
                    Connexion
                  </Link>
                </Button>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
