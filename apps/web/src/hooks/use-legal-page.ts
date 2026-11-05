import type { LegalPageId } from '@gai2e/shared-types';
import { legalPageContents, type LegalSection } from '@/data';
import { useGetLegalPageQuery } from '@/utils/api/legal-page/legal-page.api';
import { useSiteConfig } from './use-site-config';

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

// Texte par défaut (sections de legal.data.ts) au format de l'éditeur
function sectionsToHtml(sections: LegalSection[]): string {
  const paragraphs = (texts?: string[]) => (texts ?? []).map((text) => `<p>${escapeHtml(text)}</p>`).join('');
  return sections
    .map((section) => {
      const items = section.items?.length
        ? `<ul>${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
        : '';
      return `<h2>${escapeHtml(section.title)}</h2>${paragraphs(section.paragraphs)}${items}${paragraphs(section.closing)}`;
    })
    .join('');
}

// Contenu d'une page légale : celui du back-office, sinon le texte par défaut (aussi si l'api ne répond pas)
export function useLegalPage(id: LegalPageId) {
  const { data, isLoading } = useGetLegalPageQuery(id);
  const { contact } = useSiteConfig();
  const page = legalPageContents[id];

  return {
    title: page.title,
    intro: page.intro,
    html:
      data?.content ??
      sectionsToHtml(
        page.sections({ email: contact.email, address: contact.address, whatsappDisplay: contact.whatsappDisplay }),
      ),
    updatedAt: data?.updatedAt ?? page.updatedAt,
    isLoading,
  };
}
