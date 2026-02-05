export interface StdinData {
    cwd?: string;
    isGitRepo?: boolean;
    gitBranch?: string;
    [key: string]: unknown;
}
export interface PrayerTimings {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    [key: string]: string;
}
export interface AladhanResponse {
    code: number;
    status: string;
    data: {
        timings: PrayerTimings;
        date: {
            readable: string;
            timestamp: string;
            gregorian: {
                date: string;
                day: string;
                month: {
                    number: number;
                    en: string;
                };
                year: string;
            };
        };
        meta: {
            timezone: string;
            method: {
                id: number;
                name: string;
            };
        };
    };
}
export interface ClaudePrayConfig {
    city: string;
    country: string;
    method: number;
    enabled: boolean;
}
export interface NextPrayer {
    name: string;
    time: Date;
    remaining: string;
    isNow: boolean;
}
export interface ClaudeSettings {
    statusLine?: {
        type: string;
        command: string;
    };
    claudePray?: ClaudePrayConfig;
    [key: string]: unknown;
}
export declare const PRAYER_NAMES: readonly ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
export type PrayerName = (typeof PRAYER_NAMES)[number];
export declare const CALCULATION_METHODS: Record<number, string>;
