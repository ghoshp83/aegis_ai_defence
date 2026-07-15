# Changelog

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.1.0] - 2026-07-15

### Added
- **Node.js CLI auditor** (`cli/nodejs/aegis-audit.js`) — the same Gemini
  audit as the web UI, as an exit-code gate for CI/CD (`--threshold`,
  `GEMINI_API_KEY` fallback). Previously only a roadmap README.
- **Mermaid architecture diagram** in the README, plus "Why this stack"
  and "Operational characteristics" sections.
- **20 new unit tests** (6 → 26): the RL-output parser, the
  truncated-JSON repairer, and the Node CLI's argument/score/prompt
  logic are now covered.
- This CHANGELOG.

### Changed
- `parseRLOutput` extracted from the RL optimizer's stream handler and
  exported (behaviour unchanged); `parseJSONRobust` exported — both for
  testability.

### Fixed
- README/docs claims aligned with the code: the app uses **Gemini 2.5
  Pro** (docs previously said "Gemini 3 Pro"); the RL Auto-Optimizer is
  now honestly described as a prompt-driven simulation; Node/Go CLI
  availability stated accurately; broken `docs/API.md` links removed;
  placeholder GitHub URLs and wrong repo name corrected;
  `.env.example` no longer advertises env vars no code reads.

## [1.0.0] - earlier

- Initial public release: React 19 + TypeScript UI, Gemini-powered
  static analysis, Active Defense (exploit PoC + remediated code diff),
  attack-simulator visualization, EU AI Act certificate, Veo video
  briefings, Python CLI, Docker + GitHub Actions CI.
