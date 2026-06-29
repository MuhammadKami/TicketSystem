import { NextResponse } from 'next/server';
import { getRules, updateRules } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const rules = await getRules();
  return NextResponse.json({ rules });
}

export async function PATCH(req) {
  try {
    const patch = await req.json();
    const clean = {};
    if ('confidenceThreshold' in patch)
      clean.confidenceThreshold = Math.max(0, Math.min(1, Number(patch.confidenceThreshold)));
    if ('escalateOnFrustrated' in patch)
      clean.escalateOnFrustrated = Boolean(patch.escalateOnFrustrated);
    if ('urgentAlwaysEscalate' in patch)
      clean.urgentAlwaysEscalate = Boolean(patch.urgentAlwaysEscalate);
    if ('autoReplyEnabled' in patch) clean.autoReplyEnabled = Boolean(patch.autoReplyEnabled);
    if ('slaHours' in patch) clean.slaHours = Math.max(1, Number(patch.slaHours));
    if (Array.isArray(patch.autoResolveCategories))
      clean.autoResolveCategories = patch.autoResolveCategories;

    const rules = await updateRules(clean);
    return NextResponse.json({ rules });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
