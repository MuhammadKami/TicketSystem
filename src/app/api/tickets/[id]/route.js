import { NextResponse } from 'next/server';
import { getTicket, updateTicket, deleteTicket } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET(_req, { params }) {
  const ticket = await getTicket(params.id);
  if (!ticket) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ticket });
}

export async function PATCH(req, { params }) {
  try {
    const patch = await req.json();
    const allowed = [
      'status',
      'priority',
      'category',
      'sentiment',
      'assignee',
      'ai_reply',
      'resolution',
      'escalated',
      'escalation_reason',
    ];
    const clean = {};
    for (const key of allowed) {
      if (key in patch) clean[key] = patch[key];
    }
    const updated = await updateTicket(params.id, clean);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ticket: updated });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  const ok = await deleteTicket(params.id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
