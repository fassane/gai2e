import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/auth/auth-provider';
import App from './app';

// Pas d'api pendant les tests : visiteur non connecté
vi.mock('@/api/http', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api/http')>()),
  refreshSession: vi.fn(async () => null),
}));

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  );

describe('App', () => {
  beforeAll(() => {
    // jsdom n'implémente pas le défilement
    window.scrollTo = vi.fn();
  });

  it('affiche la landing page', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/Étudiez à l'étranger/);
    expect(screen.getByRole('heading', { name: 'Nos destinations' })).toBeTruthy();
  });

  it('affiche la page 404 pour une route inconnue', () => {
    renderAt('/page-inconnue');
    expect(screen.getByRole('heading', { name: 'Page introuvable' })).toBeTruthy();
  });

  it('affiche la page de connexion', async () => {
    renderAt('/login');
    expect(await screen.findByRole('heading', { name: /Content de vous revoir/ })).toBeTruthy();
    expect(screen.getByLabelText('Adresse email')).toBeTruthy();
  });

  it('affiche la page mot de passe oublié', async () => {
    renderAt('/forgot-password');
    expect(await screen.findByRole('heading', { name: 'Mot de passe oublié' })).toBeTruthy();
  });

  it('signale un lien de réinitialisation sans jeton', () => {
    renderAt('/reset-password');
    expect(screen.getByRole('heading', { name: 'Lien incomplet' })).toBeTruthy();
  });

  it('affiche le formulaire de nouveau mot de passe avec le jeton du lien', () => {
    renderAt('/reset-password?token=abc');
    expect(screen.getByRole('heading', { name: 'Nouveau mot de passe' })).toBeTruthy();
    expect(screen.getByText('Au moins 8 caractères')).toBeTruthy();
  });
});
