import { useState } from 'react';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqGroup {
  title: string;
  icon: string;
  items: FaqItem[];
}

const faqGroups: FaqGroup[] = [
  {
    title: 'Orders & Payment',
    icon: 'ri-shopping-bag-3-line',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Simply browse the shop, choose your shade or size where relevant, and add items to your bag. When you are ready, open your bag, apply any discount code, and proceed to checkout to complete your purchase.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit and debit cards — Visa, Mastercard, and American Express — as well as PayPal. All transactions are encrypted and processed securely.',
      },
      {
        q: 'Can I modify or cancel my order?',
        a: 'Orders are prepared quickly, so please contact our concierge as soon as possible. We will do our best to adjust or cancel your order before it ships, but we cannot guarantee changes once fulfilment has begun.',
      },
    ],
  },
  {
    title: 'Shipping & Delivery',
    icon: 'ri-truck-line',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Orders are typically dispatched within 1–2 business days. Standard delivery arrives within 3–5 business days, while express options are available at checkout for faster arrival.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, déesse ships to most countries worldwide. Shipping costs and delivery times are calculated at checkout based on your destination.',
      },
      {
        q: 'How can I track my order?',
        a: 'As soon as your order ships, you will receive a confirmation email with a tracking number and a link to follow your parcel in real time.',
      },
    ],
  },
  {
    title: 'Returns & Exchanges',
    icon: 'ri-arrow-go-back-line',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day return window on unopened products in their original packaging. If you are not completely satisfied, contact us to begin a return.',
      },
      {
        q: 'How do I start a return or exchange?',
        a: 'Reach out to our concierge team with your order number and the reason for the return. We will provide a prepaid label and guide you through the process.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are issued to the original payment method within 5–10 business days after we receive and inspect your returned items.',
      },
    ],
  },
  {
    title: 'Products & Ingredients',
    icon: 'ri-flask-line',
    items: [
      {
        q: 'Are your products vegan and cruelty-free?',
        a: 'Yes. Every déesse formula is vegan and cruelty-free. We never test on animals, and we carefully source clean, high-performance ingredients.',
      },
      {
        q: 'How do I find my perfect shade?',
        a: 'Each product page includes shade descriptions and swatches. If you are unsure, our concierge can offer personalised recommendations based on your skin tone and preferences.',
      },
      {
        q: 'Do you use clean ingredients?',
        a: 'We formulate without parabens, sulphates, and phthalates, prioritising refined, skin-loving ingredients that deliver results without compromise.',
      },
    ],
  },
];

function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-background-800 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-5 text-left cursor-pointer"
      >
        <span className="text-base font-medium text-foreground-100">{item.q}</span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-background-700 text-foreground-300 transition-transform duration-300 ${
            open ? 'rotate-45 border-primary-500 text-primary-300' : ''
          }`}
        >
          <i className="ri-add-line text-lg" />
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="pb-6 pr-12 text-sm leading-relaxed text-foreground-400">{item.a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="bg-background-950">
      {/* Header */}
      <section className="border-b border-background-800">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-24 md:px-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent-300">Help Centre</p>
          <h1 className="mt-4 font-heading text-4xl md:text-5xl text-foreground-50 leading-tight">
            Frequently asked questions
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-foreground-400 leading-relaxed">
            Everything you need to know about ordering, delivery, returns, and the déesse formulas.
          </p>
        </div>
      </section>

      {/* Groups */}
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <div className="space-y-12">
          {faqGroups.map((group) => (
            <div key={group.title}>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-background-900 text-primary-300">
                  <i className={`${group.icon} text-lg`} />
                </span>
                <h2 className="font-heading text-2xl text-foreground-50">{group.title}</h2>
              </div>
              <div className="mt-4 rounded-xl border border-background-800 bg-background-900/40 px-6">
                {group.items.map((item) => (
                  <FaqRow key={item.q} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 rounded-2xl border border-background-800 bg-background-900/60 p-8 text-center">
          <h3 className="font-heading text-2xl text-foreground-50">Still have a question?</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-foreground-400 leading-relaxed">
            Our concierge team is here to help with anything — from shade matching to a personal
            order.
          </p>
          <a
            href="mailto:concierge@deesse.com"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-500 px-7 py-3 text-sm font-medium uppercase tracking-[0.15em] text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
          >
            Contact concierge <i className="ri-arrow-right-line" />
          </a>
        </div>
      </section>
    </div>
  );
}