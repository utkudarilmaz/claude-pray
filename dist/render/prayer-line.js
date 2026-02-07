import { cyan, dim, green, yellow } from './colors.js';
const CRESCENT = '☪';
export function renderPrayerLine(prayer) {
    if (!prayer) {
        return `${cyan(CRESCENT)} ${dim('Prayer times unavailable')}`;
    }
    const symbol = cyan(CRESCENT);
    const name = yellow(prayer.name);
    const timeInfo = prayer.isNow
        ? green(`in ${prayer.remaining}`)
        : dim(`in ${prayer.remaining}`);
    return `${symbol} ${name} ${timeInfo}`;
}
export function renderSetupPrompt() {
    return `${cyan(CRESCENT)} ${dim('Run /claude-pray:setup')}`;
}
