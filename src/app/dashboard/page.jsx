'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  ArrowRight,
  Ticket,
  CheckCircle2,
  Zap,
  Gauge,
  Inbox,
  PartyPopper,
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import NewTicketModal from '@/components/tickets/NewTicketModal';
import TicketDetail from '@/components/tickets/TicketDetail';
import { useTickets } from '@/components/tickets/TicketsProvider';
import { timeAgo, initials, avatarColor } from '@/lib/format';

const STATUS_DOT = (status) =>
  status === 'auto_resolved' || status === 'resolved'
    ? 'bg-green-500'
    : status === 'escalated'
    ? 'bg-red-500'
    : 'bg-blue-500';

export default function OverviewPage() {
  const { tickets, loading } = useTickets();
  const [openNew, setOpenNew] = useState(false);
  const [selected, setSelected] = useState(null);

  const stats = useMemo(() => {
    const total = tickets.length;
    const auto = tickets.filter((t) => t.status === 'auto_resolved').length;
    const escalated = tickets.filter((t) => t.status === 'escalated').length;
    const resolved = tickets.filter((t) => t.status === 'resolved').length;
    const avgConf = total ? Math.round((tickets.reduce((s, t) => s + (t.confidence || 0), 0) / total) * 100) : 0;
    const autoRate = total ? Math.round(((auto + resolved) / total) * 100) : 0;
    return { total, auto, escalated, resolved, avgConf, autoRate };
  }, [tickets]);

  const escalationQueue = tickets.filter((t) => t.status === 'escalated').slice(0, 5);
  const recent = tickets.slice(0, 6);

  return (
    <>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
            Support Command Center
          </span>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Overview</h1>
          <p className="mt-1 max-w-[640px] text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Real-time view of how the AI is triaging, auto-resolving and escalating your support tickets.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setOpenNew(true)}>
          New ticket
        </Button>
      </div>

      <div className="mb-5 grid grid-cols-4 gap-4 max-[960px]:grid-cols-2">
        <StatCard label="Total tickets" value={stats.total} Icon={Ticket} tone="blue" hint="all time" />
        <StatCard label="Auto-resolution rate" value={`${stats.autoRate}%`} Icon={CheckCircle2} tone="green" hint={`${stats.auto + stats.resolved} resolved without a human`} />
        <StatCard label="Escalated to humans" value={stats.escalated} Icon={Zap} tone="red" hint="need an agent" />
        <StatCard label="Avg AI confidence" value={`${stats.avgConf}%`} Icon={Gauge} tone="amber" hint="across all tickets" />
      </div>

      <div className="grid grid-cols-[1.3fr_1fr] gap-4 max-[960px]:grid-cols-1">
        <GlassCard className="p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <Zap size={18} strokeWidth={1.5} />
              </span>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Escalation queue</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Tickets the AI routed to a human agent</p>
              </div>
            </div>
            <Link href="/dashboard/tickets">
              <Button as="span" variant="ghost" size="sm" iconRight={ArrowRight}>
                View board
              </Button>
            </Link>
          </div>

          {loading ? (
            <SkeletonRows />
          ) : escalationQueue.length === 0 ? (
            <Empty Icon={PartyPopper} title="All clear" text="No escalations — the AI is handling everything." />
          ) : (
            <div className="flex flex-col gap-2">
              {escalationQueue.map((t) => (
                <button
                  key={t.id}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-150 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  onClick={() => setSelected(t)}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-white"
                    style={{ background: avatarColor(t.customer_name) }}
                  >
                    {initials(t.customer_name)}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{t.subject}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {t.customer_name} · {timeAgo(t.created_at)}
                    </span>
                  </span>
                  <Badge value={t.priority} />
                </button>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Inbox size={18} strokeWidth={1.5} />
            </span>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Recent activity</h3>
          </div>
          {loading ? (
            <SkeletonRows />
          ) : recent.length === 0 ? (
            <Empty Icon={Inbox} title="Nothing yet" text="Submit a ticket to see activity here." />
          ) : (
            <div className="flex flex-col gap-1">
              {recent.map((t) => (
                <button
                  key={t.id}
                  className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-150 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  onClick={() => setSelected(t)}
                >
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${STATUS_DOT(t.status)}`} />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{t.subject}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {t.status === 'auto_resolved'
                        ? 'Auto-resolved by AI'
                        : t.status === 'escalated'
                        ? 'Escalated to agent'
                        : t.status === 'resolved'
                        ? 'Resolved'
                        : 'Awaiting triage'}{' '}
                      · {timeAgo(t.created_at)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      <NewTicketModal open={openNew} onClose={() => setOpenNew(false)} />
      <TicketDetail ticket={selected} open={!!selected} onClose={() => setSelected(null)} onSelect={setSelected} />
    </>
  );
}

const TONE = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  green: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
};

function StatCard({ label, value, hint, Icon, tone }) {
  return (
    <GlassCard hover className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${TONE[tone]}`}>
          <Icon size={16} strokeWidth={1.5} />
        </span>
      </div>
      <span className="text-3xl font-semibold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">{value}</span>
      <span className="text-xs text-gray-400 dark:text-gray-500">{hint}</span>
    </GlassCard>
  );
}

function SkeletonRows() {
  return (
    <div className="flex flex-col gap-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
      ))}
    </div>
  );
}

function Empty({ Icon, title, text }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-gray-200 px-4 py-8 text-center dark:border-gray-700">
      <Icon size={32} strokeWidth={1.5} className="text-gray-300 dark:text-gray-600" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400">{text}</span>
    </div>
  );
}
