import { readFile } from 'fs/promises';
import { homedir } from 'os';
import { join } from 'path';
import type { ClaudePrayConfig } from './types.js';
import { safeJsonParse, isValidConfig } from './validation.js';

const DEFAULT_CONFIG: ClaudePrayConfig = {
  city: '',
  country: '',
  method: 2, // ISNA as default
  enabled: false,
};

export async function getConfig(): Promise<ClaudePrayConfig> {
  const configPath = join(homedir(), '.claude', 'claude-pray.json');

  try {
    const content = await readFile(configPath, 'utf8');
    const config = safeJsonParse(content, isValidConfig);

    if (config) {
      return config;
    }
    // Invalid config - fall through to default
  } catch {
    // Config file doesn't exist or is invalid
  }

  return DEFAULT_CONFIG;
}

export function isConfigured(config: ClaudePrayConfig): boolean {
  return config.enabled && config.city.length > 0 && config.country.length > 0;
}
