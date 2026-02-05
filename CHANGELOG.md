# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- `dist/` directory is now committed to repository for direct plugin installation without requiring build step

## [0.1.0] - 2026-02-06

### Added

- Initial release of claude-pray plugin
- Real-time prayer time display in Claude Code statusline
- Support for 15 calculation methods (ISNA, MWL, Umm Al-Qura, Shia Ithna-Ashari, etc.)
- Countdown timer showing time until next prayer (e.g., "in 1h 23m")
- "NOW" indicator when prayer time is within 15 minutes
- Automatic transition to next day's Fajr after Isha
- Interactive setup command (`/claude-pray:setup`)
- In-memory caching to minimize API calls
- Zero runtime dependencies (uses native Node.js fetch)
- Integration with Aladhan Prayer Times API
