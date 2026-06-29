'use client';

import { useEffect, useState } from 'react';
import {
  Check,
  Gauge,
  Zap,
  Frown,
  MessageSquare,
  Clock,
  Tags,
  Sparkles,
  Plus,
  Save,
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Field, Toggle, Slider, Input } from '@/components/ui/Field';
import TriagePlayground from '@/components/tickets/TriagePlayground';
import { useToast } from '@/components/ui/Toast';
import { useTickets } from '@/components/tickets/TicketsProvider';

const ALL_CATEGORIES = ['Account', 'Billing', 'Technical', 'Bug', 'Feature Request', 'Refund', 'General'];

export default function SettingsPage() {
  const { rules, saveRules } = useTickets();
  const toast = useToast();
  const [draft, setDraft] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (rules) setDraft(rules);
  }, [rules]);

  if (!draft) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <SlidersLoading />
      </div>
    );
  }

  const set = (patch) => {
    setDraft((d) => ({ ...d, ...patch }));
    setSaved(false);
  };

  const toggleCategory = (cat) => {
    const list = draft.autoResolveCategories || [];
    set({ autoResolveCategories: list.includes(cat) ? list.filter((c) => c !== cat) : [...list, cat] });
  };

  const save = async () => {
    setSaving(true);
    await saveRules(draft);
    setSaving(false);
    setSaved(true);
    toast.success('Rules saved', 'New triage applies to all incoming tickets');
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">Automation engine</span>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">AI Escalation Rules</h1>
          <p className="mt-1 max-w-[640px] text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Tune how aggressively the AI auto-resolves tickets versus routing them to a human agent. Changes apply instantly.
          </p>
        </div>
        <Button variant={saved ? 'success' : 'primary'} icon={saved ? Check : Save} loading={saving} onClick={save}>
          {saved ? 'Saved' : 'Save rules'}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 max-[860px]:grid-cols-1">
        <GlassCard className="col-span-2 p-6 max-[860px]:col-span-1">
          <CardHeader Icon={Gauge} title="Confidence threshold" subtitle="Tickets below this AI confidence are escalated to a human instead of auto-resolved." />
          <div className="mt-4">
            <Slider
              value={draft.confidenceThreshold}
              min={0.3}
              max={0.95}
              step={0.01}
              onChange={(v) => set({ confidenceThreshold: v })}
              format={(v) => `${Math.round(v * 100)}%`}
            />
            <div className="mt-3 flex justify-between text-xs text-gray-400 dark:text-gray-500">
              <span>More automation</span>
              <span>Safer / more human review</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <CardHeader Icon={Zap} title="Escalation triggers" />
          <div className="mt-4 flex flex-col gap-2.5">
            <Toggle icon={Zap} label="Always escalate urgent" description="Urgent-priority tickets go straight to a human." checked={draft.urgentAlwaysEscalate} onChange={(v) => set({ urgentAlwaysEscalate: v })} />
            <Toggle icon={Frown} label="Escalate frustrated customers" description="Detected frustration routes to a human agent." checked={draft.escalateOnFrustrated} onChange={(v) => set({ escalateOnFrustrated: v })} />
            <Toggle icon={MessageSquare} label="Send AI auto-replies" description="Auto-resolved tickets get an instant AI reply." checked={draft.autoReplyEnabled} onChange={(v) => set({ autoReplyEnabled: v })} />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <CardHeader Icon={Clock} title="SLA target" subtitle="Target resolution window for escalated tickets." />
          <div className="mt-4">
            <Field label="Hours">
              <Input icon={Clock} type="number" min={1} value={draft.slaHours} onChange={(e) => set({ slaHours: Number(e.target.value) })} />
            </Field>
          </div>
        </GlassCard>

        <GlassCard className="col-span-2 p-6 max-[860px]:col-span-1">
          <CardHeader Icon={Tags} title="Auto-resolvable categories" subtitle="Only tickets in these categories are eligible for AI auto-resolution. Everything else is escalated." />
          <div className="mt-4 flex flex-wrap gap-2.5">
            {ALL_CATEGORIES.map((cat) => {
              const on = draft.autoResolveCategories?.includes(cat);
              return (
                <button
                  key={cat}
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-150 active:scale-95 ${
                    on
                      ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-gray-600'
                  }`}
                  onClick={() => toggleCategory(cat)}
                >
                  {on ? <Check size={14} strokeWidth={2} /> : <Plus size={14} strokeWidth={1.5} />}
                  {cat}
                </button>
              );
            })}
          </div>
        </GlassCard>
      </div>

      <GlassCard glow className="mt-4 p-6">
        <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
          <Sparkles size={13} strokeWidth={1.5} />
          Live rule summary
        </span>
        <p className="mt-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          The AI will <strong className="font-semibold text-gray-900 dark:text-gray-100">auto-resolve</strong> tickets in{' '}
          {draft.autoResolveCategories?.length ? (
            draft.autoResolveCategories.map((c) => <Badge key={c} tone="blue" label={c} className="mx-0.5 align-middle" />)
          ) : (
            <span className="italic">no categories</span>
          )}{' '}
          when confidence is at least{' '}
          <strong className="font-semibold text-blue-600 dark:text-blue-400">{Math.round(draft.confidenceThreshold * 100)}%</strong>.
          {draft.urgentAlwaysEscalate && ' Urgent tickets always escalate.'}
          {draft.escalateOnFrustrated && ' Frustrated customers always escalate.'}
        </p>
      </GlassCard>

      <GlassCard className="mt-4 p-6">
        <CardHeader Icon={Sparkles} title="AI Triage Playground" subtitle="Paste a customer message and see how the AI classifies sentiment, category and priority — then decides to auto-resolve or escalate. Uses your current rules." />
        <div className="mt-5">
          <TriagePlayground />
        </div>
      </GlassCard>
    </>
  );
}

function CardHeader({ Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
        <Icon size={18} strokeWidth={1.5} />
      </span>
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
        {subtitle && <p className="mt-0.5 max-w-[620px] text-sm leading-relaxed text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
}

function SlidersLoading() {
  return <span className="text-sm text-gray-500 dark:text-gray-400">Loading rules…</span>;
}
