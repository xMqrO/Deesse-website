import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStorefrontProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/feature/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const products = useStorefrontProducts();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();

  const [shade, setShade] = useState<string | undefined>(product?.shades?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setShade(product?.shades?.[0]);
    setQuantity(1);
    setActiveImage(0);
  }, [product?.id, product?.shades]);

  const images = product
    ? product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : []
    : [];
  const soldOut = !!product && (product.stock <= 0 || product.status === 'Out of Stock');

  const related = useMemo(
    () => products.filter((p) => p.category === product?.category && p.id !== product?.id).slice(0, 4),
    [product]
  );

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <p className="font-heading text-4xl text-foreground-50">Lost in the atelier</p>
        <p className="mt-3 text-sm text-foreground-400">
          We couldn&apos;t find that product.
        </p>
        <Link
          to="/shop"
          className="mt-6 rounded-full bg-primary-500 px-7 py-3 text-sm uppercase tracking-[0.15em] text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    if (soldOut) return;
    addToCart(product, shade, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="pt-24 md:pt-32 pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-foreground-400">
          <Link to="/" className="hover:text-foreground-50 transition-colors cursor-pointer">
            Home
          </Link>
          <i className="ri-arrow-right-s-line" />
          <Link to="/shop" className="hover:text-foreground-50 transition-colors cursor-pointer">
            Shop
          </Link>
          <i className="ri-arrow-right-s-line" />
          <span className="text-foreground-200">{product.category}</span>
        </nav>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div data-product-shop className="relative">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-background-900">
              <img
                src={images[activeImage] ?? product.image}
                alt={`${product.name} — luxury beauty`}
                title={`${product.name} — luxury beauty`}
                className="h-full w-full object-cover object-top transition-transform duration-[1400ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-950/20 to-transparent" />
              {soldOut && (
                <span className="absolute right-4 top-4 rounded-full bg-background-950/85 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-foreground-200">
                  Sold out
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {images.map((src, i) => (
                  <button
                    key={`${src.slice(0, 24)}-${i}`}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`View image ${i + 1}`}
                    aria-current={activeImage === i}
                    className={`h-16 w-14 overflow-hidden rounded-md border transition-colors cursor-pointer ${
                      activeImage === i
                        ? 'border-primary-500'
                        : 'border-background-700 hover:border-foreground-400'
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
            {product.tags.map((t) => (
              <span
                key={t}
                className="absolute left-4 top-4 rounded-full bg-primary-500 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-foreground-50"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent-300">
              {product.category}
            </p>
            <h1 className="mt-3 font-heading text-4xl md:text-5xl text-foreground-50 leading-tight">
              {product.name}
            </h1>
            <p className="mt-2 font-heading text-lg italic text-foreground-300">
              {product.tagline}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-1 text-accent-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <i
                    key={i}
                    className={`text-sm ${
                      i < Math.round(product.rating) ? 'ri-star-fill' : 'ri-star-line'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-foreground-400">
                {product.rating} · {product.reviews.toLocaleString()} reviews
              </span>
            </div>

            <p className="mt-5 font-heading text-3xl text-foreground-50">${product.price}</p>

            <p className="mt-6 text-base font-light text-foreground-300 leading-relaxed">
              {product.description}
            </p>

            {/* Shades */}
            {product.shades && (
              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground-400">
                  Shade — <span className="text-foreground-200">{shade}</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.shades.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setShade(s)}
                      className={`whitespace-nowrap rounded-full px-4 py-2 text-xs transition-colors cursor-pointer ${
                        shade === s
                          ? 'bg-foreground-50 text-background-950'
                          : 'border border-background-700 text-foreground-300 hover:border-foreground-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <div className="flex items-center justify-between rounded-full border border-background-700 px-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center text-foreground-300 hover:text-foreground-50 transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <i className="ri-subtract-line" />
                </button>
                <span className="w-8 text-center text-sm text-foreground-50">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-11 w-11 items-center justify-center text-foreground-300 hover:text-foreground-50 transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <i className="ri-add-line" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={soldOut}
                className="flex-1 whitespace-nowrap rounded-full bg-primary-500 px-8 py-3 text-sm font-medium uppercase tracking-[0.15em] text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:bg-background-700 disabled:text-foreground-400"
              >
                {soldOut ? 'Sold out' : added ? 'Added to Bag' : 'Add to Bag'}
              </button>
            </div>

            {added && (
              <p className="mt-3 text-sm text-accent-300 animate-fade-in">
                {product.name} is in your bag.
              </p>
            )}

            {/* Accordions */}
            <div className="mt-10 border-t border-background-800">
              {[
                {
                  title: 'The Ritual',
                  body: 'Warm a small amount between the fingertips and press gently into skin, moving outward. Use morning and evening as the final step of your routine for a lasting veil of radiance.',
                },
                {
                  title: 'Ingredients',
                  body: 'Formulated with responsibly-sourced botanicals, cold-pressed oils, and skin-identical actives. Free from parabens, sulfates, and synthetic dyes. Cruelty-free and vegan-friendly.',
                },
                {
                  title: 'Shipping & Returns',
                  body: 'Complimentary shipping on orders over $75. Delivered in our signature keepsake packaging. Returns accepted within 30 days, unopened and in original condition.',
                },
              ].map((a, i) => (
                <details key={a.title} className="group border-b border-background-800" open={i === 0}>
                  <summary className="flex cursor-pointer items-center justify-between py-4 text-sm uppercase tracking-[0.15em] text-foreground-200 hover:text-foreground-50 transition-colors list-none">
                    {a.title}
                    <i className="ri-add-line transition-transform duration-300 group-open:rotate-45" />
                  </summary>
                  <p className="pb-4 text-sm font-light text-foreground-400 leading-relaxed">
                    {a.body}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="font-heading text-3xl md:text-4xl text-foreground-50">You may also love</h2>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}