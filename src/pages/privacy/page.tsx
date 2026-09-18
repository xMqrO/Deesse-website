interface PrivacySection {
  title: string;
  body: string[];
}

const sections: PrivacySection[] = [
  {
    title: '1. Information We Collect',
    body: [
      'We collect information you provide directly, such as your name, email address, shipping address, and payment details when you place an order or subscribe to our newsletter.',
      'We also collect certain technical information automatically when you browse the maison, including your IP address, browser type, device information, and pages visited.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    body: [
      'We use your information to process and fulfil orders, personalise your experience, communicate about your purchases, and — with your consent — share news of new launches and private offers.',
      'We may also use aggregated, anonymised data to improve our products and the performance of our website.',
    ],
  },
  {
    title: '3. Cookies & Tracking',
    body: [
      'Our website uses cookies and similar technologies to remember your preferences, keep your bag items, and understand how the site is used.',
      'You can control cookies through your browser settings at any time. Disabling cookies may affect certain features, such as your shopping bag.',
    ],
  },
  {
    title: '4. Third-Party Services',
    body: [
      'We share information only with trusted partners who help us operate, such as payment processors and delivery carriers, and only to the extent necessary to provide our services.',
      'We never sell your personal information to third parties for their own marketing purposes.',
    ],
  },
  {
    title: '5. Your Rights & Choices',
    body: [
      'You may request access to, correction of, or deletion of your personal information at any time. You can also opt out of marketing communications by using the unsubscribe link in any email.',
      'To exercise any of these rights, please contact us using the details below.',
    ],
  },
  {
    title: '6. Data Retention',
    body: [
      'We retain your personal information only for as long as necessary to fulfil the purposes described in this policy, or as required by applicable law.',
    ],
  },
  {
    title: '7. Contact Us',
    body: [
      'If you have any questions about this privacy policy or how your information is handled, please contact our privacy team at privacy@deesse.com.',
    ],
  },
];

export default function Privacy() {
  return (
    <div className="bg-background-950">
      <section className="border-b border-background-800">
        <div className="mx-auto max-w-3xl px-4 py-16 md:py-24 md:px-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent-300">Legal</p>
          <h1 className="mt-4 font-heading text-4xl md:text-5xl text-foreground-50 leading-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-foreground-500">
            Last updated: September 2026
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-heading text-xl text-foreground-50">{section.title}</h2>
              {section.body.map((paragraph, i) => (
                <p key={i} className="mt-3 text-sm leading-relaxed text-foreground-400">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}