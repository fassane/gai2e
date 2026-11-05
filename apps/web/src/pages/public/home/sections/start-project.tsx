import { LuArrowRight, LuMail, LuMapPin, LuPhone } from 'react-icons/lu';
import { Button, Flag } from '@gai2e/ui';
import { OTHER_ORIGIN } from '@/data';
import { useSiteConfig } from '@/hooks/use-site-config';
import { destinationName, originName, useProjectSelection } from '../project-selection';

// Dernière section : récapitulatif du projet et envoi de la demande d'évaluation
const StartProject = () => {
  const { origin, destinations, evaluationUrl } = useProjectSelection();
  const { contact } = useSiteConfig();

  const contacts = [
    { id: 'origin', icon: LuMapPin, label: originName(origin) },
    {
      id: 'whatsapp',
      icon: LuPhone,
      label: `WhatsApp : ${contact.whatsappDisplay}`,
      href: contact.whatsappUrl,
    },
    { id: 'email', icon: LuMail, label: contact.email, href: `mailto:${contact.email}` },
  ];

  return (
    <section id="votre-projet" className="py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:px-6 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-peach uppercase">Parlons de votre projet</p>
          <h2 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">
            Commençons par le commencement.
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Envoyez-nous votre profil et vos destinations : nous vous disons ce qui est réaliste, à quel budget et pour
            quelle rentrée.
          </p>
          <ul className="mt-8 space-y-3">
            {contacts.map(({ id, icon: Icon, label, href }) => (
              <li key={id} className="flex items-center gap-3 text-sm">
                <Icon className="size-4 shrink-0 text-primary" />
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="hover:text-primary"
                  >
                    {label}
                  </a>
                ) : (
                  label
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border bg-card p-7 shadow-2xl shadow-primary/10">
          <h3 className="font-heading text-xl font-semibold">Récapitulatif</h3>
          <dl className="mt-5 divide-y text-sm">
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-muted-foreground">Pays d'origine</dt>
              <dd className="flex items-center gap-2 font-medium">
                {origin !== OTHER_ORIGIN && <Flag countryCode={origin} className="size-5" />}
                {originName(origin)}
              </dd>
            </div>
            <div className="py-3">
              <dt className="text-muted-foreground">Destinations choisies</dt>
              <dd className="mt-2 flex flex-wrap gap-2 font-medium">
                {destinations.length
                  ? destinations.map((code) => (
                      <span
                        key={code}
                        className="inline-flex items-center gap-1.5 rounded-full bg-secondary py-1 pr-3 pl-1 text-xs text-secondary-foreground"
                      >
                        <Flag countryCode={code} className="size-5" />
                        {destinationName(code)}
                      </span>
                    ))
                  : 'Aucune destination choisie pour l’instant'}
              </dd>
            </div>
          </dl>
          <Button asChild variant="cta" size="lg" className="mt-4 w-full">
            {destinations.length ? (
              <a href={evaluationUrl} target="_blank" rel="noreferrer">
                Faire évaluer mon profil
                <LuArrowRight />
              </a>
            ) : (
              <a href="#destinations">
                Choisir mes destinations
                <LuArrowRight />
              </a>
            )}
          </Button>
          {!!destinations.length && (
            <a href="#destinations" className="mt-3 block text-center text-xs font-medium text-primary hover:underline">
              Ajuster mes destinations
            </a>
          )}
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Votre demande part sur WhatsApp, un conseiller vous répond sous 48 h.
          </p>
        </div>
      </div>
    </section>
  );
};

export default StartProject;
