import { Link } from 'react-router-dom';
import Newsletter from '@/components/feature/Newsletter';
import { useSocials } from '@/context/SocialContext';

const shopLinks = [
  { label: 'Skincare', to: '/shop?category=Skincare' },
  { label: 'Makeup', to: '/shop?category=Makeup' },
  { label: 'Fragrance', to: '/shop?category=Fragrance' },
  { label: 'Bestsellers', to: '/shop?tag=Bestseller' },
];

const helpLinks = [
  { label: 'Shipping & Returns', to: '/' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/' },
  { label: 'Privacy', to: '/privacy' },
];

export default function Footer() {
  const { socials } = useSocials();
  const visibleSocials = socials.filter((s) => s.enabled && s.url.trim());

  return (
    <footer className="relative border-t border-background-800 bg-background-950 text-foreground-200">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-14 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:pr-8">
            <Link to="/" className="inline-block cursor-pointer">
              <span className="font-heading text-3xl text-foreground-50 lowercase leading-none">
                déesse
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-foreground-400 max-w-xs">
              A luxury beauty maison crafting indulgent rituals in cosmetics, skincare, and rare
              fragrance — designed for the modern icon.
            </p>
            {visibleSocials.length > 0 && (
              <div className="mt-6 flex items-center gap-3">
                {visibleSocials.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-background-700 text-foreground-300 hover:text-foreground-50 hover:border-primary-500 transition-colors cursor-pointer"
                  >
                    <i className={`${s.icon} text-base`} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-foreground-500">Shop</h4>
            <ul className="mt-5 space-y-3">
              {shopLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm text-foreground-300 hover:text-foreground-50 transition-colors cursor-pointer"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-foreground-500">The Maison</h4>
            <ul className="mt-5 space-y-3">
              {helpLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm text-foreground-300 hover:text-foreground-50 transition-colors cursor-pointer"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-foreground-500">Stay in touch</h4>
            <div className="mt-5">
              <Newsletter
                title=""
                subtitle="Be first to know of new launches, rituals, and private offers."
              />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-background-800 pt-6">
          <p className="text-xs text-foreground-500">
            © {new Date().getFullYear()} déesse. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-foreground-500">
            <span className="uppercase tracking-widest">Visa</span>
            <span className="uppercase tracking-widest">Mastercard</span>
            <span className="uppercase tracking-widest">Amex</span>
            <span className="uppercase tracking-widest">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}