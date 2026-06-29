import { NextResponse } from 'next/server';
import { getTicket, updateTicket, getRules } from '@/lib/data';
import { triageTicket } from '@/lib/triage';

export const dynamic = 'force-dynamic';

/**
 * POST /api/triage
 *  - { id }                 -> re-run triage on an existing ticket & persist
 *  - { subject, body, ... } -> preview triage WITHOUT persisting (dry run)
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const rules = await getRules();

    // dry-run preview mode
    if (!body.id) {
      const subject = (body.subject || '').trim();
      const message = (body.body || body.message || '').trim();
      if (!subject || !message) {
        return NextResponse.json(
          { error: 'Provide "id" to re-triage, or "subject" + "body" to preview.' },
          { status: 400 }
        );
      }
      const { analysis, decision, patch } = await triageTicket(
        { subject, body: message, customer_name: body.customer_name || '' },
        rules
      );
      return NextResponse.json({ preview: true, analysis, decision, patch });
    }

    // re-triage existing ticket
    const ticket = await getTicket(body.id);
    if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

    const { analysis, decision, patch } = await triageTicket(
      {
        subject: ticket.subject,
        body: ticket.body,
        customer_name: ticket.customer_name,
      },
      rules
    );
    const updated = await updateTicket(ticket.id, patch);
    return NextResponse.json({ ticket: updated, analysis, decision });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
