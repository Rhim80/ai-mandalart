import OpenAI from 'openai';

// Edge Runtime에서는 매 요청마다 새로운 인스턴스 생성
function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  // Cloudflare AI Gateway를 통해 OpenAI API 호출 (403 에러 우회)
  // 환경변수가 Edge Runtime에서 주입 안되는 문제로 하드코딩
  const baseURL = 'https://gateway.ai.cloudflare.com/v1/2e7841fda8fac46582ba5d43985d17a4/ai-mandalart/openai';

  return new OpenAI({ apiKey, baseURL });
}

export async function callOpenAI<T>(
  prompt: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<T> {
  const { model = 'gpt-4o', temperature = 0.7, maxTokens = 2000 } = options || {};

  const openai = getOpenAIClient();

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('Empty response from OpenAI');

      return JSON.parse(content) as T;
    } catch (error) {
      if (attempt === 2) throw error;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }

  throw new Error('Failed after 3 attempts');
}
