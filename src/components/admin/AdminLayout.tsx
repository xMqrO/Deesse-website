import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import AdminPasswordGate from '@/components/admin/AdminPasswordGate';
import PageTransition from '@/components/base/PageTransition';

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <AdminPasswordGate>
      <div className="min-h-screen bg-background-950 text-foreground-100">
        <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <div className="lg:pl-64">
          <AdminTopbar onMenu={() => setMenuOpen(true)} />
          <main className="px-4 py-6 md:px-8 md:py-8">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </main>
        </div>
      </div>
    </AdminPasswordGate>
  );
}