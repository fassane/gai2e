import type { IconType } from 'react-icons';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { brandOf, defaultSiteConfig, formatPhoneDisplay, type SiteConfig } from '@gai2e/shared-types';
import { useGetSiteConfigQuery } from '@/utils/api/site-config/site-config.api';

export type SocialLink = { id: string; label: string; href: string; icon: IconType };

const socialFields: { key: keyof SiteConfig; id: string; label: string; icon: IconType }[] = [
  { key: 'facebookUrl', id: 'facebook', label: 'Facebook', icon: FaFacebookF },
  { key: 'instagramUrl', id: 'instagram', label: 'Instagram', icon: FaInstagram },
  { key: 'linkedinUrl', id: 'linkedin', label: 'LinkedIn', icon: FaLinkedinIn },
  { key: 'tiktokUrl', id: 'tiktok', label: 'TikTok', icon: FaTiktok },
  { key: 'youtubeUrl', id: 'youtube', label: 'YouTube', icon: FaYoutube },
  { key: 'xUrl', id: 'x', label: 'X (Twitter)', icon: FaXTwitter },
];

// Réglages du site (Configuration du back-office). Valeurs par défaut pendant le chargement ou si l'api ne répond pas.
export function useSiteConfig() {
  const { data } = useGetSiteConfigQuery();
  const config = data ?? defaultSiteConfig;
  const socials: SocialLink[] = socialFields.flatMap(({ key, id, label, icon }) => {
    const href = config[key];
    return typeof href === 'string' && href ? [{ id, label, href, icon }] : [];
  });
  return {
    config,
    contact: {
      ...brandOf(config),
      phoneDisplay: config.phone ? formatPhoneDisplay(config.phone) : null,
      phone: config.phone,
      openingHours: config.openingHours,
    },
    socials,
  };
}
