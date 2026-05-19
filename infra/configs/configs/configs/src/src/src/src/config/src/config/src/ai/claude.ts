import Anthropic from '@anthropic-ai/sdk';
import { ClientConfig } from '../config/types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function askClaude(config: ClientConfig, history: Message[], userMessage: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: config.aiMaxTokens ?? 500,
    system: `Ти — AI Sales Assistant для "${config.clientName}". Твоя роль: допомагати клієнтам і записувати на послуги. Бізнес: ${config.businessDescription}. Послуги: ${config.services.map(s => s.name).join(', ')}. Відповідай коротко, 2-3 речення.`,
    messages: [...history, { role: 'user', content: userMessage }],
  });
  return response.content.filter(b => b.type === 'text').map(b => (b as any).text).join('');
}

export async function qualifyLead(config: ClientConfig, answers: Record<string, string>): Promise<{ qualified: boolean }> {
  const text = Object.entries(answers).map(([q, a]) => `${q}: ${a}`).join(', ');
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 100,
    system: `Чи це підходящий клієнт для "${config.clientName}"? Відповідай тільки JSON: {"qualified": true або false}`,
    messages: [{ role: 'user', content: text }],
  });
  try {
    const parsed = JSON.parse((response.content[0] as any).text);
    return { qualified: parsed.qualified };
  } catch {
    return { qualified: true };
  }
}
