import { Link } from 'react-router-dom';
import { LuArrowRight } from 'react-icons/lu';
import { Button } from '@gai2e/ui';
import { siteData } from '@/data';

const CallToAction = () => (
  <section className="px-4 pb-24">
    <div className="mx-auto max-w-4xl rounded-[2rem] bg-brand px-6 py-16 text-center text-brand-foreground shadow-2xl shadow-brand/25">
      <h2 className="font-serif text-3xl font-semibold md:text-4xl">Prêt à étudier à l'étranger ?</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm text-white/80">
        Pré-inscription gratuite : choisissez votre destination, un conseiller vous contacte sous 24 h.
      </p>
      <Button asChild variant="light" size="lg" className="mt-8">
        <Link to={siteData.preRegistrationPath}>
          Commencer maintenant
          <LuArrowRight />
        </Link>
      </Button>
    </div>
  </section>
);

export default CallToAction;
