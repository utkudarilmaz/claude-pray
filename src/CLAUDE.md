# Source Directory

This directory contains the TypeScript source code for the claude-pray plugin.

## Files

- `index.ts` - Entry point that orchestrates stdin → config → render → stdout
- `stdin.ts` - Parses JSON input from Claude Code via stdin
- `config.ts` - Reads settings from ~/.claude/settings.json
- `prayer-times.ts` - Fetches and calculates prayer times from Aladhan API
- `types.ts` - TypeScript interfaces, types, and constants

## Subdirectories

- `render/` - Output rendering and formatting logic
