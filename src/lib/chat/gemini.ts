import { GoogleGenAI } from '@google/genai';
import { buildSystemPrompt } from './prompt';
import { ChatContextData, ModuleAction } from './types';

const MODEL = 'gemini-3.1-flash-lite-preview';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  text: string;
  actions: ModuleAction[];
  usage: {
    inputTokens: number;
    outputTokens: number;
    model: string;
  };
}

export async function chatWithCoach(
  messages: ChatMessage[],
  context: ChatContextData,
  locale: string,
  customApiKey?: string | null,
  timezone?: string
): Promise<ChatResponse> {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY!;
  const genAI = new GoogleGenAI({ apiKey });

  const systemPrompt = buildSystemPrompt(context, locale, timezone);

  // Use proper systemInstruction instead of user-message hack
  const contents = messages.map((m) => ({
    role: (m.role === 'user' ? 'user' : 'model') as 'user' | 'model',
    parts: [{ text: m.content }],
  }));

  const response = await genAI.models.generateContent({
    model: MODEL,
    contents,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.75,
      maxOutputTokens: 2048,
    },
  });

  const text = response.text ?? '';

  const usageMetadata = response.usageMetadata;
  const inputTokens = usageMetadata?.promptTokenCount ?? 0;
  const outputTokens = usageMetadata?.candidatesTokenCount ?? 0;

  // Extract actions from ```action blocks (lenient regex)
  const actions: ModuleAction[] = [];
  const actionRegex = /```\s*action\s*\n?([\s\S]*?)```/gi;
  let match;
  while ((match = actionRegex.exec(text)) !== null) {
    try {
      const raw = match[1].trim();
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        actions.push(...parsed);
      } else {
        actions.push(parsed);
      }
    } catch {
      // Log malformed action blocks for debugging
      console.warn('Malformed action block skipped:', match[1]?.substring(0, 100));
    }
  }

  // Remove action blocks from visible text
  const cleanText = text.replace(/```\s*action\s*\n?[\s\S]*?```/gi, '').trim();

  return {
    text: cleanText,
    actions,
    usage: { inputTokens, outputTokens, model: MODEL },
  };
}
