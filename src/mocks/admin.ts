export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: 'Paid' | 'Pending' | 'Shipped' | 'Refunded' | 'Cancelled';
  date: string;
  channel: 'Storefront' | 'Concierge' | 'Wholesale';
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  joined: string;
  tier: 'Icon' | 'Gold' | 'Silver' | 'New';
  country: string;
}

export interface AdminReview {
  id: string;
  product: string;
  customer: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  status: 'Published' | 'Pending' | 'Hidden';
}

export interface AdminDiscount {
  id: string;
  code: string;
  type: 'Percent' | 'Fixed' | 'Free Shipping';
  value: string;
  uses: number;
  limit: number;
  status: 'Active' | 'Scheduled' | 'Expired';
  window: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  products: number;
  unitsSold: number;
  revenue: number;
  growth: number;
}

export const kpis = {
  revenue: 184920,
  revenueChange: 18.4,
  orders: 2864,
  ordersChange: 12.1,
  customers: 1927,
  customersChange: 9.6,
  aov: 64.58,
  aovChange: 4.3,
  conversion: 3.84,
  conversionChange: 0.7,
  refundRate: 1.2,
  refundChange: -0.4,
  stockAlerts: 6,
};

export interface RevenuePoint {
  month: string;
  revenue: number;
  orders: number;
}

export const revenueSeries: RevenuePoint[] = [
  { month: 'Jan', revenue: 9820, orders: 154 },
  { month: 'Feb', revenue: 11240, orders: 178 },
  { month: 'Mar', revenue: 12960, orders: 203 },
  { month: 'Apr', revenue: 11840, orders: 186 },
  { month: 'May', revenue: 14680, orders: 231 },
  { month: 'Jun', revenue: 16220, orders: 255 },
  { month: 'Jul', revenue: 15410, orders: 242 },
  { month: 'Aug', revenue: 17860, orders: 281 },
  { month: 'Sep', revenue: 19340, orders: 304 },
  { month: 'Oct', revenue: 18110, orders: 285 },
  { month: 'Nov', revenue: 21430, orders: 338 },
  { month: 'Dec', revenue: 24010, orders: 378 },
];

export interface CategoryShare {
  name: string;
  value: number;
}

export const categoryShare: CategoryShare[] = [
  { name: 'Skincare', value: 38 },
  { name: 'Makeup', value: 31 },
  { name: 'Fragrance', value: 19 },
  { name: 'Body Care', value: 8 },
  { name: 'Hair Care', value: 4 },
];

export interface TrafficSource {
  name: string;
  value: number;
}

export const trafficSources: TrafficSource[] = [
  { name: 'Direct', value: 34 },
  { name: 'Instagram', value: 27 },
  { name: 'Search', value: 21 },
  { name: 'Email', value: 12 },
  { name: 'Referral', value: 6 },
];

export const weeklySales = [
  { day: 'Mon', revenue: 4820, orders: 74 },
  { day: 'Tue', revenue: 5240, orders: 81 },
  { day: 'Wed', revenue: 4610, orders: 69 },
  { day: 'Thu', revenue: 6180, orders: 96 },
  { day: 'Fri', revenue: 7420, orders: 118 },
  { day: 'Sat', revenue: 8930, orders: 142 },
  { day: 'Sun', revenue: 6510, orders: 101 },
];

export interface TopProduct {
  name: string;
  units: number;
  revenue: number;
}

export const topProducts: TopProduct[] = [
  { name: 'Lumière Radiance Serum', units: 412, revenue: 52736 },
  { name: 'Velvet Rouge Lipstick', units: 386, revenue: 16212 },
  { name: 'Sérum Éclat Vitamin C', units: 298, revenue: 32780 },
  { name: 'Rose Éternelle Eau de Parfum', units: 274, revenue: 50690 },
  { name: 'Baume Démaquillant Cleansing Balm', units: 251, revenue: 13554 },
  { name: 'Crème Riche Hydra', units: 219, revenue: 20805 },
];

