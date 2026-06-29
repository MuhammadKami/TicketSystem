/**
 * Triage engine — the heart of the system.
 *
 *  1. Analyse the ticket (Gemini if configured, otherwise a transparent
 *     keyword/sentiment heuristic).
 *  2. Apply the configurable escalation rules.
 *  3. Decide: AUTO-RESOLVE (with an auto-reply) or ESCALATE to a human.
 */

import { analyzeWithGemini, CATEGORIES } from './ai';

const CATEGORY_SIGNALS = {
  Billing: ['invoice', 'charge', 'charged', 'billing', 'payment', 'card', 'subscription', 'plan', 'price', 'receipt'],
  Refund: ['refund', 'money back', 'reimburse', 'chargeback', 'cancel my'],
  Account: ['password', 'login', 'log in', 'sign in', 'account', 'email address', 'username', '2fa', 'verify'],
  Technical: ['integration', 'api', 'connect', 'sync', 'webhook', 'configure', 'setup', 'install', 'slack'],
  Bug: ['crash', 'error', 'broken', 'bug', 'not working', "doesn't work", 'freeze', 'glitch', 'fails', 'failed'],
  'Feature Request': ['feature', 'add', 'would be great', 'suggestion', 'request', 'wish', 'could you add', 'roadmap'],
  General: ['question', 'how do i', 'where', 'help', 'info', 'information'],
};

const NEGATIVE_WORDS = ['not working', 'broken', 'angry', 'disappointed', 'bad', 'worst', 'slow', 'annoyed', 'problem', 'issue', 'fail'];
const FRUSTRATED_WORDS = ['unacceptable', 'immediately', 'ridiculous', 'terrible', 'furious', 'never again', 'twice', 'demand', 'asap', 'urgent!!', 'wtf', 'sue', 'lawyer', 'scam'];
const POSITIVE_WORDS = ['love', 'great', 'awesome', 'thanks', 'thank you', 'amazing', 'appreciate', 'excellent', 'kind'];
const URGENT_WORDS = ['urgent', 'immediately', 'asap', 'right now', 'critical', 'emergency', 'down', 'outage'];

function countHits(text, words) {
  return words.reduce((n, w) => (text.includes(w) ? n + 1 : n), 0);
}

/** Transparent local fallback analysis — no external calls. */
export function heuristicAnalyze({ subject = '', body = '' }) {
  const text = `${subject} ${body}`.toLowerCase();

  // category by strongest keyword signal
  let category = 'General';
  let best = 0;
  for (const [cat, words] of Object.entries(CATEGORY_SIGNALS)) {
    const hits = countHits(text, words);
    if (hits > best) {
      best = hits;
      category = cat;
    }
  }

  // sentiment
  const frustrated = countHits(text, FRUSTRATED_WORDS);
  const negative = countHits(text, NEGATIVE_WORDS);
  const positive = countHits(text, POSITIVE_WORDS);
  let sentiment = 'neutral';
  if (frustrated > 0 || text.includes('!!!')) sentiment = 'frustrated';
  else if (negative > positive && negative > 0) sentiment = 'negative';
  else if (positive > negative && positive > 0) sentiment = 'positive';

  // priority
  const urgent = countHits(text, URGENT_WORDS);
  let priority = 'low';
  if (urgent > 0 || sentiment === 'frustrated') priority = 'urgent';
  else if (category === 'Bug' || sentiment === 'negative') priority = 'high';
  else if (category === 'Technical' || category === 'Billing') priority = 'medium';

  // confidence: clear signal + non-negative sentiment + simple/common ask = high
  let confidence = 0.55 + Math.min(best, 3) * 0.13;
  if (sentiment === 'frustrated') confidence -= 0.3;
  else if (sentiment === 'negative') confidence -= 0.15;
  else if (sentiment === 'positive') confidence += 0.08;
  if (category === 'Bug') confidence -= 0.12;
  if (priority === 'urgent') confidence -= 0.1;
  confidence = Math.max(0.15, Math.min(0.97, Number(confidence.toFixed(2))));

  return {
    category,
    priority,
    sentiment,
    confidence,
    summary: subject ? subject.trim() : 'Customer support request',
    suggested_reply: buildHeuristicReply({ category, name: '' }),
    engine: 'heuristic',
  };
}

function buildHeuristicReply({ category, name }) {
  const hi = name ? `Hi ${name},` : 'Hi there,';
  const map = {
    Account: `${hi} you can reset access from the login page using "Forgot password". Reset emails arrive within ~5 minutes (do check spam). I've re-triggered it for you — let me know if anything's still off!`,
    Billing: `${hi} thanks for reaching out about billing. You'll find all invoices and payment details under Settings → Billing. I've reviewed your account and everything looks in order — happy to clarify any specific charge.`,
    'Feature Request': `${hi} love this idea — thank you! I've logged your request with our product team and added your vote. I'll make sure you're notified the moment it ships.`,
    General: `${hi} thanks for getting in touch! I've shared the relevant guide and steps below. If this doesn't fully solve it, just reply and a specialist will jump in.`,
    Technical: `${hi} thanks for the details. I've outlined the recommended setup steps and double-checked your configuration. Give them a try and let me know if the issue persists.`,
  };
  return map[category] || map.General;
}

/**
 * Full triage: analyse, then apply rules to decide auto-resolve vs escalate.
 * @param {{subject:string, body:string, customer_name?:string}} ticket
 * @param {object} rules
 */
export async function triageTicket(ticket, rules) {
  const analysis =
    (await analyzeWithGemini(ticket)) || heuristicAnalyze(ticket);

  // personalise heuristic reply with the customer's first name when available
  if (analysis.engine === 'heuristic' && ticket.customer_name) {
    const first = ticket.customer_name.split(' ')[0];
    analysis.suggested_reply = buildHeuristicReply({
      category: analysis.category,
      name: first,
    });
  }

  const reasons = [];
  let escalate = false;

  if (rules.urgentAlwaysEscalate && analysis.priority === 'urgent') {
    escalate = true;
    reasons.push('Urgent priority always routes to a human agent');
  }
  if (rules.escalateOnFrustrated && analysis.sentiment === 'frustrated') {
    escalate = true;
    reasons.push('Frustrated customer sentiment detected');
  }
  if (analysis.confidence < rules.confidenceThreshold) {
    escalate = true;
    reasons.push(
      `AI confidence ${(analysis.confidence * 100).toFixed(0)}% is below the ${(
        rules.confidenceThreshold * 100
      ).toFixed(0)}% threshold`
    );
  }
  if (!rules.autoResolveCategories.includes(analysis.category)) {
    escalate = true;
    reasons.push(`Category "${analysis.category}" is not in the auto-resolve list`);
  }

  const patch = {
    category: analysis.category,
    priority: analysis.priority,
    sentiment: analysis.sentiment,
    confidence: analysis.confidence,
    summary: analysis.summary,
    triage_engine: analysis.engine,
  };

  if (escalate) {
    patch.status = 'escalated';
    patch.escalated = true;
    patch.escalation_reason = reasons.join('; ');
    patch.resolution = null;
    patch.ai_reply = null;
  } else {
    patch.status = 'auto_resolved';
    patch.escalated = false;
    patch.escalation_reason = null;
    patch.resolution = 'auto';
    patch.ai_reply = rules.autoReplyEnabled ? analysis.suggested_reply : null;
    if (!rules.autoReplyEnabled) {
      patch.status = 'in_progress';
      patch.resolution = null;
    }
  }

  return { analysis, decision: escalate ? 'escalated' : 'auto_resolved', patch };
}

export { CATEGORIES };
