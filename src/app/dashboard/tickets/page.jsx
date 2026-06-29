'use client';

import { useMemo, useState } from 'react';
import { Plus, Search, Columns3, LayoutGrid, List, Inbox, SlidersHorizontal } from 'lucide-react';
import Button from '@/components/ui/Button';
import TicketCard from '@/components/tickets/TicketCard';
import TicketRow from '@/components/tickets/TicketRow';
import NewTicketModal from '@/components/tickets/NewTicketModal';
import TicketDetail from '@/components/tickets/TicketDetail';
import { useTickets } from '@/components/tickets/TicketsProvider';

const COLUMNS = [
  { key: 'new', label: 'New', dot: 'bg-blue-500', match: (t) => t.status === 'new' || t.status === 'in_progress' },
  { key: 'auto_resolved', label: 'Auto-Resolved', dot: 'bg-green-500', match: (t) => t.status === 'auto_resolved' },
  { key: 'escalated', label: 'Escalated', dot: 'bg-red-500', match: (t) => t.status === 'escalated' },
  { key: 'resolved', label: 'Resolved', dot: 'bg-gray-400', match: (t) => t.status === 'resolved' || t.status === 'closed' },
];

const VIEWS = [
  { key: 'board', label: 'Board', Icon: Columns3 },
  { key: 'grid', label: 'Grid', Icon: LayoutGrid },
  { key: 'list', label: 'List', Icon: List },
];

const HEADER_GRID =
  'grid items-center gap-4 grid-cols-[1.4fr_2.2fr_1fr_0.9fr_1fr_1.1fr_1.1fr_auto]';

export default function TicketsPage() {
  const { tickets, loading } = useTickets();
  const [view, setView] = useState('board');
  const [openNew, setOpenNew] = useState(false);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState('all');

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        t.subject?.toLowerCase().includes(q) ||
        t.body?.toLowerCase().includes(q) ||
        t.customer_name?.toLowerCase().includes(q);
      const matchP = priority === 'all' || t.priority === priority;
      return matchQ && matchP;
    });
  }, [tickets, query, priority]);

  return (
    <>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">Ticket pipeline</span>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Tickets</h1>
          <p className="mt-1 max-w-[640px] text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Every ticket as it flows through AI triage, auto-resolution and human escalation.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setOpenNew(true)}>
          New ticket
        </Button>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={16} strokeWidth={1.5} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input input-icon"
            placeholder="Search tickets, customers…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <SlidersHorizontal size={16} strokeWidth={1.5} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            className="input input-icon cursor-pointer pr-8"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="all">All priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-900">
          {VIEWS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
                view === key
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }`}
            >
              <Icon size={16} strokeWidth={1.5} />
              <span className="max-sm:hidden">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <EmptyState Icon={Inbox} title="Loading tickets…" text="Fetching the latest from your queue." />
      ) : view === 'board' ? (
        <div className="grid grid-cols-4 items-start gap-4 max-[1100px]:grid-cols-2 max-[620px]:grid-cols-1">
          {COLUMNS.map((col) => {
            const items = filtered.filter(col.match);
            return (
              <div key={col.key} className="flex min-h-[200px] flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900/50">
                <div className="flex items-center justify-between border-b border-gray-100 px-1 pb-2.5 dark:border-gray-800">
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                    <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                    {col.label}
                  </span>
                  <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-200 px-1.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    {items.length}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {items.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-200 px-3 py-6 text-center text-xs text-gray-400 dark:border-gray-700 dark:text-gray-500">
                      No tickets
                    </div>
                  ) : (
                    items.map((t) => <TicketCard key={t.id} ticket={t} onClick={setSelected} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : view === 'grid' ? (
        filtered.length === 0 ? (
          <EmptyState Icon={Inbox} title="No tickets found" text="Try adjusting your search or filters." />
        ) : (
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]">
            {filtered.map((t) => (
              <TicketCard key={t.id} ticket={t} onClick={setSelected} />
            ))}
          </div>
        )
      ) : filtered.length === 0 ? (
        <EmptyState Icon={Inbox} title="No tickets found" text="Try adjusting your search or filters." />
      ) : (
        <div className="flex flex-col gap-2">
          <div className={`${HEADER_GRID} px-4 pb-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 max-lg:hidden`}>
            <span>Customer</span>
            <span>Subject</span>
            <span>Category</span>
            <span>Priority</span>
            <span>Sentiment</span>
            <span>Status</span>
            <span>Confidence</span>
            <span className="text-right">Created</span>
          </div>
          {filtered.map((t) => (
            <TicketRow key={t.id} ticket={t} onClick={setSelected} />
          ))}
        </div>
      )}

      <NewTicketModal open={openNew} onClose={() => setOpenNew(false)} />
      <TicketDetail ticket={selected} open={!!selected} onClose={() => setSelected(null)} onSelect={setSelected} />
    </>
  );
}

function EmptyState({ Icon, title, text }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 py-16 text-center dark:border-gray-700">
      <Icon size={48} strokeWidth={1.25} className="text-gray-300 dark:text-gray-600" />
      <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</span>
      <span className="text-sm text-gray-500 dark:text-gray-400">{text}</span>
    </div>
  );
}
