import fs from 'fs';
import path from 'path';
import { ClientConfig } from './types';

const configCache = new Map<string, ClientConfig>();

export function loadConfig(clientId: string): ClientConfig {
  if (configCache.has(clientId)) {
    return configCache.get(clientId)!;
  }
  const configPath = path.resolve(process.cwd(), 'configs', `${clientId}.json`);
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config not found: ${configPath}`);
  }
  const raw = fs.readFileSync(configPath, 'utf-8');
  const config: ClientConfig = JSON.parse(raw);
  configCache.set(clientId, config);
  return config;
}

export function getActiveConfig(): ClientConfig {
  const clientId = process.env.BOT_CLIENT_ID;
  if (!clientId) throw new Error('BOT_CLIENT_ID is required');
  return loadConfig(clientId);
}
