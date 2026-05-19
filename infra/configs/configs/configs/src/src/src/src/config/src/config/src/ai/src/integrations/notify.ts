import axios from 'axios';

export async function notifyManager(managerTelegramId: string, lead: Record<string, any>, clientName: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  const text = `Новий лід — ${clientName}\n\nІм'я: ${lead.name}\nТелефон: ${lead.phone}\nПослуга: ${lead.service}\nЧас: ${lead.preferredTime}`;

  try {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: managerTelegramId,
      text: text,
    });
  } catch (err) {
    console.error('Failed to notify manager:', err);
  }
}
