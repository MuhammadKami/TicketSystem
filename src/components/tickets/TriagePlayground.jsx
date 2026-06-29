'use client';

import { useState } from 'react';
import { Sparkles, User, Type, CheckCircle2, Zap, Cpu, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Field, Input, Textarea } from '@/components/ui/Field';

const PRESET = {
  customer_name: 'Jordan Webb',
  subject: 'Charged after I cancelled',
  body: "I cancelled last month and you billed me again. This is unacceptable — refund me immediately.",
};

export default function TriagePlayground() {
  const [form, setForm] = useState(PRESET);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const run = async () => {
    setError('');
    if (!form.subject.trim() || !form.body.trim()) {
      setError('Subject and message are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Triage failed');
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const isAuto = result?.decision === 'auto_resolved';
  const conf = result ? Math.round(result.analysis.confidence * 100) : 0;
  const barColor = conf >= 75 ? 'bg-green-500' : conf >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="grid grid-cols-2 gap-6 max-[860px]:grid-cols-1">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 max-[540px]:grid-cols-1">
          <Field label="Customer name">
            <Input icon={User} value={form.customer_name} onChange={set('customer_name')} placeholder="Jane Cooper" />
          </Field>
          <Field label="Subject">
            <Input icon={Type} value={form.subject} onChange={set('subject')} placeholder="Brief summary" />
          </Field>
        </div>
        <Field label="Message" error={error}>
          <Textarea
            value={form.body}
            onChange={set('body')}
            placeholder="Paste a customer message to see how the AI would triage it…"
          />
        </Field>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" loading={loading} onClick={run} icon={Sparkles}>
            {loading ? 'Analysing…' : 'Run AI triage'}
          </Button>
          <span className="text-xs text-gray-400 dark:text-gray-500">Dry run — nothing is saved</span>
        </div>
      </div>

      <div className="flex">
        {!result ? (
          <div className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 p-8 text-center dark:border-gray-700">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Sparkles size={24} strokeWidth={1.5} />
            </span>
            <p className="max-w-[280px] text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Run triage to see the AI breakdown — sentiment, category, confidence and decision.
            </p>
          </div>
        ) : (
          <div className="flex w-full animate-fade-up flex-col gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
            <div
              className={`flex items-center gap-3 rounded-lg border p-3 ${
                isAuto
                  ? 'border-green-100 bg-green-50 dark:border-green-500/20 dark:bg-green-500/10'
                  : 'border-amber-100 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10'
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white ${
                  isAuto ? 'bg-green-600' : 'bg-amber-500'
                }`}
              >
                {isAuto ? <CheckCircle2 size={18} strokeWidth={1.5} /> : <Zap size={18} strokeWidth={1.5} />}
              </span>
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {isAuto ? 'Auto-resolve' : 'Escalate to human'}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <Cpu size={12} strokeWidth={1.5} />
                  {result.analysis.engine === 'gemini' ? 'Google Gemini' : 'Heuristic engine'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <Metric label="Category"><Badge tone="gray" label={result.analysis.category} /></Metric>
              <Metric label="Priority"><Badge value={result.analysis.priority} /></Metric>
              <Metric label="Sentiment"><Badge value={result.analysis.sentiment} /></Metric>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span>Confidence</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                <span className={`block h-full rounded-full transition-[width] duration-500 ${barColor}`} style={{ width: `${conf}%` }} />
              </div>
              <strong className="tabular-nums text-gray-900 dark:text-gray-100">{conf}%</strong>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
              <span className={`mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide ${isAuto ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {isAuto ? <Sparkles size={13} strokeWidth={1.5} /> : <AlertCircle size={13} strokeWidth={1.5} />}
                {isAuto ? 'Suggested auto-reply' : 'Why escalate'}
              </span>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {isAuto
                  ? result.patch.ai_reply || result.analysis.suggested_reply
                  : result.patch.escalation_reason}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">{label}</span>
      {children}
    </div>
  );
}
