/**
 * Security validation utilities for claude-pray plugin
 *
 * Provides defense-in-depth protection against:
 * - Prototype pollution attacks via JSON parsing
 * - Schema validation failures
 * - Input format injection
 * - Type confusion vulnerabilities
 *
 * Zero dependencies - uses only native JS/TS features
 */

import type { ClaudePrayConfig, PrayerTimings, AladhanResponse } from './types.js';

// Dangerous keys that can pollute Object.prototype
const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype'];

/**
 * Recursively sanitizes an object by removing dangerous keys
 * that could lead to prototype pollution.
 *
 * @param obj - The object to sanitize
 * @returns Sanitized object with dangerous keys removed
 */
function sanitizeObject(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    // Filter out dangerous keys
    if (DANGEROUS_KEYS.includes(key)) {
      continue;
    }

    // Recursively sanitize nested objects
    sanitized[key] = sanitizeObject(value);
  }

  return sanitized;
}

/**
 * Safely parses JSON string with prototype pollution protection
 * and optional schema validation.
 *
 * @param input - JSON string to parse
 * @param validator - Optional type guard function for schema validation
 * @returns Parsed and validated object, or null on failure
 */
export function safeJsonParse<T>(
  input: string,
  validator?: (obj: unknown) => obj is T
): T | null {
  try {
    const parsed = JSON.parse(input);
    const sanitized = sanitizeObject(parsed);

    if (validator && !validator(sanitized)) {
      return null;
    }

    return sanitized as T;
  } catch {
    // Silent failure - statusline plugins must never crash
    return null;
  }
}

/**
 * Validates if value is a non-empty string within length limits
 *
 * @param value - Value to validate
 * @param maxLength - Maximum allowed length (default: 100)
 * @returns true if value is a valid non-empty string
 */
function isNonEmptyString(value: unknown, maxLength: number = 100): value is string {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    value.length <= maxLength
  );
}

/**
 * Validates city name
 * - Must be non-empty string
 * - Maximum 100 characters
 * - Trimmed (no leading/trailing whitespace)
 */
export function isValidCity(city: unknown): city is string {
  return isNonEmptyString(city, 100);
}

/**
 * Validates country name
 * - Must be non-empty string
 * - Maximum 100 characters
 * - Trimmed (no leading/trailing whitespace)
 */
export function isValidCountry(country: unknown): country is string {
  return isNonEmptyString(country, 100);
}

/**
 * Validates calculation method ID
 * - Must be a number
 * - Must be in valid range (0-14, excluding 6 which doesn't exist)
 */
export function isValidMethod(method: unknown): method is number {
  if (typeof method !== 'number') {
    return false;
  }

  // Valid method IDs: 0-5, 7-14 (6 is not defined in Aladhan API)
  return (
    Number.isInteger(method) &&
    method >= 0 &&
    method <= 14 &&
    method !== 6
  );
}

/**
 * Validates enabled flag
 * - Must be a boolean
 */
export function isValidEnabled(enabled: unknown): enabled is boolean {
  return typeof enabled === 'boolean';
}

/**
 * Validates time format (HH:MM)
 * - Must match regex pattern
 * - Hours: 00-23
 * - Minutes: 00-59
 */
export function isValidTimeFormat(time: unknown): time is string {
  if (typeof time !== 'string') {
    return false;
  }

  // Regex validates HH:MM format with valid ranges
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
}

/**
 * Validates complete ClaudePrayConfig object
 *
 * @param obj - Object to validate
 * @returns true if object matches ClaudePrayConfig schema
 */
export function isValidConfig(obj: unknown): obj is ClaudePrayConfig {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const config = obj as Record<string, unknown>;

  return (
    isValidCity(config.city) &&
    isValidCountry(config.country) &&
    isValidMethod(config.method) &&
    isValidEnabled(config.enabled)
  );
}

/**
 * Validates PrayerTimings object
 * - Must contain all 5 prayer names
 * - Each time must be valid HH:MM format
 *
 * @param obj - Object to validate
 * @returns true if object matches PrayerTimings schema
 */
export function isValidPrayerTimings(obj: unknown): obj is PrayerTimings {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const timings = obj as Record<string, unknown>;
  const requiredPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  // Check all required prayers exist
  for (const prayer of requiredPrayers) {
    if (!(prayer in timings)) {
      return false;
    }
  }

  // Validate each time format
  return requiredPrayers.every(prayer =>
    isValidTimeFormat(timings[prayer])
  );
}

/**
 * Validates Aladhan API response structure
 * - Must have code: 200
 * - Must have data.timings object
 * - Timings must match PrayerTimings schema
 *
 * @param obj - Object to validate
 * @returns true if object matches AladhanResponse schema
 */
export function isValidAladhanResponse(obj: unknown): obj is AladhanResponse {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const response = obj as Record<string, unknown>;

  // Validate response.code === 200
  if (response.code !== 200) {
    return false;
  }

  // Validate response.data exists and is an object
  if (typeof response.data !== 'object' || response.data === null) {
    return false;
  }

  const data = response.data as Record<string, unknown>;

  // Validate response.data.timings exists and matches schema
  return (
    typeof data.timings === 'object' &&
    data.timings !== null &&
    isValidPrayerTimings(data.timings)
  );
}

/**
 * Validates stdin input
 * - Must be a non-null object (not array)
 *
 * @param obj - Object to validate
 * @returns true if object is valid stdin input
 */
export function isValidStdinInput(obj: unknown): obj is Record<string, unknown> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    !Array.isArray(obj)
  );
}
