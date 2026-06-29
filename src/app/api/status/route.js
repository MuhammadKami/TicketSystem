import { NextResponse } from 'next/server';
import { activeBackend } from '@/lib/data';
import { isGeminiConfigured } from '@/lib/ai';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    backend: activeBackend(),
    ai: isGeminiConfigured() ? 'gemini' : 'heuristic',
  });
}
