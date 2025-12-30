import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/lib/openai';

export const runtime = 'edge';

interface BlessingResponse {
  blessing: string;
}

const BLESSING_PROMPT = (goal: string, pillars: string[]) => `
당신은 위트있고 따뜻한 응원 메시지를 작성하는 전문가입니다.

사용자의 2026년 목표와 실천 영역을 보고, 유머러스하면서도 진심이 담긴 덕담 한 줄을 작성해주세요.

목표: "${goal}"
실천 영역: ${pillars.join(', ')}

규칙:
- 한 문장, 최대 50자 이내
- 목표나 영역을 구체적으로 언급하면 더 좋음
- 너무 뻔한 응원 ("화이팅!", "할 수 있어!") 금지
- 약간의 위트나 재치 포함
- 하지만 진심이 느껴지게
- 이모지 1개 정도 사용 가능

좋은 예시:
- "8개 영역 다 챙기다 번아웃 오면 제가 커피 쏠게요 ☕"
- "이 정도 계획이면 2026년 12월에 자서전 쓰셔야겠는데요 📚"
- "체력 관리가 있어서 다행이에요, 이 목표엔 필수거든요 💪"

JSON 형식으로 응답:
{
  "blessing": "덕담 메시지"
}
`;

export async function POST(req: NextRequest) {
  try {
    const { goal, pillars } = await req.json() as {
      goal: string;
      pillars: string[];
    };

    if (!goal || !pillars || pillars.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = BLESSING_PROMPT(goal, pillars);
    const result = await callOpenAI<BlessingResponse>(prompt);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Blessing API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate blessing' },
      { status: 500 }
    );
  }
}
