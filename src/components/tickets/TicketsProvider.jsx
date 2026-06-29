'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';

const TicketsContext = createContext(null);

export function useTickets() {
  const ctx = useContext(TicketsContext);
  if (!ctx) throw new Error('useTickets must be used within <TicketsProvider>');
  return ctx;
}

export default function TicketsProvider({ children }) {
  const [tickets, setTickets] = useState([]);
  const [rules, setRules] = useState(null);
  const [status, setStatus] = useState({ backend: 'memory', ai: 'heuristic' });
  const [loading, setLoading] = useState(true);
  const [realtime, setRealtime] = useState(false);

  const refresh = useCallback(async () => {
    const [t, r, s] = await Promise.all([
      fetch('/api/tickets').then((res) => res.json()),
      fetch('/api/rules').then((res) => res.json()),
      fetch('/api/status').then((res) => res.json()),
    ]);
    setTickets(t.tickets || []);
    setRules(r.rules || null);
    setStatus(s || status);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Supabase real-time: live-sync the board when the DB changes (any client/source).
  // No-op when Supabase isn't configured (the in-memory store has no realtime).
  useEffect(() => {
    const sb = getSupabaseBrowserClient();
    if (!sb) return;

    const upsert = (row) =>
      setTickets((prev) => {
        const exists = prev.some((t) => t.id === row.id);
        const next = exists ? prev.map((t) => (t.id === row.id ? row : t)) : [row, ...prev];
        return next.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      });

    const channel = sb
      .channel('tickets-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tickets' }, (p) =>
        upsert(p.new)
      )
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tickets' }, (p) =>
        upsert(p.new)
      )
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'tickets' }, (p) =>
        setTickets((prev) => prev.filter((t) => t.id !== p.old.id))
      )
      .subscribe((s) => setRealtime(s === 'SUBSCRIBED'));

    return () => {
      sb.removeChannel(channel);
      setRealtime(false);
    };
  }, []);

  const createTicket = useCallback(async (payload) => {
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create ticket');
    setTickets((prev) => [data.ticket, ...prev]);
    return data;
  }, []);

  const retriage = useCallback(async (id) => {
    const res = await fetch('/api/triage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to re-triage');
    setTickets((prev) => prev.map((t) => (t.id === id ? data.ticket : t)));
    return data;
  }, []);

  const updateTicket = useCallback(async (id, patch) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    const res = await fetch(`/api/tickets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (res.ok) {
      setTickets((prev) => prev.map((t) => (t.id === id ? data.ticket : t)));
    }
    return data;
  }, []);

  const deleteTicket = useCallback(async (id) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/tickets/${id}`, { method: 'DELETE' });
  }, []);

  const saveRules = useCallback(async (patch) => {
    setRules((prev) => ({ ...prev, ...patch }));
    const res = await fetch('/api/rules', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (res.ok) setRules(data.rules);
    return data;
  }, []);

  const value = useMemo(
    () => ({
      tickets,
      rules,
      status,
      loading,
      realtime,
      refresh,
      createTicket,
      retriage,
      updateTicket,
      deleteTicket,
      saveRules,
    }),
    [
      tickets,
      rules,
      status,
      loading,
      realtime,
      refresh,
      createTicket,
      retriage,
      updateTicket,
      deleteTicket,
      saveRules,
    ]
  );

  return <TicketsContext.Provider value={value}>{children}</TicketsContext.Provider>;
}
