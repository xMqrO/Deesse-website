import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AdminOrder } from '@/mocks/admin';
import { fetchOrders, pushOrder, pushOrderStatus } from '@/lib/db';

export interface StoreLineItem {
  name: string;
  quantity: number;
  price: number;
}

export interface StoreOrder {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: AdminOrder['status'];
  date: string;
  channel: 'Storefront';
  lineItems: StoreLineItem[];
  shippingAddress: string;
  paymentId: string;
}

type NewOrder = Omit<StoreOrder, 'id' | 'date' | 'channel' | 'status'> & { id?: string };

interface OrdersContextValue {
  orders: StoreOrder[];
  addOrder: (input: NewOrder) => StoreOrder;
  updateOrderStatus: (id: string, status: AdminOrder['status']) => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);
const STORAGE_KEY = 'deesse-orders';

function loadOrders(): StoreOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as StoreOrder[];
    }
  } catch {
    /* ignore */
  }
  return [];
}

function today(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function nextOrderId(orders: StoreOrder[]): string {
  let n = Math.floor(Math.random() * 9000) + 1000;
  let id = `#DS-${n}`;
  while (orders.some((o) => o.id === id)) {
    n = n + 1 > 9999 ? 1000 : n + 1;
    id = `#DS-${n}`;
  }
  return id;
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<StoreOrder[]>(loadOrders);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      /* ignore quota errors */
    }
  }, [orders]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const remote = await fetchOrders();
      if (cancelled || !remote) return;
      setOrders((prev) => {
        const byId = new Map(prev.map((o) => [o.id, o]));
        for (const remoteOrder of remote) {
          if (!byId.has(remoteOrder.id)) byId.set(remoteOrder.id, remoteOrder);
        }
        return Array.from(byId.values()).sort((a, b) => b.date.localeCompare(a.date));
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addOrder = useCallback(
    (input: NewOrder): StoreOrder => {
      const order: StoreOrder = {
        id: input.id || nextOrderId(orders),
        customer: input.customer,
        email: input.email,
        items: input.items,
        total: input.total,
        status: 'Paid',
        date: today(),
        channel: 'Storefront',
        lineItems: input.lineItems,
        shippingAddress: input.shippingAddress,
        paymentId: input.paymentId,
      };
      setOrders((prev) => [order, ...prev]);
      pushOrder(order);
      return order;
    },
    [orders]
  );

  const updateOrderStatus = useCallback((id: string, status: AdminOrder['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    void pushOrderStatus(id, status);
  }, []);

  const value = useMemo<OrdersContextValue>(
    () => ({ orders, addOrder, updateOrderStatus }),
    [orders, addOrder, updateOrderStatus]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return ctx;
}