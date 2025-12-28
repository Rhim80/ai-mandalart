import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/lib/openai';
import { PILLAR_SUGGESTION } from '@/lib/prompts';
import { ArchetypeType, PillarsResponse } from '@/types/mandalart';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { archetype, goal, vibeSummary } = await req.json() as {
      archetype: ArchetypeType;
      goal: string;
      vibeSummary: string;
    };

    if (!archetype || !goal || !vibeSummary) {
      return NextResponse.json(
        { error: 'Archetype, goal, and vibeSummary are required' },
        { status: 400 }
      );
    }

    const prompt = PILLAR_SUGGESTION(archetype, goal, vibeSummary);
    const result = await callOpenAI<PillarsResponse>(prompt);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Pillars API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate pillars' },
      { status: 500 }
    );
  }
}
