# ⚡ AEGIS Node.js CLI

Standalone Node.js auditor — the same Gemini-powered security audit as the
web UI, as an exit-code gate for CI/CD pipelines.

## Installation

```bash
npm install @google/genai   # already installed if you ran npm install at the repo root
```

## Usage

```bash
node aegis-audit.js \
  --file your_model.js \
  --api-key YOUR_GEMINI_KEY \
  --threshold 80
```

- `--api-key` may be omitted if `GEMINI_API_KEY` is set in the environment.
- `--threshold` defaults to 70. If the analysis reports a security score
  below it, the process exits `1` — failing the build.
- If no numeric score can be extracted, the analysis is printed and the
  process exits `0` (the gate never false-fails on formatting).

## Planned Features

- TensorFlow.js model analysis
- ONNX.js support
- npm package distribution
