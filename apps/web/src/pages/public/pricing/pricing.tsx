import { Link } from 'react-router-dom';
import { LuArrowRight, LuCreditCard, LuSmartphone } from 'react-icons/lu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Badge, Button, ColgateWrapper } from '@gai2e/ui';
import { ContactCard } from '@/components/shared/contact-card';
import { PageBanner } from '@/components/shared/page-banner';
import { paymentMethods, pricingFaq, pricingSteps, siteData } from '@/data';
import { faqJsonLd } from '@/utils/faq-json-ld';
import { formatEur, formatXof, pricingTotal } from '@/utils/price';

const paymentIcons = { 'mobile-money': LuSmartphone, card: LuCreditCard };

const PricingPage = () => (
  <div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd(pricingFaq) }} />
    <PageBanner
      title="Nos tarifs"
      paragraph="Études à l'étranger : après l'évaluation de votre profil par un conseiller, le paiement se fait en 3 étapes, en fonction de l'évolution de votre dossier."
    >
      <Button asChild variant="cta" size="lg" className="mt-6">
        <Link to={siteData.preRegistrationPath}>
          Faire évaluer mon profil
          <LuArrowRight />
        </Link>
      </Button>
    </PageBanner>

    <div className="mx-auto max-w-6xl space-y-14 px-4 py-12 md:px-6 md:py-16">
      <section aria-labelledby="pricing-steps">
        <h2 id="pricing-steps" className="mb-6 font-heading text-2xl font-semibold">
          Les 3 étapes de paiement
        </h2>
        <ol className="grid gap-6 lg:grid-cols-3">
          {pricingSteps.map((step, index) => (
            <li key={step.id} className="flex flex-col rounded-3xl border bg-card p-8 shadow-xs">
              <p className="text-sm font-semibold tracking-wide text-primary">Étape {index + 1}</p>
              <h3 className="mt-1 font-heading text-lg font-semibold">{step.title}</h3>
              <p className="mt-4 font-heading text-3xl font-semibold tracking-tight">{formatXof(step.amountXof)}</p>
              <p className="mt-1 text-sm text-muted-foreground">ou {formatEur(step.amountEurCents)}</p>
              <p className="mt-6 border-t pt-6 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 rounded-2xl bg-muted px-5 py-4 text-sm text-muted-foreground">
          Soit <strong className="text-foreground">{formatXof(pricingTotal.xof)}</strong> (
          {formatEur(pricingTotal.eurCents)}) pour les 3 étapes. Après l'étape 1, vous pouvez aussi poursuivre seul : le
          fichier remis vous permet de déposer votre demande d'admission sans assistance.
        </p>
      </section>

      <section aria-labelledby="payment-methods">
        <h2 id="payment-methods" className="mb-6 font-heading text-2xl font-semibold">
          Moyens de paiement
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {paymentMethods.map((method) => {
            const Icon = paymentIcons[method.id as keyof typeof paymentIcons];
            return (
              <div key={method.id} className="flex items-start gap-4 rounded-3xl border bg-card p-6 shadow-xs">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-semibold">{method.title}</h3>
                  {method.options.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {method.options.map((option) => (
                        <li key={option}>
                          <Badge variant="secondary">{option}</Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <ColgateWrapper>
        <h2 className="mb-5 font-heading text-2xl font-semibold">Questions sur les tarifs</h2>
        <Accordion type="single" collapsible defaultValue={pricingFaq[0].question}>
          {pricingFaq.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className="text-base">{item.question}</AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="mt-5 text-sm text-muted-foreground">
          D'autres questions ?{' '}
          <Link to="/faqs" className="font-medium text-primary hover:underline">
            Consultez la FAQ
          </Link>
        </p>
      </ColgateWrapper>

      <ContactCard />
    </div>
  </div>
);

export default PricingPage;
