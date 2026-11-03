import type { UseFormReturn } from 'react-hook-form';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import type { SiteConfigInput } from '@gai2e/shared-types';
import { Input } from '@gai2e/ui';

const networks = [
  { name: 'facebookUrl', label: 'Facebook', icon: FaFacebookF, placeholder: 'https://facebook.com/…' },
  { name: 'instagramUrl', label: 'Instagram', icon: FaInstagram, placeholder: 'https://instagram.com/…' },
  { name: 'linkedinUrl', label: 'LinkedIn', icon: FaLinkedinIn, placeholder: 'https://linkedin.com/company/…' },
  { name: 'tiktokUrl', label: 'TikTok', icon: FaTiktok, placeholder: 'https://tiktok.com/@…' },
  { name: 'youtubeUrl', label: 'YouTube', icon: FaYoutube, placeholder: 'https://youtube.com/@…' },
  { name: 'xUrl', label: 'X (Twitter)', icon: FaXTwitter, placeholder: 'https://x.com/…' },
] as const;

export function SocialsTab({ form }: { form: UseFormReturn<SiteConfigInput> }) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div>
      <p className="mb-5 text-sm text-muted-foreground">
        Seuls les réseaux renseignés apparaissent dans le pied de page. Laissez vide pour masquer un réseau.
      </p>
      <div className="grid gap-x-4 md:grid-cols-2">
        {networks.map(({ name, label, icon: Icon, placeholder }) => (
          <Input
            key={name}
            label={label}
            type="url"
            icon={<Icon className="size-4" />}
            placeholder={placeholder}
            {...register(name, { setValueAs: (value: string) => value ?? '' })}
            error={errors[name]}
          />
        ))}
      </div>
    </div>
  );
}
