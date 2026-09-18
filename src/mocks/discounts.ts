export type DiscountType = 'percent' | 'fixed' | 'free_shipping';

export interface Discount {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  minPurchase: number;
  usageLimit: number;
  usageCount: number;
  startsAt: string;
  expiresAt: string;
  active: boolean;
  appliesTo: 'all' | 'category' | 'product';
  category: string | null;
  productIds: string[];
}

export const seedDiscounts: Discount[] = [
  {
    id: 'D-01',
    code: 'ICONEDIT25',
    type: 'percent',
    value: 25,
    minPurchase: 0,
    usageLimit: 1000,
    usageCount: 412,
    startsAt: '2026-09-14',
    expiresAt: '2026-09-22',
    active: true,
    appliesTo: 'all',
    category: null,
    productIds: [],
  },
  {
    id: 'D-02',
    code: 'FIRSTGLOW',
    type: 'percent',
    value: 15,
    minPurchase: 0,
    usageLimit: 5000,
    usageCount: 1284,
    startsAt: '2026-01-01',
    expiresAt: '2026-12-31',
    active: true,
    appliesTo: 'all',
    category: null,
    productIds: [],
  },
  {
    id: 'D-03',
    code: 'FREESHIP75',
    type: 'free_shipping',
    value: 0,
    minPurchase: 75,
    usageLimit: 0,
    usageCount: 3204,
    startsAt: '2026-01-01',
    expiresAt: '2026-12-31',
    active: true,
    appliesTo: 'all',
    category: null,
    productIds: [],
  },
  {
    id: 'D-04',
    code: 'NIGHT25',
    type: 'fixed',
    value: 25,
    minPurchase: 120,
    usageLimit: 500,
    usageCount: 0,
    startsAt: '2026-10-01',
    expiresAt: '2026-10-07',
    active: false,
    appliesTo: 'category',
    category: 'Skincare',
    productIds: [],
  },
  {
    id: 'D-05',
    code: 'SUMMER20',
    type: 'percent',
    value: 20,
    minPurchase: 0,
    usageLimit: 900,
    usageCount: 890,
    startsAt: '2026-06-01',
    expiresAt: '2026-06-30',
    active: false,
    appliesTo: 'all',
    category: null,
    productIds: [],
  },
  {
    id: 'D-06',
    code: 'VIPGOLD',
    type: 'percent',
    value: 30,
    minPurchase: 200,
    usageLimit: 300,
    usageCount: 156,
    startsAt: '2026-09-01',
    expiresAt: '2026-10-31',
    active: true,
    appliesTo: 'product',
    category: null,
    productIds: ['rose-eternelle-parfum', 'ambre-noir-parfum', 'fleur-de-nuit-parfum'],
  },
];