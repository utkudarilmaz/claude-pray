# claude-pray - Project Instructions for AI Assistants

This is a Claude Code plugin that displays Islamic prayer times in the statusline.

## Project Overview

**Purpose**: Display next prayer time with countdown in Claude Code's statusline
**Runtime**: Node.js 18+ or Bun (uses native fetch API)
**Language**: TypeScript (compiled to JavaScript ES2022 modules)
**API**: Aladhan Prayer Times API (https://api.aladhan.com/v1/timingsByCity)

## Project Structure

```
claude-pray/
├── .claude-plugin/
│   ├── plugin.json           # Plugin manifest (name, version, keywords)
│   ├── marketplace.json      # Marketplace metadata (owner, category, tags)
│   └── CLAUDE.md             # Plugin directory instructions
├── commands/
│   └── setup.md              # Interactive setup command documentation
├── src/
│   ├── index.ts              # Entry point - orchestrates stdin → config → render
│   ├── stdin.ts              # Parse JSON from Claude Code via stdin
│   ├── config.ts             # Read settings from ~/.claude/settings.json
│   ├── prayer-times.ts       # Fetch and calculate prayer times
│   ├── types.ts              # TypeScript interfaces and constants
│   └── render/
│       ├── index.ts          # Main render coordinator
│       ├── prayer-line.ts    # Prayer display formatting
│       └── colors.ts         # ANSI color helpers
├── tests/
│   ├── prayer-times.test.ts  # Prayer calculation tests
│   └── render.test.ts        # Render output tests
├── dist/                     # Compiled JavaScript (committed for plugin installation)
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript ES2022 + NodeNext modules
├── .gitignore
├── CHANGELOG.md              # Version history
├── README.md                 # User-facing documentation
└── CLAUDE.md                 # This file - AI assistant instructions
```

## Architecture

### Data Flow

```
stdin (JSON) → Config Loading → Prayer API → Next Prayer Calculation → Render → stdout
```

1. **stdin.ts**: Reads JSON input from Claude Code (contains cwd, git info, etc.)
2. **config.ts**: Loads `~/.claude/settings.json` and extracts `claudePray` section
3. **prayer-times.ts**: Fetches daily prayer times from Aladhan API (with in-memory cache)
4. **render/index.ts**: Coordinates rendering based on config and prayer data
5. **render/prayer-line.ts**: Formats output with ANSI colors
6. **index.ts**: Writes final output to stdout

### Configuration Schema

Settings are stored in `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash -c '\"node\" \"$(ls -td ~/.claude/plugins/cache/claude-pray/*/ 2>/dev/null | head -1)dist/index.js\"'"
  },
  "claudePray": {
    "city": "Dubai",
    "country": "UAE",
    "method": 4,
    "enabled": true
  }
}
```

**Field Descriptions:**
- `city`: City name for location-based prayer times
- `country`: Country code or name
- `method`: Calculation method ID (0-14, see types.ts CALCULATION_METHODS)
- `enabled`: Boolean flag to enable/disable the plugin

### Prayer Time Calculation

**Logic in `prayer-times.ts`:**

1. **Fetch**: Calls Aladhan API with city, country, and method parameters
2. **Cache**: Stores timings in memory for the current day (keyed by city:country:method)
3. **Calculate Next Prayer**:
   - Iterates through [Fajr, Dhuhr, Asr, Maghrib, Isha]
   - Finds first prayer with time > current time
   - If all prayers passed, returns tomorrow's Fajr
4. **Time Remaining**: Formats as "Xh Ym", "Xh", or "Ym"
5. **Now Flag**: Set true when prayer is within 15 minutes

**Display States:**
- `☪ Asr in 1h 23m` - Normal countdown
- `☪ Maghrib NOW` - Within 15 minutes (green highlight)
- `☪ Prayer times unavailable` - API error or network issue
- `☪ Run /claude-pray:setup` - Not configured

## Coding Patterns

### TypeScript Configuration

- **Target**: ES2022 (native fetch, top-level await)
- **Module System**: ESM with NodeNext (requires `.js` imports)
- **Strict Mode**: Enabled
- **Output**: `dist/` directory (committed to git for plugin installation)

### Import Style

All imports must include `.js` extension (ESM requirement):

```typescript
import { readStdin } from './stdin.js';  // ✓ Correct
import { readStdin } from './stdin';     // ✗ Wrong - will not resolve
```

### Error Handling

**Silent Failures**: The plugin must never crash Claude Code. All errors are caught and result in empty output or fallback messages.

```typescript
try {
  // Plugin logic
} catch (error) {
  // Silently fail - statusline should not crash Claude Code
  process.stdout.write('');
}
```

### Testing

**Framework**: Node.js native test runner (`node:test`)
**Pattern**: Import compiled code from `dist/` to test actual output

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert';

const { calculateNextPrayer } = await import('../dist/prayer-times.js');
```

**Run Tests**: `npm test` (builds first, then runs tests)

### Color Formatting

ANSI escape codes are used for terminal colors:

```typescript
export const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',    // Crescent symbol
  yellow: '\x1b[33m',  // Prayer name
  green: '\x1b[32m',   // "NOW" indicator
  dim: '\x1b[2m',      // Time remaining
  red: '\x1b[31m',     // Reserved for error states (not currently used)
};
```

**Note**: The `red()` helper function exists but is currently unused. It's reserved for potential future error display states (e.g., API failures, configuration errors).

## Development Workflow

### Build Commands

```bash
npm run build  # Compile TypeScript to dist/
npm run dev    # Watch mode for development
npm test       # Build + run tests
```

### Adding New Features

1. **Update types.ts** if new interfaces needed
2. **Implement logic** in appropriate module
3. **Add tests** in `tests/` directory
4. **Build and verify** with `npm test`
5. **Update README.md** for user-facing changes
6. **Update CLAUDE.md** for AI-specific patterns

### Plugin Installation Path

Claude Code installs plugins to:
```
~/.claude/plugins/cache/claude-pray/<version>/
```

The statusline command uses a glob pattern to find the latest version:
```bash
$(ls -td ~/.claude/plugins/cache/claude-pray/*/ 2>/dev/null | head -1)dist/index.js
```

## API Reference

### Aladhan API Endpoint

```
GET https://api.aladhan.com/v1/timingsByCity
  ?city={city}
  &country={country}
  &method={method}
```

**Response Structure** (see `AladhanResponse` in types.ts):
```json
{
  "code": 200,
  "data": {
    "timings": {
      "Fajr": "05:30",
      "Dhuhr": "12:30",
      "Asr": "15:45",
      "Maghrib": "18:15",
      "Isha": "19:45"
    }
  }
}
```

**Calculation Methods** (defined in `CALCULATION_METHODS`):
- 0: Shia Ithna-Ashari
- 1: University of Islamic Sciences, Karachi
- 2: Islamic Society of North America (ISNA) - Default
- 3: Muslim World League
- 4: Umm Al-Qura University, Makkah
- 5: Egyptian General Authority of Survey
- 7: Institute of Geophysics, University of Tehran
- 8: Gulf Region
- 9: Kuwait
- 10: Qatar
- 11: Majlis Ugama Islam Singapura
- 12: Union Organization Islamic de France
- 13: Diyanet İşleri Başkanlığı, Turkey
- 14: Spiritual Administration of Muslims of Russia

## Common Tasks

### Debugging Plugin Output

Run the plugin directly:
```bash
echo '{}' | node dist/index.js
```

Expected output examples:
```
☪ Asr in 1h 23m
☪ Maghrib NOW
☪ Run /claude-pray:setup
```

### Testing API Calls

```bash
curl "https://api.aladhan.com/v1/timingsByCity?city=Dubai&country=UAE&method=4"
```

### Validating Configuration

```bash
cat ~/.claude/settings.json | jq '.claudePray'
```

### Manual Plugin Installation

```bash
# Link for development
claude plugins add /absolute/path/to/claude-pray

# Or install from GitHub
claude plugins add github:username/claude-pray
```

## Dependencies

### Runtime
- **Node.js 18+** or **Bun** (for native fetch API)
- No external runtime dependencies

### Development
- `typescript` ^5.0.0 - TypeScript compiler
- `@types/node` ^20.0.0 - Node.js type definitions

### Why No Dependencies?

The plugin intentionally has zero runtime dependencies to:
1. Minimize installation size
2. Reduce potential conflicts
3. Improve load time for statusline updates
4. Use native Node.js APIs (fetch, fs/promises, path, os)

## Important Notes

- **Cache Strategy**: Prayer times are cached in memory per day to reduce API calls
- **Cache Key**: `city:country:method` ensures different locations don't conflict
- **Time Zones**: API automatically handles time zones based on city/country
- **Silent Failures**: Network errors or API failures result in "unavailable" message
- **No Sunrise**: Sunrise is fetched but not displayed (only 5 daily prayers shown)
- **Tomorrow's Fajr**: After Isha, displays countdown to next day's Fajr

## Setup Command

The `/claude-pray:setup` command is an interactive setup wizard documented in `commands/setup.md`.

**Flow:**
1. Detect runtime (prefer Bun, fallback to Node.js)
2. Ask for city and country
3. Let user select calculation method
4. Validate location by testing API
5. Update `~/.claude/settings.json`
6. Confirm success

**Implementation**: Claude Code reads `setup.md` and executes instructions using available tools (AskUserQuestion, Edit, Write, Bash).

## Troubleshooting

**Issue**: Prayer times not showing
- Check `~/.claude/settings.json` for `claudePray.enabled: true`
- Verify statusline command points to correct dist path
- Test API manually: `curl "https://api.aladhan.com/v1/timingsByCity?city=YourCity&country=YourCountry&method=2"`

**Issue**: Build errors
- Ensure TypeScript 5+ is installed: `npm install`
- Check Node.js version: `node --version` (18+ required)
- Clean and rebuild: `rm -rf dist && npm run build`

**Issue**: Tests failing
- Rebuild before testing: `npm run build`
- Tests mock Date object - time-sensitive tests may need adjustment

## Conventions

- Use camelCase for JSON field names
- Never add AI attribution to code or commits
- Follow conventional commits standard (fix:, feat:, docs:, etc.)
- Test coverage for core logic (prayer calculations, rendering)
- Minimal console output (plugin runs on every statusline update)

## Future Enhancements

Potential features (not yet implemented):
- Optional notification sound when prayer time arrives
- Support for custom calculation parameters (Fajr/Isha angles)
- Historical prayer time lookup
- Hijri calendar date display
- Qibla direction indicator
- Multiple location profiles
