import { originCountries } from '@/data';

// Bandeau défilant des pays d'origine. La liste est doublée pour boucler sans saut ;
// immobile si l'utilisateur préfère réduire les animations.
const Origins = () => {
  const items = [...originCountries, ...originCountries];
  return (
    <section aria-label="Pays d'origine de nos étudiants" className="overflow-hidden border-y bg-background py-5">
      <ul className="flex w-max animate-marquee items-center motion-reduce:animate-none">
        {items.map((country, index) => (
          <li
            key={`${country.countryCode}-${index}`}
            aria-hidden={index >= originCountries.length || undefined}
            className="flex items-center font-serif text-lg whitespace-nowrap text-foreground/80"
          >
            <span className="px-7">{country.name}</span>
            <span aria-hidden className="text-peach">
              ✦
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Origins;
