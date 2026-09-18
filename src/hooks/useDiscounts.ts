import { useCallback, useEffect, useState } from 'react';
import { seedDiscounts, type Discount } from '@/mocks/discounts';

const STORAGE_KEY = 'deesse-discounts';

export function loadDiscounts(): Discount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Discount[];
  } catch {
    /* ignore */
  }
  return seedDiscounts;
}

export function saveDiscounts(discounts: Discount[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(discounts));
  } catch {
    /* ignore */
  }
}

export function useDiscounts() {
  const [discounts, setDiscounts] = useState<Discount[]>(loadDiscounts);

  useEffect(() => {
    saveDiscounts(discounts);
  }, [discounts]);

  const create = useCallback((d: Omit<Discount, 'id' | 'usageCount'>) => {
    const next: Discount = {
      ...d,
      id: `D-${Date.now()}`,
      usageCount: 0,
    };
    setDiscounts((prev) => [next, ...prev]);
    return next;
  }, []);

  const update = useCallback((id: string, patch: Partial<Discount>) => {
    setDiscounts((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }, []);

  const remove = useCallback((id: string) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const toggle = useCallback((id: string) => {
    setDiscounts((prev) => prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d)));
  }, []);

  return { discounts, create, update, remove, toggle };
}

export interface DiscountableItem {
  productId: string;
  category: string;
  price: number;
  quantity: number;
}

export interface DiscountResult {
  valid: boolean;
  amount: number;
  freeShipping: boolean;
  message: string;
  code: string | null;
}

export function applyDiscountCode(
  code: string,
  discounts: Discount[],
  subtotal: number,
  items: DiscountableItem[]
): DiscountResult {
  const trimmed = code.trim().toLowerCase();
  if (!trimmed) {
    return { valid: false, amount: 0, freeShipping: false, message: '', code: null };
  }

  const d = discounts.find((x) => x.code.toLowerCase() === trimmed);
  if (!d) {
    return {
      valid: false,
      amount: 0,
      freeShipping: false,
      message: 'This code is not recognised.',
      code: trimmed,
    };
  }
  if (!d.active) {
    return {
      valid: false,
      amount: 0,
      freeShipping: false,
      message: 'This code is not active.',
      code: trimmed,
    };
  }
  if (d.usageLimit > 0 && d.usageCount >= d.usageLimit) {
    return {
      valid: false,
      amount: 0,
      freeShipping: false,
      message: 'This code has reached its usage limit.',
      code: trimmed,
    };
  }

  const now = new Date();
  if (d.startsAt && new Date(`${d.startsAt}T00:00:00`) > now) {
    return {
      valid: false,
      amount: 0,
      freeShipping: false,
      message: 'This code is not active yet.',
      code: trimmed,
    };
  }
  if (d.expiresAt && new Date(`${d.expiresAt}T23:59:59`) < now) {
    return {
      valid: false,
      amount: 0,
      freeShipping: false,
      message: 'This code has expired.',
      code: trimmed,
    };
  }
  if (d.minPurchase > 0 && subtotal < d.minPurchase) {
    return {
      valid: false,
      amount: 0,
      freeShipping: false,
      message: `This code requires a minimum purchase of $${d.minPurchase}.`,
      code: trimmed,
    };
  }

  let applicable: DiscountableItem[] = items;
  if (d.appliesTo === 'category' && d.category) {
    applicable = items.filter((i) => i.category === d.category);
  } else if (d.appliesTo === 'product' && d.productIds.length > 0) {
    applicable = items.filter((i) => d.productIds.includes(i.productId));
  }

  if (applicable.length === 0) {
    return {
      valid: false,
      amount: 0,
      freeShipping: false,
      message: 'This code does not apply to the items in your bag.',
      code: trimmed,
    };
  }

  const applicableSubtotal = applicable.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (d.type === 'free_shipping') {
    return { valid: true, amount: 0, freeShipping: true, message: 'Free shipping applied.', code: trimmed };
  }

  let amount = 0;
  if (d.type === 'percent') {
    amount = (applicableSubtotal * d.value) / 100;
  } else if (d.type === 'fixed') {
    amount = Math.min(d.value, applicableSubtotal);
  }
  amount = Math.round(amount * 100) / 100;

  return { valid: true, amount, freeShipping: false, message: 'Discount applied.', code: trimmed };
}