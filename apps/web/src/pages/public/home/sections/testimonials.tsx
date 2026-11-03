import { useRef } from 'react';
import { LuChevronLeft, LuChevronRight, LuQuote } from 'react-icons/lu';
import { Button, Flag } from '@gai2e/ui';
import { SectionTitle } from '@/components/ui/section-title';
import { destinations, testimonials } from '@/data';

const destinationName = (code: string) => destinations.find((d) => d.countryCode === code)?.name ?? code;

// Carrousel en scroll-snap natif : défilement tactile sur mobile, flèches sur ordinateur.
const Testimonials = () => {
  const trackRef = useRef<HTMLUListElement>(null);
  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (track) track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' });
  };

  if (testimonials.length === 0) return null;

  return (
    <section id="temoignages" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle eyebrow="Témoignages" title="Ce que disent nos étudiants" subtitle="Ils ont réalisé leur projet avec GAI2E Conseils." />
        <div className="relative">
          <ul ref={trackRef} className="scrollbar-none flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2">
            {testimonials.map((item) => (
              <li
                key={item.id}
                className="flex w-[85%] shrink-0 snap-start flex-col rounded-3xl border bg-card p-7 shadow-xs sm:w-[45%] lg:w-[31%]"
              >
                <LuQuote className="size-7 text-peach/50" />
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/80">
                  “{item.quote}”
                </blockquote>
                <div className="mt-6 flex items-center gap-3 border-t pt-4">
                  <span className="flex size-10 items-center justify-center rounded-full bg-secondary font-serif text-sm font-semibold text-primary">
                    {item.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.origin} · {item.program}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-primary">
                    <Flag countryCode={item.destinationCode} className="size-4" />
                    {destinationName(item.destinationCode)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" size="icon" aria-label="Témoignages précédents" onClick={() => scroll(-1)}>
              <LuChevronLeft />
            </Button>
            <Button variant="outline" size="icon" aria-label="Témoignages suivants" onClick={() => scroll(1)}>
              <LuChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
