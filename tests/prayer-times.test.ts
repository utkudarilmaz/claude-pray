import { describe, it, mock } from 'node:test';
import assert from 'node:assert';

// Mock timings for testing
const mockTimings = {
  Fajr: '05:30',
  Sunrise: '06:45',
  Dhuhr: '12:30',
  Asr: '15:45',
  Maghrib: '18:15',
  Isha: '19:45',
};

// Helper to create a date at specific time today
function todayAt(hours: number, minutes: number): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
}

describe('Prayer Times', () => {
  describe('calculateNextPrayer', () => {
    it('should return Fajr when before Fajr', async () => {
      // Dynamic import to test
      const { calculateNextPrayer } = await import('../dist/prayer-times.js');

      // Mock current time to 04:00
      const originalDate = Date;
      const mockNow = todayAt(4, 0);

      // @ts-ignore - mocking Date
      global.Date = class extends originalDate {
        constructor(...args: any[]) {
          if (args.length === 0) {
            super(mockNow);
            return this;
          }
          // @ts-ignore
          super(...args);
        }
        static now() {
          return mockNow.getTime();
        }
      };

      try {
        const result = calculateNextPrayer(mockTimings);
        assert.equal(result?.name, 'Fajr');
        assert.equal(result?.isNow, false);
      } finally {
        global.Date = originalDate;
      }
    });

    it('should return Dhuhr when after Fajr but before Dhuhr', async () => {
      const { calculateNextPrayer } = await import('../dist/prayer-times.js');

      const originalDate = Date;
      const mockNow = todayAt(10, 0);

      // @ts-ignore
      global.Date = class extends originalDate {
        constructor(...args: any[]) {
          if (args.length === 0) {
            super(mockNow);
            return this;
          }
          // @ts-ignore
          super(...args);
        }
        static now() {
          return mockNow.getTime();
        }
      };

      try {
        const result = calculateNextPrayer(mockTimings);
        assert.equal(result?.name, 'Dhuhr');
      } finally {
        global.Date = originalDate;
      }
    });

    it('should return tomorrow Fajr when after Isha', async () => {
      const { calculateNextPrayer } = await import('../dist/prayer-times.js');

      const originalDate = Date;
      const mockNow = todayAt(22, 0);

      // @ts-ignore
      global.Date = class extends originalDate {
        constructor(...args: any[]) {
          if (args.length === 0) {
            super(mockNow);
            return this;
          }
          // @ts-ignore
          super(...args);
        }
        static now() {
          return mockNow.getTime();
        }
      };

      try {
        const result = calculateNextPrayer(mockTimings);
        assert.equal(result?.name, 'Fajr');
        // Tomorrow's Fajr
        const tomorrow = new Date(mockNow);
        tomorrow.setDate(tomorrow.getDate() + 1);
        assert.equal(result?.time.getDate(), tomorrow.getDate());
      } finally {
        global.Date = originalDate;
      }
    });

    it('should mark as NOW when within 15 minutes', async () => {
      const { calculateNextPrayer } = await import('../dist/prayer-times.js');

      const originalDate = Date;
      // 10 minutes before Asr (15:45)
      const mockNow = todayAt(15, 35);

      // @ts-ignore
      global.Date = class extends originalDate {
        constructor(...args: any[]) {
          if (args.length === 0) {
            super(mockNow);
            return this;
          }
          // @ts-ignore
          super(...args);
        }
        static now() {
          return mockNow.getTime();
        }
      };

      try {
        const result = calculateNextPrayer(mockTimings);
        assert.equal(result?.name, 'Asr');
        assert.equal(result?.isNow, true);
      } finally {
        global.Date = originalDate;
      }
    });
  });
});

describe('Time Formatting', () => {
  it('should format hours and minutes correctly', async () => {
    // This tests the formatTimeRemaining function indirectly
    const { calculateNextPrayer } = await import('../dist/prayer-times.js');

    const originalDate = Date;
    // 2 hours 30 minutes before Dhuhr (12:30)
    const mockNow = todayAt(10, 0);

    // @ts-ignore
    global.Date = class extends originalDate {
      constructor(...args: any[]) {
        if (args.length === 0) {
          super(mockNow);
          return this;
        }
        // @ts-ignore
        super(...args);
      }
      static now() {
        return mockNow.getTime();
      }
    };

    try {
      const result = calculateNextPrayer(mockTimings);
      assert.equal(result?.remaining, '2h 30m');
    } finally {
      global.Date = originalDate;
    }
  });

  it('should format minutes only when less than an hour', async () => {
    const { calculateNextPrayer } = await import('../dist/prayer-times.js');

    const originalDate = Date;
    // 45 minutes before Dhuhr (12:30)
    const mockNow = todayAt(11, 45);

    // @ts-ignore
    global.Date = class extends originalDate {
      constructor(...args: any[]) {
        if (args.length === 0) {
          super(mockNow);
          return this;
        }
        // @ts-ignore
        super(...args);
      }
      static now() {
        return mockNow.getTime();
      }
    };

    try {
      const result = calculateNextPrayer(mockTimings);
      assert.equal(result?.remaining, '45m');
    } finally {
      global.Date = originalDate;
    }
  });
});
