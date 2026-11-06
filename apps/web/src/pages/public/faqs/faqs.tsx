import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  ColgateWrapper,
  EmptyAlert,
  SearchInput,
} from '@gai2e/ui';
import { ContactCard } from '@/components/shared/contact-card';
import { PageBanner } from '@/components/shared/page-banner';
import { faq } from '@/data';
import { faqJsonLd } from '@/utils/faq-json-ld';

// Recherche insensible à la casse et aux accents
const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd(faq) }} />
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