export const adminOrders: AdminOrder[] = [
  { id: '#DS-4821', customer: 'Camille Laurent', email: 'camille@maison.fr', items: 3, total: 264, status: 'Paid', date: '2026-09-18', channel: 'Storefront' },
  { id: '#DS-4820', customer: 'Avery Thompson', email: 'avery.t@studio.co', items: 2, total: 168, status: 'Shipped', date: '2026-09-18', channel: 'Storefront' },
  { id: '#DS-4819', customer: 'Sofia Marchetti', email: 'sofia.makeup@art.it', items: 5, total: 412, status: 'Paid', date: '2026-09-17', channel: 'Concierge' },
  { id: '#DS-4818', customer: 'Naomi Adeyemi', email: 'naomi.a@beauty.com', items: 1, total: 185, status: 'Pending', date: '2026-09-17', channel: 'Storefront' },
  { id: '#DS-4817', customer: 'Léa Bernard', email: 'lea.bernard@paris.fr', items: 4, total: 296, status: 'Paid', date: '2026-09-16', channel: 'Storefront' },
  { id: '#DS-4816', customer: 'Grace Miller', email: 'grace@london.uk', items: 2, total: 132, status: 'Refunded', date: '2026-09-16', channel: 'Storefront' },
  { id: '#DS-4815', customer: 'Yuki Tanaka', email: 'yuki@tokyo.jp', items: 6, total: 548, status: 'Shipped', date: '2026-09-15', channel: 'Concierge' },
  { id: '#DS-4814', customer: 'Isabella Rossi', email: 'bella@milano.it', items: 3, total: 210, status: 'Paid', date: '2026-09-15', channel: 'Storefront' },
  { id: '#DS-4813', customer: 'Amara Okafor', email: 'amara@lagos.ng', items: 2, total: 156, status: 'Cancelled', date: '2026-09-14', channel: 'Storefront' },
  { id: '#DS-4812', customer: 'Chloé Dubois', email: 'chloe.d@lyon.fr', items: 5, total: 385, status: 'Paid', date: '2026-09-14', channel: 'Wholesale' },
  { id: '#DS-4811', customer: 'Mia Chen', email: 'mia.chen@shanghai.cn', items: 1, total: 68, status: 'Shipped', date: '2026-09-13', channel: 'Storefront' },
  { id: '#DS-4810', customer: 'Olivia Bennett', email: 'olivia@nyc.us', items: 4, total: 342, status: 'Paid', date: '2026-09-13', channel: 'Storefront' },
  { id: '#DS-4809', customer: 'Freya Larsen', email: 'freya@oslo.no', items: 2, total: 148, status: 'Paid', date: '2026-09-12', channel: 'Storefront' },
  { id: '#DS-4808', customer: 'Ana Santos', email: 'ana@lisboa.pt', items: 3, total: 224, status: 'Shipped', date: '2026-09-12', channel: 'Concierge' },
];

export const adminCustomers: AdminCustomer[] = [
  { id: 'C-1001', name: 'Camille Laurent', email: 'camille@maison.fr', orders: 14, spent: 2860, joined: '2023-02-11', tier: 'Icon', country: 'France' },
  { id: 'C-1002', name: 'Avery Thompson', email: 'avery.t@studio.co', orders: 11, spent: 1980, joined: '2023-05-02', tier: 'Gold', country: 'USA' },
  { id: 'C-1003', name: 'Sofia Marchetti', email: 'sofia.makeup@art.it', orders: 9, spent: 1640, joined: '2023-07-19', tier: 'Gold', country: 'Italy' },
  { id: 'C-1004', name: 'Naomi Adeyemi', email: 'naomi.a@beauty.com', orders: 7, spent: 1220, joined: '2024-01-08', tier: 'Silver', country: 'UK' },
  { id: 'C-1005', name: 'Yuki Tanaka', email: 'yuki@tokyo.jp', orders: 6, spent: 1180, joined: '2024-03-14', tier: 'Silver', country: 'Japan' },
  { id: 'C-1006', name: 'Léa Bernard', email: 'lea.bernard@paris.fr', orders: 5, spent: 940, joined: '2024-06-21', tier: 'Silver', country: 'France' },
  { id: 'C-1007', name: 'Isabella Rossi', email: 'bella@milano.it', orders: 4, spent: 720, joined: '2024-09-30', tier: 'Silver', country: 'Italy' },
  { id: 'C-1008', name: 'Grace Miller', email: 'grace@london.uk', orders: 3, spent: 480, joined: '2025-01-17', tier: 'New', country: 'UK' },
  { id: 'C-1009', name: 'Mia Chen', email: 'mia.chen@shanghai.cn', orders: 2, spent: 260, joined: '2025-04-05', tier: 'New', country: 'China' },
  { id: 'C-1010', name: 'Olivia Bennett', email: 'olivia@nyc.us', orders: 8, spent: 1420, joined: '2023-11-23', tier: 'Gold', country: 'USA' },
];

