import { Link } from 'react-router-dom';
import Reveal from '@/components/base/Reveal';

const collections = [
  {
    name: 'Skincare',
    desc: 'Radiance, restored',
    to: '/shop?category=Skincare',
    image:
      'https://readdy.ai/api/search-image?query=Luxurious%20skincare%20collection%20with%20elegant%20glass%20serum%20bottles%20and%20cream%20jars%20arranged%20on%20a%20dark%20reflective%20surface%2C%20deep%20black%20studio%20background%20with%20soft%20rose%20pink%20and%20crimson%20gradient%20glow%2C%20cinematic%20lighting%2C%20high-end%20beauty%20editorial%20photography%2C%20elegant%20minimalist%20composition&width=700&height=900&seq=deesse-col-01&orientation=portrait',
  },
  {
    name: 'Makeup',
    desc: 'Artistry for the face',
    to: '/shop?category=Makeup',
    image:
      'https://readdy.ai/api/search-image?query=High-end%20makeup%20collection%20with%20gold%20lipsticks%2C%20eyeshadow%20palettes%20and%20compacts%20arranged%20artistically%20on%20a%20dark%20glossy%20surface%2C%20black%20studio%20background%20with%20soft%20crimson%20and%20rose%20pink%20gradient%20lighting%2C%20cinematic%20dramatic%20glow%2C%20luxury%20cosmetic%20editorial%20photography%2C%20high%20detail%2C%20minimalist%20composition&width=700&height=900&seq=deesse-col-02&orientation=portrait',
  },
  {
    name: 'Fragrance',
    desc: 'Rare & enduring',
    to: '/shop?category=Fragrance',
    image:
      'https://readdy.ai/api/search-image?query=Elegant%20perfume%20bottles%20in%20varying%20heights%20with%20gold%20caps%20surrounded%20by%20delicate%20rose%20petals%20on%20a%20dark%20reflective%20surface%2C%20black%20studio%20background%20with%20soft%20rose%20and%20crimson%20gradient%20glow%2C%20cinematic%20lighting%2C%20luxury%20fragrance%20editorial%20photography%2C%20high%20detail%2C%20elegant%20composition&width=700&height=900&seq=deesse-col-03&orientation=portrait',
  },
  {
    name: 'Body Care',
    desc: 'Indulgence for skin',
    to: '/shop?category=Body%20Care',
    image:
      'https://readdy.ai/api/search-image?query=Luxury%20body%20care%20collection%20with%20golden%20body%20oil%20bottles%20and%20cream%20jars%20on%20a%20dark%20reflective%20surface%2C%20black%20studio%20background%20with%20warm%20crimson%20and%20rose%20pink%20gradient%20glow%2C%20cinematic%20lighting%2C%20high-end%20beauty%20editorial%20photography%2C%20high%20detail%2C%20minimalist%20elegant%20composition&width=700&height=900&seq=deesse-col-04&orientation=portrait',
  },
];

export default function Collections() {
  return (
    <section className="relative border-y border-background-800 bg-background-900/40">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
        <Reveal className="text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-accent-300">The Collections</p>
          <h2 className="mt-3 font-heading text-3xl md:text-5xl text-foreground-50 leading-tight">
            Find your ritual
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((c, i) => (
            <Reveal key={c.name} delay={i * 100}>
              <Link to={c.to} className="group block cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-background-900">
                  <img
                    src={c.image}
                    alt={`${c.name} collection — déesse`}
                    title={`${c.name} — déesse`}
                    className="h-full w-full object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background-950/90 via-background-950/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-heading text-2xl text-foreground-50">{c.name}</h3>
                    <p className="mt-1 text-sm text-foreground-300">{c.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-accent-300 opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                      Explore
                      <i className="ri-arrow-right-line" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}