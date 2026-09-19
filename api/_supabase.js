import { createClient } from '@supabase/supabase-js';

let db = null;

export function isDbConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getDb() {
  if (!isDbConfigured()) return null;
  if (!db) {
    db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return db;
}

// ---- Row mapping between snake_case DB rows and the app's camelCase types ----

export function toProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price) || 0,
    compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : undefined,
    image: row.image,
    images: Array.isArray(row.images) ? row.images : [],
    tagline: row.tagline,
    description: row.description,
    rating: Number(row.rating) || 0,
    reviews: row.reviews || 0,
    shades: Array.isArray(row.shades) ? row.shades : undefined,
    tags: Array.isArray(row.tags) ? row.tags : [],
    stock: row.stock || 0,
    sku: row.sku || undefined,
    status: row.status,
    featured: Boolean(row.featured),
    linkPreviewDescription: row.link_preview_description || undefined,
  };
}

export function toProductRow(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price ?? 0,
    compare_at_price: product.compareAtPrice ?? null,
    image: product.image || '',
    images: product.images || [],
    tagline: product.tagline || '',
    description: product.description || '',
    rating: product.rating ?? 0,
    reviews: product.reviews ?? 0,
    shades: product.shades || null,
    tags: product.tags || [],
    stock: product.stock ?? 0,
    sku: product.sku ?? null,
    status: product.status || 'Active',
    featured: Boolean(product.featured),
    link_preview_description: product.linkPreviewDescription || null,
  };
}

export function toSettings(row) {
  return {
    linkPreviewTitle:
      (row && row.link_preview_title) || 'déesse | Luxury Beauty, Skincare & Fragrance',
    linkPreviewDescription: (row && row.link_preview_description) || '',
  };
}

export function toOrder(row) {
  return {
    id: row.id,
    customer: row.customer,
    email: row.email,
    items: row.items || 0,
    total: Number(row.total) || 0,
    status: row.status,
    date: row.date,
    channel: row.channel || 'Storefront',
    lineItems: Array.isArray(row.line_items) ? row.line_items : [],
    shippingAddress: row.shipping_address || '',
    paymentId: row.payment_id || '',
  };
}

export function toOrderRow(order) {
  return {
    id: order.id,
    customer: order.customer,
    email: order.email,
    items: order.items || 0,
    total: order.total ?? 0,
    status: order.status,
    date: order.date,
    channel: order.channel || 'Storefront',
    line_items: order.lineItems || [],
    shipping_address: order.shippingAddress || '',
    payment_id: order.paymentId || '',
  };
}