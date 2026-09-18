import { NavLink, Link } from 'react-router-dom';

const navItems = [
  { label: 'Overview', to: '/admin', icon: 'ri-dashboard-3-line', end: true },
  { label: 'Products', to: '/admin/products', icon: 'ri-shopping-bag-3-line' },
  { label: 'Inventory', to: '/admin/inventory', icon: 'ri-stack-line' },
  { label: 'Orders', to: '/admin/orders', icon: 'ri-file-list-3-line' },
  { label: 'Customers', to: '/admin/customers', icon: 'ri-group-line' },
  { label: 'Categories', to: '/admin/categories', icon: 'ri-price-tag-3-line' },
  { label: 'Discounts', to: '/admin/discounts', icon: 'ri-coupon-3-line' },
  { label: 'Reviews', to: '/admin/reviews', icon: 'ri-chat-3-line' },
  { label: 'Analytics', to: '/admin/analytics', icon: 'ri-line-chart-line' },
  { label: 'Profile', to: '/admin/profile', icon: 'ri-user-settings-line' },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-background-950/70 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-background-800 bg-background-950 transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between border-b border-background-800 px-5">
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <span className="font-heading text-2xl lowercase text-foreground-50 leading-none">
              déesse
            </span>
            <span className="rounded-full border border-primary-500/40 bg-primary-500/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-primary-200">
              Admin
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center text-foreground-300 lg:hidden cursor-pointer"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 pb-2 text-[10px] uppercase tracking-[0.25em] text-foreground-600">
            Manage
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-primary-500/15 text-foreground-50'
                        : 'text-foreground-400 hover:bg-background-900 hover:text-foreground-100'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <i
                        className={`${item.icon} text-lg ${isActive ? 'text-primary-400' : ''}`}
                      />
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-500" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-background-800 p-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground-400 hover:bg-background-900 hover:text-foreground-100 transition-colors cursor-pointer"
          >
            <i className="ri-store-2-line text-lg" />
            View Storefront
            <i className="ri-arrow-right-up-line ml-auto text-foreground-600" />
          </Link>
        </div>
      </aside>
    </>
  );
}