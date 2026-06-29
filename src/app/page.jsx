'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  LifeBuoy,
  Brain,
  Zap,
  SlidersHorizontal,
  BarChart2,
  LayoutDashboard,
  Plug,
  ArrowRight,
  Menu,
  X,
  Check,
  Loader2,
  Sparkles,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';

const NAV = [
  { href: '#features', label: 'Features', Icon: Sparkles },
  { href: '#how', label: 'How it works', Icon: LayoutDashboard },
];

const FEATURES = [
  { Icon: Brain, title: 'AI auto-resolution', text: 'Gemini analyses every ticket, classifies it, and sends a warm, accurate reply — no agent needed for the easy 70%.' },
  { Icon: Zap, title: 'Smart escalation', text: 'Low confidence, frustrated sentiment or urgent priority? It instantly routes to a human with full context.' },
  { Icon: SlidersHorizontal, title: 'Tunable rules', text: 'Dial the confidence threshold and pick auto-resolvable categories. You own the automation/safety trade-off.' },
  { Icon: BarChart2, title: 'Sentiment & priority', text: 'Each ticket is scored for sentiment and urgency so your team always sees the most important issues first.' },
  { Icon: LayoutDashboard, title: 'Clean pipeline', text: 'Watch tickets flow from New → Auto-Resolved → Escalated → Resolved on a calm, focused board.' },
  { Icon: Plug, title: 'Runs anywhere', text: 'Works instantly in-memory, then scales to Supabase + Gemini with a couple of env vars. Deploy free on Vercel.' },
];

