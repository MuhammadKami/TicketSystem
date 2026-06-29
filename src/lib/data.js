/**
 * Unified data-access layer.
 *
 * Picks Supabase when configured, otherwise the in-memory store. API routes
 * import only from here so they never need to know which backend is live.
 */

import { memoryStore, DEFAULT_RULES } from './store';
import { isSupabaseConfigured, getSupabaseServerClient } from './supabase';

const RULES_ROW_ID = 'global';

export function activeBackend() {
  return isSupabaseConfigured() ? 'supabase' : 'memory';
}

export async function listTickets() {
  if (!isSupabaseConfigured()) return memoryStore.listTickets();
  const sb = getSupabaseServerClient();
  const { data, error } = await sb
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getTicket(id) {
  if (!isSupabaseConfigured()) return memoryStore.getTicket(id);
  const sb = getSupabaseServerClient();
  const { data, error } = await sb.from('tickets').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

export async function createTicket(payload) {
  if (!isSupabaseConfigured()) return memoryStore.createTicket(payload);
  const sb = getSupabaseServerClient();
  const { data, error } = await sb.from('tickets').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateTicket(id, patch) {
  if (!isSupabaseConfigured()) return memoryStore.updateTicket(id, patch);
  const sb = getSupabaseServerClient();
  const { data, error } = await sb
    .from('tickets')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTicket(id) {
  if (!isSupabaseConfigured()) return memoryStore.deleteTicket(id);
  const sb = getSupabaseServerClient();
  const { error } = await sb.from('tickets').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function getRules() {
  if (!isSupabaseConfigured()) return memoryStore.getRules();
  const sb = getSupabaseServerClient();
  const { data } = await sb.from('rules').select('config').eq('id', RULES_ROW_ID).single();
  return { ...DEFAULT_RULES, ...(data?.config || {}) };
}

export async function updateRules(patch) {
  if (!isSupabaseConfigured()) return memoryStore.updateRules(patch);
  const sb = getSupabaseServerClient();
  const current = await getRules();
  const config = { ...current, ...patch };
  await sb.from('rules').upsert({ id: RULES_ROW_ID, config });
  return config;
}
