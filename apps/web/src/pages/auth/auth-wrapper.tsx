import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuBellRing, LuFileCheck, LuMessagesSquare } from 'react-icons/lu';
import { Button, Logo, ThemeToggle } from '@gai2e/ui';
import { siteData } from '@/data';

const promises = [
  { icon: LuFileCheck, text: 'Vos étapes et vos échéances calculées pour votre destination' },
  { icon: LuMessagesSquare, text: 'Un conseiller qui vérifie vos pièces et répond à vos questions' },
  { icon: LuBellRing, text: 'Des rappels avant chaque date importante' },
];

type AuthWrapperProps = {
  title: string;
  description?: ReactNode;
  children: ReactNode;
};

// Mise en page des pages d'authentification : formulaire à gauche, panneau de marque à droite (desktop).
const AuthWrapper = ({ title, description, children }: AuthWrapperProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-svh bg-warm-gradient">
      <div className="flex w-full flex-col px-4 py-6 md:px-10 lg:w-1/2">
        <div className="flex items-center justify-between">
          <Link to="/" title={siteData.name}>
            <Logo />
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <LuArrowLeft />
              Retour
            </Button>
          </div>
        </div>

        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md rounded-3xl border bg-card p-6 shadow-xl shadow-primary/5 md:p-8">
            <div className="mb-8 text-center">
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance">{title}</h1>
              {description && <p className="mt-3 text-sm text-muted-foreground">{description}</p>}
            </div>
            {children}
          </div>
        </main>

        <p className="text-center text-xs text-muted-foreground">
          Besoin d'aide ?{' '}
          <a
            href={siteData.contact.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Écrivez-nous sur WhatsApp
          </a>
        </p>
      </div>

      <aside className="hidden p-4 lg:block lg:w-1/2">
        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] bg-brand p-12 text-brand-foreground">
          <div aria-hidden className="absolute -top-24 -right-24 size-80 rounded-full bg-peach/30 blur-3xl" />
          <div aria-hidden className="absolute -bottom-32 -left-16 size-96 rounded-full bg-white/10 blur-3xl" />

          <Logo light className="relative" />

          <div className="relative max-w-md">
            <p className="font-serif text-4xl leading-tight font-semibold">
              Votre projet d'études, <em className="text-peach">suivi pas à pas.</em>
            </p>
            <ul className="mt-10 space-y-5">
              {promises.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm text-white/85">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <Icon className="size-4" />
                  </span>
                  <span className="pt-2">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="relative text-xs text-white/60">France · Canada · Japon · Royaume-Uni · Chine</p>
        </div>
      </aside>
    </div>
  );
};

export default AuthWrapper;
