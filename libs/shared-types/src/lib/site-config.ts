import { z } from 'zod';

// Réglages du site, modifiables dans le back-office (Configuration) : présentation, coordonnées, réseaux sociaux.
// Lus par la landing, le footer et les emails. Tant qu'aucun réglage n'est enregistré, defaultSiteConfig s'applique.

const e164Schema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{6,14}$/, 'Numéro invalide (format international, ex. +226 70 00 00 00)');

// Lien facultatif : vide → null
const optionalUrlSchema = z
  .string()
  .trim()
  .max(300, 'Lien trop long')
  .pipe(z.url({ protocol: /^https?$/, message: 'Lien invalide (https://…)' }))
  .nullable()
  .or(z.literal('').transform(() => null));

const optionalTextSchema = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Trop long (${max} caractères maximum)`)
    .nullable()
    .or(z.literal('').transform(() => null));

export const siteConfigSchema = z.object({
  // Présentation (footer, emails)
  description: z.string().trim().min(1, 'Saisissez une description').max(500, 'Trop long (500 caractères maximum)'),
  // Coordonnées
  contactEmail: z.string().trim().toLowerCase().pipe(z.email('Adresse email invalide')),
  whatsappPhone: e164Schema,
  phone: e164Schema.nullable().or(z.literal('').transform(() => null)),
  address: z.string().trim().min(1, "Saisissez l'adresse").max(300, 'Trop long (300 caractères maximum)'),
  openingHours: optionalTextSchema(200),
  // Réseaux sociaux
  facebookUrl: optionalUrlSchema,
  instagramUrl: optionalUrlSchema,
  linkedinUrl: optionalUrlSchema,
  tiktokUrl: optionalUrlSchema,
  youtubeUrl: optionalUrlSchema,
  xUrl: optionalUrlSchema,
});
export type SiteConfigInput = z.infer<typeof siteConfigSchema>;

export const siteConfigResponseSchema = siteConfigSchema.extend({
  // Nul tant que les réglages par défaut s'appliquent
  updatedAt: z.string().nullable(),
});
export type SiteConfig = z.infer<typeof siteConfigResponseSchema>;

export const defaultSiteConfig: SiteConfig = {
  description:
    "Votre partenaire pour étudier à l'étranger : France, Canada, Japon, Royaume-Uni, Chine et bientôt d'autres destinations.",
  contactEmail: 'contact@gai2e.com',
  whatsappPhone: '+22654631884',
  phone: null,
  address: 'Zone SONATUR, Ouaga 2000 Extension sud, Ouagadougou, Burkina Faso',
  openingHours: null,
  facebookUrl: null,
  instagramUrl: null,
  linkedinUrl: null,
  tiktokUrl: null,
  youtubeUrl: null,
  xUrl: null,
  updatedAt: null,
};

// Longueur de l'indicatif pays d'un numéro E.164 (plan de numérotation de l'UIT)
function callingCodeLength(digits: string): number {
  if (digits.startsWith('1') || digits.startsWith('7')) return 1;
  const twoDigitCodes = [
    '20',
    '27',
    '30',
    '31',
    '32',
    '33',
    '34',
    '36',
    '39',
    '40',
    '41',
    '43',
    '44',
    '45',
    '46',
    '47',
    '48',
    '49',
    '51',
    '52',
    '53',
    '54',
    '55',
    '56',
    '57',
    '58',
    '60',
    '61',
    '62',
    '63',
    '64',
    '65',
    '66',
    '81',
    '82',
    '84',
    '86',
    '90',
    '91',
    '92',
    '93',
    '94',
    '95',
    '98',
  ];
  return twoDigitCodes.includes(digits.slice(0, 2)) ? 2 : 3;
}

// Numéro E.164 lisible : +22654631884 → « +226 54 63 18 84 », +33612345678 → « +33 6 12 34 56 78 »,
// +14155550123 → « +1 415 555 0123 » (indicatif, puis le numéro par paires, un chiffre seul en tête si impair)
export function formatPhoneDisplay(e164: string): string {
  const digits = e164.replace(/\D/g, '');
  const codeLength = callingCodeLength(digits);
  const code = digits.slice(0, codeLength);
  const national = digits.slice(codeLength);
  if (code === '1' && national.length === 10) {
    return `+1 ${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`;
  }
  const head = national.length % 2 ? national.slice(0, 1) : '';
  const pairs = national.slice(head.length).match(/.{2}/g) ?? [];
  return [`+${code}`, head, ...pairs].filter(Boolean).join(' ');
}

export const whatsappUrlOf = (e164: string) => `https://wa.me/${e164.replace(/\D/g, '')}`;

// Coordonnées sous la forme utilisée par le site et les emails
export function brandOf(config: Pick<SiteConfig, 'contactEmail' | 'whatsappPhone' | 'address'>) {
  return {
    name: 'GAI2E Conseils',
    email: config.contactEmail,
    whatsappDisplay: formatPhoneDisplay(config.whatsappPhone),
    whatsappUrl: whatsappUrlOf(config.whatsappPhone),
    address: config.address,
  };
}
export type Brand = ReturnType<typeof brandOf>;
