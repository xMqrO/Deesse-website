import { Link } from 'react-router-dom';
import type { Product } from '@/mocks/products';
import { useCart } from '@/context/CartContext';
import { useInView } from '@/hooks/useInView';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const { ref, inView } = useInView<HTMLDivElement>();

  const badge = product.tags.includes('Bestseller')
    ? 'Bestseller'
    : product.tags.includes('New')
      ? 'New'
      : null;

  return (
    <div
      ref={ref}
      data-product-shop
      className={`group relative reveal ${inView ? 'reveal-visible' : ''}`}
      style={{ transitionDelay: `${Math.min(index * 80, 400)}ms` }}
    >
      <Link to={`/product/${product.id}`} className="block cursor-pointer">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-background-900">
          <img
            src={product.image}
            alt={`${product.name} — luxury beauty product`}
            title={`${product.name} — luxury beauty`}
            className="h-full w-full object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {badge && (
            <span className="absolute left-3 top-3 rounded-full bg-primary-500 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-foreground-50">
              {badge}
            </span>
          )}

          <div className="absolute inset-x-0 bottom-0 translate-y-4 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
              className="w-full whitespace-nowrap rounded-full bg-foreground-50/90 px-4 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-background-950 backdrop-blur hover:bg-foreground-50 transition-colors cursor-pointer"
            >
              Add to Bag
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-foreground-400">
              {product.category}
            </p>
            <h3 className="mt-1 truncate font-heading text-lg leading-tight text-foreground-50">
              {product.name}
            </h3>
            <div className="mt-1.5 flex items-center gap-1.5">
              <i className="ri-star-fill text-xs text-accent-400" />
              <span className="text-xs text-foreground-400">
                {product.rating} · {product.reviews.toLocaleString()}
              </span>
            </div>
          </div>
          <p className="whitespace-nowrap font-heading text-lg text-foreground-50">
            ${product.price}
          </p>
        </div>
      </Link>
    </div>
  );
}