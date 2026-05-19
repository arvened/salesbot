import 'dotenv/config';
import { getActiveConfig } from './config/loader';
import { TelegramAdapter } from './adapters/telegram';
import { WhatsAppAdapter } from './adapters/whatsapp';

async function bootstrap() {
  const config = getActiveConfig();
  const channels = (process.env.CHANNELS ?? 'telegram').split(',').map(s => s.trim());

  console.log(`SalesBot starting for: ${config.clientName}`);
  console.log(`Channels: ${channels.join(', ')}`);

  const adapters = [];

  if (channels.includes('telegram')) {
    adapters.push(new TelegramAdapter(config));
  }

  if (channels.includes('whatsapp')) {
    adapters.push(new WhatsAppAdapter(config));
  }

  if (adapters.length === 0) {
    throw new Error('No channels configured');
  }

  await Promise.all(adapters.map(a => a.start()));
}

bootstrap().catch(err => { console.error(err); process.exit(1); });
