/**
 * Google Gemini integration.
 *
 * `analyzeWithGemini` returns a structured triage object, or null if Gemini is
 * not configured / the call fails — callers then fall back to the local
 * heuristic engine in triage.js, so the system never hard-fails.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-1.5-flash';

export function isGeminiConfigured() {
  return Boolean(API_KEY);
}

const CATEGORIES = [
  'Billing',
  'Technical',
  'Account',
  'Bug',
  'Feature Request',
  'Refund',
  'General',
];

function buildPrompt({ subject, body }) {
  return `You are an expert support triage engine. Analyse the ticket and reply with STRICT JSON only (no markdown, no prose).

Categories: ${CATEGORIES.join(', ')}
Priorities: low, medium, high, urgent
Sentiments: positive, neutral, negative, frustrated

Return exactly:
{
  "category": "<one category>",
  "priority": "<one priority>",
  "sentiment": "<one sentiment>",
  "confidence": <number 0..1, how confident an automated reply would fully resolve this>,
  "summary": "<one-sentence summary>",
  "suggested_reply": "<a warm, helpful, ready-to-send reply addressing the customer by name if known>"
}

Ticket subject: "${subject}"
Ticket body: "${body}"`;
}

function extractJson(text) {
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
}

export async function analyzeWithGemini({ subject, body }) {
  if (!API_KEY) return null;
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: MODEL,
      generationConfig: { temperature: 0.4, responseMimeType: 'application/json' },
    });
    const result = await model.generateContent(buildPrompt({ subject, body }));
    const parsed = extractJson(result.response.text());
    if (!parsed) return null;

    return {
      category: CATEGORIES.includes(parsed.category) ? parsed.category : 'General',
      priority: ['low', 'medium', 'high', 'urgent'].includes(parsed.priority)
        ? parsed.priority
        : 'medium',
      sentiment: ['positive', 'neutral', 'negative', 'frustrated'].includes(parsed.sentiment)
        ? parsed.sentiment
        : 'neutral',
      confidence: Math.max(0, Math.min(1, Number(parsed.confidence) || 0.5)),
      summary: parsed.summary || '',
      suggested_reply: parsed.suggested_reply || '',
      engine: 'gemini',
    };
  } catch (err) {
    console.warn('[ai] Gemini analysis failed, falling back to heuristic:', err.message);
    return null;
  }
}

export { CATEGORIES };
