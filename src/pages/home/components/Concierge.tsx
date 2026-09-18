import Reveal from '@/components/base/Reveal';
import AnimatedHeading from '@/components/base/AnimatedHeading';
import MagneticButton from '@/components/base/MagneticButton';
import { advisers } from '@/mocks/collections';

const perks = [
  { icon: 'ri-customer-service-2-line', label: '1:1 guidance with every order' },
  { icon: 'ri-gift-line', label: 'Complimentary keepsake packaging' },
  { icon: 'ri-refresh-line', label: 'Effortless re-fills & refills' },
];

export default function Concierge() {
  return (
    <section className="relative border-y border-background-800 bg-background-900/40">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
        <Reveal className="text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-accent-300">
            The déesse Concierge
          </p>
          <AnimatedHeading
            as="h2"
            text="Beauty, personally guided"
            className="mt-3 font-heading text-3xl md:text-5xl text-foreground-50 leading-tight"
          />
          <p className="mx-auto mt-4 max-w-xl text-sm text-foreground-400 leading-relaxed">
            Our artists and skin therapists compose bespoke routines around your needs — so every
            purchase feels considered, from first look to final glow.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {advisers.map((a, i) => (
            <Reveal key={a.name} delay={i * 110}>
              <article className="group relative overflow-hidden rounded-lg border border-background-700/60 bg-background-900/60 p-6 text-center transition-colors duration-500 hover:border-primary-500/50">
                <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border border-background-700 bg-background-950">
                  <img
                    src={a.avatar}
                    alt={`${a.name}, ${a.role} at déesse`}
                    title={`${a.name} — ${a.role}`}
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-5 font-heading text-xl text-foreground-50">{a.name}</h3>
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.2em] text-accent-300">
                  {a.role}
                </p>
                <p className="mt-3 text-sm text-foreground-400">{a.specialty}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-12 flex flex-col items-center gap-8 rounded-lg border border-background-700/60 bg-background-950/60 p-8 md:flex-row md:justify-between md:p-10">
            <ul className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-8">
              {perks.map((p) => (
                <li key={p.label} className="flex items-center gap-3 text-sm text-foreground-200">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-500/15 text-secondary-300">
                    <i className={`${p.icon} text-lg`} />
                  </span>
                  {p.label}
                </li>
              ))}
            </ul>
            <MagneticButton>
              <a
                href="/#maison"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-foreground-300/40 px-7 py-3 text-sm font-medium uppercase tracking-[0.15em] text-foreground-100 hover:border-foreground-100 transition-colors cursor-pointer"
              >
                Meet the Maison
              </a>
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}