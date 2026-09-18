import Hero from '@/pages/home/components/Hero';
import Marquee, { BrandMarquee } from '@/pages/home/components/Marquee';
import FeaturedProducts from '@/pages/home/components/FeaturedProducts';
import ProductSpotlight from '@/pages/home/components/ProductSpotlight';
import FeaturedCollections from '@/pages/home/components/FeaturedCollections';
import Collections from '@/pages/home/components/Collections';
import OfferBanner from '@/pages/home/components/OfferBanner';
import Editorial from '@/pages/home/components/Editorial';
import BrandStory from '@/pages/home/components/BrandStory';
import Concierge from '@/pages/home/components/Concierge';
import Testimonials from '@/pages/home/components/Testimonials';
import SocialGallery from '@/pages/home/components/SocialGallery';
import ProductCard from '@/components/feature/ProductCard';
import Newsletter from '@/components/feature/Newsletter';
import Reveal from '@/components/base/Reveal';
import AnimatedHeading from '@/components/base/AnimatedHeading';
import Parallax from '@/components/base/Parallax';
import { Link } from 'react-router-dom';
import { useStorefrontProducts } from '@/context/ProductContext';

export default function Home() {
  const products = useStorefrontProducts();
  const newArrivals = products.filter((p) => p.tags.includes('New')).slice(0, 4);

  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedProducts />
      <ProductSpotlight />
      <FeaturedCollections />
      <Collections />
      <BrandMarquee />
      <OfferBanner />
      <Editorial />
      <BrandStory />

      {/* New Arrivals */}
      <section className="relative border-b border-background-800 bg-background-900/40">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.35em] text-accent-300">
                Just Landed
              </p>
              <AnimatedHeading
                as="h2"
                text="New Arrivals"
                className="mt-3 font-heading text-3xl md:text-5xl text-foreground-50 leading-tight"
              />
            </Reveal>
            <Reveal delay={120}>
              <Link
                to="/shop?tag=New"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground-300 hover:text-foreground-50 transition-colors cursor-pointer group"
              >
                Shop new in
                <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {newArrivals.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Concierge />
      <Testimonials />
      <SocialGallery />

      {/* Newsletter CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Parallax speed={80} className="h-full w-full">
            <img
              src="https://readdy.ai/api/search-image?query=Soft%20dreamy%20abstract%20background%20of%20blurred%20crimson%20and%20rose%20pink%20silk%20waves%20on%20a%20deep%20black%20backdrop%2C%20cinematic%20soft%20focus%20glow%2C%20luxury%20beauty%20editorial%20atmosphere%2C%20elegant%20gradient%20lighting%2C%20sophisticated%20minimalist%20composition&width=1920&height=800&seq=deesse-cta-01&orientation=landscape"
              alt=""
              className="h-[130%] w-full object-cover object-top"
            />
          </Parallax>
          <div className="absolute inset-0 bg-background-950/70" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 md:px-6 py-24 md:py-32 text-center">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.35em] text-accent-300">Private List</p>
            <h2 className="mt-3 font-heading text-3xl md:text-5xl text-foreground-50 leading-tight">
              Join the maison
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-foreground-300 leading-relaxed">
              Be first to know of new launches, private rituals, and offers reserved for our inner
              circle.
            </p>
          </Reveal>
          <Reveal delay={150} className="mt-8 flex justify-center">
            <Newsletter align="center" />
          </Reveal>
        </div>
      </section>
    </>
  );
}