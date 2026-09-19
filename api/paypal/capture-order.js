import { getPayPalBase, getPayPalAccessToken, isMockPayPal, parseBody, send, wrap } from './_paypal.js';

export default wrap(async (req, res) => {
  const { orderID } = parseBody(req);
  if (!orderID) {
    return send(res, 400, { ok: false, message: 'Missing order id.' });
  }

  if (isMockPayPal()) {
    return send(res, 200, {
      ok: true,
      mock: true,
      status: 'COMPLETED',
      id: orderID,
      captureId: `MOCK-CAPTURE-${Date.now().toString(36).toUpperCase()}`,
    });
  }

  const token = await getPayPalAccessToken();
  const capRes = await fetch(
    `${getPayPalBase()}/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: '{}',
    }
  );
  if (!capRes.ok) {
    throw new Error(`PayPal could not capture the payment (${capRes.status}).`);
  }
  const data = await capRes.json();
  const capture = data?.purchase_units?.[0]?.payments?.captures?.[0];
  return send(res, 200, {
    ok: true,
    status: data.status,
    id: data.id,
    captureId: capture?.id || data.id,
    amount: capture ? Number(capture.amount?.value || 0) : null,
  });
});