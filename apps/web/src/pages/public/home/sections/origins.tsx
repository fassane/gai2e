import { Flag } from '@gai2e/ui';
import { originCountries } from '@/data';

const Origins = () => (
  <section className="mx-auto max-w-5xl px-4 py-14 text-center">
    <p className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
      Nous accompagnons les étudiants de toute l'Afrique subsaharienne
    </p>
    <ul className="mt-6 flex flex-wrap justify-center gap-2">
      {originCountries.map((country) => (
        <li
          key={country.countryCode}
          className="flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs shadow-xs"
        >
          <Flag countryCode={country.countryCode} className="size-4" />
          {country.name}
        </li>
      ))}
    </ul>
  </section>
);

export default Origins;
