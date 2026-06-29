'use client';

import { memo } from 'react';
import Badge from '@/components/ui/Badge';
import ChannelIcon from '@/components/ui/ChannelIcon';
import { timeAgo, initials, avatarColor } from '@/lib/format';

function TicketCard({ ticket, onClick }) {
  const confidence = Math.round((ticket.confidence || 0) * 100);
  const barColor = confidence >= 75 ? 'bg-green-500' : confidence >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <button
      onClick={() => onClick?.(ticket)}
      className="group flex w-full flex-col gap-3.5 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-200 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white shadow-sm"
          style={{ background: avatarColor(ticket.customer_name || ticket.id) }}
        >
          {initials(ticket.customer_name)}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
            {ticket.customer_name || 'Anonymous'}
          </span>
          <span className="flex min-w-0 items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <ChannelIcon channel={ticket.channel} size={12} className="shrink-0 text-gray-400 dark:text-gray-500" />
            <span className="truncate">
              <span className="capitalize">{ticket.channel}</span> · {timeAgo(ticket.created_at)}
            </span>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="line-clamp-1 text-[15px] font-semibold leading-snug text-gray-900 dark:text-gray-100">
          {ticket.subject}
        </h4>
        <p className="line-clamp-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{ticket.body}</p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {ticket.priority && <Badge value={ticket.priority} />}
        {ticket.category && <Badge tone="gray" label={ticket.category} />}
        {ticket.sentiment && <Badge value={ticket.sentiment} />}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-3.5 dark:border-gray-800">
        <Badge value={ticket.status} dot />
        {ticket.confidence != null && (
          <div className="flex max-w-[130px] flex-1 items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <span className={`block h-full rounded-full ${barColor}`} style={{ width: `${confidence}%` }} />
            </div>
            <span className="text-xs font-semibold tabular-nums text-gray-500 dark:text-gray-400">{confidence}%</span>
          </div>
        )}
      </div>
    </button>
  );
}

export default memo(TicketCard);
