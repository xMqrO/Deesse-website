const FROM = process.env.EMAIL_FROM || 'Déesse Shop <onboarding@resend.dev>';

export function isResendConfigured() {
  const key = process.env.RESEND_API_KEY || '';
  return Boolean(key && key !== 'mock');
}

export async function sendMail({ to, subject, html, text, replyTo }) {
  const key = process.env.RESEND_API_KEY;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: Array.isArray(to) ? to : [to],
      replyTo: replyTo || undefined,
      subject,
      html: html || undefined,
      text: text || undefined,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Email not sent (${res.status})${detail ? `: ${detail}` : ''}`);
  }
  return res.json();
}