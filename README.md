# claude-pray

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)

Islamic prayer times statusline plugin for Claude Code.

## Features

- Displays next prayer time in Claude Code statusline
- Supports 15 calculation methods (ISNA, MWL, Umm Al-Qura, etc.)
- Shows countdown to next prayer (e.g., "in 1h 23m")
- Highlights when prayer time is imminent ("NOW" within 15 minutes)
- After Isha, shows time until tomorrow's Fajr
- Zero runtime dependencies (uses native Node.js fetch)
- In-memory caching to minimize API calls

## Requirements

- Node.js 18+ or Bun
- Claude Code (for plugin integration)

## Installation

Install as a Claude Code plugin:

```bash
claude plugins add /path/to/claude-pray
```

Or from GitHub (replace with your GitHub username):

```bash
claude plugins add github:yourusername/claude-pray
```

## Setup

Run the setup command in Claude Code:

```
/claude-pray:setup
```

This will:
1. Ask for your city and country
2. Let you select a calculation method
3. Configure the statusline

## Manual Configuration

If you prefer manual setup, edit `~/.claude/settings.json`:

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

**Configuration Fields:**
- `city`: Your city name (e.g., "Dubai", "New York", "London")
- `country`: Your country code or name (e.g., "UAE", "USA", "UK")
- `method`: Calculation method ID (see table below)
- `enabled`: Set to `true` to activate the plugin

Replace `node` with `bun` in the command if you prefer using Bun runtime.

## Calculation Methods

| ID | Method | Recommended For |
|----|--------|-----------------|
| 0 | Shia Ithna-Ashari | Shia communities |
| 1 | University of Islamic Sciences, Karachi | Pakistan, Bangladesh, India |
| 2 | Islamic Society of North America (ISNA) | North America (default) |
| 3 | Muslim World League | Europe, Far East |
| 4 | Umm Al-Qura University, Makkah | Saudi Arabia |
| 5 | Egyptian General Authority of Survey | Africa, Syria, Lebanon |
| 7 | Institute of Geophysics, University of Tehran | Iran |
| 8 | Gulf Region | UAE, Kuwait, Qatar |
| 9 | Kuwait | Kuwait |
| 10 | Qatar | Qatar |
| 11 | Majlis Ugama Islam Singapura | Singapore |
| 12 | Union Organization Islamic de France | France |
| 13 | Diyanet İşleri Başkanlığı | Turkey |
| 14 | Spiritual Administration of Muslims of Russia | Russia |

The default method is ISNA (ID: 2) if not configured.

## Display

The statusline shows:

- `☪ Asr in 1h 23m` - Next prayer with countdown
- `☪ Maghrib NOW` - When within 15 minutes of prayer time
- `☪ Run /claude-pray:setup` - When not configured

## API

This plugin uses the [Aladhan Prayer Times API](https://aladhan.com/prayer-times-api).

**Privacy**: Prayer times are fetched based on your city and country. No personal data is transmitted.

## Development

```bash
# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Run tests (builds first, then runs Node.js test runner)
npm test

# Watch mode for development
npm run dev
```

**Note**: The `dist/` directory is committed to the repository to enable direct plugin installation without requiring users to build from source.

### Project Structure

```
src/
├── index.ts              # Entry point
├── stdin.ts              # Parse Claude Code JSON input
├── config.ts             # Read ~/.claude/settings.json
├── prayer-times.ts       # Fetch and calculate prayer times
├── types.ts              # TypeScript interfaces
└── render/
    ├── index.ts          # Main render coordinator
    ├── prayer-line.ts    # Prayer display formatting
    └── colors.ts         # ANSI color helpers
```

### Testing Locally

Run the plugin directly to test output:

```bash
npm run build
echo '{}' | node dist/index.js
```

Expected output: `☪ Asr in 1h 23m` (or setup prompt if not configured)

## Troubleshooting

**Prayer times not showing?**
1. Verify configuration in `~/.claude/settings.json`
2. Check that `claudePray.enabled` is `true`
3. Test the API manually:
   ```bash
   curl "https://api.aladhan.com/v1/timingsByCity?city=YourCity&country=YourCountry&method=2"
   ```
4. Restart Claude Code to reload the statusline

**Build errors?**
- Ensure Node.js 18+ is installed: `node --version`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Clean build: `rm -rf dist && npm run build`

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

MIT
