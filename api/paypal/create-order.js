import { getPayPalBase, getPayPalAccessToken, isMockPayPal, parseBody, send, wrap } from './_paypal.js';

export default wrap(async (req, res) => {
  const { amount, currency = 'USD' } = parseBody(req);
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) {
    return send(res, 400, { ok: false, message: 'Invalid amount.' });
  }

  if (isMockPayPal()) {
    return send(res, 200, {
      ok: true,
      mock: true,
      id: `MOCK-ORDER-${Date.now().toString(36).toUpperCase()}`,
    });
  }

  const token = await getPayPalAccessToken();
  const orderRes = await fetch(`${getPayPalBase()}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: { currency_code: currency, value: value.toFixed(2) },
        },
      ],
    }),
  });
  if (!orderRes.ok) {
    throw new Error(`PayPal could not create the order (${orderRes.status}).`);
  }
  const data = await orderRes.json();
  return send(res, 200, { ok: true, id: data.id });
});