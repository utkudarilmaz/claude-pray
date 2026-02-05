import { readFile } from 'fs/promises';
import { homedir } from 'os';
import { join } from 'path';
const DEFAULT_CONFIG = {
    city: '',
    country: '',
    method: 2, // ISNA as default
    enabled: false,
};
export async function getConfig() {
    const settingsPath = join(homedir(), '.claude', 'settings.json');
    try {
        const content = await readFile(settingsPath, 'utf8');
        const settings = JSON.parse(content);
        if (settings.claudePray) {
            return {
                ...DEFAULT_CONFIG,
                ...settings.claudePray,
            };
        }
    }
    catch {
        // Settings file doesn't exist or is invalid
    }
    return DEFAULT_CONFIG;
}
export function isConfigured(config) {
    return config.enabled && config.city.length > 0 && config.country.length > 0;
}
