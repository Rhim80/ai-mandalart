import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/lib/openai';
import { ARCHETYPE_DETECTION } from '@/lib/prompts';
import { ArchetypeResponse, QuickContext } from '@/types/mandalart';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { goal, quickContext } = await req.json() as { goal: string; quickContext?: QuickContext };

    if (!goal || typeof goal !== 'string') {
      return NextResponse.json(
        { error: 'Goal is required' },
        { status: 400 }
      );
    }

    const prompt = ARCHETYPE_DETECTION(goal, quickContext);
    const result = await callOpenAI<ArchetypeResponse>(prompt);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Archetype API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to detect archetype', details: errorMessage },
      { status: 500 }
    );
  }
}
