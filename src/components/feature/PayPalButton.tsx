import { useEffect, useRef, useState } from 'react';
import { getPayPalClientId, isDemoPayment, loadPayPalSdk } from '@/lib/paypal';
import { apiPost } from '@/lib/api';

interface PayPalCaptureResult {
  ok: boolean;
  mock?: boolean;
  status?: string;
  id?: string;
  captureId?: string;
  amount?: number | null;
}

interface PayPalButtonProps {
  amount: number;
  onApprove: (orderId: string) => Promise<unknown>;
  onError?: (message: string) => void;
}

interface PayPalSdk {
  Buttons: (options: unknown) => { render: (element: HTMLElement) => Promise<void> };
}

export default function PayPalButton({ amount, onApprove, onError }: PayPalButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const demo = isDemoPayment();

  const handleError = (message: string) => {
    setError(message);
    onError?.(message);
  };

  const approve = async (orderId: string) => {
    setBusy(true);
    setError('');
    try {
      await onApprove(orderId);
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Payment could not be completed.');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (demo || !containerRef.current) return;
    let cancelled = false;

    const paypal = (window as unknown as { paypal?: PayPalSdk }).paypal;

    const init = async () => {
      try {
        await loadPayPalSdk(getPayPalClientId());
        if (cancelled || !containerRef.current) return;
        const sdk = (window as unknown as { paypal?: PayPalSdk }).paypal;
        if (!sdk) throw new Error('PayPal is not available.');
        await sdk.Buttons({
          style: { layout: 'vertical', color: 'black', shape: 'pill', label: 'paypal' },
          createOrder: async () => {
            const res = await apiPost<{ id: string }>('/api/paypal/create-order', {
              amount,
              currency: 'USD',
            });
            return res.id;
          },
          onApprove: async (data: { orderID: string }) => {
            await approve(data.orderID);
          },
          onError: (err: unknown) => {
            handleError(err instanceof Error ? err.message : 'PayPal reported an error.');
          },
        }).render(containerRef.current);
      } catch (err) {
        if (!cancelled) {
          handleError(err instanceof Error ? err.message : 'PayPal could not be loaded.');
        }
      }
    };

    void init();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);

  if (demo) {
    return (
      <div className="space-y-3">
        {error && <p className="rounded-lg bg-primary-500/10 px-3 py-2 text-xs text-primary-300">{error}</p>}
        <button
          type="button"
          onClick={() => {
            if (!busy) void approve(`DEMO-ORDER-${Date.now().toString(36).toUpperCase()}`);
          }}
          disabled={busy}
          className="w-full rounded-full bg-[#ffc439] px-6 py-3.5 text-sm font-semibold text-[#003087] shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? 'Processing…' : `Pay $${amount.toFixed(2)} with PayPal (demo)`}
        </button>
        <p className="text-center text-[11px] text-foreground-500">
          Demo mode — no real charge. Connects to live/sandbox PayPal once a client id and secret
          are configured.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="rounded-lg bg-primary-500/10 px-3 py-2 text-xs text-primary-300">{error}</p>}
      <div ref={containerRef} className="min-h-[45px]" />
    </div>
  );
}