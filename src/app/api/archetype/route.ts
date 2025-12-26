import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/lib/openai';
import { ARCHETYPE_DETECTION } from '@/lib/prompts';
import { ArchetypeResponse } from '@/types/mandalart';

export async function POST(req: NextRequest) {
  try {
    const { goal } = await req.json();

    if (!goal || typeof goal !== 'string') {
      return NextResponse.json(
        { error: 'Goal is required' },
        { status: 400 }
      );
    }

    const prompt = ARCHETYPE_DETECTION(goal);
    const result = await callOpenAI<ArchetypeResponse>(prompt);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Archetype API error:', error);
    return NextResponse.json(
      { error: 'Failed to detect archetype' },
      { status: 500 }
    );
  }
}
