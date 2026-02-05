import { cyan, dim, green, yellow } from './colors.js';
const CRESCENT = '☪';
export function renderPrayerLine(prayer) {
    if (!prayer) {
        return `${cyan(CRESCENT)} ${dim('Prayer times unavailable')}`;
    }
    const symbol = cyan(CRESCENT);
    const name = yellow(prayer.name);
    if (prayer.isNow) {
        return `${symbol} ${name} ${green('NOW')}`;
    }
    return `${symbol} ${name} ${dim(`in ${prayer.remaining}`)}`;
}
export function renderSetupPrompt() {
    return `${cyan(CRESCENT)} ${dim('Run /claude-pray:setup')}`;
}
