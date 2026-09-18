import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

const FREE_SHIPPING = 75;

export default function Cart() {
  const {
    items,
    subtotal,
    total,
    discountCode,
    discountAmount,
    discountMessage,
    freeShipping,
    applyDiscount,
    removeDiscount,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const [notice, setNotice] = useState(false);
  const [code, setCode] = useState('');

  const remaining = FREE_SHIPPING - subtotal;
  const progress = Math.min((subtotal / FREE_SHIPPING) * 100, 100);
  const hasFreeShipping = freeShipping || remaining <= 0;

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center pt-24">
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-background-700 text-foreground-300">
          <i className="ri-shopping-bag-line text-3xl" />
        </span>
        <h1 className="mt-6 font-heading text-4xl text-foreground-50">Your bag is empty</h1>
        <p className="mt-3 text-sm text-foreground-400 max-w-sm">
          Discover the treasures awaiting — begin your ritual with our most-loved pieces.
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

  return (
    <div className="pt-28 md:pt-36 pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h1 className="font-heading text-4xl md:text-6xl text-foreground-50 leading-tight">
          Your Bag
        </h1>

        {/* Free shipping progress */}
        <div className="mt-6 max-w-xl">
          {hasFreeShipping ? (
            <p className="text-sm text-accent-300">You&apos;ve unlocked complimentary shipping.</p>
          ) : (
            <p className="text-sm text-foreground-300">
              You&apos;re{' '}
              <span className="text-foreground-50">${remaining.toFixed(2)}</span> away from
              complimentary shipping.
            </p>
          )}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-background-800">
            <div
              className="h-full rounded-full bg-primary-500 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 space-y-5">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.shade ?? ''}`}
                data-product-shop
                className="flex gap-5 rounded-lg border border-background-800 bg-background-900/50 p-4"
              >
                <Link
                  to={`/product/${item.product.id}`}
                  className="block h-28 w-24 shrink-0 overflow-hidden rounded-md bg-background-900 cursor-pointer"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-full w-full object-cover object-top"
                  />
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-foreground-400">
                        {item.product.category}
                      </p>
                      <Link
                        to={`/product/${item.product.id}`}
                        className="mt-0.5 block font-heading text-lg text-foreground-50 hover:text-foreground-200 transition-colors cursor-pointer"
                      >
                        {item.product.name}
                      </Link>
                      {item.shade && (
                        <p className="mt-0.5 text-xs text-foreground-400">Shade: {item.shade}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id, item.shade)}
                      className="flex h-8 w-8 items-center justify-center text-foreground-400 hover:text-primary-400 transition-colors cursor-pointer"
                      aria-label="Remove item"
                    >
                      <i className="ri-close-line text-lg" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-background-700">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.shade, item.quantity - 1)
                        }
                        className="flex h-8 w-8 items-center justify-center text-foreground-300 hover:text-foreground-50 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <i className="ri-subtract-line" />
                      </button>
                      <span className="w-6 text-center text-sm text-foreground-50">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.shade, item.quantity + 1)
                        }
                        className="flex h-8 w-8 items-center justify-center text-foreground-300 hover:text-foreground-50 transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <i className="ri-add-line" />
                      </button>
                    </div>
                    <p className="font-heading text-lg text-foreground-50">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-lg border border-background-800 bg-background-900/50 p-6">
              <h2 className="font-heading text-2xl text-foreground-50">Summary</h2>

              <dl className="mt-5 space-y-3 text-sm">
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
                    {hasFreeShipping ? 'Complimentary' : 'Calculated at checkout'}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-background-800 pt-3">
                  <dt className="text-foreground-100 font-medium">Total</dt>
                  <dd className="font-heading text-2xl text-foreground-50">
                    ${total.toFixed(2)}
                  </dd>
                </div>
              </dl>

              {/* Discount code */}
              <div className="mt-5 border-t border-background-800 pt-4">
                {discountCode ? (
                  <div className="flex items-center justify-between rounded-lg border border-accent-500/30 bg-accent-500/10 px-3 py-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.15em] text-accent-300">
                        Code {discountCode}
                      </p>
                      <p className="text-[11px] text-foreground-400">{discountMessage}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        removeDiscount();
                        setCode('');
                      }}
                      aria-label="Remove discount"
                      className="flex h-7 w-7 items-center justify-center text-foreground-400 hover:text-foreground-50 transition-colors cursor-pointer"
                    >
                      <i className="ri-close-line" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="Discount code"
                        aria-label="Discount code"
                        className="flex-1 rounded-lg border border-background-700 bg-background-950 px-3 py-2.5 text-sm uppercase tracking-wider text-foreground-100 placeholder:normal-case placeholder:tracking-normal placeholder:text-foreground-600 outline-none focus:border-primary-500/60 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => applyDiscount(code)}
                        className="whitespace-nowrap rounded-lg border border-background-700 px-4 text-sm text-foreground-100 hover:border-foreground-400 transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {discountMessage && (
                      <p className="mt-2 text-xs text-primary-300">{discountMessage}</p>
                    )}
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setNotice(true)}
                className="mt-6 w-full whitespace-nowrap rounded-full bg-primary-500 px-6 py-3.5 text-sm font-medium uppercase tracking-[0.15em] text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
              >
                Proceed to Checkout
              </button>

              {notice && (
                <p className="mt-4 rounded-lg bg-background-800/70 p-3 text-xs leading-relaxed text-foreground-300 animate-fade-in">
                  Secure checkout is the final step — connect your payment to unlock it. Everything
                  in your bag is safely saved.
                </p>
              )}

              <p className="mt-4 flex items-center justify-center gap-2 text-xs text-foreground-500">
                <i className="ri-lock-line" /> Encrypted &amp; secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}