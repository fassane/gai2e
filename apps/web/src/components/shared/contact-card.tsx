import { FaWhatsapp } from 'react-icons/fa';
import { LuClock, LuMail, LuPhone } from 'react-icons/lu';
import { useSiteConfig } from '@/hooks/use-site-config';

// Carte de contact : coordonnées des réglages du site (back-office > Configuration)
export function ContactCard() {
  const { contact } = useSiteConfig();
  const links = [
    { id: 'whatsapp', icon: FaWhatsapp, label: 'WhatsApp', value: contact.whatsappDisplay, href: contact.whatsappUrl },
    ...(contact.phone
      ? [
          {
            id: 'phone',
            icon: LuPhone,
            label: 'Téléphone',
            value: contact.phoneDisplay ?? '',
            href: `tel:${contact.phone}`,
          },
        ]
      : []),
    { id: 'email', icon: LuMail, label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
  ];

  return (
    <section aria-labelledby="contact-card-title" className="rounded-3xl bg-secondary p-6 md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-card text-primary shadow-xs">
            <LuPhone className="size-6" />
          </span>
          <div>
            <h2 id="contact-card-title" className="font-heading text-xl font-semibold">
              Besoin d'un conseiller ?
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              {contact.openingHours ? (
                <>
                  <LuClock className="size-3.5 shrink-0" />
                  {contact.openingHours}
                </>
              ) : (
                'Écrivez-nous, un conseiller vous répond.'
              )}
            </p>
          </div>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {links.map(({ id, icon: Icon, label, value, href }) => (
            <li key={id} className="min-w-0 sm:[&:last-child:nth-child(odd)]:col-span-2">
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-xs transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:outline-none"
              >
                <Icon className="size-4 shrink-0 text-primary" />
                <span className="min-w-0">
                  <span className="block text-xs text-muted-foreground">{label}</span>
                  <span className="block truncate text-sm font-semibold">{value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
