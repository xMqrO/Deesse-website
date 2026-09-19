export interface OrderEmailInput {
  id: string;
  customer: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shippingAddress: string;
}

const money = (n: number) => `$${Number(n || 0).toFixed(2)}`;

export function buildOrderEmailHtml(input: OrderEmailInput): string {
  const rows = input.items
    .map(
      (line) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #2a211e;color:#e9e2dc;font-size:14px;">
          ${line.name} &times; ${line.quantity}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #2a211e;color:#e9e2dc;font-size:14px;text-align:right;white-space:nowrap;">${money(
          line.price * line.quantity
        )}</td>
      </tr>`
    )
    .join('\n');

  return `
  <div style="background:#14100f;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:560px;margin:0 auto;background:#1f1a18;border:1px solid #2a211e;border-radius:12px;overflow:hidden;">
      <div style="padding:32px 32px 8px;text-align:center;">
        <p style="margin:0;font-size:30px;letter-spacing:2px;color:#efe6df;text-transform:lowercase;">déesse</p>
        <p style="margin:8px 0 0;font-size:11px;letter-spacing:3px;color:#8a7a70;text-transform:uppercase;">The Maison</p>
      </div>
      <div style="padding:24px 32px;">
        <h1 style="margin:0 0 6px;font-size:22px;color:#efe6df;">Merci${input.customer ? ', ' + input.customer : ''} — your order is confirmed</h1>
        <p style="margin:0 0 6px;font-size:13px;color:#a89a90;">Order <span style="color:#efe6df;">${input.id}</span></p>
        <p style="margin:0 0 20px;font-size:14px;color:#c6bab1;line-height:1.6;">
          We received your order and are preparing it in the atelier. A gift-wrapped parcel is on its way to you soon.
        </p>

        <table style="width:100%;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
          ${rows}
        </table>

        <table style="width:100%;border-collapse:collapse;margin-top:16px;font-family:Arial,Helvetica,sans-serif;">
          <tr><td style="padding:6px 0;color:#a89a90;font-size:13px;">Subtotal</td><td style="padding:6px 0;color:#e9e2dc;font-size:13px;text-align:right;">${money(input.subtotal)}</td></tr>
          ${
            input.discount > 0
              ? `<tr><td style="padding:6px 0;color:#d9a98c;font-size:13px;">Discount</td><td style="padding:6px 0;color:#d9a98c;font-size:13px;text-align:right;">−${money(input.discount)}</td></tr>`
              : ''
          }
          <tr><td style="padding:6px 0;color:#a89a90;font-size:13px;">Shipping</td><td style="padding:6px 0;color:#e9e2dc;font-size:13px;text-align:right;">${input.shipping > 0 ? money(input.shipping) : 'Complimentary'}</td></tr>
          <tr><td style="padding:10px 0 0;color:#e9e2dc;font-size:14px;font-weight:bold;">Total</td><td style="padding:10px 0 0;color:#efe6df;font-size:18px;text-align:right;font-weight:bold;">${money(input.total)}</td></tr>
        </table>

        <div style="margin-top:24px;padding:16px;background:#14100f;border:1px solid #2a211e;border-radius:8px;font-family:Arial,Helvetica,sans-serif;">
          <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;color:#8a7a70;text-transform:uppercase;">Shipping to</p>
          <p style="margin:0;font-size:13px;color:#c6bab1;line-height:1.6;white-space:pre-line;">${input.shippingAddress}</p>
        </div>

        <p style="margin:28px 0 0;font-size:12px;color:#8a7a70;line-height:1.8;text-align:center;">
          Questions about your order? Reply to this email — the atelier is at your service.<br/>
          &copy; ${new Date().getFullYear()} déesse Maison
        </p>
      </div>
    </div>
  </div>`;
}

export function buildOrderEmailText(input: OrderEmailInput): string {
  const lines = input.items.map(
    (l) => `${l.name} x${l.quantity} — ${money(l.price * l.quantity)}`
  );
  return [
    `Merci${input.customer ? ', ' + input.customer : ''} — your order is confirmed.`,
    `Order ${input.id}`,
    '',
    'Items:',
    ...lines,
    '',
    `Subtotal: ${money(input.subtotal)}`,
    input.discount > 0 ? `Discount: −${money(input.discount)}` : '',
    `Shipping: ${input.shipping > 0 ? money(input.shipping) : 'Complimentary'}`,
    `Total: ${money(input.total)}`,
    '',
    'Shipping to:',
    input.shippingAddress,
    '',
    'We are preparing your order in the atelier. Questions? Reply to this email.',
  ]
    .filter(Boolean)
    .join('\n');
}