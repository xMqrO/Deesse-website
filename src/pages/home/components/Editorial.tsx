import { Link } from 'react-router-dom';
import Reveal from '@/components/base/Reveal';

const stats = [
  { value: '15+', label: 'Years of Craft' },
  { value: '40+', label: 'Countries' },
  { value: '120', label: 'Signature Products' },
  { value: '98%', label: 'Would Recommend' },
];

export default function Editorial() {
  return (
    <section id="maison" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-background-900">
              <img
                src="https://readdy.ai/api/search-image?query=Elegant%20still%20life%20of%20luxury%20beauty%20products%20and%20a%20silk%20crimson%20fabric%20draped%20over%20a%20marble%20surface%20with%20soft%20rose%20petals%2C%20deep%20black%20background%20with%20cinematic%20dramatic%20lighting%20and%20golden%20highlights%2C%20high%20fashion%20editorial%20photography%2C%20rich%20textures%2C%20sophisticated%20moody%20atmosphere%2C%20minimalist%20luxury%20composition&width=900&height=1125&seq=deesse-maison-01&orientation=portrait"
                alt="déesse the maison — luxury beauty still life"
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-950/40 to-transparent" />
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-6 -right-4 md:right-[-2rem] rounded-lg border border-background-700 bg-background-900/90 p-5 backdrop-blur animate-float">
              <p className="font-heading text-3xl text-accent-400">Est. 2011</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-foreground-400">
                Paris · New York
              </p>
            </div>
          </Reveal>

          {/* Copy */}
          <div>
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.35em] text-accent-300">The Maison</p>
              <h2 className="mt-3 font-heading text-3xl md:text-5xl text-foreground-50 leading-[1.1]">
                Born of couture,
                <br />
                crafted for skin
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 text-base font-light text-foreground-300 leading-relaxed">
                déesse began in a Paris atelier with a simple belief — that beauty should feel as
                considered as couture. Every formula is composed of rare, responsibly-sourced
                ingredients and poured by hand, then finished in vessels designed to be displayed.
              </p>
              <p className="mt-4 text-base font-light text-foreground-300 leading-relaxed">
                From a single stroke of Velvet Rouge to the quiet glow of the Lumière Serum, each
                product is an invitation to slow down, to ritualize, and to meet the goddess within.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <Link
                to="/shop"
                className="mt-8 inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-primary-500 px-7 py-3 text-sm font-medium uppercase tracking-[0.15em] text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
              >
                Explore the Collection
              </Link>
            </Reveal>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className="text-center">
              <p className="font-heading text-4xl md:text-5xl text-foreground-50">{s.value}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-foreground-400">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}