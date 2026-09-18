import { Outlet } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import CustomCursor from '@/components/base/CustomCursor';
import ScrollProgress from '@/components/base/ScrollProgress';
import PageTransition from '@/components/base/PageTransition';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-background-950">
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}