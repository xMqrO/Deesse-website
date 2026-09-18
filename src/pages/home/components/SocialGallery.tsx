import Reveal from '@/components/base/Reveal';
import AnimatedHeading from '@/components/base/AnimatedHeading';
import { socialShots } from '@/mocks/collections';

export default function SocialGallery() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
      <Reveal className="text-center">
        <p className="text-[11px] uppercase tracking-[0.35em] text-accent-300">#déesse</p>
        <AnimatedHeading
          as="h2"
          text="Worn by the world"
          className="mt-3 font-heading text-3xl md:text-5xl text-foreground-50 leading-tight"
        />
        <p className="mx-auto mt-4 max-w-lg text-sm text-foreground-400 leading-relaxed">
          Share your ritual and tag <span className="text-foreground-100">@deesse</span> to be
          featured across the maison.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {socialShots.map((s, i) => (
          <Reveal key={s.handle} delay={i * 70}>
            <a
              href="#"
              className="group relative block aspect-square overflow-hidden rounded-lg bg-background-900 cursor-pointer"
            >
              <img
                src={s.image}
                alt={`déesse community look tagged ${s.handle}`}
                title={`déesse community — ${s.handle}`}
                className="h-full w-full object-cover object-top transition-transform duration-[1100ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-background-950/70 opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100">
                <i className="ri-instagram-line text-2xl text-foreground-50" />
                <span className="text-[11px] tracking-wide text-foreground-200">{s.handle}</span>
                <span className="flex items-center gap-1 text-[10px] text-foreground-400">
                  <i className="ri-heart-fill text-primary-400" />
                  {s.likes}
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}