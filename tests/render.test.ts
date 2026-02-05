import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Render', () => {
  describe('renderPrayerLine', () => {
    it('should render prayer with time remaining', async () => {
      const { renderPrayerLine } = await import('../dist/render/prayer-line.js');

      const prayer = {
        name: 'Asr',
        time: new Date(),
        remaining: '1h 23m',
        isNow: false,
      };

      const result = renderPrayerLine(prayer);

      // Should contain the crescent symbol
      assert.ok(result.includes('☪'));
      // Should contain prayer name
      assert.ok(result.includes('Asr'));
      // Should contain time remaining
      assert.ok(result.includes('1h 23m'));
      // Should not contain NOW
      assert.ok(!result.includes('NOW'));
    });

    it('should render NOW when prayer is imminent', async () => {
      const { renderPrayerLine } = await import('../dist/render/prayer-line.js');

      const prayer = {
        name: 'Maghrib',
        time: new Date(),
        remaining: '5m',
        isNow: true,
      };

      const result = renderPrayerLine(prayer);

      assert.ok(result.includes('☪'));
      assert.ok(result.includes('Maghrib'));
      assert.ok(result.includes('NOW'));
    });

    it('should render unavailable message when prayer is null', async () => {
      const { renderPrayerLine } = await import('../dist/render/prayer-line.js');

      const result = renderPrayerLine(null);

      assert.ok(result.includes('☪'));
      assert.ok(result.includes('unavailable'));
    });
  });

  describe('renderSetupPrompt', () => {
    it('should prompt to run setup', async () => {
      const { renderSetupPrompt } = await import('../dist/render/prayer-line.js');

      const result = renderSetupPrompt();

      assert.ok(result.includes('☪'));
      assert.ok(result.includes('setup'));
    });
  });
});

describe('Colors', () => {
  it('should export color functions', async () => {
    const colors = await import('../dist/render/colors.js');

    assert.equal(typeof colors.cyan, 'function');
    assert.equal(typeof colors.yellow, 'function');
    assert.equal(typeof colors.green, 'function');
    assert.equal(typeof colors.dim, 'function');
  });

  it('should wrap text with ANSI codes', async () => {
    const { cyan, yellow } = await import('../dist/render/colors.js');

    const cyanText = cyan('test');
    const yellowText = yellow('test');

    // Should contain escape codes
    assert.ok(cyanText.includes('\x1b['));
    assert.ok(yellowText.includes('\x1b['));
    // Should contain the text
    assert.ok(cyanText.includes('test'));
    assert.ok(yellowText.includes('test'));
  });
});
