import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { MAX_DESTINATIONS, originOptions, studyDestinations } from '@/data';
import { useSiteConfig } from '@/hooks/use-site-config';

// Projet saisi sur la landing : pays d'origine et jusqu'à 3 destinations.
// Partagé par la carte du hero, la section Destinations et le récapitulatif final.
type ProjectSelection = {
  origin: string;
  setOrigin: (countryCode: string) => void;
  destinations: string[];
  toggleDestination: (countryCode: string) => void;
  isFull: boolean;
  // Lien WhatsApp avec la demande d'évaluation pré-remplie
  evaluationUrl: string;
};

const ProjectSelectionContext = createContext<ProjectSelection | null>(null);

const nameOf = (list: { countryCode: string; name: string }[], code: string) =>
  list.find((country) => country.countryCode === code)?.name ?? code;

export function ProjectSelectionProvider({ children }: { children: ReactNode }) {
  const [origin, setOrigin] = useState('BF');
  const [destinations, setDestinations] = useState<string[]>([]);
  const { contact } = useSiteConfig();

  const toggleDestination = useCallback((countryCode: string) => {
    setDestinations((current) => {
      if (current.includes(countryCode)) return current.filter((code) => code !== countryCode);
      return current.length < MAX_DESTINATIONS ? [...current, countryCode] : current;
    });
  }, []);

  // En attendant l'enregistrement des prospects (Lead) par l'API : la demande part sur WhatsApp
  const evaluationUrl = useMemo(() => {
    const wishes = destinations.map((code) => nameOf(studyDestinations, code)).join(', ');
    const message = [
      'Bonjour GAI2E Conseils, je souhaite faire évaluer mon profil pour étudier à l’étranger.',
      `Je viens de : ${nameOf(originOptions, origin)}`,
      `Destinations souhaitées : ${wishes || 'à définir avec un conseiller'}`,
    ].join('\n');
    return `${contact.whatsappUrl}?text=${encodeURIComponent(message)}`;
  }, [origin, destinations, contact.whatsappUrl]);

  const value = useMemo(
    () => ({
      origin,
      setOrigin,
      destinations,
      toggleDestination,
      isFull: destinations.length >= MAX_DESTINATIONS,
      evaluationUrl,
    }),
    [origin, destinations, toggleDestination, evaluationUrl],
  );
  return <ProjectSelectionContext.Provider value={value}>{children}</ProjectSelectionContext.Provider>;
}

export function useProjectSelection(): ProjectSelection {
  const context = useContext(ProjectSelectionContext);
  if (!context) throw new Error('useProjectSelection doit être utilisé sous <ProjectSelectionProvider>');
  return context;
}

export const destinationName = (code: string) => nameOf(studyDestinations, code);
export const originName = (code: string) => nameOf(originOptions, code);
