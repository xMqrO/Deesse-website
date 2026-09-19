import type { Product } from '@/mocks/products';
import type { SiteSettings } from '@/context/SiteSettingsContext';
import type { StoreOrder } from '@/context/OrdersContext';

export interface CatalogSnapshot {
  products: Product[];
  categories: string[];
  settings: SiteSettings;
}

interface JsonInit {
  method?: 'GET' | 'POST' | 'PATCH';
  body?: string;
  headers?: Record<string, string>;
}

async function request<T>(path: string, init?: JsonInit): Promise<T | null> {
  try {
    const res = await fetch(path, {
      method: init?.method ?? 'GET',
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
      body: init?.body,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

let catalogPromise: Promise<CatalogSnapshot | null> | null = null;

async function doFetchCatalog(): Promise<CatalogSnapshot | null> {
  const data = await request<{
    ok: boolean;
    products?: Product[];
    categories?: string[];
    settings?: SiteSettings;
  }>('/api/catalog');
  if (!data?.ok || !Array.isArray(data.products) || !Array.isArray(data.categories)) {
    return null;
  }
  return {
    products: data.products ?? [],
    categories: data.categories ?? [],
    settings: data.settings ?? ({ linkPreviewTitle: '', linkPreviewDescription: '' } as SiteSettings),
  };
}

export function fetchCatalog(): Promise<CatalogSnapshot | null> {
  if (!catalogPromise) {
    catalogPromise = doFetchCatalog().finally(() => {
      setTimeout(() => {
        catalogPromise = null;
      }, 60000);
    });
  }
  return catalogPromise;
}

const debounces = new Map<string, ReturnType<typeof setTimeout>>();

function debouncePush(key: string, fn: () => Promise<unknown>, delay = 1000) {
  const existing = debounces.get(key);
  if (existing) clearTimeout(existing);
  debounces.set(
    key,
    setTimeout(() => {
      debounces.delete(key);
      void fn();
    }, delay)
  );
}

export function pushCatalog(products: Product[], categories: string[]) {
  debouncePush(
    'catalog',
    () => request('/api/catalog', { method: 'POST', body: JSON.stringify({ action: 'sync', products, categories }) }),
    1200
  );
}

export function pushSettings(settings: SiteSettings) {
  debouncePush(
    'settings',
    () => request('/api/catalog', { method: 'POST', body: JSON.stringify({ action: 'syncSettings', settings }) }),
    800
  );
}

export async function fetchOrders(): Promise<StoreOrder[] | null> {
  const data = await request<{ ok: boolean; orders?: StoreOrder[] }>('/api/orders');
  return data?.ok && Array.isArray(data.orders) ? data.orders : null;
}

export function pushOrder(order: StoreOrder) {
  debouncePush(
    `order:${order.id}`,
    () => request('/api/orders', { method: 'POST', body: JSON.stringify({ order }) }),
    300
  );
}

export function pushOrderStatus(id: string, status: StoreOrder['status']) {
  return request('/api/orders', { method: 'PATCH', body: JSON.stringify({ id, status }) });
}