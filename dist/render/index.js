import { isConfigured } from '../config.js';
import { getNextPrayer } from '../prayer-times.js';
import { renderPrayerLine, renderSetupPrompt } from './prayer-line.js';
export async function render(_stdinData, config) {
    // Check if plugin is configured
    if (!isConfigured(config)) {
        return renderSetupPrompt();
    }
    // Get next prayer time
    const nextPrayer = await getNextPrayer(config);
    return renderPrayerLine(nextPrayer);
}
