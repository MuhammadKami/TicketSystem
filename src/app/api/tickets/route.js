import { NextResponse } from 'next/server';
import { listTickets, createTicket, updateTicket, getRules } from '@/lib/data';
import { triageTicket } from '@/lib/triage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tickets = await listTickets();
    return NextResponse.json({ tickets });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const subject = (body.subject || '').trim();
    const message = (body.body || body.message || '').trim();

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Both "subject" and "body" are required.' },
        { status: 400 }
      );
    }

    // 1. persist the raw ticket
    const ticket = await createTicket({
      subject,
      body: message,
      customer_name: (body.customer_name || 'Anonymous').trim(),
      customer_email: (body.customer_email || '').trim(),
      channel: body.channel || 'web',
      status: 'new',
    });

    // 2. run triage (Gemini → heuristic) and apply escalation rules
    const rules = await getRules();
    const { analysis, decision, patch } = await triageTicket(
      { subject, body: message, customer_name: ticket.customer_name },
      rules
    );

    // 3. persist the triage outcome
    const updated = await updateTicket(ticket.id, patch);

    return NextResponse.json({ ticket: updated, analysis, decision }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
