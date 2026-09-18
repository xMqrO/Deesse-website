import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Fades + lifts the routed content on every navigation for a cinematic
 * page-to-page transition feel.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}