import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrdersContext';
import PayPalButton from '@/components/feature/PayPalButton';
import { apiPost } from '@/lib/api';
import { isDemoPayment } from '@/lib/paypal';
import { buildOrderEmailHtml, buildOrderEmailText } from '@/lib/order-email';

const FREE_SHIPPING_THRESHOLD = 75;
const FLAT_SHIPPING = 9;

const inputClass =
  'mt-2 w-full rounded-lg border border-background-800 bg-background-950 px-4 py-2.5 text-sm text-foreground-100 outline-none focus:border-primary-500/60 transition-colors';
const labelClass = 'text-xs uppercase tracking-[0.15em] text-foreground-500';

interface Details {
  email: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  zip: string;
  country: string;
  notes: string;
}

const emptyDetails: Details = {
  email: '',
  name: '',
  line1: '',
  line2: '',
  city: '',
  zip: '',
  country: 'United States',
  notes: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Checkout() {
  const {
    items,
    subtotal,
    total,
    discountAmount,
    discountCode,
    freeShipping,
    clearCart,
  } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [details, setDetails] = useState<Details>(emptyDetails);
  const [touched, setTouched] = useState(false);
  const [processing, setProcessing] = useState(false);

  const shipping = freeShipping || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const grandTotal = total + shipping;

  const itemCount = useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items]);

  const errors = useMemo(() => {
    const e: Partial<Record<keyof Details, string>> = {};
    if (!details.name.trim()) e.name = 'Please enter your name.';
    if (!EMAIL_RE.test(details.email.trim())) e.email = 'Enter a valid email address.';
    if (!details.line1.trim()) e.line1 = 'Street address is required.';
    if (!details.city.trim()) e.city = 'City is required.';
    if (!details.zip.trim()) e.zip = 'Postal code is required.';
    if (!details.country.trim()) e.country = 'Country is required.';
    return e;
  }, [details]);

  const set = (patch: Partial<Details>) => setDetails((prev) => ({ ...prev, ...patch }));

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-24 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-background-700 text-foreground-300">
          <i className="ri-shopping-bag-line text-3xl" />
        </span>
        <h1 className="mt-6 font-heading text-4xl text-foreground-50">Nothing to check out</h1>
        <p className="mt-3 max-w-sm text-sm text-foreground-400">
          Your bag is empty. Add a few treasures before continuing to checkout.
        </p>
        <Link
          to="/shop"
          className="mt-6 rounded-full bg-primary-500 px-8 py-3 text-sm font-medium uppercase tracking-[0.15em] text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
        >
          Shop the Collection
        </Link>
      </div>
    );
  }

  const canProceed = Object.keys(errors).length === 0;

  const addressText = [
    details.line1.trim(),
    details.line2.trim(),
    `${details.city.trim()}, ${details.country.trim()} ${details.zip.trim()}`,
  ]
    .filter(Boolean)
    .join('\n');

  const handleApprove = async (orderId: string) => {
    setProcessing(true);
    try {
      let capture: { ok: boolean; mock?: boolean; captureId?: string; id?: string };
      if (isDemoPayment()) {
        capture = {
          ok: true,
          mock: true,
          id: orderId,
          captureId: `MOCK-${Date.now().toString(36).toUpperCase()}`,
        };
      } else {
        capture = await apiPost<{ ok: boolean; captureId?: string; id?: string }>(
          '/api/paypal/capture-order',
          { orderID: orderId }
        );
      }

      const lineItems = items.map((i) => ({
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
      }));

      const order = addOrder({
        customer: details.name.trim(),
        email: details.email.trim(),
        items: itemCount,
        total: grandTotal,
        lineItems,
        shippingAddress: addressText,
        paymentId: capture.captureId || capture.id || orderId,
      });

      void (async () => {
        try {
          await apiPost('/api/send-email', {
            to: order.email,
            subject: `Your déesse order ${order.id} is confirmed`,
            html: buildOrderEmailHtml({
              id: order.id,
              customer: order.customer,
              items: order.lineItems,
              subtotal,
              discount: discountAmount,
              shipping,
              total: grandTotal,
              shippingAddress: order.shippingAddress,
            }),
            text: buildOrderEmailText({
              id: order.id,
              customer: order.customer,
              items: order.lineItems,
              subtotal,
              discount: discountAmount,
              shipping,
              total: grandTotal,
              shippingAddress: order.shippingAddress,
            }),
          });
        } catch {
          /* best effort — the confirmation screen still works in development */
        }
      })();

      clearCart();
      navigate(`/checkout/success?order=${encodeURIComponent(order.id)}`);
    } finally {
      setProcessing(false);
    }
  };

  const proceed = () => {
    setTouched(true);
    if (!canProceed) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(2);
  };

  return (
    <div className="pt-28 md:pt-36 pb-20 md:pb-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h1 className="font-heading text-4xl md:text-5xl text-foreground-50 leading-tight">
          Checkout
        </h1>

        {/* Stepper */}
        <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em]">
          {[
            { n: 1, label: 'Details' },
            { n: 2, label: 'Payment' },
          ].map((s) => (
            <div key={s.n} className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] transition-colors ${
                  step >= s.n
                    ? 'bg-primary-500 text-foreground-50'
                    : 'border border-background-700 text-foreground-500'
                }`}
              >
                {s.n}
              </span>
              <span className={step >= s.n ? 'text-foreground-200' : 'text-foreground-600'}>
                {s.label}
              </span>
              {s.n === 1 && <span className="h-px w-10 bg-background-700" />}
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Form / payment */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <section className="rounded-2xl border border-background-800 bg-background-900/40 p-6">
                  <h2 className="font-heading text-xl text-foreground-50">Contact</h2>
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClass} htmlFor="checkout-name">
                          Full name
                        </label>
                        <input
                          id="checkout-name"
                          value={details.name}
                          onChange={(e) => set({ name: e.target.value })}
                          placeholder="Camille Laurent"
                          autoComplete="name"
                          className={inputClass}
                        />
                        {touched && errors.name && (
                          <p className="mt-1.5 text-xs text-primary-300">{errors.name}</p>
                        )}
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="checkout-email">
                          Email
                        </label>
                        <input
                          id="checkout-email"
                          type="email"
                          value={details.email}
                          onChange={(e) => set({ email: e.target.value })}
                          placeholder="you@example.com"
                          autoComplete="email"
                          className={inputClass}
                        />
                        {touched && errors.email && (
                          <p className="mt-1.5 text-xs text-primary-300">{errors.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-background-800 bg-background-900/40 p-6">
                  <h2 className="font-heading text-xl text-foreground-50">Shipping address</h2>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className={labelClass} htmlFor="checkout-line1">
                        Street address
                      </label>
                      <input
                        id="checkout-line1"
                        value={details.line1}
                        onChange={(e) => set({ line1: e.target.value })}
                        placeholder="12 Rue de la Paix"
                        autoComplete="address-line1"
                        className={inputClass}
                      />
                      {touched && errors.line1 && (
                        <p className="mt-1.5 text-xs text-primary-300">{errors.line1}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="checkout-line2">
                        Apartment, suite (optional)
                      </label>
                      <input
                        id="checkout-line2"
                        value={details.line2}
                        onChange={(e) => set({ line2: e.target.value })}
                        placeholder="Apt 4B"
                        autoComplete="address-line2"
                        className={inputClass}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div className="col-span-2">
                        <label className={labelClass} htmlFor="checkout-city">
                          City
                        </label>
                        <input
                          id="checkout-city"
                          value={details.city}
                          onChange={(e) => set({ city: e.target.value })}
                          placeholder="Paris"
                          autoComplete="address-level2"
                          className={inputClass}
                        />
                        {touched && errors.city && (
                          <p className="mt-1.5 text-xs text-primary-300">{errors.city}</p>
                        )}
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="checkout-zip">
                          Postal code
                        </label>
                        <input
                          id="checkout-zip"
                          value={details.zip}
                          onChange={(e) => set({ zip: e.target.value })}
                          placeholder="75001"
                          autoComplete="postal-code"
                          className={inputClass}
                        />
                        {touched && errors.zip && (
                          <p className="mt-1.5 text-xs text-primary-300">{errors.zip}</p>
                        )}
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="checkout-country">
                          Country
                        </label>
                        <input
                          id="checkout-country"
                          value={details.country}
                          onChange={(e) => set({ country: e.target.value })}
                          placeholder="United States"
                          list="checkout-country-options"
                          autoComplete="country-name"
                          className={inputClass}
                        />
                        <datalist id="checkout-country-options">
                          {['United States', 'United Kingdom', 'France', 'Germany', 'Italy', 'Spain', 'Canada', 'Australia', 'UAE', 'Japan', 'China'].map((c) => (
                            <option key={c} value={c} />
                          ))}
                        </datalist>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="checkout-notes">
                        Order notes (optional)
                      </label>
                      <textarea
                        id="checkout-notes"
                        value={details.notes}
                        onChange={(e) => set({ notes: e.target.value })}
                        rows={3}
                        placeholder="Gift notes, delivery instructions…"
                        className={`${inputClass} resize-y leading-relaxed`}
                      />
                    </div>
                  </div>
                </section>

                <div className="flex items-center justify-between">
                  <Link
                    to="/cart"
                    className="text-sm text-foreground-400 hover:text-foreground-100 transition-colors cursor-pointer"
                  >
                    ← Back to bag
                  </Link>
                  <button
                    type="button"
                    onClick={proceed}
                    className="rounded-full bg-primary-500 px-8 py-3 text-sm font-medium uppercase tracking-[0.15em] text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
                  >
                    Continue to payment
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <section className="rounded-2xl border border-background-800 bg-background-900/40 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-xl text-foreground-50">Payment</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-foreground-500">
                        {discountCode ? `Code ${discountCode} applied` : 'No discount'}
                      </span>
                      <i className="ri-lock-line text-foreground-400" />
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl border border-background-800 bg-background-950/60 p-5">
                    {isDemoPayment() ? (
                      <p className="mb-4 text-xs text-foreground-400">
                        PayPal isn&apos;t configured yet, so this checkout runs in demo mode — no
                        real charge is made. Your order is still saved and the store is notified.
                      </p>
                    ) : (
                      <div className="mb-4 flex items-center justify-between rounded-lg border border-background-800 bg-background-900/60 px-4 py-3 text-sm">
                        <span className="text-foreground-400">Amount to pay</span>
                        <span className="font-heading text-2xl text-foreground-50">
                          ${grandTotal.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <PayPalButton amount={Number(grandTotal.toFixed(2))} onApprove={handleApprove} />
                    <p className="mt-4 flex items-center justify-center gap-2 text-xs text-foreground-500">
                      <i className="ri-lock-line" /> Encrypted &amp; secure — PayPal payment
                    </p>
                  </div>

                  {processing && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-foreground-300 animate-pulse">
                      <i className="ri-loader-4-line animate-spin" /> Confirming your payment…
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="mt-4 text-sm text-foreground-400 hover:text-foreground-100 transition-colors cursor-pointer"
                  >
                    ← Edit details
                  </button>
                </section>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-lg border border-background-800 bg-background-900/50 p-6">
              <h2 className="font-heading text-2xl text-foreground-50">Summary</h2>
              <ul className="mt-5 space-y-4">
                {items.map((item) => (
                  <li key={`${item.product.id}-${item.shade ?? ''}`} className="flex gap-3">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-background-900">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover object-top"
                      />
                      <span className="absolute right-0 top-0 bg-background-950/85 px-1.5 py-0.5 text-[10px] text-foreground-100">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-foreground-100">{item.product.name}</p>
                      {item.shade && (
                        <p className="text-xs text-foreground-500">Shade: {item.shade}</p>
                      )}
                      <p className="mt-1 text-sm text-foreground-400">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <dl className="mt-5 space-y-3 border-t border-background-800 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-foreground-400">Subtotal</dt>
                  <dd className="text-foreground-100">${subtotal.toFixed(2)}</dd>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-accent-300">Discount</dt>
                    <dd className="text-accent-300">-${discountAmount.toFixed(2)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-foreground-400">Shipping</dt>
                  <dd className="text-foreground-100">
                    {shipping > 0 ? `$${shipping.toFixed(2)}` : 'Complimentary'}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-background-800 pt-3">
                  <dt className="font-medium text-foreground-100">Total</dt>
                  <dd className="font-heading text-2xl text-foreground-50">
                    ${grandTotal.toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}