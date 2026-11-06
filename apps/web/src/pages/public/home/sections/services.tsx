import { LuCheck, LuGraduationCap } from 'react-icons/lu';
import { SectionTitle } from '@/components/ui/section-title';
import { studentService } from '@/data';

const Services = () => (
  <section id="services" className="py-24">
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      <SectionTitle eyebrow="Nos services" title="Un accompagnement pour vos études, de bout en bout." align="left" />
      <article className="grid gap-8 rounded-3xl border bg-card p-8 shadow-xs md:grid-cols-2 md:items-center md:gap-12 md:p-10">
        <div>
          <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
            <LuGraduationCap className="size-5" />
          </span>
          <h3 className="mt-6 font-heading text-xl font-semibold">{studentService.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{studentService.description}</p>
        </div>
        <ul className="space-y-4 border-t pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-12">
          {studentService.items.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <LuCheck className="size-3" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </article>
    </div>
  </section>
);

export default Services;
