import Reveal from '@/components/base/Reveal';
import Parallax from '@/components/base/Parallax';
import AnimatedHeading from '@/components/base/AnimatedHeading';
import { craftSteps } from '@/mocks/collections';

export default function BrandStory() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          {/* Image column with parallax */}
          <div className="relative">
            <Reveal>
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-background-900">
                <Parallax speed={70} className="h-full w-full">
                  <img
                    src="https://readdy.ai/api/search-image?query=Artisan%20hands%20blending%20luxury%20beauty%20cream%20in%20a%20Parisian%20atelier%20with%20glass%20beakers%20and%20dried%20rose%20petals%20on%20a%20marble%20counter%2C%20warm%20cinematic%20lighting%20against%20a%20dark%20moody%20background%20with%20crimson%20accents%2C%20high-end%20craftsmanship%20editorial%20photography%2C%20ultra%20detailed%20elegant%20composition&width=900&height=1200&seq=deesse-craft-01&orientation=portrait"
                    alt="déesse atelier — crafting luxury beauty by hand"
                    className="h-[115%] w-full object-cover object-top"
                  />
                </Parallax>
                <div className="absolute inset-0 bg-gradient-to-t from-background-950/50 to-transparent" />
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="absolute -bottom-6 -left-4 md:-left-6 rounded-lg border border-background-700 bg-background-900/90 p-5 backdrop-blur animate-float">
                <p className="font-heading text-3xl text-accent-400">100%</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-foreground-400">
                  Cruelty-Free
                </p>
              </div>
            </Reveal>
          </div>

          {/* Steps */}
          <div>
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.35em] text-accent-300">
                The déesse Difference
              </p>
              <AnimatedHeading
                as="h2"
                text="A ritual, composed with care"
                className="mt-3 font-heading text-3xl md:text-5xl text-foreground-50 leading-[1.1]"
              />
              <p className="mt-5 max-w-lg text-base font-light text-foreground-300 leading-relaxed">
                Every déesse product passes through four unhurried stages — each one a promise
                that what touches your skin is nothing short of exceptional.
              </p>
            </Reveal>

            <div className="mt-10 space-y-3">
              {craftSteps.map((s, i) => (
                <Reveal key={s.index} delay={i * 90}>
                  <div className="group flex items-start gap-4 rounded-lg border border-background-800/70 bg-background-900/40 p-5 transition-colors duration-500 hover:border-primary-500/50 hover:bg-background-900/70">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-background-700 bg-background-950 text-accent-400 transition-colors duration-500 group-hover:border-primary-500/60 group-hover:text-primary-300">
                      <i className={`${s.icon} text-xl`} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="font-heading text-sm text-foreground-500">{s.index}</span>
                        <h3 className="font-heading text-xl text-foreground-50">{s.title}</h3>
                      </div>
                      <p className="mt-1.5 text-sm font-light text-foreground-400 leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}