export const adminReviews: AdminReview[] = [
  { id: 'R-501', product: 'Lumière Radiance Serum', customer: 'Camille Laurent', rating: 5, title: 'My skin has never glowed like this', body: 'Fourteen days in and the difference is undeniable. The texture is weightless yet somehow deeply nourishing.', date: '2026-09-17', status: 'Published' },
  { id: 'R-502', product: 'Velvet Rouge Lipstick', customer: 'Sofia Marchetti', rating: 5, title: 'The perfect crimson', body: 'One swipe, full coverage, and it survived a full dinner. A new kit essential.', date: '2026-09-16', status: 'Published' },
  { id: 'R-503', product: 'Rose Éternelle Eau de Parfum', customer: 'Avery Thompson', rating: 4, title: 'Beautiful but bold', body: 'Gorgeous oud drydown. Slightly stronger than expected — one spray is plenty.', date: '2026-09-15', status: 'Published' },
  { id: 'R-504', product: 'Crème Riche Hydra', customer: 'Naomi Adeyemi', rating: 5, title: 'Rich yet never greasy', body: 'My winter skin saviour. Absorbs quickly and leaves a soft, healthy finish.', date: '2026-09-14', status: 'Pending' },
  { id: 'R-505', product: 'Silk Veil Foundation', customer: 'Isabella Rossi', rating: 3, title: 'Lovely but limited shade range', body: 'The finish is stunning; I just wish there were a deeper option for my undertone.', date: '2026-09-13', status: 'Pending' },
  { id: 'R-506', product: 'Huile d\u2019Or Body Oil', customer: 'Yuki Tanaka', rating: 5, title: 'Liquid gold indeed', body: 'Silky, not sticky, and the subtle shimmer is perfect for evenings.', date: '2026-09-12', status: 'Published' },
  { id: 'R-507', product: 'Noir Éclat Mascara', customer: 'Grace Miller', rating: 5, title: 'Dramatic without clumps', body: 'Best mascara I have used in years. Lifts my lashes all day.', date: '2026-09-11', status: 'Published' },
  { id: 'R-508', product: 'Vernis Nuit Nail Lacquer', customer: 'Amara Okafor', rating: 2, title: 'Chipped quickly', body: 'The colour is divine but it chipped within two days despite a top coat.', date: '2026-09-10', status: 'Hidden' },
];

export const adminDiscounts: AdminDiscount[] = [
  { id: 'D-01', code: 'ICONEDIT25', type: 'Percent', value: '25% off', uses: 412, limit: 1000, status: 'Active', window: 'Sep 14 – Sep 22' },
  { id: 'D-02', code: 'FIRSTGLOW', type: 'Percent', value: '15% off', uses: 1284, limit: 5000, status: 'Active', window: 'Always on' },
  { id: 'D-03', code: 'FREESHIP75', type: 'Free Shipping', value: 'Free over $75', uses: 3204, limit: 99999, status: 'Active', window: 'Always on' },
  { id: 'D-04', code: 'NIGHT25', type: 'Fixed', value: '$25 off', uses: 0, limit: 500, status: 'Scheduled', window: 'Oct 01 – Oct 07' },
  { id: 'D-05', code: 'SUMMER20', type: 'Percent', value: '20% off', uses: 890, limit: 900, status: 'Expired', window: 'Jun 01 – Jun 30' },
  { id: 'D-06', code: 'VIPGOLD', type: 'Percent', value: '30% off', uses: 156, limit: 300, status: 'Active', window: 'Sep 01 – Oct 31' },
];

export const adminCategories: AdminCategory[] = [
  { id: 'CAT-01', name: 'Skincare', products: 9, unitsSold: 2140, revenue: 71240, growth: 22.4 },
  { id: 'CAT-02', name: 'Makeup', products: 10, unitsSold: 3120, revenue: 58860, growth: 14.8 },
  { id: 'CAT-03', name: 'Fragrance', products: 3, unitsSold: 640, revenue: 36120, growth: 9.2 },
  { id: 'CAT-04', name: 'Body Care', products: 3, unitsSold: 980, revenue: 12840, growth: 6.1 },
  { id: 'CAT-05', name: 'Hair Care', products: 2, unitsSold: 540, revenue: 5860, growth: -2.3 },
];