import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/lib/openai';
import { PILLAR_REGENERATION } from '@/lib/prompts';
import { ArchetypeType, Pillar, PillarsResponse } from '@/types/mandalart';

export async function POST(req: NextRequest) {
  try {
    const { archetype, goal, vibeSummary, selectedPillars, rejectedPillars, count } = await req.json() as {
      archetype: ArchetypeType;
      goal: string;
      vibeSummary: string;
      selectedPillars: Pillar[];
      rejectedPillars: Pillar[];
      count: number;
    };

    if (!archetype || !goal || !vibeSummary) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = PILLAR_REGENERATION(archetype, goal, vibeSummary, selectedPillars, rejectedPillars || [], count);
    const result = await callOpenAI<PillarsResponse>(prompt);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Pillar regeneration API error:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate pillars' },
      { status: 500 }
    );
  }
}
