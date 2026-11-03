import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuArrowRight, LuChevronDown, LuGlobe, LuGraduationCap, LuPlane } from 'react-icons/lu';
import { Button, Flag } from '@gai2e/ui';
import { destinations, highlights, siteData } from '@/data';

// Photo de l'étudiant(e), avec un visuel de repli tant que le fichier n'est pas déposé dans public/.
const HeroVisual = () => {
  const [imageMissing, setImageMissing] = useState(false);

  return (
    <div className="relative mx-auto w-full max-w-md lg:ml-auto">
      <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-linear-to-br from-peach-soft via-white to-sky-soft shadow-2xl shadow-primary/15 ring-1 ring-black/5">
        {imageMissing ? (
          <div className="flex size-full flex-col items-center justify-center gap-6 p-8">
            <span className="flex size-20 items-center justify-center rounded-full bg-white text-primary shadow-lg">
              <LuGraduationCap className="size-10" />
            </span>
            <div className="flex -space-x-2">
              {destinations.map((destination) => (
                <Flag
                  key={destination.slug}
                  countryCode={destination.countryCode}
                  className="size-11 ring-4 ring-white"
                />
              ))}
            </div>
          </div>
        ) : (
          <img
            src={siteData.heroImage}
            alt="Étudiants sur un campus à l'étranger"
            className="size-full object-cover"
            onError={() => setImageMissing(true)}
          />
        )}
      </div>

      <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-black/5 md:-left-6">
        <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary">
          <LuPlane className="size-4" />
        </span>
        <div>
          <p className="text-[11px] text-muted-foreground">Accompagnement</p>
          <p className="text-sm font-semibold">De l'admission au visa</p>
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const query = destination ? `?destination=${destination}` : '';
    navigate(`${siteData.preRegistrationPath}${query}`);
  };

  return (
    <section className="bg-warm-gradient">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-14 pb-20 md:pt-20 md:pb-28 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium shadow-xs ring-1 ring-black/5">
            <Flag countryCode="BF" className="size-4" />
            Depuis le Burkina Faso, pour toute l'Afrique subsaharienne
          </span>
          <h1 className="mt-6 font-serif text-5xl leading-[1.08] font-semibold tracking-tight md:text-6xl">
            Étudiez à l'étranger, <em className="font-semibold text-primary">sereinement.</em>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
            GAI2E Conseils accompagne les étudiants d'Afrique subsaharienne vers les universités de leur choix, de
            l'orientation jusqu'à l'arrivée sur le campus.
          </p>

          <form
            onSubmit={onSubmit}
            className="mt-8 flex max-w-lg items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-lg shadow-primary/10 ring-1 ring-black/5"
          >
            <LuGlobe className="size-4 shrink-0 text-muted-foreground" />
            <label htmlFor="hero-destination" className="sr-only">
              Où souhaitez-vous étudier ?
            </label>
            <div className="relative min-w-0 flex-1">
              <select
                id="hero-destination"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                className="h-10 w-full cursor-pointer appearance-none truncate bg-transparent pr-6 text-sm outline-none"
              >
                <option value="">Où souhaitez-vous étudier ?</option>
                {destinations.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
              <LuChevronDown className="pointer-events-none absolute top-1/2 right-1 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Button type="submit" variant="cta">
              Commencer
              <LuArrowRight />
            </Button>
          </form>

          <dl className="mt-10 flex gap-10">
            {highlights.map((item) => (
              <div key={item.id}>
                <dt className="sr-only">{item.label}</dt>
                <dd className="font-serif text-3xl font-semibold">{item.value}</dd>
                <dd className="mt-0.5 text-xs text-muted-foreground">{item.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
};

export default Hero;
