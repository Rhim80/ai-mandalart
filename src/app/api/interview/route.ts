import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/lib/openai';
import { INTERVIEW_QUESTIONS, INTERVIEW_SUMMARY } from '@/lib/prompts';
import {
  ArchetypeType,
  InterviewAnswer,
  InterviewQuestionResponse,
  InterviewSummaryResponse,
} from '@/types/mandalart';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, archetype, goal, questionIndex, answers } = body as {
      action: 'getQuestion' | 'getSummary';
      archetype: ArchetypeType;
      goal?: string;
      questionIndex?: number;
      answers?: InterviewAnswer[];
    };

    if (!archetype || !INTERVIEW_QUESTIONS[archetype]) {
      return NextResponse.json(
        { error: 'Valid archetype is required' },
        { status: 400 }
      );
    }

    if (action === 'getQuestion') {
      const index = questionIndex ?? 0;
      const questions = INTERVIEW_QUESTIONS[archetype];

      if (index >= questions.length) {
        const response: InterviewQuestionResponse = {
          question: '',
          questionIndex: index,
          isComplete: true,
        };
        return NextResponse.json(response);
      }

      const response: InterviewQuestionResponse = {
        question: questions[index],
        questionIndex: index,
        isComplete: false,
      };

      return NextResponse.json(response);
    }

    if (action === 'getSummary') {
      if (!goal || !answers || answers.length === 0) {
        return NextResponse.json(
          { error: 'Goal and answers are required' },
          { status: 400 }
        );
      }

      const prompt = INTERVIEW_SUMMARY(archetype, goal, answers);
      const result = await callOpenAI<InterviewSummaryResponse>(prompt);

      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Interview API error:', error);
    return NextResponse.json(
      { error: 'Failed to process interview request' },
      { status: 500 }
    );
  }
}
