import { Link } from 'react-router-dom';
import Parallax from '@/components/base/Parallax';
import MagneticButton from '@/components/base/MagneticButton';
import { products } from '@/mocks/products';

export default function Hero() {
  const floatA = products.find((p) => p.id === 'velvet-rouge-lipstick') ?? products[0];
  const floatB = products.find((p) => p.id === 'lumiere-radiance-serum') ?? products[1];

  return (
    <section className="grain relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden">
      {/* Background with parallax */}
      <div className="absolute inset-0">
        <Parallax speed={110} className="h-full w-full">
          <img
            src="https://readdy.ai/api/search-image?query=Elegant%20abstract%20luxury%20beauty%20background%20with%20flowing%20silk-like%20crimson%20and%20rose%20pink%20ribbons%20swirling%20against%20a%20deep%20black%20backdrop%2C%20soft%20cinematic%20studio%20lighting%20with%20gentle%20golden%20highlights%2C%20dramatic%20moody%20atmosphere%2C%20high%20fashion%20editorial%20aesthetic%2C%20rich%20textures%20and%20subtle%20bokeh%2C%20sophisticated%20minimalist%20composition&width=1920&height=1080&seq=deesse-hero-01&orientation=landscape"
            alt="déesse luxury beauty — cinematic crimson and rose silk"
            className="h-[125%] w-full object-cover object-top"
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-b from-background-950/70 via-background-950/40 to-background-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-background-950/50 via-transparent to-background-950/50" />
      </div>

      {/* Floating product chips (desktop) */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="animate-float absolute left-[6%] top-[22%] w-36">
          <Link
            to={`/product/${floatA.id}`}
            className="pointer-events-auto block cursor-pointer rounded-lg border border-background-700/70 bg-background-950/70 p-2 backdrop-blur transition-colors hover:border-primary-500/60"
          >
            <div className="aspect-square overflow-hidden rounded-md bg-background-900">
              <img
                src={floatA.image}
                alt={floatA.name}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <p className="mt-2 truncate px-1 text-[10px] uppercase tracking-[0.2em] text-foreground-400">
              Icon
            </p>
            <p className="truncate px-1 font-heading text-sm text-foreground-50">{floatA.name}</p>
          </Link>
        </div>

        <div
          className="animate-float absolute right-[6%] top-[30%] w-36"
          style={{ animationDelay: '1.4s' }}
        >
          <Link
            to={`/product/${floatB.id}`}
            className="pointer-events-auto block cursor-pointer rounded-lg border border-background-700/70 bg-background-950/70 p-2 backdrop-blur transition-colors hover:border-accent-500/60"
          >
            <div className="aspect-square overflow-hidden rounded-md bg-background-900">
              <img
                src={floatB.image}
                alt={floatB.name}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <p className="mt-2 truncate px-1 text-[10px] uppercase tracking-[0.2em] text-foreground-400">
              Bestseller
            </p>
            <p className="truncate px-1 font-heading text-sm text-foreground-50">{floatB.name}</p>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 md:px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="cinematic-line text-[11px] md:text-xs uppercase tracking-[0.45em] text-accent-300">
            La Maison de Beauté
          </p>

          <h1 className="mt-6 font-heading text-5xl md:text-7xl lg:text-8xl leading-[1.02] text-foreground-50">
            <span className="cinematic-line block" style={{ animationDelay: '0.15s' }}>
              Beauty, made
            </span>
            <span
              className="cinematic-line block text-shimmer italic"
              style={{ animationDelay: '0.35s' }}
            >
              divine.
            </span>
          </h1>

          <p
            className="cinematic-line mx-auto mt-6 max-w-xl text-base md:text-lg font-light text-foreground-200 leading-relaxed"
            style={{ animationDelay: '0.55s' }}
          >
            Indulgent cosmetics, radiant skincare, and rare fragrance — a ritual of elegance
            crafted for the modern icon.
          </p>

          <div
            className="cinematic-line mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
            style={{ animationDelay: '0.75s' }}
          >
            <MagneticButton className="w-full sm:w-auto">
              <Link
                to="/shop"
                className="inline-flex w-full sm:w-auto items-center justify-center whitespace-nowrap rounded-full bg-primary-500 px-8 py-3.5 text-sm font-medium uppercase tracking-[0.15em] text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
              >
                Shop the Collection
              </Link>
            </MagneticButton>
            <MagneticButton className="w-full sm:w-auto">
              <a
                href="#maison"
                className="inline-flex w-full sm:w-auto items-center justify-center whitespace-nowrap rounded-full border border-foreground-300/40 px-8 py-3.5 text-sm font-medium uppercase tracking-[0.15em] text-foreground-100 hover:border-foreground-100 transition-colors cursor-pointer"
              >
                Discover the Maison
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse-soft">
        <span className="text-[10px] uppercase tracking-[0.3em] text-foreground-400">Scroll</span>
        <i className="ri-arrow-down-line text-foreground-300" />
      </div>
    </section>
  );
}