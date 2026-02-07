---
description: Configure claude-pray with your location and prayer calculation method
allowed-tools: Bash, Read, Edit, Write, AskUserQuestion
---

# claude-pray Setup

You are setting up the claude-pray statusline plugin. Follow these steps carefully:

## Step 1: Detect Environment

First, detect the platform and available runtime:

```bash
# Check platform
uname -s

# Check for bun
which bun 2>/dev/null && bun --version

# Check for node
which node 2>/dev/null && node --version
```

Prefer `bun` if available, otherwise use `node` (version 18+ required for native fetch).

## Step 2: Get User Location

Ask the user for their location using AskUserQuestion:

1. **City**: Ask "What city are you in?" with common examples as options plus "Other" for custom input
2. **Country**: Ask "What country?" with common options plus "Other"

## Step 3: Select Calculation Method

Present the calculation methods and ask the user to choose. Common methods:

| Method | Name | Best For |
|--------|------|----------|
| 2 | Islamic Society of North America (ISNA) | North America |
| 3 | Muslim World League | Europe, Far East |
| 4 | Umm Al-Qura University | Saudi Arabia |
| 5 | Egyptian General Authority | Africa, Syria, Lebanon |
| 1 | University of Islamic Sciences, Karachi | Pakistan, Bangladesh, India |
| 13 | Diyanet İşleri Başkanlığı | Turkey |
| 8 | Gulf Region | UAE, Kuwait, Qatar |

Use AskUserQuestion to let them pick from the most common methods, with "Other" option to show the full list.

## Step 4: Validate Location

Test the API to ensure the location is valid:

```bash
curl -s "https://api.aladhan.com/v1/timingsByCity?city=CITY&country=COUNTRY&method=METHOD"
```

Check that the response has `"code": 200` and contains prayer times data. If not, inform the user that the location may be invalid and ask them to:
- Check city/country spelling
- Try using a major city nearby
- Verify the country code or name

## Step 5: Update Settings

Read the current settings file:

```bash
cat ~/.claude/settings.json 2>/dev/null || echo '{}'
```

Then update it with the new configuration. The settings should include:

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash -c '\"RUNTIME\" \"$(ls -td ~/.claude/plugins/cache/claude-pray/*/ 2>/dev/null | head -1)dist/index.js\"'"
  },
  "claudePray": {
    "city": "USER_CITY",
    "country": "USER_COUNTRY",
    "method": METHOD_NUMBER,
    "enabled": true
  }
}
```

Where:
- `RUNTIME` is either `bun` or `node` (full path preferred)
- `USER_CITY`, `USER_COUNTRY`, `METHOD_NUMBER` are from user input

Use the Edit or Write tool to update `~/.claude/settings.json`, merging with existing settings.

## Step 6: Confirm Success

After updating settings, show a success message:

```
✓ claude-pray configured successfully!

Location: {city}, {country}
Method: {method_name}

Prayer times will appear in your statusline. Restart Claude Code if needed.

You can test the plugin by running:
echo '{}' | node $(ls -td ~/.claude/plugins/cache/claude-pray/*/ 2>/dev/null | head -1)dist/index.js
```

## Error Handling

- If the API returns an error, suggest the user check their city/country spelling
- If settings.json can't be written, show the required JSON for manual configuration
- If neither bun nor node is available, guide the user to install one

## Full Calculation Methods Reference

If user selects "Other" or needs the full list:

- 0: Shia Ithna-Ashari
- 1: University of Islamic Sciences, Karachi
- 2: Islamic Society of North America (ISNA)
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
