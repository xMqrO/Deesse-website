import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  categories as seedCategories,
  normalizeProduct,
  products as seedProducts,
  slugify,
  type Product,
} from '@/mocks/products';
import { fetchCatalog, pushCatalog } from '@/lib/db';

const PRODUCTS_KEY = 'deesse-products';
const CATEGORIES_KEY = 'deesse-categories';

function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p, i) => normalizeProduct(p, i));
      }
    }
  } catch {
    /* ignore */
  }
  return seedProducts.map((p, i) => normalizeProduct(p, i));
}

function loadCategories(): string[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((c): c is string => typeof c === 'string');
      }
    }
  } catch {
    /* ignore */
  }
  return [...seedCategories];
}

function uniqueId(products: Product[]): string {
  let id = `p-${Date.now().toString(36)}`;
  let n = 1;
  while (products.some((p) => p.id === id)) {
    id = `p-${Date.now().toString(36)}-${n}`;
    n += 1;
  }
  return id;
}

interface ProductContextValue {
  products: Product[];
  categories: string[];
  getProduct: (id: string) => Product | undefined;
  addProduct: (input?: Partial<Product>) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  resetProducts: () => void;
  addCategory: (name: string) => void;
  renameCategory: (from: string, to: string) => void;
  deleteCategory: (name: string) => void;
}

const ProductContext = createContext<ProductContextValue | null>(null);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(loadProducts);
  const [categories, setCategories] = useState<string[]>(loadCategories);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const snapshot = await fetchCatalog();
      if (cancelled) return;
      if (snapshot) {
        if (snapshot.products.length > 0) setProducts(snapshot.products);
        if (snapshot.categories.length > 0) setCategories(snapshot.categories);
      }
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    pushCatalog(products, categories);
  }, [hydrated, products, categories]);

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch {
      /* ignore quota errors */
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch {
      /* ignore quota errors */
    }
  }, [categories]);

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  const addProduct = useCallback(
    (input: Partial<Product> = {}) => {
      const next = normalizeProduct(
        {
          ...input,
          id: input.id || uniqueId(products),
          name: input.name || 'Untitled product',
        },
        products.length
      );
      setProducts((prev) => [next, ...prev]);
      if (next.category) {
        setCategories((prev) =>
          prev.some((c) => c.toLowerCase() === next.category.toLowerCase())
            ? prev
            : [...prev, next.category]
        );
      }
      return next;
    },
    [products]
  );

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? normalizeProduct({ ...p, ...patch }, 0) : p))
    );
    if (patch.category) {
      setCategories((prev) =>
        prev.some((c) => c.toLowerCase() === patch.category!.toLowerCase())
          ? prev
          : [...prev, patch.category!]
      );
    }
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const duplicateProduct = useCallback((id: string) => {
    setProducts((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      if (index === -1) return prev;
      const source = prev[index];
      const copy = normalizeProduct(
        {
          ...source,
          id: uniqueId(prev),
          name: `${source.name} (Copy)`,
        },
        prev.length
      );
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      return next;
    });
  }, []);

  const resetProducts = useCallback(() => {
    setProducts(seedProducts.map((p, i) => normalizeProduct(p, i)));
    setCategories([...seedCategories]);
  }, []);

  const addCategory = useCallback((name: string) => {
    const clean = name.trim();
    if (!clean) return;
    setCategories((prev) =>
      prev.some((c) => c.toLowerCase() === clean.toLowerCase()) ? prev : [...prev, clean]
    );
  }, []);

  const renameCategory = useCallback((from: string, to: string) => {
    const clean = to.trim();
    if (!clean) return;
    setCategories((prev) => prev.map((c) => (c === from ? clean : c)));
    setProducts((prev) =>
      prev.map((p) => (p.category === from ? { ...p, category: clean } : p))
    );
  }, []);

  const deleteCategory = useCallback((name: string) => {
    setCategories((prev) => prev.filter((c) => c !== name));
  }, []);

  const value = useMemo<ProductContextValue>(
    () => ({
      products,
      categories,
      getProduct,
      addProduct,
      updateProduct,
      deleteProduct,
      duplicateProduct,
      resetProducts,
      addCategory,
      renameCategory,
      deleteCategory,
    }),
    [
      products,
      categories,
      getProduct,
      addProduct,
      updateProduct,
      deleteProduct,
      duplicateProduct,
      resetProducts,
      addCategory,
      renameCategory,
      deleteCategory,
    ]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return ctx;
}

export function useStorefrontProducts() {
  const { products } = useProducts();
  return useMemo(() => products.filter((p) => p.status !== 'Draft'), [products]);
}

export function productSlug(name: string): string {
  return slugify(name);
}
