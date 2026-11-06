import { Link } from 'react-router-dom';
import { LuArrowRight } from 'react-icons/lu';
import { Button } from '@gai2e/ui';
import { SectionTitle } from '@/components/ui/section-title';
import { pricingSteps } from '@/data';
import { formatEur, formatXof } from '@/utils/price';

// Résumé sur la landing : le détail est sur la page /tarifs
const Pricing = () => (
  <section id="tarifs" className="py-24">
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      <SectionTitle
        eyebrow="Tarifs · Études à l'étranger"
        title="Un paiement en 3 étapes, selon l'évolution de votre dossier."
        subtitle="Après l'évaluation de votre profil par un conseiller, vous réglez chaque étape au fur et à mesure."
        align="left"
      />
      <ol className="grid gap-6 md:grid-cols-3">
        {pricingSteps.map((step, index) => (
          <li key={step.id} className="rounded-3xl border bg-card p-7 shadow-xs">
            <h3 className="text-sm font-semibold tracking-wide text-primary">Étape {index + 1}</h3>
            <p className="mt-1 font-medium">{step.title}</p>
            <p className="mt-4 font-heading text-3xl font-semibold tracking-tight">{formatXof(step.amountXof)}</p>
            <p className="mt-1 text-sm text-muted-foreground">ou {formatEur(step.amountEurCents)}</p>
          </li>
        ))}
      </ol>
      <div className="mt-10 text-center">
        <Button asChild variant="outline" size="lg">
          <Link to="/tarifs">
            Voir le détail des tarifs
            <LuArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  </section>
);

export default Pricing;
