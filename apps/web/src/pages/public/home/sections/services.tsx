import { LuBriefcase, LuCheck, LuGraduationCap } from 'react-icons/lu';
import { cn } from '@gai2e/ui';
import { SectionTitle } from '@/components/ui/section-title';
import { services } from '@/data';

const icons = { studies: LuGraduationCap, workers: LuBriefcase };

const Services = () => (
  <section id="services" className="py-24">
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      <SectionTitle eyebrow="Nos services" title="Deux façons de vous accompagner." align="left" />
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service) => {
          const Icon = icons[service.id as keyof typeof icons];
          return (
            <article key={service.id} className="rounded-3xl border bg-card p-8 shadow-xs">
              <span
                className={cn(
                  'flex size-12 items-center justify-center rounded-full',
                  service.tone === 'peach' ? 'bg-peach-soft text-peach' : 'bg-secondary text-primary',
                )}
              >
                <Icon className="size-5" />
              </span>
              <h3 className="mt-6 font-serif text-xl font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
              <ul className="mt-6 space-y-3 border-t pt-6">
                {service.items.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                      <LuCheck className="size-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

export default Services;
