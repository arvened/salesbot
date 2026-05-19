export interface SessionData {
  history: Array<{ role: string; content: string }>;
  qualificationStep: number;
  qualificationAnswers: Record<string, string>;
  isQualified?: boolean;
  lead: {
    name?: string;
    phone?: string;
    service?: string;
    preferredTime?: string;
  };
  stage: string;
  messageCount: number;
  lastActivity: number;
}

export function initialSession(): SessionData {
  return {
    history: [],
    qualificationStep: 0,
    qualificationAnswers: {},
    lead: {},
    stage: 'greeting',
    messageCount: 0,
    lastActivity: Date.now(),
  };
}
