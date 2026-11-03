import { useState } from 'react';
import { LuGraduationCap } from 'react-icons/lu';
import { Flag } from '@gai2e/ui';
import { siteData, studyDestinations } from '@/data';

const caption = 'Un conseiller suit votre dossier, de la première candidature à la délivrance du visa.';

// Grande photo sous le hero (public/images/hero-etudiants.jpg et .webp), avec un visuel de repli si elle manque.
const PhotoBanner = () => {
  const [imageMissing, setImageMissing] = useState(false);

  return (
    <section className="bg-warm-gradient px-4 pb-10 md:px-6">
      <figure className="relative mx-auto h-64 max-w-6xl overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/15 md:h-80">
        {imageMissing ? (
          <div className="flex size-full items-center justify-center gap-6 bg-brand [background-image:radial-gradient(40rem_20rem_at_85%_20%,color-mix(in_oklch,var(--peach)_45%,transparent),transparent_70%)]">
            <span className="hidden size-20 items-center justify-center rounded-full bg-white/15 text-white sm:flex">
              <LuGraduationCap className="size-10" />
            </span>
            <div className="flex -space-x-3">
              {studyDestinations.slice(0, 8).map((destination) => (
                <Flag
                  key={destination.countryCode}
                  countryCode={destination.countryCode}
                  className="size-12 ring-4 ring-brand md:size-14"
                />
              ))}
            </div>
          </div>
        ) : (
          <picture>
            <source srcSet={siteData.heroImage.replace(/\.jpg$/, '.webp')} type="image/webp" />
            <img
              src={siteData.heroImage}
              alt="Étudiants africains sur un campus à l'étranger"
              // Visages dans le tiers haut de la photo (carrée) : cadrage sur cette zone dans la bannière large
              className="size-full object-cover object-[center_22%]"
              onError={() => setImageMissing(true)}
            />
          </picture>
        )}
        <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/25 to-transparent px-6 pt-20 pb-5 text-sm text-white md:px-8">
          {caption}
        </figcaption>
      </figure>
    </section>
  );
};

export default PhotoBanner;
