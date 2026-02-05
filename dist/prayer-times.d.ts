import type { ClaudePrayConfig, NextPrayer, PrayerTimings } from './types.js';
export declare function fetchPrayerTimes(config: ClaudePrayConfig): Promise<PrayerTimings | null>;
export declare function calculateNextPrayer(timings: PrayerTimings): NextPrayer | null;
export declare function getNextPrayer(config: ClaudePrayConfig): Promise<NextPrayer | null>;
