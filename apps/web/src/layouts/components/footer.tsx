import { Link } from 'react-router-dom';
import { LuClock, LuMail, LuMapPin, LuPhone } from 'react-icons/lu';
import { Logo } from '@gai2e/ui';
import { siteData } from '@/data';
import { useSiteConfig } from '@/hooks/use-site-config';

const columns = [
  {
    title: 'Services',
    links: [
      { label: 'Destinations', to: '/#destinations' },
      { label: 'Comment ça marche', to: '/#comment-ca-marche' },
      { label: 'Pré-inscription', to: siteData.preRegistrationPath },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { label: 'Tarifs', to: '/tarifs' },
      { label: 'FAQ', to: '/faqs' },
      { label: 'Devenir partenaire', to: '/#partenaires' },
    ],
  },
];

const Footer = () => {
  const year = new Date().getFullYear();
  // Présentation, coordonnées et réseaux sociaux : réglages du back-office (Configuration)
  const { config, contact, socials } = useSiteConfig();

  return (
    <footer id="contact" className="bg-brand text-brand-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed text-white/70">{config.description}</p>
          {socials.length > 0 && (
            <>
              <p className="mt-6 text-xs font-semibold tracking-wider text-white/50 uppercase">Suivez-nous</p>
              <div className="mt-3 flex gap-2">
                {socials.map(({ id, label, href, icon: Icon }) => (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/25"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="font-semibold">{column.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="font-semibold">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex gap-3">
              <LuMapPin className="mt-0.5 size-4 shrink-0 text-peach" />
              {contact.address}
            </li>
            <li>
              <a href={contact.whatsappUrl} className="flex gap-3 hover:text-white">
                <LuPhone className="mt-0.5 size-4 shrink-0 text-peach" />
                WhatsApp : {contact.whatsappDisplay}
              </a>
            </li>
            {contact.phone && (
              <li>
                <a href={`tel:${contact.phone}`} className="flex gap-3 hover:text-white">
                  <LuPhone className="mt-0.5 size-4 shrink-0 text-peach" />
                  Tél. : {contact.phoneDisplay}
                </a>
              </li>
            )}
            <li>
              <a href={`mailto:${contact.email}`} className="flex gap-3 hover:text-white">
                <LuMail className="mt-0.5 size-4 shrink-0 text-peach" />
                {contact.email}
              </a>
            </li>
            {contact.openingHours && (
              <li className="flex gap-3">
                <LuClock className="mt-0.5 size-4 shrink-0 text-peach" />
                {contact.openingHours}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-white/60 md:flex-row md:items-center md:justify-between md:px-6">
          <p>
            © {year} {siteData.name}. Tous droits réservés.
          </p>
          <div className="flex gap-5">
            <Link to="/mentions-legales" className="hover:text-white">
              Mentions légales
            </Link>
            <Link to="/politique-de-confidentialite" className="hover:text-white">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
