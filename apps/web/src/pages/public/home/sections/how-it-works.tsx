import { LuClipboardList, LuLandmark, LuPlaneTakeoff, LuSearch } from 'react-icons/lu';
import { SectionTitle } from '@/components/ui/section-title';
import { processSteps } from '@/data';

const icons = {
  'pre-registration': LuClipboardList,
  evaluation: LuSearch,
  admission: LuLandmark,
  visa: LuPlaneTakeoff,
};

const HowItWorks = () => (
  <section id="comment-ca-marche" className="bg-secondary/70 py-20">
    <div className="mx-auto max-w-6xl px-4">
      <SectionTitle eyebrow="Comment ça marche" title="Votre projet en 4 étapes" />
      <ol className="relative grid gap-10 md:grid-cols-4 md:gap-6">
        {/* Ligne pointillée qui relie les étapes */}
        <div
          aria-hidden
          className="absolute top-7 right-[12.5%] left-[12.5%] hidden border-t border-dashed border-primary/25 md:block"
        />
        {processSteps.map((step, index) => {
          const Icon = icons[step.id as keyof typeof icons];
          return (
            <li key={step.id} className="relative text-center">
              <span className="relative mx-auto flex size-14 items-center justify-center rounded-2xl bg-card text-primary shadow-sm ring-1 ring-black/5">
                <Icon className="size-6" />
                <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-peach text-[10px] font-bold text-white">
                  {index + 1}
                </span>
              </span>
              <h3 className="mt-5 font-serif font-semibold">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-56 text-sm text-muted-foreground">{step.description}</p>
            </li>
          );
        })}
      </ol>
    </div>
  </section>
);

export default HowItWorks;
