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
        month: { number: number; en: string };
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

export const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
export type PrayerName = (typeof PRAYER_NAMES)[number];

export const CALCULATION_METHODS: Record<number, string> = {
  0: 'Shia Ithna-Ashari',
  1: 'University of Islamic Sciences, Karachi',
  2: 'Islamic Society of North America',
  3: 'Muslim World League',
  4: 'Umm Al-Qura University, Makkah',
  5: 'Egyptian General Authority of Survey',
  7: 'Institute of Geophysics, University of Tehran',
  8: 'Gulf Region',
  9: 'Kuwait',
  10: 'Qatar',
  11: 'Majlis Ugama Islam Singapura',
  12: 'Union Organization Islamic de France',
  13: 'Diyanet İşleri Başkanlığı, Turkey',
  14: 'Spiritual Administration of Muslims of Russia',
};
