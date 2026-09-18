import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '@/mocks/products';
import { applyDiscountCode, loadDiscounts } from '@/hooks/useDiscounts';

export interface CartItem {
  product: Product;
  shade?: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  discountCode: string | null;
  discountAmount: number;
  discountMessage: string;
  discountValid: boolean;
  freeShipping: boolean;
  total: number;
  addToCart: (product: Product, shade?: string, quantity?: number) => void;
  removeFromCart: (productId: string, shade?: string) => void;
  updateQuantity: (productId: string, shade: string | undefined, quantity: number) => void;
  applyDiscount: (code: string) => void;
  removeDiscount: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'deesse-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota errors */
    }
  }, [items]);

  const addToCart = (product: Product, shade?: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.product.id === product.id && i.shade === shade
      );
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.shade === shade
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, shade, quantity }];
    });
  };

  const removeFromCart = (productId: string, shade?: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.product.id === productId && i.shade === shade))
    );
  };

  const updateQuantity = (productId: string, shade: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, shade);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.shade === shade ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [items]
  );

  const discountResult = useMemo(() => {
    if (!discountCode) {
      return { valid: false, amount: 0, freeShipping: false, message: '', code: null };
    }
    const all = loadDiscounts();
    const cartItems = items.map((i) => ({
      productId: i.product.id,
      category: i.product.category,
      price: i.product.price,
      quantity: i.quantity,
    }));
    return applyDiscountCode(discountCode, all, subtotal, cartItems);
  }, [discountCode, items, subtotal]);

  const total = useMemo(
    () => Math.max(subtotal - discountResult.amount, 0),
    [subtotal, discountResult.amount]
  );

  const applyDiscount = (code: string) => {
    setDiscountCode(code.trim() || null);
  };

  const removeDiscount = () => {
    setDiscountCode(null);
  };

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    discountCode: discountResult.valid ? discountCode : null,
    discountAmount: discountResult.valid ? discountResult.amount : 0,
    discountMessage: discountResult.message,
    discountValid: discountResult.valid,
    freeShipping: discountResult.freeShipping,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyDiscount,
    removeDiscount,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}