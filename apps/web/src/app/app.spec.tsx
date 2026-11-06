import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@gai2e/ui';
import { makeStore } from '@/redux/store';
import App from './app';

const renderAt = (path: string) =>
  render(
    <ThemeProvider>
      <Provider store={makeStore()}>
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>
      </Provider>
    </ThemeProvider>,
  );

describe('App', () => {
  beforeAll(() => {
    // jsdom n'implémente ni le défilement ni matchMedia (thème système)
    window.scrollTo = vi.fn();
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
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
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/Étudier à l'étranger/);
    expect(screen.getByRole('heading', { name: 'Votre destination pour vos études ?' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Voir toutes les questions/ }).getAttribute('href')).toBe('/faqs');
    expect(screen.getByRole('heading', { name: 'Étape 3' })).toBeTruthy();
    expect(screen.getByText(/140\s000\sFCFA/)).toBeTruthy();
    expect(screen.getByRole('link', { name: /Voir le détail des tarifs/ }).getAttribute('href')).toBe('/tarifs');
    expect(screen.queryByText(/garantit-il/)).toBeNull();
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

  it('renvoie un visiteur non connecté du back-office vers la connexion', async () => {
    renderAt('/admin/dashboard');
    expect(await screen.findByRole('heading', { name: /Content de vous revoir/ })).toBeTruthy();
  });

  it('limite le choix à 3 destinations, reprises dans la carte du hero', () => {
    renderAt('/');
    for (const name of ['Canada', 'France', 'Japon']) {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${name}`) }));
    }
    expect(screen.getByText('3 / 3 choisis')).toBeTruthy();
    expect((screen.getByRole('button', { name: /^Allemagne/ }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole('button', { name: 'Retirer Japon' })).toBeTruthy();
  });

  it('affiche la page FAQ et filtre les questions, sans tenir compte des accents', async () => {
    renderAt('/faqs');
    expect(screen.getByRole('heading', { level: 1, name: 'Foire aux questions' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Besoin d'un conseiller/ })).toBeTruthy();

    fireEvent.change(screen.getByRole('searchbox', { name: 'Rechercher une question' }), {
      target: { value: 'DOCUMENTS' },
    });
    expect(screen.getByRole('button', { name: /Quels documents/ })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /garantit-il/ })).toBeNull();

    fireEvent.change(screen.getByRole('searchbox', { name: 'Rechercher une question' }), {
      target: { value: 'zzzz' },
    });
    expect(screen.getByText(/Aucune question ne correspond/)).toBeTruthy();
  });

  it('affiche les pages légales, liées entre elles', async () => {
    renderAt('/mentions-legales');
    expect(screen.getByRole('heading', { level: 1, name: 'Mentions légales' })).toBeTruthy();
    expect(await screen.findByRole('heading', { name: 'Éditeur du site' })).toBeTruthy();
    for (const link of screen.getAllByRole('link', { name: 'Politique de confidentialité' })) {
      expect(link.getAttribute('href')).toBe('/politique-de-confidentialite');
    }
  });

  it('affiche la politique de confidentialité avec les coordonnées du site', async () => {
    renderAt('/politique-de-confidentialite');
    expect(screen.getByRole('heading', { level: 1, name: 'Politique de confidentialité' })).toBeTruthy();
    expect(await screen.findByText(/Pour toute question : contact@gai2e\.com/)).toBeTruthy();
    expect(screen.getByText(/gai2e_refresh/)).toBeTruthy();
  });

  it('affiche la page des tarifs : étapes, total, moyens de paiement et FAQ', () => {
    renderAt('/tarifs');
    expect(screen.getByRole('heading', { level: 1, name: 'Nos tarifs' })).toBeTruthy();
    expect(screen.getByText(/fichier complet/)).toBeTruthy();
    expect(screen.getByText(/275\s000\sFCFA/)).toBeTruthy();
    expect(screen.getByText('Wave')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Carte bancaire' })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Dois-je payer les 3 étapes/ })).toBeTruthy();
  });

  describe('destinations', () => {
    const fiche = {
      countryCode: 'CA',
      slug: 'canada',
      name: 'Canada',
      summary: 'Études en français ou en anglais.',
      stepCount: 1,
      documents: [{ code: 'PASSPORT', label: 'Passeport' }],
      steps: [
        {
          code: 'permis',
          title: "Permis d'études",
          description: 'Demande auprès de IRCC.',
          category: 'VISA',
          dueDaysBeforeIntake: 150,
          isOptional: true,
          externalUrl: 'https://www.canada.ca/',
          documents: [{ code: 'PASSPORT', label: 'Passeport' }],
        },
      ],
    };
    const mockApi = () =>
      vi.mocked(fetch).mockImplementation(async (input) => {
        const url = typeof input === 'string' ? input : (input as Request).url;
        if (url.endsWith('/destinations')) return Response.json([fiche]);
        if (url.endsWith('/destinations/canada')) return Response.json(fiche);
        if (url.includes('/destinations/'))
          return Response.json({ message: 'Destination introuvable' }, { status: 404 });
        return new Response(null, { status: 401 });
      });
    afterEach(() => {
      vi.mocked(fetch).mockImplementation(async () => new Response(null, { status: 401 }));
    });

    it('liste les fiches et les autres pays proposés', async () => {
      mockApi();
      renderAt('/destinations');
      expect(screen.getByRole('heading', { level: 1, name: 'Nos destinations' })).toBeTruthy();
      expect((await screen.findByRole('link', { name: /Voir la fiche/ })).getAttribute('href')).toBe(
        '/destinations/canada',
      );
      expect(screen.getByText('Allemagne')).toBeTruthy();
    });

    it('affiche la fiche : étapes, échéance en clair et pièces', async () => {
      mockApi();
      renderAt('/destinations/canada');
      expect(await screen.findByRole('heading', { name: "Permis d'études" })).toBeTruthy();
      expect(screen.getByRole('heading', { level: 1, name: 'Canada' })).toBeTruthy();
      expect(screen.getByText('Environ 5 mois avant la rentrée')).toBeTruthy();
      expect(screen.getByText('Selon votre projet')).toBeTruthy();
      expect(document.title).toMatch(/Canada/);
    });

    it('affiche la page introuvable pour une fiche inconnue', async () => {
      mockApi();
      renderAt('/destinations/inconnue');
      expect(await screen.findByRole('heading', { name: 'Page introuvable' })).toBeTruthy();
      await waitFor(() => expect(document.title).toMatch(/^Page introuvable/));
    });
  });
});
