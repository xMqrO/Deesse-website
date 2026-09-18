import { useMemo, useState } from 'react';
import Panel from '@/components/admin/ui/Panel';
import Badge, { toneForStatus } from '@/components/admin/ui/Badge';
import Modal from '@/components/admin/ui/Modal';
import { adminReviews, type AdminReview } from '@/mocks/admin';

const RATING_TABS = [
  { key: 'all', label: 'All' },
  { key: '5', label: '5 stars' },
  { key: '4', label: '4 stars' },
  { key: '3', label: '3 stars' },
  { key: 'low', label: '≤ 2 stars' },
] as const;

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5 text-accent-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <i key={i} className={`${i < rating ? 'ri-star-fill' : 'ri-star-line'} text-xs`} />
      ))}
    </span>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<AdminReview[]>(adminReviews);
  const [tab, setTab] = useState<(typeof RATING_TABS)[number]['key']>('all');
  const [replyTo, setReplyTo] = useState<AdminReview | null>(null);
  const [replyText, setReplyText] = useState('');

  const filtered = useMemo(() => {
    if (tab === 'all') return reviews;
    if (tab === 'low') return reviews.filter((r) => r.rating <= 2);
    return reviews.filter((r) => r.rating === Number(tab));
  }, [reviews, tab]);

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const setStatus = (id: string, status: AdminReview['status']) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Average rating" subtitle="Across all published reviews" className="lg:col-span-1">
          <div className="flex items-end gap-4">
            <p className="font-heading text-6xl text-foreground-50">{avg.toFixed(1)}</p>
            <div className="pb-2">
              <Stars rating={Math.round(avg)} />
              <p className="mt-1 text-xs text-foreground-500">{reviews.length} reviews</p>
            </div>
          </div>
        </Panel>

        <Panel title="Rating distribution" subtitle="How clients score the maison" className="lg:col-span-2">
          <ul className="space-y-2.5">
            {distribution.map((d) => {
              const pct = reviews.length ? (d.count / reviews.length) * 100 : 0;
              return (
                <li key={d.star} className="flex items-center gap-3 text-sm">
                  <span className="flex w-14 items-center gap-1 text-foreground-400">
                    {d.star} <i className="ri-star-fill text-xs text-accent-400" />
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-background-800">
                    <div className="h-full rounded-full bg-accent-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-right text-foreground-500">{d.count}</span>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      <Panel bodyClassName="p-0">
        <div className="flex flex-wrap items-center gap-2 border-b border-background-800 p-4">
          {RATING_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs uppercase tracking-[0.1em] transition-colors cursor-pointer ${
                tab === t.key
                  ? 'bg-primary-500 text-foreground-50'
                  : 'border border-background-700 text-foreground-400 hover:text-foreground-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <ul className="divide-y divide-background-800/60">
          {filtered.map((r) => (
            <li key={r.id} className="p-5 transition-colors hover:bg-background-800/30">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <Stars rating={r.rating} />
                    <span className="font-heading text-lg text-foreground-50">{r.title}</span>
                    <Badge tone={toneForStatus(r.status)}>{r.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-foreground-300 leading-relaxed">{r.body}</p>
                  <p className="mt-3 text-xs text-foreground-500">
                    {r.customer} · {r.product} · {r.date}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {r.status !== 'Published' && (
                    <button
                      type="button"
                      onClick={() => setStatus(r.id, 'Published')}
                      className="whitespace-nowrap rounded-md border border-background-700 px-3 py-1.5 text-xs text-accent-300 hover:border-accent-500/60 transition-colors cursor-pointer"
                    >
                      Publish
                    </button>
                  )}
                  {r.status !== 'Hidden' && (
                    <button
                      type="button"
                      onClick={() => setStatus(r.id, 'Hidden')}
                      className="whitespace-nowrap rounded-md border border-background-700 px-3 py-1.5 text-xs text-foreground-300 hover:border-foreground-400 transition-colors cursor-pointer"
                    >
                      Hide
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setReplyTo(r);
                      setReplyText('');
                    }}
                    className="whitespace-nowrap rounded-md bg-primary-500 px-3 py-1.5 text-xs font-medium text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="py-16 text-center text-sm text-foreground-500">No reviews in this range.</li>
          )}
        </ul>
      </Panel>

      <Modal
        open={!!replyTo}
        onClose={() => setReplyTo(null)}
        title="Reply to review"
        subtitle={replyTo ? `${replyTo.customer} · ${replyTo.product}` : ''}
        footer={
          <>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="rounded-lg border border-background-700 px-4 py-2 text-sm text-foreground-200 hover:border-foreground-400 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="rounded-lg bg-primary-500 px-5 py-2 text-sm font-medium text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
            >
              Send reply
            </button>
          </>
        }
      >
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          maxLength={500}
          rows={4}
          placeholder="Thank you for your kind words…"
          className="w-full resize-none rounded-lg border border-background-800 bg-background-950 px-4 py-3 text-sm text-foreground-100 placeholder:text-foreground-600 outline-none focus:border-primary-500/60"
        />
        <p className="mt-2 text-xs text-foreground-500">{replyText.length}/500</p>
      </Modal>
    </div>
  );
}