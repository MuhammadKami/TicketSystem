/**
 * In-memory data store used as a graceful fallback when Supabase is not
 * configured. Survives Hot-Module-Reload via a global handle so tickets you
 * create during `npm run dev` don't vanish on every save.
 *
 * The shape here mirrors the Supabase `tickets` / `rules` tables (see
 * supabase/schema.sql) so swapping to the real DB is a drop-in change.
 */

import { randomUUID } from 'crypto';

const SAMPLE_TICKETS = [
  {
    subject: 'How do I reset my password?',
    body: "Hi, I can't remember my password and the reset email never arrives. Can you help me log back in?",
    customer_name: 'Aisha Khan',
    customer_email: 'aisha@example.com',
    channel: 'email',
    category: 'Account',
    priority: 'low',
    sentiment: 'neutral',
    confidence: 0.94,
    status: 'auto_resolved',
    resolution: 'auto',
    escalated: false,
    ai_reply:
      "Hi Aisha! You can reset your password from the login page via 'Forgot password'. Reset emails can take up to 5 minutes and sometimes land in spam. I've also re-triggered the email to your address — let me know if it still doesn't arrive.",
  },
  {
    subject: 'I was charged twice this month!',
    body: "This is unacceptable. My card got billed TWICE for the Pro plan and I want a refund immediately. I've been a customer for 3 years.",
    customer_name: 'Marcus Reid',
    customer_email: 'marcus@example.com',
    channel: 'web',
    category: 'Billing',
    priority: 'urgent',
    sentiment: 'frustrated',
    confidence: 0.71,
    status: 'escalated',
    resolution: null,
    escalated: true,
    escalation_reason: 'Frustrated sentiment + billing dispute over refund',
    ai_reply: null,
  },
  {
    subject: 'Dark mode would be amazing',
    body: 'Love the product! Any chance you could add a dark theme to the mobile app? My eyes would thank you.',
    customer_name: 'Lena Park',
    customer_email: 'lena@example.com',
    channel: 'chat',
    category: 'Feature Request',
    priority: 'low',
    sentiment: 'positive',
    confidence: 0.88,
    status: 'auto_resolved',
    resolution: 'auto',
    escalated: false,
    ai_reply:
      "Thanks so much for the kind words, Lena! Dark mode is on our roadmap and I've added your vote to the feature request. I'll make sure you're notified the moment it ships. 🌙",
  },
  {
    subject: 'App crashes on upload',
    body: 'Every time I try to upload a PDF larger than 10MB the app freezes and then crashes. Using v3.2 on Windows.',
    customer_name: 'David Osei',
    customer_email: 'david@example.com',
    channel: 'email',
    category: 'Bug',
    priority: 'high',
    sentiment: 'negative',
    confidence: 0.62,
    status: 'escalated',
    resolution: null,
    escalated: true,
    escalation_reason: 'Confidence below threshold for a high-priority bug report',
    ai_reply: null,
  },
  {
    subject: 'Where can I download my invoice?',
    body: 'Need a copy of last month invoice for my accountant. Where do I find it?',
    customer_name: 'Sofia Marino',
    customer_email: 'sofia@example.com',
    channel: 'web',
    category: 'Billing',
    priority: 'low',
    sentiment: 'neutral',
    confidence: 0.91,
    status: 'auto_resolved',
    resolution: 'auto',
    escalated: false,
    ai_reply:
      'Hi Sofia! You can download any invoice from Settings → Billing → Invoices. Click the PDF icon next to the month you need. Let me know if you want me to email it directly!',
  },
  {
    subject: 'Integration with Slack not working',
    body: "Connected our Slack workspace but notifications aren't coming through to the channel. Tried reconnecting twice.",
    customer_name: 'Tom Becker',
    customer_email: 'tom@example.com',
    channel: 'chat',
    category: 'Technical',
    priority: 'medium',
    sentiment: 'neutral',
    confidence: 0.58,
    status: 'new',
    resolution: null,
    escalated: false,
    ai_reply: null,
  },
];

const DEFAULT_RULES = {
  confidenceThreshold: 0.75,
  escalateOnFrustrated: true,
  urgentAlwaysEscalate: true,
  autoResolveCategories: ['Account', 'Billing', 'Feature Request', 'General'],
  autoReplyEnabled: true,
  slaHours: 24,
};

function seed() {
  const now = Date.now();
  return SAMPLE_TICKETS.map((t, i) => {
    const created = new Date(now - (i + 1) * 1000 * 60 * 47);
    return {
      id: randomUUID(),
      ...t,
      escalation_reason: t.escalation_reason || null,
      created_at: created.toISOString(),
      updated_at: created.toISOString(),
    };
  });
}

function getGlobalStore() {
  if (!globalThis.__triageStore) {
    globalThis.__triageStore = {
      tickets: seed(),
      rules: { ...DEFAULT_RULES },
    };
  }
  return globalThis.__triageStore;
}

export const memoryStore = {
  listTickets() {
    return [...getGlobalStore().tickets].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  },
  getTicket(id) {
    return getGlobalStore().tickets.find((t) => t.id === id) || null;
  },
  createTicket(data) {
    const now = new Date().toISOString();
    const ticket = {
      id: randomUUID(),
      status: 'new',
      resolution: null,
      escalated: false,
      escalation_reason: null,
      ai_reply: null,
      created_at: now,
      updated_at: now,
      ...data,
    };
    getGlobalStore().tickets.unshift(ticket);
    return ticket;
  },
  updateTicket(id, patch) {
    const store = getGlobalStore();
    const idx = store.tickets.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    store.tickets[idx] = {
      ...store.tickets[idx],
      ...patch,
      updated_at: new Date().toISOString(),
    };
    return store.tickets[idx];
  },
  deleteTicket(id) {
    const store = getGlobalStore();
    const before = store.tickets.length;
    store.tickets = store.tickets.filter((t) => t.id !== id);
    return store.tickets.length < before;
  },
  getRules() {
    return { ...getGlobalStore().rules };
  },
  updateRules(patch) {
    const store = getGlobalStore();
    store.rules = { ...store.rules, ...patch };
    return { ...store.rules };
  },
};

export { DEFAULT_RULES };
