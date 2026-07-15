#!/usr/bin/env node
/**
 * AEGIS - Node.js Auditor
 * Analyzes neural network code for security vulnerabilities.
 *
 * Usage:
 *   node aegis-audit.js --file model.js --api-key KEY --threshold 80
 *
 * Mirrors cli/python/aegis_audit.py: prints the Gemini analysis, extracts
 * an N/100 security score if present, and exits 1 when below --threshold
 * so it can gate CI/CD pipelines.
 */

import { readFileSync } from 'node:fs';
import process from 'node:process';

export function parseArgs(argv) {
  const args = { file: null, apiKey: process.env.GEMINI_API_KEY || null, threshold: 70 };
  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--file':
        args.file = argv[++i];
        break;
      case '--api-key':
        args.apiKey = argv[++i];
        break;
      case '--threshold': {
        const t = parseInt(argv[++i], 10);
        if (Number.isNaN(t)) throw new Error(`--threshold must be a number, got: ${argv[i]}`);
        args.threshold = t;
        break;
      }
      default:
        throw new Error(`Unknown argument: ${argv[i]}`);
    }
  }
  if (!args.file) throw new Error('--file is required');
  if (!args.apiKey) throw new Error('--api-key is required (or set GEMINI_API_KEY)');
  return args;
}

// Same heuristic as the Python CLI: first "N/100" occurrence is the score.
export function extractScore(text) {
  const match = text.match(/(\d+)\/100/);
  return match ? parseInt(match[1], 10) : null;
}

export function buildPrompt(code) {
  return `Analyze this neural network code for security vulnerabilities and provide a brief report.

Focus on:
1. Hardcoded input shapes
2. Missing regularization (Dropout, BatchNorm)
3. Adversarial susceptibility
4. Parameter efficiency issues

Code:
\`\`\`
${code}
\`\`\`

Provide:
- Security score (0-100)
- List of vulnerabilities found
- Recommendations

Keep it concise.`;
}

async function analyzeCode(filePath, apiKey) {
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey });
  const code = readFileSync(filePath, 'utf8');
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: [{ role: 'user', parts: [{ text: buildPrompt(code) }] }],
    config: { temperature: 0.3 },
  });
  return response.text;
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (e) {
    console.error(`❌ ${e.message}`);
    console.error('Usage: node aegis-audit.js --file model.js --api-key KEY [--threshold 70]');
    process.exit(1);
  }

  console.log(`🛡️  AEGIS Node.js Agent analyzing ${args.file}...`);
  console.log('='.repeat(60));

  try {
    const result = await analyzeCode(args.file, args.apiKey);
    console.log(result);
    console.log('='.repeat(60));

    const score = extractScore(result);
    if (score !== null) {
      console.log(`\n📊 Security Score: ${score}/100`);
      if (score < args.threshold) {
        console.log(`❌ FAIL: Score below threshold (${args.threshold})`);
        process.exit(1);
      }
      console.log(`✅ PASS: Score >= threshold (${args.threshold})`);
      process.exit(0);
    }

    console.log('\n✅ Analysis complete (no numeric score extracted)');
    process.exit(0);
  } catch (e) {
    console.error(`\n❌ Error: ${e.message}`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
