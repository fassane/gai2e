import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LuClock, LuMail, LuPhone } from 'react-icons/lu';
import { FaWhatsapp } from 'react-icons/fa';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  ColgateWrapper,
  EmptyAlert,
  SearchInput,
} from '@gai2e/ui';
import { PageBanner } from '@/components/shared/page-banner';
import { faq } from '@/data';
import { useSiteConfig } from '@/hooks/use-site-config';

// Données structurées pour les moteurs, générées depuis les questions affichées
const faqJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
}).replace(/</g, '\\u003c');

// Recherche insensible à la casse et aux accents
const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

// Carte de contact : coordonnées des réglages du site (back-office > Configuration)
const ContactCard = () => {
  const { contact } = useSiteConfig();
  const links = [
    { id: 'whatsapp', icon: FaWhatsapp, label: 'WhatsApp', value: contact.whatsappDisplay, href: contact.whatsappUrl },
    ...(contact.phone
      ? [
          {
            id: 'phone',
            icon: LuPhone,
            label: 'Téléphone',
            value: contact.phoneDisplay ?? '',
            href: `tel:${contact.phone}`,
          },
        ]
      : []),
    { id: 'email', icon: LuMail, label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
  ];

  return (
    <section aria-labelledby="faq-contact" className="rounded-3xl bg-secondary p-6 md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-card text-primary shadow-xs">
            <LuPhone className="size-6" />
          </span>
          <div>
            <h2 id="faq-contact" className="font-heading text-xl font-semibold">
              Besoin d'un conseiller ?
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              {contact.openingHours ? (
                <>
                  <LuClock className="size-3.5 shrink-0" />
                  {contact.openingHours}
                </>
              ) : (
                'Écrivez-nous, un conseiller vous répond.'
              )}
            </p>
          </div>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {links.map(({ id, icon: Icon, label, value, href }) => (
            <li key={id} className="min-w-0 sm:[&:last-child:nth-child(odd)]:col-span-2">
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-xs transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:outline-none"
              >
                <Icon className="size-4 shrink-0 text-primary" />
                <span className="min-w-0">
                  <span className="block text-xs text-muted-foreground">{label}</span>
                  <span className="block truncate text-sm font-semibold">{value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

const FaqsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') ?? '';

  const questions = useMemo(() => {
    const query = normalize(search.trim());
    return query ? faq.filter((item) => normalize(`${item.question} ${item.answer}`).includes(query)) : faq;
  }, [search]);

  const onSearch = (value: string) => setSearchParams(value ? { q: value } : {}, { replace: true });

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
      <PageBanner
        title="Foire aux questions"
        paragraph="Destinations, démarches, documents : les réponses aux questions que l'on nous pose le plus souvent."
      />

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 md:px-6 md:py-14">
        <ContactCard />

        <ColgateWrapper>
          <h2 className="mb-5 font-heading text-2xl font-semibold">Questions fréquentes</h2>
          <SearchInput
            aria-label="Rechercher une question"
            placeholder="Rechercher une question…"
            containerClassName="mb-5"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
          />
          {questions.length ? (
            <Accordion type="single" collapsible defaultValue={faq[0].question}>
              {questions.map((item) => (
                <AccordionItem key={item.question} value={item.question}>
                  <AccordionTrigger className="text-base">{item.question}</AccordionTrigger>
                  <AccordionContent className="leading-relaxed text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <EmptyAlert text="Aucune question ne correspond à votre recherche. Contactez-nous, nous vous répondrons." />
          )}
        </ColgateWrapper>
      </div>
    </div>
  );
};

export default FaqsPage;
