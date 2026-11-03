import { LuChevronDown } from 'react-icons/lu';
import { SectionTitle } from '@/components/ui/section-title';
import { faq } from '@/data';

const Faq = () => (
  <section id="faq" className="py-20">
    <div className="mx-auto max-w-2xl px-4">
      <SectionTitle eyebrow="FAQ" title="Questions fréquentes" />
      <div className="space-y-3">
        {faq.map((item, index) => (
          <details
            key={item.question}
            open={index === 0}
            className="group rounded-2xl border bg-card px-5 shadow-xs"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
              {item.question}
              <LuChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export default Faq;
