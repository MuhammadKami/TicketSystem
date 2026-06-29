'use client';

import { useState } from 'react';
import { Plus, User, Mail, Type, Sparkles, CheckCircle2, Zap, Cpu } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Field, Input, Textarea, Select } from '@/components/ui/Field';
import { useToast } from '@/components/ui/Toast';
import { useTickets } from './TicketsProvider';

const EMPTY = {
  customer_name: '',
  customer_email: '',
  channel: 'web',
  subject: '',
  body: '',
};

const SAMPLES = [
  {
    label: 'Refund (angry)',
    data: {
      customer_name: 'Jordan Webb',
      subject: 'Charged after I cancelled — refund now',
      body: "This is unacceptable. I cancelled last month and you billed me AGAIN. I demand a refund immediately or I'm disputing with my bank.",
    },
  },
  {
    label: 'Password help',
    data: {
      customer_name: 'Priya Nair',
      subject: 'Forgot my password',
      body: "Hi, I can't log in and the reset email isn't coming through. Could you help me get back into my account?",
    },
  },
  {
    label: 'Feature idea',
    data: {
      customer_name: 'Sam Lee',
      subject: 'Please add CSV export',
      body: 'Loving the app! It would be great if I could export my reports to CSV. Any plans for that?',
    },
  },
];

export default function NewTicketModal({ open, onClose }) {
  const { createTicket } = useTickets();
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const loadSample = (data) => {
    setForm({ ...EMPTY, channel: 'web', ...data });
    setResult(null);
    setError('');
  };

  const submit = async () => {
    setError('');
    if (!form.subject.trim() || !form.body.trim()) {
      setError('Subject and message are required.');
      return;
    }
    setSubmitting(true);
    try {
      const data = await createTicket(form);
      setResult(data);
      const conf = Math.round((data.analysis?.confidence || 0) * 100);
      if (data.decision === 'auto_resolved') {
        toast.ai('AI auto-resolved', `${data.analysis.category} · ${conf}% confidence`);
      } else {
        toast.escalate('Escalated to a human', data.analysis?.category || 'Needs review');
      }
    } catch (err) {
      setError(err.message);
      toast.error('Triage failed', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => {
    setForm(EMPTY);
    setResult(null);
    setError('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      icon={result ? Sparkles : Plus}
      title={result ? 'Triage complete' : 'New support ticket'}
      subtitle={
        result
          ? 'The AI engine analysed and routed this ticket instantly.'
          : 'Submit a ticket and watch the AI triage it in real time.'
      }
      width={620}
      footer={
        result ? (
          <>
            <Button variant="ghost" icon={Plus} onClick={() => { setResult(null); setForm(EMPTY); }}>
              Submit another
            </Button>
            <Button variant="primary" icon={CheckCircle2} onClick={close}>
              Done
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button variant="primary" icon={Sparkles} loading={submitting} onClick={submit}>
              {submitting ? 'Triaging…' : 'Submit & triage'}
            </Button>
          </>
        )
      }
    >
      {result ? (
        <TriageResult result={result} />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Quick fill
            </span>
            {SAMPLES.map((s) => (
              <button
                key={s.label}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 transition-all duration-150 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 active:scale-95 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                onClick={() => loadSample(s.data)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 max-[540px]:grid-cols-1">
            <Field label="Customer name">
              <Input icon={User} placeholder="Jane Cooper" value={form.customer_name} onChange={set('customer_name')} />
            </Field>
            <Field label="Email">
              <Input icon={Mail} placeholder="jane@company.com" value={form.customer_email} onChange={set('customer_email')} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4 max-[540px]:grid-cols-1">
            <Field label="Subject">
              <Input icon={Type} placeholder="Brief summary" value={form.subject} onChange={set('subject')} error={!!error && !form.subject.trim()} />
            </Field>
            <Field label="Channel">
              <Select value={form.channel} onChange={set('channel')}>
                <option value="web">Web form</option>
                <option value="email">Email</option>
                <option value="chat">Live chat</option>
                <option value="phone">Phone</option>
              </Select>
            </Field>
          </div>

          <Field label="Message" error={error && !form.body.trim() ? error : ''}>
            <Textarea
              placeholder="Describe the issue the customer is facing…"
              value={form.body}
              onChange={set('body')}
            />
          </Field>
        </div>
      )}
    </Modal>
  );
}

function TriageResult({ result }) {
  const { ticket, analysis, decision } = result;
  const isAuto = decision === 'auto_resolved';
  return (
    <div className="flex animate-fade-up flex-col gap-4">
      <div
        className={`flex items-center gap-3 rounded-xl border p-4 ${
          isAuto
            ? 'border-green-100 bg-green-50 dark:border-green-500/20 dark:bg-green-500/10'
            : 'border-amber-100 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10'
        }`}
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white ${
            isAuto ? 'bg-green-600' : 'bg-amber-500'
          }`}
        >
          {isAuto ? <CheckCircle2 size={20} strokeWidth={1.5} /> : <Zap size={20} strokeWidth={1.5} />}
        </span>
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {isAuto ? 'Auto-resolved by AI' : 'Escalated to a human agent'}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Cpu size={12} strokeWidth={1.5} />
            {analysis.engine === 'gemini' ? 'Google Gemini' : 'Heuristic'} · {Math.round(analysis.confidence * 100)}% confidence
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge tone="gray" label={analysis.category} />
        <Badge value={analysis.priority} />
        <Badge value={analysis.sentiment} />
        <Badge value={ticket.status} dot />
      </div>

      {isAuto && ticket.ai_reply && (
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-green-600 dark:text-green-400">
            <Sparkles size={13} strokeWidth={1.5} />
            AI auto-reply sent to customer
          </div>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{ticket.ai_reply}</p>
        </div>
      )}

      {!isAuto && ticket.escalation_reason && (
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-amber-600 dark:text-amber-400">
            <Zap size={13} strokeWidth={1.5} />
            Why it was escalated
          </div>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{ticket.escalation_reason}</p>
        </div>
      )}
    </div>
  );
}
