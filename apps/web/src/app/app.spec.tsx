import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { makeStore } from '@/redux/store';
import App from './app';

const renderAt = (path: string) =>
  render(
    <Provider store={makeStore()}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </Provider>,
  );

describe('App', () => {
  beforeAll(() => {
    // jsdom n'implémente pas le défilement
    window.scrollTo = vi.fn();
    // Pas d'api pendant les tests : pas de session à restaurer, visiteur non connecté
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(null, { status: 401 })),
    );
  });

  afterAll(() => {
    vi.unstubAllGlobals();
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
