export function getPayPalClientId(): string {
  return (import.meta.env.VITE_PAYPAL_CLIENT_ID as string | undefined) || '';
}

export function isDemoPayment(): boolean {
  const id = getPayPalClientId();
  return !id || id === 'demo';
}

let sdkPromise: Promise<void> | null = null;

export function loadPayPalSdk(clientId: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-paypal-sdk]');
      if (existing) {
        if ((window as { paypal?: unknown }).paypal) {
          resolve();
          return;
        }
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => sdkPromise = null);
        return;
      }
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
        clientId
      )}&currency=USD&intent=capture`;
      script.setAttribute('data-paypal-sdk', '');
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        sdkPromise = null;
        reject(new Error('PayPal SDK failed to load.'));
      };
      document.head.appendChild(script);
    });
  }
  return sdkPromise;
}