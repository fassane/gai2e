import { Link, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuHouse } from 'react-icons/lu';
import { Button } from '@gai2e/ui';


const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-warm-gradient px-4 py-16 md:py-24">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <img src="/images/not-found.svg" alt="" aria-hidden className="w-full max-w-lg" />
        <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">Page introuvable</h1>
        <p className="max-w-md text-muted-foreground">
          Cette page n'existe pas ou n'est pas encore disponible.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="outline" size="lg" onClick={() => navigate(-1)}>
            <LuArrowLeft />
            Retour
          </Button>
          <Button asChild variant="cta" size="lg">
            <Link to="/">
              <LuHouse />
              Retour à l'accueil
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
