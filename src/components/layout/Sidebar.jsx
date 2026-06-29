'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  SlidersHorizontal,
  LifeBuoy,
  Cpu,
  Database,
  Activity,
} from 'lucide-react';
import { useTickets } from '@/components/tickets/TicketsProvider';
import ThemeToggle from '@/components/ui/ThemeToggle';

const NAV = [
  { href: '/dashboard', label: 'Overview', Icon: LayoutDashboard },
  { href: '/dashboard/tickets', label: 'Tickets', Icon: Inbox },
  { href: '/dashboard/settings', label: 'AI Rules', Icon: SlidersHorizontal },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { tickets, status, realtime } = useTickets();

  const escalated = tickets.filter((t) => t.status === 'escalated').length;
  const counts = { '/dashboard/tickets': escalated };

  return (
    <aside className="sticky top-0 z-20 flex h-screen w-64 shrink-0 flex-col border-r border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 max-md:fixed max-md:bottom-0 max-md:top-auto max-md:h-auto max-md:w-full max-md:flex-row max-md:items-center max-md:border-r-0 max-md:border-t max-md:p-2.5">
      <Link
        href="/"
        className="mb-6 flex items-center gap-2.5 px-2 py-1 max-md:hidden"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <LifeBuoy size={20} strokeWidth={1.5} />
        </span>
        <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          TriageAI
        </span>
      </Link>

      <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500 max-md:hidden">
        Menu
      </p>
      <nav className="flex flex-col gap-1 max-md:w-full max-md:flex-row max-md:justify-around">
        {NAV.map(({ href, label, Icon }) => {
          const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
              }`}
            >
              <Icon size={20} strokeWidth={1.5} />
              <span className="max-md:hidden">{label}</span>
              {counts[href] > 0 && (
                <span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-50 px-1.5 text-xs font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400 max-md:ml-1">
                  {counts[href]}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-3 max-md:hidden">
        <div className="flex flex-col gap-2.5 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950">
          <StatusRow Icon={Cpu} label="AI engine" value={status.ai === 'gemini' ? 'Gemini' : 'Heuristic'} on={status.ai === 'gemini'} />
          <StatusRow Icon={Database} label="Store" value={status.backend === 'supabase' ? 'Supabase' : 'In-memory'} on={status.backend === 'supabase'} />
          {realtime && (
            <StatusRow Icon={Activity} label="Sync" value="Live" on />
          )}
        </div>
        <ThemeToggle className="self-start" />
      </div>
    </aside>
  );
}

function StatusRow({ Icon, label, value, on }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
      <Icon size={14} strokeWidth={1.5} className={on ? 'text-green-600 dark:text-green-400' : 'text-gray-400'} />
      <span>{label}:</span>
      <span className="ml-auto font-medium text-gray-700 dark:text-gray-300">{value}</span>
    </div>
  );
}
