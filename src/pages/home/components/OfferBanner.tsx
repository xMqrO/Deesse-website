import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '@/components/base/Reveal';
import MagneticButton from '@/components/base/MagneticButton';
import Parallax from '@/components/base/Parallax';

function useCountdown(target: number) {
  const [remaining, setRemaining] = useState(() => Math.max(target - Date.now(), 0));

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(target - Date.now(), 0));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  const totalSeconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

export default function OfferBanner() {
  // Offer window: 5 days from first render.
  const [target] = useState(() => Date.now() + 5 * 24 * 60 * 60 * 1000);
  const { days, hours, minutes, seconds } = useCountdown(target);

  const units = [
    { label: 'Days', value: pad(days) },
    { label: 'Hours', value: pad(hours) },
    { label: 'Minutes', value: pad(minutes) },
    { label: 'Seconds', value: pad(seconds) },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Parallax speed={90} className="h-full w-full">
          <img
            src="https://readdy.ai/api/search-image?query=Dramatic%20luxury%20beauty%20promotional%20background%20with%20flowing%20crimson%20silk%20and%20scattered%20rose%20petals%20on%20a%20deep%20black%20surface%2C%20rich%20cinematic%20lighting%20with%20glowing%20red%20gradient%20and%20subtle%20golden%20sparkle%2C%20high%20fashion%20editorial%20atmosphere%2C%20ultra%20detailed%20elegant%20composition&width=1920&height=900&seq=deesse-offer-01&orientation=landscape"
            alt=""
            className="h-[130%] w-full object-cover object-top"
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-r from-background-950/95 via-background-950/80 to-background-950/60" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-500/50 bg-primary-500/10 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-primary-200">
              <i className="ri-flashlight-fill" />
              Private Offer · Ends Soon
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-5 font-heading text-4xl md:text-6xl text-foreground-50 leading-[1.05]">
              Up to <span className="text-shimmer italic">25% off</span>
              <br />
              the Icon Edit
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-4 max-w-lg text-base font-light text-foreground-300 leading-relaxed">
              Our most-loved pieces, offered at a rare discount for the maison&apos;s inner
              circle. Complimentary keepsake packaging and shipping on every order.
            </p>
          </Reveal>

          <Reveal delay={240} className="mt-8">
            <div className="flex flex-wrap gap-3">
              {units.map((u) => (
                <div
                  key={u.label}
                  className="flex h-20 w-20 flex-col items-center justify-center rounded-lg border border-background-700/70 bg-background-950/60 backdrop-blur"
                >
                  <span className="font-heading text-3xl text-foreground-50 tabular-nums">
                    {u.value}
                  </span>
                  <span className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-foreground-400">
                    {u.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={320} className="mt-9">
            <MagneticButton>
              <Link
                to="/shop?tag=Bestseller"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-primary-500 px-8 py-3.5 text-sm font-medium uppercase tracking-[0.15em] text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
              >
                Shop the Edit
                <i className="ri-arrow-right-line" />
              </Link>
            </MagneticButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}