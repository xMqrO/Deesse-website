import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import SearchOverlay from '@/components/feature/SearchOverlay';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Bestsellers', to: '/shop?tag=Bestseller' },
  { label: 'New In', to: '/shop?tag=New' },
  { label: 'The Maison', to: '/#maison' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  const solid = scrolled || open;

  return (
    <>
      <header
        className={`sticky top-0 inset-x-0 z-50 transition-all duration-500 ${
          solid
            ? 'bg-background-950/90 backdrop-blur-xl border-b border-background-800/70'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex h-16 md:h-20 items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group cursor-pointer">
              <span className="font-heading text-2xl md:text-[1.7rem] tracking-wide text-foreground-50 lowercase leading-none">
                déesse
              </span>
              <span className="hidden md:inline-flex h-1.5 w-1.5 rounded-full bg-primary-500 transition-colors group-hover:bg-accent-400" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {links.map((l) => (
                <NavLink
                  key={l.label}
                  to={l.to}
                  className={({ isActive }) =>
                    `relative text-[13px] uppercase tracking-[0.2em] whitespace-nowrap cursor-pointer transition-colors duration-300 ${
                      isActive && l.to !== '/#maison'
                        ? 'text-foreground-50'
                        : 'text-foreground-300 hover:text-foreground-50'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <button
                type="button"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className="flex h-10 w-10 items-center justify-center text-foreground-300 hover:text-foreground-50 transition-colors cursor-pointer"
              >
                <i className="ri-search-line text-lg" />
              </button>

              <Link
                to="/cart"
                className="relative flex h-10 w-10 items-center justify-center text-foreground-300 hover:text-foreground-50 transition-colors cursor-pointer"
                aria-label="Cart"
              >
                <i className="ri-shopping-bag-line text-lg" />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-500 px-1 text-[10px] font-medium text-foreground-50 animate-scale-in">
                    {count}
                  </span>
                )}
              </Link>

              <button
                type="button"
                aria-label="Menu"
                onClick={() => setOpen((v) => !v)}
                className="md:hidden flex h-10 w-10 items-center justify-center text-foreground-50 cursor-pointer"
              >
                <i className={`text-xl ${open ? 'ri-close-line' : 'ri-menu-line'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col gap-1 px-4 pb-6 pt-2">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                className="flex items-center justify-between rounded-lg px-4 py-3 text-sm uppercase tracking-[0.2em] text-foreground-200 hover:bg-background-900 transition-colors cursor-pointer"
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}