const STEPS = [
  { n: '01', title: 'Ticket arrives', text: 'From email, chat, web or phone — it lands in the queue.' },
  { n: '02', title: 'AI triages it', text: 'Category, priority, sentiment and a confidence score in milliseconds.' },
  { n: '03', title: 'Resolve or escalate', text: 'Confident? Auto-reply & close. Risky? Hand to a human with context.' },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3 max-md:px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <LifeBuoy size={18} strokeWidth={1.5} />
            </span>
            <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">TriageAI</span>
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            {NAV.map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
              >
                <Icon size={16} strokeWidth={1.5} />
                {label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link href="/dashboard" className="max-md:hidden">
              <Button as="span" variant="primary" size="md" iconRight={ArrowRight}>
                Open dashboard
              </Button>
            </Link>
            <button
              className="hidden h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-all duration-150 hover:bg-gray-100 active:scale-95 max-md:flex dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-gray-100 px-4 py-3 md:hidden dark:border-gray-800">
            <nav className="flex flex-col gap-1">
              {NAV.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <Icon size={18} strokeWidth={1.5} />
                  {label}
                </a>
              ))}
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                <Button as="span" variant="primary" size="md" className="mt-1 w-full" iconRight={ArrowRight}>
                  Open dashboard
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      <section
        className="relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=85')" }}
      >
        <div
          className="absolute inset-0 z-0"
          style={{ background: 'linear-gradient(135deg, rgba(23,37,84,0.94) 0%, rgba(30,64,175,0.88) 45%, rgba(37,99,235,0.80) 100%)' }}
        />
        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-16 pt-20 max-md:px-4 max-md:pt-12">
          <div className="grid grid-cols-[1.05fr_0.95fr] items-center gap-14 max-[940px]:grid-cols-1 max-[940px]:gap-10">
            <div className="flex animate-fade-up flex-col items-start">
              <h1 className="mb-5 text-[clamp(36px,6vw,58px)] font-bold leading-[1.05] tracking-tight text-white">
                Support tickets that
                <br />
                <span className="text-sky-300">triage themselves.</span>
              </h1>
              <p className="mb-8 max-w-[520px] text-base leading-relaxed text-gray-200">
                An AI support triage system that automatically sorts, auto-replies, and escalates the tickets
                that truly need a human — wrapped in a clean, modern dashboard.
              </p>
              <div className="mb-10 flex flex-wrap gap-3">
                <Link href="/dashboard">
                  <Button as="span" variant="primary" size="lg" icon={LayoutDashboard}>
                    Launch the dashboard
                  </Button>
                </Link>
                <a
                  href="#how"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition-all duration-150 hover:bg-white/10 active:scale-95"
                >
                  See how it works
                  <ArrowRight size={16} strokeWidth={1.5} />
                </a>
              </div>

              <div className="flex items-center gap-6">
                <Stat value="70%" label="auto-resolved" light />
                <span className="h-9 w-px bg-white/20" />
                <Stat value="<1s" label="time to triage" light />
                <span className="h-9 w-px bg-white/20" />
                <Stat value="$0" label="to get started" light />
              </div>
            </div>

            <div className="animate-scale-in">
              <MockDashboard />
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="relative bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80')" }}
      >
        <div className="absolute inset-0 z-0" style={{ background: 'rgba(255,255,255,0.90)' }} />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 max-md:px-4">
          <div className="mb-10 text-center">
            <span className="text-xs font-medium uppercase tracking-wide text-blue-600">Why TriageAI</span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
              Everything you need to deflect support load
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-4 max-[860px]:grid-cols-1">
            {FEATURES.map(({ Icon, title, text }) => (
              <div key={title} className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon size={20} strokeWidth={1.5} />
                </span>
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how"
        className="relative bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=80')" }}
      >
        <div className="absolute inset-0 z-0" style={{ background: 'rgba(17,24,39,0.85)' }} />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 max-md:px-4">
          <div className="mb-10 text-center">
            <span className="text-xs font-medium uppercase tracking-wide text-blue-400">The flow</span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              From inbox chaos to clean pipeline
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-4 max-[860px]:grid-cols-1">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-sm">
                <span className="text-3xl font-bold text-blue-400/50">{s.n}</span>
                <h3 className="mb-2 mt-3 text-lg font-medium text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed text-gray-300">{s.text}</p>
                {i < STEPS.length - 1 && (
                  <ArrowRight
                    size={20}
                    strokeWidth={1.5}
                    className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 text-white/30 max-[860px]:hidden"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 max-md:px-4">
        <div
          className="relative overflow-hidden rounded-2xl px-8 py-16 text-center shadow-sm"
          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 55%, #3b82f6 100%)' }}
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-sky-300/10 blur-2xl" />
          <div className="relative z-10 flex flex-col items-center">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
              <Sparkles size={24} strokeWidth={1.5} />
            </span>
            <h2 className="mb-3 text-3xl font-semibold tracking-tight text-white">
              Ready to let AI handle the busywork?
            </h2>
            <p className="mb-7 max-w-[560px] text-base text-blue-100">
              Open the live dashboard and submit a ticket — watch it get triaged in real time.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-blue-700 shadow-sm transition-all duration-150 hover:bg-blue-50 active:scale-95"
            >
              <LayoutDashboard size={16} strokeWidth={1.5} />
              Open the dashboard
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-9 dark:border-gray-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 text-sm text-gray-500 dark:text-gray-400 max-md:px-4">
          <span className="flex items-center gap-2">
            <LifeBuoy size={16} strokeWidth={1.5} className="text-blue-600 dark:text-blue-400" />
            TriageAI — built with Next.js · Supabase · Gemini
          </span>
          <span className="text-gray-400 dark:text-gray-500">A modern AI support triage demo</span>
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label, light = false }) {
  return (
    <div className="flex flex-col">
      <span className={`text-2xl font-bold tracking-tight ${light ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
        {value}
      </span>
      <span className={`text-xs ${light ? 'text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>{label}</span>
    </div>
  );
}

function MockDashboard() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-amber-400" />
        <span className="h-3 w-3 rounded-full bg-green-400" />
        <span className="ml-3 text-xs text-gray-400 dark:text-gray-500">triageai / dashboard</span>
      </div>
      <div className="flex flex-col gap-2.5 p-4">
        <MockRow color="text-green-600 dark:text-green-400" border="border-l-green-500" Icon={Check} subject="Where is my invoice?" meta="Auto-resolved · 94% confidence" tag="AI" />
        <MockRow color="text-red-600 dark:text-red-400" border="border-l-red-500" Icon={Zap} subject="Charged twice — refund now!" meta="Escalated · frustrated sentiment" tag="Human" />
        <MockRow color="text-green-600 dark:text-green-400" border="border-l-green-500" Icon={Check} subject="Add dark mode please" meta="Auto-resolved · feature logged" tag="AI" />
        <MockRow color="text-blue-600 dark:text-blue-400" border="border-l-blue-500" Icon={Loader2} subject="Slack integration not working" meta="Triaging…" tag="" spin />
      </div>
    </div>
  );
}

function MockRow({ color, border, Icon, subject, meta, tag, spin }) {
  return (
    <div className={`flex items-center gap-3 rounded-lg border border-l-2 border-gray-100 bg-gray-50 px-4 py-3 ${border} dark:border-gray-800 dark:bg-gray-950`}>
      <Icon size={16} strokeWidth={1.5} className={`shrink-0 ${color} ${spin ? 'animate-spin' : ''}`} />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{subject}</span>
        <span className="text-xs text-gray-400 dark:text-gray-500">{meta}</span>
      </div>
      {tag && <span className={`whitespace-nowrap text-xs font-semibold ${color}`}>{tag}</span>}
    </div>
  );
}
