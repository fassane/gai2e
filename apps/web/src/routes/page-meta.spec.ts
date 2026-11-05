import { pageMetaOf } from './page-meta';

describe('pageMetaOf', () => {
  it('indexe la landing en production, avec son URL officielle', () => {
    expect(pageMetaOf('/', 'gai2e.com')).toMatchObject({ noindex: false, canonical: 'https://gai2e.com/' });
  });

  it('indexe la FAQ en production, avec sa propre description', () => {
    const meta = pageMetaOf('/faqs', 'gai2e.com');
    expect(meta).toMatchObject({ noindex: false, canonical: 'https://gai2e.com/faqs' });
    expect(meta.description).toMatch(/questions fréquentes/);
    expect(pageMetaOf('/faqs', 'recette.gai2e.com').noindex).toBe(true);
  });

  it("n'indexe jamais la recette ni le développement", () => {
    expect(pageMetaOf('/', 'recette.gai2e.com')).toMatchObject({ noindex: true, canonical: null });
    expect(pageMetaOf('/', 'localhost')).toMatchObject({ noindex: true, canonical: null });
  });

  it("n'indexe pas la connexion, le back-office ni les pages inconnues", () => {
    expect(pageMetaOf('/login', 'gai2e.com')).toMatchObject({
      title: 'Connexion | GAI2E Conseils',
      noindex: true,
      canonical: null,
    });
    expect(pageMetaOf('/admin/dashboard', 'gai2e.com').noindex).toBe(true);
    expect(pageMetaOf('/mentions-legales', 'gai2e.com')).toMatchObject({
      title: 'Mentions légales | GAI2E Conseils',
      noindex: true,
    });
    expect(pageMetaOf('/page-inconnue', 'gai2e.com')).toMatchObject({
      title: 'Page introuvable | GAI2E Conseils',
      noindex: true,
    });
  });
});
