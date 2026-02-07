/**
 * Comprehensive validation tests for security utilities
 *
 * Tests cover:
 * - Prototype pollution prevention
 * - Input validation (city, country, method, time format)
 * - Schema validation (config, timings, API response)
 * - Edge cases and malicious inputs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';

// Import validation functions from compiled output
const {
  safeJsonParse,
  isValidCity,
  isValidCountry,
  isValidMethod,
  isValidEnabled,
  isValidTimeFormat,
  isValidConfig,
  isValidPrayerTimings,
  isValidAladhanResponse,
  isValidStdinInput,
} = await import('../dist/validation.js');

describe('Prototype Pollution Prevention', () => {
  it('should filter __proto__ from parsed JSON', () => {
    const malicious = '{"__proto__": {"polluted": true}, "city": "Dubai"}';
    const result = safeJsonParse(malicious);

    assert.strictEqual(result !== null, true, 'Should parse successfully');
    assert.strictEqual(Object.hasOwn(result as object, '__proto__'), false, 'Should not have __proto__ property');
    assert.strictEqual((Object.prototype as any).polluted, undefined, 'Object.prototype should not be polluted');
  });

  it('should filter constructor from parsed JSON', () => {
    const malicious = '{"constructor": {"polluted": true}, "city": "Dubai"}';
    const result = safeJsonParse(malicious);

    assert.strictEqual(result !== null, true, 'Should parse successfully');
    assert.strictEqual(Object.hasOwn(result as object, 'constructor'), false, 'Should not have constructor property');
  });

  it('should filter prototype from parsed JSON', () => {
    const malicious = '{"prototype": {"polluted": true}, "city": "Dubai"}';
    const result = safeJsonParse(malicious);

    assert.strictEqual(result !== null, true, 'Should parse successfully');
    assert.strictEqual(Object.hasOwn(result as object, 'prototype'), false, 'Should not have prototype property');
  });

  it('should filter dangerous keys from nested objects', () => {
    const malicious = '{"data": {"__proto__": {"polluted": true}, "timings": {}}}';
    const result = safeJsonParse(malicious) as any;

    assert.strictEqual(result !== null, true, 'Should parse successfully');
    assert.strictEqual(Object.hasOwn(result.data, '__proto__'), false, 'Nested object should not have __proto__');
    assert.strictEqual((Object.prototype as any).polluted, undefined, 'Object.prototype should not be polluted');
  });

  it('should handle arrays with dangerous keys in objects', () => {
    const malicious = '[{"__proto__": {"polluted": true}}]';
    const result = safeJsonParse(malicious) as any[];

    assert.strictEqual(Array.isArray(result), true, 'Should return array');
    assert.strictEqual(Object.hasOwn(result[0], '__proto__'), false, 'Array element should not have __proto__');
  });
});

describe('City Validation', () => {
  it('should accept valid city names', () => {
    assert.strictEqual(isValidCity('Dubai'), true);
    assert.strictEqual(isValidCity('New York'), true);
    assert.strictEqual(isValidCity('São Paulo'), true);
  });

  it('should reject empty strings', () => {
    assert.strictEqual(isValidCity(''), false);
    assert.strictEqual(isValidCity('   '), false);
  });

  it('should reject non-strings', () => {
    assert.strictEqual(isValidCity(123), false);
    assert.strictEqual(isValidCity(null), false);
    assert.strictEqual(isValidCity(undefined), false);
    assert.strictEqual(isValidCity({}), false);
  });

  it('should reject strings exceeding 100 characters', () => {
    const longString = 'a'.repeat(101);
    assert.strictEqual(isValidCity(longString), false);
  });

  it('should accept strings at 100 character limit', () => {
    const maxString = 'a'.repeat(100);
    assert.strictEqual(isValidCity(maxString), true);
  });
});

describe('Country Validation', () => {
  it('should accept valid country names', () => {
    assert.strictEqual(isValidCountry('UAE'), true);
    assert.strictEqual(isValidCountry('United States'), true);
    assert.strictEqual(isValidCountry('UK'), true);
  });

  it('should reject empty strings', () => {
    assert.strictEqual(isValidCountry(''), false);
    assert.strictEqual(isValidCountry('   '), false);
  });

  it('should reject non-strings', () => {
    assert.strictEqual(isValidCountry(123), false);
    assert.strictEqual(isValidCountry(null), false);
  });
});

describe('Method Validation', () => {
  it('should accept valid method IDs (0-5, 7-14)', () => {
    assert.strictEqual(isValidMethod(0), true);
    assert.strictEqual(isValidMethod(1), true);
    assert.strictEqual(isValidMethod(5), true);
    assert.strictEqual(isValidMethod(7), true);
    assert.strictEqual(isValidMethod(14), true);
  });

  it('should reject method ID 6 (does not exist in Aladhan API)', () => {
    assert.strictEqual(isValidMethod(6), false);
  });

  it('should reject out-of-range method IDs', () => {
    assert.strictEqual(isValidMethod(-1), false);
    assert.strictEqual(isValidMethod(15), false);
    assert.strictEqual(isValidMethod(100), false);
  });

  it('should reject non-integers', () => {
    assert.strictEqual(isValidMethod(3.5), false);
    assert.strictEqual(isValidMethod('3'), false);
    assert.strictEqual(isValidMethod(null), false);
  });
});

describe('Enabled Flag Validation', () => {
  it('should accept boolean values', () => {
    assert.strictEqual(isValidEnabled(true), true);
    assert.strictEqual(isValidEnabled(false), true);
  });

  it('should reject non-boolean values', () => {
    assert.strictEqual(isValidEnabled(1), false);
    assert.strictEqual(isValidEnabled('true'), false);
    assert.strictEqual(isValidEnabled(null), false);
  });
});

describe('Time Format Validation', () => {
  it('should accept valid HH:MM times', () => {
    assert.strictEqual(isValidTimeFormat('00:00'), true);
    assert.strictEqual(isValidTimeFormat('05:30'), true);
    assert.strictEqual(isValidTimeFormat('12:45'), true);
    assert.strictEqual(isValidTimeFormat('23:59'), true);
  });

  it('should reject invalid hours (24+)', () => {
    assert.strictEqual(isValidTimeFormat('24:00'), false);
    assert.strictEqual(isValidTimeFormat('25:30'), false);
  });

  it('should reject invalid minutes (60+)', () => {
    assert.strictEqual(isValidTimeFormat('12:60'), false);
    assert.strictEqual(isValidTimeFormat('12:99'), false);
  });

  it('should reject malformed time strings', () => {
    assert.strictEqual(isValidTimeFormat('5:30'), false); // Missing leading zero
    assert.strictEqual(isValidTimeFormat('05:5'), false); // Missing leading zero
    assert.strictEqual(isValidTimeFormat('invalid'), false);
    assert.strictEqual(isValidTimeFormat('12-30'), false);
  });

  it('should reject non-strings', () => {
    assert.strictEqual(isValidTimeFormat(530), false);
    assert.strictEqual(isValidTimeFormat(null), false);
  });
});

describe('Config Schema Validation', () => {
  it('should accept valid config object', () => {
    const validConfig = {
      city: 'Dubai',
      country: 'UAE',
      method: 4,
      enabled: true,
    };

    assert.strictEqual(isValidConfig(validConfig), true);
  });

  it('should reject config with missing fields', () => {
    const missingCity = {
      country: 'UAE',
      method: 4,
      enabled: true,
    };

    assert.strictEqual(isValidConfig(missingCity), false);
  });

  it('should reject config with wrong types', () => {
    const wrongTypes = {
      city: 123, // Should be string
      country: 'UAE',
      method: 4,
      enabled: true,
    };

    assert.strictEqual(isValidConfig(wrongTypes), false);
  });

  it('should reject config with invalid method', () => {
    const invalidMethod = {
      city: 'Dubai',
      country: 'UAE',
      method: 6, // Invalid method ID
      enabled: true,
    };

    assert.strictEqual(isValidConfig(invalidMethod), false);
  });

  it('should reject non-object inputs', () => {
    assert.strictEqual(isValidConfig(null), false);
    assert.strictEqual(isValidConfig('config'), false);
    assert.strictEqual(isValidConfig([]), false);
  });
});

describe('PrayerTimings Schema Validation', () => {
  it('should accept valid prayer timings', () => {
    const validTimings = {
      Fajr: '05:30',
      Dhuhr: '12:30',
      Asr: '15:45',
      Maghrib: '18:15',
      Isha: '19:45',
    };

    assert.strictEqual(isValidPrayerTimings(validTimings), true);
  });

  it('should reject timings with missing prayers', () => {
    const missingAsr = {
      Fajr: '05:30',
      Dhuhr: '12:30',
      Maghrib: '18:15',
      Isha: '19:45',
    };

    assert.strictEqual(isValidPrayerTimings(missingAsr), false);
  });

  it('should reject timings with invalid time formats', () => {
    const invalidFormat = {
      Fajr: '25:99', // Invalid time
      Dhuhr: '12:30',
      Asr: '15:45',
      Maghrib: '18:15',
      Isha: '19:45',
    };

    assert.strictEqual(isValidPrayerTimings(invalidFormat), false);
  });

  it('should reject non-object inputs', () => {
    assert.strictEqual(isValidPrayerTimings(null), false);
    assert.strictEqual(isValidPrayerTimings('timings'), false);
  });
});

describe('AladhanResponse Schema Validation', () => {
  it('should accept valid API response', () => {
    const validResponse = {
      code: 200,
      data: {
        timings: {
          Fajr: '05:30',
          Dhuhr: '12:30',
          Asr: '15:45',
          Maghrib: '18:15',
          Isha: '19:45',
        },
      },
    };

    assert.strictEqual(isValidAladhanResponse(validResponse), true);
  });

  it('should reject response with non-200 code', () => {
    const errorResponse = {
      code: 500,
      data: {
        timings: {
          Fajr: '05:30',
          Dhuhr: '12:30',
          Asr: '15:45',
          Maghrib: '18:15',
          Isha: '19:45',
        },
      },
    };

    assert.strictEqual(isValidAladhanResponse(errorResponse), false);
  });

  it('should reject response with missing data.timings', () => {
    const missingTimings = {
      code: 200,
      data: {},
    };

    assert.strictEqual(isValidAladhanResponse(missingTimings), false);
  });

  it('should reject response with invalid timings', () => {
    const invalidTimings = {
      code: 200,
      data: {
        timings: {
          Fajr: 'invalid',
          Dhuhr: '12:30',
          Asr: '15:45',
          Maghrib: '18:15',
          Isha: '19:45',
        },
      },
    };

    assert.strictEqual(isValidAladhanResponse(invalidTimings), false);
  });

  it('should reject non-object inputs', () => {
    assert.strictEqual(isValidAladhanResponse(null), false);
    assert.strictEqual(isValidAladhanResponse('response'), false);
  });
});

describe('StdinInput Validation', () => {
  it('should accept valid object inputs', () => {
    assert.strictEqual(isValidStdinInput({}), true);
    assert.strictEqual(isValidStdinInput({ cwd: '/path' }), true);
  });

  it('should reject arrays', () => {
    assert.strictEqual(isValidStdinInput([]), false);
    assert.strictEqual(isValidStdinInput([1, 2, 3]), false);
  });

  it('should reject null and non-objects', () => {
    assert.strictEqual(isValidStdinInput(null), false);
    assert.strictEqual(isValidStdinInput('string'), false);
    assert.strictEqual(isValidStdinInput(123), false);
  });
});

describe('safeJsonParse Integration', () => {
  it('should parse valid JSON without validator', () => {
    const json = '{"city": "Dubai"}';
    const result = safeJsonParse(json);

    assert.notStrictEqual(result, null);
    assert.deepStrictEqual(result, { city: 'Dubai' });
  });

  it('should return null for invalid JSON', () => {
    const invalid = '{invalid json}';
    const result = safeJsonParse(invalid);

    assert.strictEqual(result, null);
  });

  it('should validate with type guard', () => {
    const validJson = '{"city": "Dubai", "country": "UAE", "method": 4, "enabled": true}';
    const result = safeJsonParse(validJson, isValidConfig);

    assert.notStrictEqual(result, null);
  });

  it('should return null when validation fails', () => {
    const invalidJson = '{"city": "Dubai"}'; // Missing required fields
    const result = safeJsonParse(invalidJson, isValidConfig);

    assert.strictEqual(result, null);
  });

  it('should handle malicious API response', () => {
    const malicious = JSON.stringify({
      __proto__: { polluted: true },
      code: 200,
      data: {
        timings: {
          Fajr: '05:30',
          Dhuhr: '12:30',
          Asr: '15:45',
          Maghrib: '18:15',
          Isha: '19:45',
        },
      },
    });

    const result = safeJsonParse(malicious, isValidAladhanResponse);

    assert.notStrictEqual(result, null, 'Should parse valid response');
    assert.strictEqual(Object.hasOwn(result as object, '__proto__'), false, 'Should filter __proto__');
    assert.strictEqual((Object.prototype as any).polluted, undefined, 'Should not pollute prototype');
  });
});
