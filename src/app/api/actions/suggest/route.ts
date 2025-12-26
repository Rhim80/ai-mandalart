import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/lib/openai';
import { ACTION_SUGGESTION } from '@/lib/prompts';
import { Pillar } from '@/types/mandalart';

interface ActionSuggestionResponse {
  actions: string[];
}

export async function POST(req: NextRequest) {
  try {
    const { goal, vibeSummary, pillar } = await req.json() as {
      goal: string;
      vibeSummary: string;
      pillar: Pillar;
    };

    if (!goal || !vibeSummary || !pillar) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = ACTION_SUGGESTION(goal, vibeSummary, pillar);
    const result = await callOpenAI<ActionSuggestionResponse>(prompt);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Action suggestion API error:', error);
    return NextResponse.json(
      { error: 'Failed to suggest actions' },
      { status: 500 }
    );
  }
}
