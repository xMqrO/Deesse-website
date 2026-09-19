import { isResendConfigured, sendMail } from './_resend.js';
import { getDb, isDbConfigured } from './_supabase.js';
import { send, wrap } from './paypal/_paypal.js';

export default wrap(async (req, res) => {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const { email, name } = body;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return send(res, 400, { ok: false, message: 'A valid email is required.' });
  }

  if (isDbConfigured()) {
    try {
      const db = getDb();
      const { error } = await db
        .from('subscribers')
        .upsert({ email: email.toLowerCase(), name: name || null, source: 'newsletter' });
      if (error) throw error;
    } catch (error) {
      return send(res, 500, { ok: false, message: String(error.message || error) });
    }
  }

  if (!isResendConfigured()) {
    return send(res, 200, { ok: true, mock: true });
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID || '';
  if (audienceId) {
    const parts = String(name || '').trim().split(/\s+/);
    const first = parts[0] || '';
    const last = parts.slice(1).join(' ') || undefined;
    const addRes = await fetch(
      `https://api.resend.com/audiences/${encodeURIComponent(audienceId)}/contacts`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, first_name: first, last_name: last }),
      }
    );
    if (!addRes.ok) {
      throw new Error('Could not add the subscriber.');
    }
  } else {
    const owner = process.env.STORE_EMAIL || '';
    if (owner) {
      await sendMail({
        to: owner,
        subject: 'New newsletter subscriber — déesse',
        text: `${email}${name ? ` (${name})` : ''} just subscribed to the déesse newsletter.`,
        html: `<p>${email}${name ? ` (${name})` : ''} just subscribed to the déesse newsletter.</p>`,
      });
    }
  }

  return send(res, 200, { ok: true });
});