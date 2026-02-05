const API_BASE = 'https://api.aladhan.com/v1/timingsByCity';
// In-memory cache for prayer times
let cachedTimings = null;
let cacheDate = null;
let cacheKey = null;
function getTodayDateString() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
function getCacheKey(config) {
    return `${config.city}:${config.country}:${config.method}`;
}
export async function fetchPrayerTimes(config) {
    const today = getTodayDateString();
    const key = getCacheKey(config);
    // Return cached data if valid
    if (cachedTimings && cacheDate === today && cacheKey === key) {
        return cachedTimings;
    }
    try {
        const params = new URLSearchParams({
            city: config.city,
            country: config.country,
            method: config.method.toString(),
        });
        const response = await fetch(`${API_BASE}?${params}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        if (data.code !== 200) {
            return null;
        }
        // Update cache
        cachedTimings = data.data.timings;
        cacheDate = today;
        cacheKey = key;
        return cachedTimings;
    }
    catch {
        return null;
    }
}
function parseTimeToDate(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
    return date;
}
function formatTimeRemaining(ms) {
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) {
        return `${minutes}m`;
    }
    if (minutes === 0) {
        return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
}
const MAIN_PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
export function calculateNextPrayer(timings) {
    const now = new Date();
    const nowMs = now.getTime();
    // Check each prayer in order
    for (const prayer of MAIN_PRAYERS) {
        const prayerTime = parseTimeToDate(timings[prayer]);
        const prayerMs = prayerTime.getTime();
        const diffMs = prayerMs - nowMs;
        // If prayer is in the future
        if (diffMs > 0) {
            const isNow = diffMs <= 15 * 60 * 1000; // Within 15 minutes
            return {
                name: prayer,
                time: prayerTime,
                remaining: formatTimeRemaining(diffMs),
                isNow,
            };
        }
    }
    // All prayers passed today, show tomorrow's Fajr
    const tomorrowFajr = parseTimeToDate(timings.Fajr);
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
    const diffMs = tomorrowFajr.getTime() - nowMs;
    return {
        name: 'Fajr',
        time: tomorrowFajr,
        remaining: formatTimeRemaining(diffMs),
        isNow: false,
    };
}
export async function getNextPrayer(config) {
    const timings = await fetchPrayerTimes(config);
    if (!timings) {
        return null;
    }
    return calculateNextPrayer(timings);
}
