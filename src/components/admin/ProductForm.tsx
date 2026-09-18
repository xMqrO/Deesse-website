import type { ReactNode } from 'react';
import type { Product, ProductStatus } from '@/mocks/products';
import { statusOptions, tagOptions } from '@/mocks/products';
import ImageManager from '@/components/admin/ImageManager';
import StringListEditor from '@/components/admin/StringListEditor';

interface ProductFormProps {
  draft: Product;
  onChange: (patch: Partial<Product>) => void;
  categories: string[];
}

const inputClass =
  'mt-2 w-full rounded-lg border border-background-800 bg-background-950 px-4 py-2.5 text-sm text-foreground-100 outline-none focus:border-primary-500/60 transition-colors';
const labelClass = 'text-xs uppercase tracking-[0.15em] text-foreground-500';
const hintClass = 'mt-1.5 text-xs text-foreground-600';

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-background-800 bg-background-900/40 p-5">
      <h3 className="font-heading text-lg text-foreground-50">{title}</h3>
      {description && <p className="mt-1 text-xs text-foreground-500">{description}</p>}
      <div className="mt-4 space-y-5">{children}</div>
    </section>
  );
}

export default function ProductForm({ draft, onChange, categories }: ProductFormProps) {
  const setStock = (value: string) => {
    const stock = Math.max(0, Number(value) || 0);
    const patch: Partial<Product> = { stock };
    if (stock === 0 && draft.status !== 'Draft') patch.status = 'Out of Stock';
    if (stock > 0 && draft.status === 'Out of Stock') patch.status = 'Active';
    onChange(patch);
  };

  return (
    <div className="space-y-5">
      <Section title="Basics" description="The core details customers see everywhere.">
        <div>
          <label className={labelClass} htmlFor="product-name">
            Product name
          </label>
          <input
            id="product-name"
            value={draft.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g. Velvet Rouge Lipstick"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="product-id">
            URL slug
          </label>
          <input
            id="product-id"
            value={draft.id}
            onChange={(e) => onChange({ id: e.target.value.trim() })}
            placeholder="velvet-rouge-lipstick"
            className={`${inputClass} font-mono`}
          />
          <p className={hintClass}>
            Used in the storefront link <code>/product/{draft.id || 'slug'}</code>. Changing it
            changes the product URL.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="product-category">
              Category
            </label>
            <input
              id="product-category"
              list="product-category-options"
              value={draft.category}
              onChange={(e) => onChange({ category: e.target.value })}
              placeholder="e.g. Skincare"
              className={inputClass}
            />
            <datalist id="product-category-options">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <p className={hintClass}>Pick an existing category or type a new one.</p>
          </div>
          <div>
            <label className={labelClass} htmlFor="product-sku">
              SKU (optional)
            </label>
            <input
              id="product-sku"
              value={draft.sku ?? ''}
              onChange={(e) => onChange({ sku: e.target.value })}
              placeholder="e.g. DS-1000"
              className={`${inputClass} font-mono`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="product-price">
              Price ($)
            </label>
            <input
              id="product-price"
              type="number"
              min="0"
              step="0.01"
              value={draft.price}
              onChange={(e) => onChange({ price: Number(e.target.value) || 0 })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="product-compare-price">
              Compare-at price ($)
            </label>
            <input
              id="product-compare-price"
              type="number"
              min="0"
              step="0.01"
              value={draft.compareAtPrice ?? ''}
              onChange={(e) =>
                onChange({
                  compareAtPrice: e.target.value === '' ? undefined : Number(e.target.value) || 0,
                })
              }
              placeholder="Optional"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="product-stock">
              Stock / inventory
            </label>
            <input
              id="product-stock"
              type="number"
              min="0"
              value={draft.stock}
              onChange={(e) => setStock(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="product-status">
              Availability / status
            </label>
            <select
              id="product-status"
              value={draft.status}
              onChange={(e) => onChange({ status: e.target.value as ProductStatus })}
              className={`${inputClass} cursor-pointer`}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s === 'Draft' ? 'Draft (hidden from storefront)' : s}
                </option>
              ))}
            </select>
            <p className={hintClass}>Draft products are hidden from the storefront.</p>
          </div>
          <div className="flex items-end">
            <label className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-background-800 bg-background-950 px-4 py-3">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => onChange({ featured: e.target.checked })}
                className="h-4 w-4 cursor-pointer accent-primary-500"
              />
              <span className="text-sm text-foreground-200">
                Featured — show in the homepage Bestsellers section
              </span>
            </label>
          </div>
        </div>
      </Section>

      <Section title="Content" description="Write anything you like — no presets or restrictions.">
        <div>
          <label className={labelClass} htmlFor="product-tagline">
            Tagline
          </label>
          <input
            id="product-tagline"
            value={draft.tagline}
            onChange={(e) => onChange({ tagline: e.target.value })}
            placeholder="A single stroke of couture crimson"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="product-description">
            Description
          </label>
          <textarea
            id="product-description"
            value={draft.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={6}
            placeholder="Describe the product in your own words…"
            className={`${inputClass} resize-y leading-relaxed`}
          />
          <p className={hintClass}>Free-form text. Supports multiple lines.</p>
        </div>
        <div>
          <label className={labelClass} htmlFor="product-link-preview">
            Link preview description (optional)
          </label>
          <textarea
            id="product-link-preview"
            value={draft.linkPreviewDescription ?? ''}
            onChange={(e) => onChange({ linkPreviewDescription: e.target.value })}
            rows={3}
            placeholder="Short description shown when this product link is shared…"
            className={`${inputClass} resize-y leading-relaxed`}
          />
        </div>
      </Section>

      <Section
        title="Images"
        description="Add by URL or upload files. Reorder, replace, remove, and choose the main image."
      >
        <ImageManager images={draft.images} onChange={(images) => onChange({ images })} />
      </Section>

      <Section title="Variants" description="Shades, sizes, or any options customers can choose.">
        <div>
          <label className={labelClass}>Variants / shades</label>
          <div className="mt-2">
            <StringListEditor
              items={draft.shades ?? []}
              onChange={(shades) => onChange({ shades: shades.length ? shades : undefined })}
              placeholder="e.g. Rouge Nocturne"
              addLabel="Add variant"
              emptyLabel="No variants — the product will not show an option selector."
            />
          </div>
        </div>
      </Section>

      <Section title="Tags, ratings & discovery">
        <div>
          <label className={labelClass}>Tags</label>
          <div className="mt-2">
            <StringListEditor
              items={draft.tags}
              onChange={(tags) => onChange({ tags })}
              placeholder="e.g. Bestseller"
              addLabel="Add tag"
              suggestions={tagOptions}
              emptyLabel="No tags yet."
            />
          </div>
          <p className={hintClass}>
            “Bestseller” and “New” tags appear as badges and in the shop filters.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="product-rating">
              Rating (0–5)
            </label>
            <input
              id="product-rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={draft.rating}
              onChange={(e) => onChange({ rating: Number(e.target.value) || 0 })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="product-reviews">
              Review count
            </label>
            <input
              id="product-reviews"
              type="number"
              min="0"
              value={draft.reviews}
              onChange={(e) => onChange({ reviews: Number(e.target.value) || 0 })}
              className={inputClass}
            />
          </div>
        </div>
      </Section>
    </div>
  );
}
