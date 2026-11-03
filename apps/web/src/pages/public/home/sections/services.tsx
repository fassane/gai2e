import { LuCompass, LuFileCheck, LuHouse } from 'react-icons/lu';
import { SectionTitle } from '@/components/ui/section-title';
import { services } from '@/data';
import { cn } from '@gai2e/ui';

const icons = {
  admission: { icon: LuCompass, className: 'bg-secondary text-primary' },
  visa: { icon: LuFileCheck, className: 'bg-peach-soft text-peach' },
  arrival: { icon: LuHouse, className: 'bg-secondary text-primary' },
};

const Services = () => (
  <section id="services" className="mx-auto max-w-6xl px-4 py-20">
    <SectionTitle
      eyebrow="Ce que nous faisons"
      title="Un accompagnement humain, de bout en bout"
      align="left"
      className="max-w-md"
    />
    <div className="grid gap-5 md:grid-cols-3">
      {services.map((service) => {
        const { icon: Icon, className } = icons[service.id as keyof typeof icons];
        return (
          <article
            key={service.id}
            className="rounded-3xl border bg-card p-7 shadow-xs transition-shadow hover:shadow-md"
          >
            <span className={cn('flex size-11 items-center justify-center rounded-full', className)}>
              <Icon className="size-5" />
            </span>
            <h3 className="mt-6 font-serif text-lg font-semibold">{service.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
          </article>
        );
      })}
    </div>
  </section>
);

export default Services;
