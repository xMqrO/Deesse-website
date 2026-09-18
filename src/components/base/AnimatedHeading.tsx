import { useInView } from '@/hooks/useInView';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  /** Extra delay before the first word (ms). */
  delay?: number;
  as?: 'h1' | 'h2' | 'h3';
}

/**
 * Word-by-word masked reveal for elegant editorial headings.
 */
export default function AnimatedHeading({
  text,
  className = '',
  delay = 0,
  as = 'h2',
}: AnimatedHeadingProps) {
  const { ref, inView } = useInView<HTMLHeadingElement>({ threshold: 0.3 });
  const words = text.split(' ');
  const Tag = as;

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <span
            className="animated-word inline-block"
            style={{
              animationDelay: `${delay + i * 70}ms`,
              animationPlayState: inView ? 'running' : 'paused',
              opacity: inView ? 1 : 0,
            }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </Tag>
  );
}