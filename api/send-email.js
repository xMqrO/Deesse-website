import { isResendConfigured, sendMail } from './_resend.js';
import { send, wrap } from './paypal/_paypal.js';

export default wrap(async (req, res) => {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const { to, subject, html, text, replyTo } = body;
  if (!to || !subject || (!html && !text)) {
    return send(res, 400, { ok: false, message: 'to, subject and content are required.' });
  }

  if (!isResendConfigured()) {
    return send(res, 200, { ok: true, mock: true });
  }

  await sendMail({ to, subject, html, text, replyTo });
  return send(res, 200, { ok: true });
});