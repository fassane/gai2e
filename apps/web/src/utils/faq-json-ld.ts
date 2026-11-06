// Données structurées d'une FAQ pour les moteurs, générées depuis les questions affichées sur la page
export const faqJsonLd = (items: { question: string; answer: string }[]) =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }).replace(/</g, '\\u003c');
