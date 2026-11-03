import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import App from './app';

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
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
});
