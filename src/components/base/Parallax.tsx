import { useEffect, useRef, useState, type ReactNode } from 'react';

interface ParallaxProps {
  children: ReactNode;
  /** Travel distance in px across the viewport. Positive = moves up as you scroll. */
  speed?: number;
  className?: string;
  innerClassName?: string;
}

/**
 * Lightweight rAF-based parallax. Translates its inner layer based on how far
 * the element has travelled through the viewport.
 */
export default function Parallax({
  children,
  speed = 60,
  className = '',
  innerClassName = '',
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      setOffset(-progress * speed);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      <div
        className={innerClassName}
        style={{ transform: `translate3d(0, ${offset}px, 0)`, willChange: 'transform' }}
      >
        {children}
      </div>
    </div>
  );
}