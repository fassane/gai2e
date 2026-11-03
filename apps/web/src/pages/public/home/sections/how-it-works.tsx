import { SectionTitle } from '@/components/ui/section-title';
import { processSteps } from '@/data';

const HowItWorks = () => (
  <section id="comment-ca-marche" className="bg-warm-gradient py-24">
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      <SectionTitle eyebrow="Comment ça marche" title="Quatre étapes, un seul interlocuteur." align="left" />
      <ol className="grid overflow-hidden rounded-3xl border bg-card shadow-xs sm:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((step, index) => (
          <li
            key={step.id}
            className="border-b p-7 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-r lg:border-b-0 lg:last:border-r-0"
          >
            <div className="flex items-center gap-4">
              <span className="font-serif text-4xl font-light text-muted-foreground/50">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span aria-hidden className="h-px flex-1 bg-border" />
            </div>
            <h3 className="mt-6 font-serif text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default HowItWorks;
