import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/lib/openai';
import { ACTION_REGENERATION } from '@/lib/prompts';
import { Pillar } from '@/types/mandalart';

interface ActionRegenerationResponse {
  actions: string[];
}

export async function POST(req: NextRequest) {
  try {
    const { goal, vibeSummary, pillar, selectedActions, count } = await req.json() as {
      goal: string;
      vibeSummary: string;
      pillar: Pillar;
      selectedActions: string[];
      count: number;
    };

    if (!goal || !vibeSummary || !pillar) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = ACTION_REGENERATION(goal, vibeSummary, pillar, selectedActions, count);
    const result = await callOpenAI<ActionRegenerationResponse>(prompt);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Action regeneration API error:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate actions' },
      { status: 500 }
    );
  }
}
