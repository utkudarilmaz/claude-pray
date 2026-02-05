# Tests Directory

This directory contains test files for the claude-pray plugin.

## Testing Framework

Uses Node.js native test runner (`node:test`) with no external dependencies.

## Files

- `prayer-times.test.ts` - Tests for prayer time calculation logic
- `render.test.ts` - Tests for render output formatting

## Running Tests

```bash
npm test  # Builds the project first, then runs tests
```

Tests import compiled code from `dist/` to validate actual output.
