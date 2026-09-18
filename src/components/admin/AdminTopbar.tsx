import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { adminOrders } from '@/mocks/admin';
import { signOutAdmin } from '@/components/admin/AdminPasswordGate';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/admin': { title: 'Overview', subtitle: 'A live pulse of the maison' },
  '/admin/products': { title: 'Products', subtitle: 'Manage the déesse catalog' },
  '/admin/inventory': { title: 'Inventory', subtitle: 'Stock health & alerts' },
  '/admin/orders': { title: 'Orders', subtitle: 'Fulfilment and payments' },
  '/admin/customers': { title: 'Customers', subtitle: 'Your clientele' },
  '/admin/categories': { title: 'Categories', subtitle: 'Organise the collections' },
  '/admin/discounts': { title: 'Discounts', subtitle: 'Offers, codes & campaigns' },
  '/admin/reviews': { title: 'Reviews', subtitle: 'Client sentiment' },
  '/admin/analytics': { title: 'Analytics', subtitle: 'Revenue & performance' },
  '/admin/profile': { title: 'Profile', subtitle: 'Brand & social links' },
};

const notifications = [
  { icon: 'ri-shopping-bag-3-line', title: 'New order #DS-4821', time: '2 min ago', tone: 'text-primary-300' },
  { icon: 'ri-user-add-line', title: 'Camille Laurent joined Icon tier', time: '1 hr ago', tone: 'text-accent-300' },
  { icon: 'ri-alert-line', title: 'Low stock: Vernis Nuit', time: '3 hrs ago', tone: 'text-primary-300' },
  { icon: 'ri-star-line', title: 'New 5-star review on Lumière', time: '5 hrs ago', tone: 'text-accent-300' },
];

interface AdminTopbarProps {
  onMenu: () => void;
}

export default function AdminTopbar({ onMenu }: AdminTopbarProps) {
  const { pathname } = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState('');

  const page = PAGE_TITLES[pathname] ?? { title: 'Admin', subtitle: 'déesse dashboard' };

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return adminOrders
      .filter((o) => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q))
      .slice(0, 5);
  }, [query]);

  return (
    <header className="sticky top-0 z-30 border-b border-background-800 bg-background-950/85 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 md:px-8">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-background-800 text-foreground-300 lg:hidden cursor-pointer"
        >
          <i className="ri-menu-line text-xl" />
        </button>

        <div className="hidden min-w-0 md:block">
          <h1 className="truncate font-heading text-xl text-foreground-50 leading-tight">
            {page.title}
          </h1>
          <p className="truncate text-xs text-foreground-500">{page.subtitle}</p>
        </div>

        <div className="relative ml-auto w-full max-w-xs">
          <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders, customers…"
            className="w-full rounded-full border border-background-800 bg-background-900/60 py-2.5 pl-9 pr-4 text-sm text-foreground-100 placeholder:text-foreground-600 outline-none focus:border-primary-500/60 transition-colors"
          />
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-lg border border-background-700 bg-background-900 animate-scale-in">
              {searchResults.map((o) => (
                <Link
                  key={o.id}
                  to="/admin/orders"
                  onClick={() => setQuery('')}
                  className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-background-800 transition-colors cursor-pointer"
                >
                  <span className="text-foreground-100">{o.id}</span>
                  <span className="truncate text-foreground-500">{o.customer}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((v) => !v);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-background-800 text-foreground-300 hover:text-foreground-50 transition-colors cursor-pointer"
          >
            <i className="ri-notification-3-line text-lg" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary-500" />
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-xl border border-background-700 bg-background-900 animate-scale-in">
                <div className="border-b border-background-800 px-4 py-3">
                  <p className="font-heading text-base text-foreground-50">Notifications</p>
                </div>
                <ul>
                  {notifications.map((n) => (
                    <li
                      key={n.title}
                      className="flex items-start gap-3 border-b border-background-800/60 px-4 py-3 last:border-0 hover:bg-background-800/40 transition-colors"
                    >
                      <i className={`${n.icon} mt-0.5 text-lg ${n.tone}`} />
                      <div>
                        <p className="text-sm text-foreground-100">{n.title}</p>
                        <p className="text-xs text-foreground-500">{n.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileOpen((v) => !v);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 rounded-full border border-background-800 py-1 pl-1 pr-3 transition-colors hover:border-background-700 cursor-pointer"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500/20 font-heading text-sm text-primary-200">
              É
            </span>
            <span className="hidden text-sm text-foreground-200 sm:block">Élise</span>
            <i className="ri-arrow-down-s-line text-foreground-500" />
          </button>
          {profileOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-xl border border-background-700 bg-background-900 animate-scale-in">
                <div className="border-b border-background-800 px-4 py-3">
                  <p className="text-sm text-foreground-50">Élise Moreau</p>
                  <p className="text-xs text-foreground-500">elise@deesse.com</p>
                </div>
                <Link
                  to="/"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground-300 hover:bg-background-800 transition-colors cursor-pointer"
                >
                  <i className="ri-store-2-line" /> Storefront
                </Link>
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground-300 hover:bg-background-800 transition-colors cursor-pointer"
                >
                  <i className="ri-settings-3-line" /> Settings
                </Link>
                <button
                  type="button"
                  onClick={signOutAdmin}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-primary-300 hover:bg-background-800 transition-colors cursor-pointer"
                >
                  <i className="ri-logout-box-r-line" /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}