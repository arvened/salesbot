import http from 'http';
import axios from 'axios';
import { ClientConfig } from '../config/types';

const WA_API_URL = 'https://graph.facebook.com/v19.0';

export class WhatsAppAdapter {
  channel = 'whatsapp' as const;
  private config: ClientConfig;
  private phoneNumberId: string;
  private accessToken: string;
  private verifyToken: string;
  private port: number;

  constructor(config: ClientConfig) {
    this.config = config;
    this.phoneNumberId = process.env.WA_PHONE_NUMBER_ID ?? '';
    this.accessToken = process.env.WA_ACCESS_TOKEN ?? '';
    this.verifyToken = process.env.WA_VERIFY_TOKEN ?? 'salesbot_verify';
    this.port = parseInt(process.env.WA_WEBHOOK_PORT ?? '3000');
  }

  async sendText(userId: string, text: string): Promise<void> {
    try {
      await axios.post(
        `${WA_API_URL}/${this.phoneNumberId}/messages`,
        { messaging_product: 'whatsapp', to: userId, type: 'text', text: { body: text } },
        { headers: { Authorization: `Bearer ${this.accessToken}` } }
      );
    } catch (err) {
      console.error('[WhatsApp] Error:', err);
    }
  }

  async sendMessage(userId: string, text: string, buttons?: string[][]): Promise<void> {
    await this.sendText(userId, text);
  }

  async start(): Promise<void> {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url ?? '/', 'http://localhost');

      if (req.method === 'GET' && url.pathname === '/webhook/whatsapp') {
        const mode = url.searchParams.get('hub.mode');
        const token = url.searchParams.get('hub.verify_token');
        const challenge = url.searchParams.get('hub.challenge');
        if (mode === 'subscribe' && token === this.verifyToken) {
          res.writeHead(200);
          res.end(challenge);
        } else {
          res.writeHead(403);
          res.end('Forbidden');
        }
        return;
      }

      if (req.method === 'POST' && url.pathname === '/webhook/whatsapp') {
        res.writeHead(200);
        res.end('OK');
      }

      res.writeHead(404);
      res.end('Not found');
    });

    server.listen(this.port, () => {
      console.log(`[WhatsApp] Webhook on port ${this.port}`);
    });
  }
}
