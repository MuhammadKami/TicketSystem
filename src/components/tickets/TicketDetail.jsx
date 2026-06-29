'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Zap, Check, Trash2, Send, History, Sparkles, Cpu } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ChannelIcon from '@/components/ui/ChannelIcon';
import { useToast } from '@/components/ui/Toast';
import { useTickets } from './TicketsProvider';
import { timeAgo, initials, avatarColor } from '@/lib/format';

const statusDot = (status) =>
  status === 'auto_resolved' || status === 'resolved'
    ? 'bg-green-500'
    : status === 'escalated'
    ? 'bg-red-500'
    : 'bg-blue-500';

export default function TicketDetail({ ticket, open, onClose, onSelect }) {
  const { tickets, retriage, updateTicket, deleteTicket } = useTickets();
  const toast = useToast();
  const [busy, setBusy] = useState('');
  const [reply, setReply] = useState('');
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    setReply(ticket?.ai_reply || '');
  }, [ticket]);

  if (!ticket) return null;

  const confidence = Math.round((ticket.confidence || 0) * 100);
  const barColor = confidence >= 75 ? 'bg-green-500' : confidence >= 50 ? 'bg-amber-500' : 'bg-red-500';

  const history = tickets
    .filter((t) => {
      if (t.id === ticket.id) return false;
      if (ticket.customer_email) return t.customer_email === ticket.customer_email;
      return t.customer_name && t.customer_name === ticket.customer_name;
    })
    .slice(0, 6);

  const celebrateAndClose = () => {
    setCelebrate(true);
    setTimeout(() => {
      setCelebrate(false);
      onClose();
    }, 1050);
  };

  const doRetriage = async () => {
    setBusy('retriage');
    try {
      const { decision, analysis } = await retriage(ticket.id);
      if (decision === 'auto_resolved') {
        toast.ai('Re-triaged: auto-resolved', `${Math.round(analysis.confidence * 100)}% confidence`);
      } else {
        toast.escalate('Re-triaged: escalated', 'Routed to a human agent');
      }
    } catch (e) {
      toast.error('Re-triage failed', e.message);
    }
    setBusy('');
  };
  const markResolved = async () => {
    setBusy('resolve');
    await updateTicket(ticket.id, { status: 'resolved', resolution: 'human' });
    setBusy('');
    toast.success('Ticket resolved', `“${ticket.subject}” marked resolved`);
    celebrateAndClose();
  };
  const escalate = async () => {
    setBusy('escalate');
    await updateTicket(ticket.id, {
      status: 'escalated',
      escalated: true,
      escalation_reason: 'Manually escalated by agent',
    });
    setBusy('');
    toast.escalate('Escalated to agent', 'A human will take it from here');
  };
  const remove = async () => {
    setBusy('delete');
    await deleteTicket(ticket.id);
    setBusy('');
    toast.info('Ticket deleted', `“${ticket.subject}” removed`);
    onClose();
  };
  const saveReply = async () => {
    if (!reply.trim()) {
      toast.error('Reply is empty', 'Write a message before sending');
      return;
    }
    setBusy('reply');
    await updateTicket(ticket.id, { ai_reply: reply, status: 'resolved', resolution: 'human' });
    setBusy('');
    toast.success('Reply sent', 'Customer notified & ticket resolved');
    celebrateAndClose();
  };

  return (
    <Modal open={open} onClose={onClose} width={680} title={ticket.subject}>
      {celebrate && (
        <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center gap-4 rounded-[inherit] bg-white/90 backdrop-blur-sm animate-fade-in dark:bg-gray-900/90">
          <svg viewBox="0 0 52 52" className="h-20 w-20">
            <circle cx="26" cy="26" r="24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="151" strokeDashoffset="151" className="animate-draw-circle" />
            <path fill="none" d="M14 27l8 8 16-16" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="48" strokeDashoffset="48" className="animate-draw-check" />
          </svg>
          <span className="text-lg font-semibold tracking-tight text-green-600 dark:text-green-400 animate-fade-up [animation-delay:0.55s]">
            Resolved
          </span>
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white"
            style={{ background: avatarColor(ticket.customer_name) }}
          >
            {initials(ticket.customer_name)}
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{ticket.customer_name || 'Anonymous'}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">{ticket.customer_email || 'no email'}</span>
          </div>
          <span className="flex items-center gap-1.5 whitespace-nowrap text-xs capitalize text-gray-400 dark:text-gray-500">
            <ChannelIcon channel={ticket.channel} size={13} />
            {ticket.channel} · {timeAgo(ticket.created_at)}
          </span>
        </div>

        <p className="rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-600 dark:bg-gray-950 dark:text-gray-400">
          {ticket.body}
        </p>

        <div className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              <Sparkles size={14} strokeWidth={1.5} className="text-blue-600 dark:text-blue-400" />
              AI Analysis
            </span>
            <Badge
              tone={ticket.triage_engine === 'gemini' ? 'blue' : 'gray'}
              icon={Cpu}
              label={ticket.triage_engine === 'gemini' ? 'Gemini' : 'Heuristic'}
            />
          </div>
          <div className="grid grid-cols-4 gap-3 max-sm:grid-cols-2">
            <Meta label="Status"><Badge value={ticket.status} dot /></Meta>
            <Meta label="Priority"><Badge value={ticket.priority} /></Meta>
            <Meta label="Category"><Badge tone="gray" label={ticket.category || '—'} /></Meta>
            <Meta label="Sentiment"><Badge value={ticket.sentiment} /></Meta>
          </div>
          <div className="flex items-center gap-3">
            <span className="whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">Resolution confidence</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <span className={`block h-full rounded-full ${barColor}`} style={{ width: `${confidence}%` }} />
            </div>
            <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">{confidence}%</span>
          </div>
          {ticket.escalation_reason && (
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              <span className="font-medium text-red-600 dark:text-red-400">Escalation reason: </span>
              {ticket.escalation_reason}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              <History size={14} strokeWidth={1.5} />
              Customer history
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {history.length} previous {history.length === 1 ? 'ticket' : 'tickets'}
            </span>
          </div>
          {history.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
              First time this customer has reached out.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {history.map((h) => (
                <button
                  key={h.id}
                  onClick={() => onSelect?.(h)}
                  disabled={!onSelect}
                  className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3 text-left transition-all duration-150 enabled:hover:bg-gray-50 disabled:cursor-default dark:border-gray-800 dark:bg-gray-900 dark:enabled:hover:bg-gray-800/60"
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${statusDot(h.status)}`} />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{h.subject}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{timeAgo(h.created_at)}</span>
                  </span>
                  <Badge value={h.status} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {ticket.resolution === 'auto' ? 'AI auto-reply' : 'Agent reply'}
          </span>
          <Textarea value={reply} onChange={(e) => setReply(e.target.value)} />
          <div className="flex justify-end">
            <Button size="sm" variant="success" icon={Send} loading={busy === 'reply'} onClick={saveReply}>
              Send & resolve
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
          <Button size="sm" variant="secondary" icon={RefreshCw} loading={busy === 'retriage'} onClick={doRetriage}>
            Re-run triage
          </Button>
          {ticket.status !== 'escalated' && (
            <Button size="sm" variant="secondary" icon={Zap} loading={busy === 'escalate'} onClick={escalate}>
              Escalate
            </Button>
          )}
          {ticket.status !== 'resolved' && (
            <Button size="sm" variant="success" icon={Check} loading={busy === 'resolve'} onClick={markResolved}>
              Mark resolved
            </Button>
          )}
          <Button size="sm" variant="danger" icon={Trash2} loading={busy === 'delete'} onClick={remove}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function Meta({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">{label}</span>
      {children}
    </div>
  );
}

function Textarea(props) {
  return (
    <textarea
      className="input min-h-[110px] resize-y leading-relaxed"
      placeholder="Compose a reply to the customer…"
      {...props}
    />
  );
}
