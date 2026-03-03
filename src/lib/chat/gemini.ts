import { GoogleGenAI } from '@google/genai';
import { buildSystemPrompt } from './prompt';
import { ChatContextData, ModuleAction } from './types';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  text: string;
  actions: ModuleAction[];
}

export async function chatWithCoach(
  messages: ChatMessage[],
  context: ChatContextData,
  locale: string
): Promise<ChatResponse> {
  const systemPrompt = buildSystemPrompt(context, locale);

  const contents = [
    { role: 'user' as const, parts: [{ text: systemPrompt }] },
    { role: 'model' as const, parts: [{ text: '네, 갓생코치로서 도와드리겠습니다!' }] },
    ...messages.map((m) => ({
      role: (m.role === 'user' ? 'user' : 'model') as 'user' | 'model',
      parts: [{ text: m.content }],
    })),
  ];

  const response = await genAI.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents,
    config: {
      temperature: 0.9,
      maxOutputTokens: 1024,
    },
  });

  const text = response.text ?? '';

  // Extract actions from ```action blocks
  const actions: ModuleAction[] = [];
  const actionRegex = /```action\s*([\s\S]*?)```/g;
  let match;
  while ((match = actionRegex.exec(text)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      if (Array.isArray(parsed)) {
        actions.push(...parsed);
      } else {
        actions.push(parsed);
      }
    } catch {
      // Skip malformed action blocks
    }
  }

  // Remove action blocks from visible text
  const cleanText = text.replace(/```action\s*[\s\S]*?```/g, '').trim();

  return { text: cleanText, actions };
}
