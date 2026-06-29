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
      className="flex w-full flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 text-left shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-white"
          style={{ background: avatarColor(ticket.customer_name || ticket.id) }}
        >
          {initials(ticket.customer_name)}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
            {ticket.customer_name || 'Anonymous'}
          </span>
          <span className="flex items-center gap-1.5 text-xs capitalize text-gray-400 dark:text-gray-500">
            <ChannelIcon channel={ticket.channel} size={12} />
            {ticket.channel} · {timeAgo(ticket.created_at)}
          </span>
        </div>
        <Badge value={ticket.priority} />
      </div>

      <div>
        <h4 className="text-sm font-medium leading-snug text-gray-900 dark:text-gray-100">{ticket.subject}</h4>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{ticket.body}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {ticket.category && <Badge tone="gray" label={ticket.category} />}
        {ticket.sentiment && <Badge value={ticket.sentiment} />}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3 dark:border-gray-800">
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
