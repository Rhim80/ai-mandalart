import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/lib/openai';
import { DISCOVERY_QUESTIONS, DISCOVERY_GOAL_SUGGESTION } from '@/lib/prompts';
import { InterviewAnswer, DiscoveryQuestionResponse, DiscoveryGoalsResponse } from '@/types/mandalart';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, questionIndex, answers } = body as {
      action: 'getQuestion' | 'generateGoals';
      questionIndex?: number;
      answers?: InterviewAnswer[];
    };

    if (action === 'getQuestion') {
      const index = questionIndex ?? 0;
      if (index >= DISCOVERY_QUESTIONS.length) {
        return NextResponse.json(
          { error: 'No more questions' },
          { status: 400 }
        );
      }

      const response: DiscoveryQuestionResponse = {
        question: DISCOVERY_QUESTIONS[index],
        questionIndex: index,
        totalQuestions: DISCOVERY_QUESTIONS.length,
      };

      return NextResponse.json(response);
    }

    if (action === 'generateGoals') {
      if (!answers || answers.length === 0) {
        return NextResponse.json(
          { error: 'Answers are required' },
          { status: 400 }
        );
      }

      const prompt = DISCOVERY_GOAL_SUGGESTION(answers);
      const result = await callOpenAI<DiscoveryGoalsResponse>(prompt);

      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Discovery API error:', error);
    return NextResponse.json(
      { error: 'Failed to process discovery request' },
      { status: 500 }
    );
  }
}
