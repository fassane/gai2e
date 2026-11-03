import { FaWhatsapp } from 'react-icons/fa';
import { siteData } from '@/data';

// Bouton flottant : le WhatsApp est le canal préféré de la plupart des étudiants.
export function WhatsappButton() {
  return (
    <a
      href={siteData.contact.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Nous écrire sur WhatsApp"
      className="fixed right-5 bottom-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-105"
    >
      <FaWhatsapp className="size-7" />
    </a>
  );
}
