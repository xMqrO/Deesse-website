import { getDb, isDbConfigured, toOrder, toOrderRow } from './_supabase.js';
import { parseBody, send, wrap } from './paypal/_paypal.js';

const STATUSES = ['Paid', 'Pending', 'Shipped', 'Refunded', 'Cancelled'];

export default wrap(async (req, res) => {
  if (!isDbConfigured()) {
    return send(res, 501, { ok: false, code: 'NO_DB', message: 'Supabase is not configured.' });
  }

  const db = getDb();

  if (req.method === 'GET') {
    try {
      const { data, error } = await db.from('orders').select('*').order('date', { ascending: false });
      if (error) throw error;
      return send(res, 200, { ok: true, orders: (data || []).map(toOrder) });
    } catch (error) {
      return send(res, 500, { ok: false, message: String(error.message || error) });
    }
  }

  if (req.method === 'POST') {
    const body = await parseBody(req);
    const order = body.order;
    if (!order || !order.id || !order.customer || !order.email) {
      return send(res, 400, { ok: false, message: 'order.id, customer and email are required.' });
    }
    try {
      const { error } = await db.from('orders').upsert(toOrderRow(order), { onConflict: 'id' });
      if (error) throw error;
      return send(res, 200, { ok: true, orderId: order.id });
    } catch (error) {
      return send(res, 500, { ok: false, message: String(error.message || error) });
    }
  }

  if (req.method === 'PATCH') {
    const body = await parseBody(req);
    const { id, status } = body;
    if (!id) return send(res, 400, { ok: false, message: 'id is required.' });
    if (!STATUSES.includes(status)) {
      return send(res, 400, { ok: false, message: `status must be one of ${STATUSES.join(', ')}.` });
    }
    try {
      const { error } = await db.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
      return send(res, 200, { ok: true, id, status });
    } catch (error) {
      return send(res, 500, { ok: false, message: String(error.message || error) });
    }
  }

  return send(res, 405, { ok: false, message: 'Method not allowed.' });
});