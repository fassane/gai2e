import { Outlet } from 'react-router-dom';
import { WhatsappButton } from '@/components/shared/whatsapp-button';
import Header from './components/header';
import Footer from './components/footer';

// Layout des pages publiques (landing, pages d'information).
function AppLayout() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
      <WhatsappButton />
    </>
  );
}

export default AppLayout;
