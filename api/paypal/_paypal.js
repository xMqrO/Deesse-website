const PAYPAL_MODE = (process.env.PAYPAL_MODE || 'sandbox').toLowerCase() === 'live' ? 'live' : 'sandbox';

export function getPayPalBase() {
  return PAYPAL_MODE === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
}

export function isMockPayPal() {
  const secret = process.env.PAYPAL_CLIENT_SECRET || '';
  return !secret || secret === 'mock';
}

export async function getPayPalAccessToken() {
  const base = getPayPalBase();
  const clientId = process.env.PAYPAL_CLIENT_ID || '';
  const secret = process.env.PAYPAL_CLIENT_SECRET || '';
  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    throw new Error(`PayPal auth failed (${res.status})`);
  }
  const data = await res.json();
  return data.access_token;
}

export function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  return {};
}

export function send(res, status, payload) {
  return res.status(status).json(payload);
}

export function wrap(fn) {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      return send(res, 502, { ok: false, message });
    }
  };
}