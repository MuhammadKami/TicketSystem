'use client';

import { memo } from 'react';
import { ChevronRight } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import ChannelIcon from '@/components/ui/ChannelIcon';
import { timeAgo, initials, avatarColor } from '@/lib/format';

const GRID =
  'grid items-center gap-4 grid-cols-[1.4fr_2.2fr_1fr_0.9fr_1fr_1.1fr_1.1fr_auto] max-lg:grid-cols-[1.4fr_2fr_1fr_1fr_auto] max-sm:grid-cols-[auto_1fr_auto]';

function TicketRow({ ticket, onClick }) {
  const confidence = Math.round((ticket.confidence || 0) * 100);
  const barColor = confidence >= 75 ? 'bg-green-500' : confidence >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <button
      onClick={() => onClick?.(ticket)}
      className={`${GRID} group w-full rounded-lg border border-gray-100 bg-white px-4 py-3 text-left transition-all duration-150 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800/60`}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-white"
          style={{ background: avatarColor(ticket.customer_name || ticket.id) }}
        >
          {initials(ticket.customer_name)}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
            {ticket.customer_name || 'Anonymous'}
          </span>
          <span className="flex items-center gap-1 text-xs capitalize text-gray-400 dark:text-gray-500">
            <ChannelIcon channel={ticket.channel} size={11} />
            {ticket.channel}
          </span>
        </span>
      </span>

      <span className="flex min-w-0 flex-col max-sm:hidden">
        <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{ticket.subject}</span>
        <span className="truncate text-xs text-gray-400 dark:text-gray-500">{ticket.body}</span>
      </span>

      <span className="truncate text-sm text-gray-600 dark:text-gray-400 max-lg:hidden">{ticket.category || '—'}</span>
      <span><Badge value={ticket.priority} /></span>
      <span className="max-lg:hidden"><Badge value={ticket.sentiment} /></span>
      <span><Badge value={ticket.status} dot /></span>

      <span className="flex items-center gap-2 max-lg:hidden">
        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <span className={`block h-full rounded-full ${barColor}`} style={{ width: `${confidence}%` }} />
        </span>
        <span className="text-xs font-semibold tabular-nums text-gray-500 dark:text-gray-400">{confidence}%</span>
      </span>

      <span className="flex items-center gap-3">
        <span className="whitespace-nowrap text-xs text-gray-400 dark:text-gray-500 max-lg:hidden">
          {timeAgo(ticket.created_at)}
        </span>
        <ChevronRight
          size={16}
          strokeWidth={1.5}
          className="text-gray-300 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-gray-500 dark:text-gray-600"
        />
      </span>
    </button>
  );
}

export default memo(TicketRow);
