export interface Service {
  name: string;
  price?: number;
  currency?: string;
  duration?: number;
  description?: string;
}

export interface QualificationQuestion {
  id: string;
  question: string;
  type: 'text' | 'choice';
  choices?: string[];
}

export interface ClientConfig {
  clientId: string;
  clientName: string;
  businessType: string;
  businessDescription: string;
  language: string[];
  welcomeMessage?: string;
  tone: 'friendly' | 'professional' | 'casual' | 'formal';
  services: Service[];
  qualificationQuestions: QualificationQuestion[];
  qualifiedMessage?: string;
  disqualifiedMessage?: string;
  managerTelegramId: string;
  notifyOnNewLead: boolean;
  maxMessagesPerUser?: number;
  aiMaxTokens?: number;
}
