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
/**
 * Safely parses JSON string with prototype pollution protection
 * and optional schema validation.
 *
 * @param input - JSON string to parse
 * @param validator - Optional type guard function for schema validation
 * @returns Parsed and validated object, or null on failure
 */
export declare function safeJsonParse<T>(input: string, validator?: (obj: unknown) => obj is T): T | null;
/**
 * Validates city name
 * - Must be non-empty string
 * - Maximum 100 characters
 * - Trimmed (no leading/trailing whitespace)
 */
export declare function isValidCity(city: unknown): city is string;
/**
 * Validates country name
 * - Must be non-empty string
 * - Maximum 100 characters
 * - Trimmed (no leading/trailing whitespace)
 */
export declare function isValidCountry(country: unknown): country is string;
/**
 * Validates calculation method ID
 * - Must be a number
 * - Must be in valid range (0-14, excluding 6 which doesn't exist)
 */
export declare function isValidMethod(method: unknown): method is number;
/**
 * Validates enabled flag
 * - Must be a boolean
 */
export declare function isValidEnabled(enabled: unknown): enabled is boolean;
/**
 * Validates time format (HH:MM)
 * - Must match regex pattern
 * - Hours: 00-23
 * - Minutes: 00-59
 */
export declare function isValidTimeFormat(time: unknown): time is string;
/**
 * Validates complete ClaudePrayConfig object
 *
 * @param obj - Object to validate
 * @returns true if object matches ClaudePrayConfig schema
 */
export declare function isValidConfig(obj: unknown): obj is ClaudePrayConfig;
/**
 * Validates PrayerTimings object
 * - Must contain all 5 prayer names
 * - Each time must be valid HH:MM format
 *
 * @param obj - Object to validate
 * @returns true if object matches PrayerTimings schema
 */
export declare function isValidPrayerTimings(obj: unknown): obj is PrayerTimings;
/**
 * Validates Aladhan API response structure
 * - Must have code: 200
 * - Must have data.timings object
 * - Timings must match PrayerTimings schema
 *
 * @param obj - Object to validate
 * @returns true if object matches AladhanResponse schema
 */
export declare function isValidAladhanResponse(obj: unknown): obj is AladhanResponse;
/**
 * Validates stdin input
 * - Must be a non-null object (not array)
 *
 * @param obj - Object to validate
 * @returns true if object is valid stdin input
 */
export declare function isValidStdinInput(obj: unknown): obj is Record<string, unknown>;
