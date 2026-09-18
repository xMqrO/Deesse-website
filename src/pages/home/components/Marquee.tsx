import { Link } from 'react-router-dom';

const ticker = [
  'Complimentary shipping over $75',
  'New: Fleur de Nuit Eau de Parfum',
  'Private offer — up to 25% off the Icon Edit',
  'Join the maison for early access',
];

export default function Marquee() {
  const row = [...ticker, ...ticker];
  return (
    <div className="relative border-b border-background-800 bg-primary-600 text-foreground-50">
      <div className="overflow-hidden py-2.5">
        <div className="marquee-track-fast flex w-max gap-10 whitespace-nowrap">
          {row.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-10 text-[11px] uppercase tracking-[0.25em]"
            >
              {item}
              <i className="ri-sparkling-2-fill text-[10px] opacity-80" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BrandMarquee() {
  const words = [
    'Rare Ingredients',
    'Cruelty-Free',
    'Hand-Poured in Paris',
    'Refillable Vessels',
    'Dermatologist-Reviewed',
    'Consciously Crafted',
  ];
  const row = [...words, ...words];
  return (
    <div className="relative overflow-hidden border-b border-background-800 bg-background-900/50 py-6">
      <div className="marquee-track flex w-max gap-14 whitespace-nowrap">
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-14 font-heading text-3xl md:text-4xl text-foreground-500"
          >
            {item}
            <i className="ri-sparkling-2-fill text-lg text-primary-500/70" />
          </span>
        ))}
      </div>
    </div>
  );
}