import { Link } from 'react-router-dom';
import Reveal from '@/components/base/Reveal';
import AnimatedHeading from '@/components/base/AnimatedHeading';
import { curatedCollections } from '@/mocks/collections';

export default function FeaturedCollections() {
  return (
    <section className="relative border-y border-background-800 bg-background-900/40">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.35em] text-accent-300">Curated Edits</p>
            <AnimatedHeading
              as="h2"
              text="Collect the moment"
              className="mt-3 font-heading text-3xl md:text-5xl text-foreground-50 leading-tight"
            />
            <p className="mt-3 max-w-md text-sm text-foreground-400 leading-relaxed">
              Hand-picked groupings composed by our artists — designed to be discovered,
              gifted, and adored.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground-300 hover:text-foreground-50 transition-colors cursor-pointer group"
            >
              All edits
              <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/* Bento grid */}
        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3 lg:grid-rows-2">
          {curatedCollections.map((c, i) => {
            const feature = i === 0;
            return (
              <Reveal
                key={c.id}
                delay={i * 100}
                className={feature ? 'lg:col-span-2 lg:row-span-2' : ''}
              >
                <Link to={c.to} className="group relative block h-full cursor-pointer">
                  <div
                    className={`relative overflow-hidden rounded-lg bg-background-900 ${
                      feature ? 'aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[520px]' : 'aspect-[16/10]'
                    }`}
                  >
                    <img
                      src={c.image}
                      alt={`${c.name} — déesse curated collection`}
                      title={`${c.name} — déesse`}
                      className="h-full w-full object-cover object-top transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-950/95 via-background-950/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                      <span className="inline-flex rounded-full border border-foreground-300/30 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground-200">
                        {c.itemCount} pieces
                      </span>
                      <p className="mt-4 text-[11px] uppercase tracking-[0.3em] text-accent-300">
                        {c.tagline}
                      </p>
                      <h3
                        className={`mt-2 font-heading text-foreground-50 leading-tight ${
                          feature ? 'text-3xl md:text-4xl' : 'text-2xl'
                        }`}
                      >
                        {c.name}
                      </h3>
                      <p className="mt-2 max-w-sm text-sm text-foreground-300 leading-relaxed">
                        {c.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-foreground-100 opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                        Discover the edit
                        <i className="ri-arrow-right-line" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}