import { useState, type FormEvent } from 'react';
import { apiPost } from '@/lib/api';

const FORM_URL = 'https://readdy.ai/api/form/dampj5t1jbh5ebt7f9eg';

interface NewsletterProps {
  align?: 'left' | 'center';
  title?: string;
  subtitle?: string;
}

export default function Newsletter({ align = 'left', title, subtitle }: NewsletterProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const honeypot = String(fd.get('company_alt') ?? '').trim();
    if (honeypot) {
      setStatus('success');
      form.reset();
      return;
    }
    fd.delete('company_alt');

    const email = String(fd.get('email') ?? '').trim();

    try {
      await apiPost('/api/subscribe', { email });
      setStatus('success');
      form.reset();
      return;
    } catch {
      /* endpoint not reachable in dev — fall back to the form provider below */
    }

    const body = new URLSearchParams();
    fd.forEach((value, key) => {
      if (typeof value === 'string') body.append(key, value);
    });

    try {
      const res = await fetch(FORM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      const responseText = await res.text();
      let parsed: { code?: string; meta?: { message?: string; detail?: string }; message?: string } | null = null;
      try {
        parsed = JSON.parse(responseText);
      } catch {
        parsed = null;
      }
      const serverMsg =
        parsed?.meta?.message || parsed?.message || parsed?.meta?.detail || responseText;
      const isSpam = typeof serverMsg === 'string' && serverMsg.toLowerCase().includes('spam');
      const code = parsed?.code;

      if (res.ok && code === 'OK') {
        setStatus('success');
        form.reset();
      } else if (isSpam || !res.ok || (code && code !== 'OK')) {
        setStatus('error');
        setErrorMsg(
          typeof serverMsg === 'string' && serverMsg
            ? serverMsg
            : 'Something went wrong. Please try again.'
        );
      } else {
        setStatus('success');
        form.reset();
      }
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  return (
    <div className={align === 'center' ? 'text-center' : 'text-left'}>
      {title && (
        <h3 className="font-heading text-2xl md:text-3xl text-foreground-50">{title}</h3>
      )}
      {subtitle && (
        <p className="mt-2 text-sm text-foreground-300 leading-relaxed max-w-sm">
          {subtitle}
        </p>
      )}

      <form
        id="deesse-newsletter"
        data-readdy-form
        onSubmit={handleSubmit}
        className={`mt-5 ${align === 'center' ? 'mx-auto' : ''} max-w-md`}
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <label className="sr-only" htmlFor="deesse-newsletter-email">
            Email address
          </label>
          <input
            id="deesse-newsletter-email"
            type="email"
            name="email"
            required
            placeholder="Your email address"
            autoComplete="email"
            className="flex-1 rounded-full border border-background-700 bg-background-900/60 px-5 py-3 text-sm text-foreground-50 placeholder:text-foreground-500 outline-none focus:border-primary-500 transition-colors"
          />
          <button
            type="submit"
            className="whitespace-nowrap rounded-full bg-primary-500 px-6 py-3 text-sm font-medium uppercase tracking-[0.15em] text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
          >
            Subscribe
          </button>
        </div>

        {/* Anti-spam honeypot */}
        <input
          type="text"
          name="company_alt"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          readOnly
          className="hp-field"
        />

        {status === 'success' && (
          <p className="mt-3 text-sm text-accent-300 animate-fade-in">
            Welcome to the maison — you&apos;re on the list.
          </p>
        )}
        {status === 'error' && (
          <p className="mt-3 text-sm text-primary-300 animate-fade-in">{errorMsg}</p>
        )}
      </form>
    </div>
  );
}