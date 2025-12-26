import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/lib/openai';
import { ACTION_GENERATION } from '@/lib/prompts';
import { Pillar, ActionsResponse } from '@/types/mandalart';

export async function POST(req: NextRequest) {
  try {
    const { goal, vibeSummary, selectedPillars } = await req.json() as {
      goal: string;
      vibeSummary: string;
      selectedPillars: Pillar[];
    };

    if (!goal || !vibeSummary || !selectedPillars || selectedPillars.length !== 8) {
      return NextResponse.json(
        { error: 'Goal, vibeSummary, and exactly 8 selected pillars are required' },
        { status: 400 }
      );
    }

    const prompt = ACTION_GENERATION(goal, vibeSummary, selectedPillars);
    const result = await callOpenAI<ActionsResponse>(prompt, {
      maxTokens: 4000,
    });

    // Assign opacity levels to each subGrid
    const subGridsWithOpacity = result.subGrids.map((grid, index) => ({
      ...grid,
      opacityLevel: index + 1,
    }));

    return NextResponse.json({ subGrids: subGridsWithOpacity });
  } catch (error) {
    console.error('Actions API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate actions' },
      { status: 500 }
    );
  }
}
