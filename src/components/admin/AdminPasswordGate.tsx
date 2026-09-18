import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

const AUTH_KEY = 'deesse-admin-auth';
const AUTH_EVENT = 'deesse:admin-auth-change';
const ADMIN_PASSWORD = 'fucking';

export function isAdminAuthed(): boolean {
  try {
    return sessionStorage.getItem(AUTH_KEY) === '1';
  } catch {
    return false;
  }
}

export function signOutAdmin(): void {
  try {
    sessionStorage.removeItem(AUTH_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export default function AdminPasswordGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(isAdminAuthed);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const onAuth = () => setAuthed(isAdminAuthed());
    window.addEventListener(AUTH_EVENT, onAuth);
    return () => window.removeEventListener(AUTH_EVENT, onAuth);
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(AUTH_KEY, '1');
      } catch {
        /* ignore */
      }
      setError(false);
      setValue('');
      setAuthed(true);
    } else {
      setError(true);
      setValue('');
    }
  };

  if (authed) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-950 px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-xl border border-background-800 bg-background-900/50 p-8">
          <div className="flex items-center gap-2">
            <span className="font-heading text-2xl lowercase leading-none text-foreground-50">
              déesse
            </span>
            <span className="rounded-full border border-primary-500/40 bg-primary-500/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-primary-200">
              Admin
            </span>
          </div>

          <h1 className="mt-6 font-heading text-2xl text-foreground-50">Restricted area</h1>
          <p className="mt-2 text-sm leading-relaxed text-foreground-400">
            Enter your password to access the dashboard.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <input
              type="password"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(false);
              }}
              autoFocus
              placeholder="Password"
              aria-label="Admin password"
              className="w-full rounded-lg border border-background-700 bg-background-950 px-4 py-3 text-sm text-foreground-100 placeholder:text-foreground-600 outline-none transition-colors focus:border-primary-500/60"
            />
            {error && (
              <p className="text-xs text-primary-300">Incorrect password. Please try again.</p>
            )}
            <button
              type="submit"
              className="w-full whitespace-nowrap rounded-lg bg-primary-500 px-6 py-3 text-sm font-medium text-foreground-50 transition-colors hover:bg-primary-600 cursor-pointer"
            >
              Enter dashboard
            </button>
          </form>

          <Link
            to="/"
            className="mt-6 block text-center text-xs text-foreground-500 hover:text-foreground-200 transition-colors cursor-pointer"
          >
            ← Back to storefront
          </Link>
        </div>
      </div>
    </div>
  );
}