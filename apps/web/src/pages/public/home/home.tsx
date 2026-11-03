import Hero from './sections/hero';
import Origins from './sections/origins';
import Services from './sections/services';
import HowItWorks from './sections/how-it-works';
import Destinations from './sections/destinations';
import Testimonials from './sections/testimonials';
import Partner from './sections/partner';
import Faq from './sections/faq';
import CallToAction from './sections/call-to-action';

const Home = () => (
  <div className="home--page">
    <Hero />
    <Origins />
    <Services />
    <HowItWorks />
    <Destinations />
    <Testimonials />
    <Partner />
    <Faq />
    <CallToAction />
  </div>
);

export default Home;
