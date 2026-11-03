import { ProjectSelectionProvider } from './project-selection';
import Hero from './sections/hero';
import PhotoBanner from './sections/photo-banner';
import Origins from './sections/origins';
import Services from './sections/services';
import HowItWorks from './sections/how-it-works';
import Destinations from './sections/destinations';
import Partner from './sections/partner';
import Faq from './sections/faq';
import StartProject from './sections/start-project';

const Home = () => (
  <ProjectSelectionProvider>
    <div className="home--page">
      <Hero />
      <PhotoBanner />
      <Origins />
      <Services />
      <HowItWorks />
      <Destinations />
      <Partner />
      <Faq />
      <StartProject />
    </div>
  </ProjectSelectionProvider>
);

export default Home;
