import Reveal from '@/components/base/Reveal';
import { testimonials } from '@/mocks/products';

export default function Testimonials() {
  return (
    <section className="relative border-y border-background-800 bg-background-900/40">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
        <Reveal className="text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-accent-300">The Devotees</p>
          <h2 className="mt-3 font-heading text-3xl md:text-5xl text-foreground-50 leading-tight">
            Loved, endlessly
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <figure className="flex h-full flex-col rounded-lg border border-background-700/60 bg-background-900/60 p-7">
                <div className="flex items-center gap-1 text-accent-400">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <i key={j} className="ri-star-fill text-sm" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 font-heading text-xl md:text-2xl text-foreground-100 leading-snug italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-500/15 text-primary-300">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground-50">{t.name}</p>
                    <p className="text-xs text-foreground-400">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}