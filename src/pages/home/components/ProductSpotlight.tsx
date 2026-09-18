import { Link } from 'react-router-dom';
import Reveal from '@/components/base/Reveal';
import Parallax from '@/components/base/Parallax';
import MagneticButton from '@/components/base/MagneticButton';
import { useStorefrontProducts } from '@/context/ProductContext';

export default function ProductSpotlight() {
  const products = useStorefrontProducts();
  const hero = products.find((p) => p.id === 'rose-eternelle-parfum') ?? products[3] ?? products[0];

  if (!hero) return null;

  const notes = [
    { label: 'Top', value: 'Saffron · Bergamot' },
    { label: 'Heart', value: 'Damask Rose · Peony' },
    { label: 'Base', value: 'Oud · Amber · Musk' },
  ];

  return (
    <section className="relative overflow-hidden border-y border-background-800">
      {/* Ambient gradient */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-primary-600/20 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-accent-500/15 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Copy */}
          <div className="order-2 lg:order-1">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-500/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-accent-200">
                <i className="ri-vip-diamond-fill" />
                Signature
              </span>
            </Reveal>
            <Reveal delay={90}>
              <h2 className="mt-5 font-heading text-4xl md:text-6xl text-foreground-50 leading-[1.05]">
                {hero.name}
              </h2>
              <p className="mt-3 font-heading text-xl italic text-foreground-300">
                {hero.tagline}
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 max-w-lg text-base font-light text-foreground-300 leading-relaxed">
                {hero.description}
              </p>
            </Reveal>

            <Reveal delay={220}>
              <dl className="mt-8 divide-y divide-background-800 border-y border-background-800">
                {notes.map((n) => (
                  <div key={n.label} className="flex items-center justify-between py-3.5">
                    <dt className="text-[11px] uppercase tracking-[0.25em] text-foreground-500">
                      {n.label} Notes
                    </dt>
                    <dd className="font-heading text-lg text-foreground-200">{n.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={280} className="mt-8 flex flex-wrap items-center gap-4">
              <MagneticButton>
                <Link
                  to={`/product/${hero.id}`}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-primary-500 px-8 py-3.5 text-sm font-medium uppercase tracking-[0.15em] text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
                >
                  Discover the Scent
                </Link>
              </MagneticButton>
              <span className="font-heading text-3xl text-foreground-50">${hero.price}</span>
            </Reveal>
          </div>

          {/* Product image */}
          <div className="relative order-1 lg:order-2">
            <Reveal>
              <div data-product-shop className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-lg bg-background-900">
                <Parallax speed={50} className="h-full w-full">
                  <img
                    src={hero.image}
                    alt={`${hero.name} — déesse signature fragrance`}
                    title={`${hero.name} — déesse`}
                    className="h-[112%] w-full object-cover object-top"
                  />
                </Parallax>
                <div className="absolute inset-0 bg-gradient-to-t from-background-950/40 to-transparent" />
              </div>
            </Reveal>

            {/* Floating rating badge */}
            <div className="absolute left-2 top-6 rounded-lg border border-background-700 bg-background-900/90 px-4 py-3 backdrop-blur animate-float md:left-6">
              <div className="flex items-center gap-1 text-accent-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <i key={i} className="ri-star-fill text-xs" />
                ))}
              </div>
              <p className="mt-1 text-[11px] text-foreground-400">
                {hero.rating} · {hero.reviews.toLocaleString()} devotees
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}