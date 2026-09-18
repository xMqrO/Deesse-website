import { Link } from 'react-router-dom';
import ProductCard from '@/components/feature/ProductCard';
import Reveal from '@/components/base/Reveal';
import AnimatedHeading from '@/components/base/AnimatedHeading';
import { useStorefrontProducts } from '@/context/ProductContext';

export default function FeaturedProducts() {
  const products = useStorefrontProducts();
  const featured = products
    .filter((p) => p.featured || p.tags.includes('Bestseller'))
    .slice(0, 8);

  return (
    <section className="relative mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.35em] text-accent-300">Curated Icons</p>
          <AnimatedHeading
            as="h2"
            text="The Bestsellers"
            className="mt-3 font-heading text-3xl md:text-5xl text-foreground-50 leading-tight"
          />
          <p className="mt-3 max-w-md text-sm text-foreground-400 leading-relaxed">
            The pieces our clientele returns to, season after season — loved, restocked, and
            endlessly coveted.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <Link
            to="/shop?tag=Bestseller"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground-300 hover:text-foreground-50 transition-colors cursor-pointer group"
          >
            View all
            <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}