import { Link, useSearchParams } from 'react-router-dom';
import { useOrders } from '@/context/OrdersContext';

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const { orders } = useOrders();
  const order = orders.find((o) => o.id === searchParams.get('order'));

  return (
    <div className="pt-28 md:pt-36 pb-20 md:pb-28">
      <div className="mx-auto max-w-2xl px-4 text-center md:px-6">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-500/15 text-accent-300">
          <i className="ri-check-line text-3xl" />
        </span>
        <h1 className="mt-6 font-heading text-4xl md:text-5xl text-foreground-50 leading-tight">
          Merci — your order is confirmed
        </h1>
        {order ? (
          <>
            <p className="mt-4 text-sm text-foreground-400 leading-relaxed">
              Order <span className="text-foreground-100">{order.id}</span> was placed and our
              atelier is preparing it. A confirmation email is on its way to{' '}
              <span className="text-foreground-100">{order.email}</span>.
            </p>

            <div className="mt-8 rounded-xl border border-background-800 bg-background-900/50 p-6 text-left">
              <ul className="space-y-3 border-b border-background-800 pb-4">
                {order.lineItems.map((line, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="text-foreground-200">
                      {line.name} <span className="text-foreground-500">× {line.quantity}</span>
                    </span>
                    <span className="text-foreground-100">
                      ${(line.price * line.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-foreground-400">Payment</dt>
                  <dd className="text-foreground-100">Paid via PayPal</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-foreground-400">Reference</dt>
                  <dd className="font-mono text-xs text-foreground-300">{order.paymentId}</dd>
                </div>
                <div className="flex justify-between pt-2">
                  <dt className="font-medium text-foreground-100">Total</dt>
                  <dd className="font-heading text-xl text-foreground-50">
                    ${order.total.toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>
          </>
        ) : (
          <p className="mt-4 text-sm text-foreground-400 leading-relaxed">
            Your payment went through and our atelier is preparing your order.
          </p>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/shop"
            className="rounded-full bg-primary-500 px-8 py-3 text-sm font-medium uppercase tracking-[0.15em] text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
          >
            Continue shopping
          </Link>
          <Link
            to="/"
            className="rounded-full border border-background-700 px-8 py-3 text-sm text-foreground-300 hover:border-foreground-400 transition-colors cursor-pointer"
          >
            Back to the Maison
          </Link>
        </div>
      </div>
    </div>
  );
}