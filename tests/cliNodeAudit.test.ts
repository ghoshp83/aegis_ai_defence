import { describe, test, expect, beforeEach, afterAll } from 'vitest';
import { parseArgs, extractScore, buildPrompt } from '../cli/nodejs/aegis-audit.js';

const savedKey = process.env.GEMINI_API_KEY;

beforeEach(() => {
  delete process.env.GEMINI_API_KEY;
});

afterAll(() => {
  if (savedKey !== undefined) process.env.GEMINI_API_KEY = savedKey;
});

describe('Node CLI parseArgs', () => {
  test('parses file, api-key and threshold', () => {
    const args = parseArgs(['--file', 'model.js', '--api-key', 'k123', '--threshold', '80']);
    expect(args).toEqual({ file: 'model.js', apiKey: 'k123', threshold: 80 });
  });

  test('threshold defaults to 70', () => {
    const args = parseArgs(['--file', 'model.js', '--api-key', 'k123']);
    expect(args.threshold).toBe(70);
  });

  test('falls back to GEMINI_API_KEY env var', () => {
    process.env.GEMINI_API_KEY = 'env-key';
    const args = parseArgs(['--file', 'model.js']);
    expect(args.apiKey).toBe('env-key');
  });

  test('rejects missing --file', () => {
    expect(() => parseArgs(['--api-key', 'k123'])).toThrow('--file is required');
  });

  test('rejects missing api key when env is unset', () => {
    expect(() => parseArgs(['--file', 'model.js'])).toThrow('--api-key is required');
  });

  test('rejects non-numeric threshold and unknown flags', () => {
    expect(() => parseArgs(['--file', 'f', '--api-key', 'k', '--threshold', 'high'])).toThrow(
      '--threshold must be a number'
    );
    expect(() => parseArgs(['--file', 'f', '--api-key', 'k', '--bogus'])).toThrow(
      'Unknown argument: --bogus'
    );
  });
});

describe('Node CLI extractScore', () => {
  test('extracts the first N/100 score from the report', () => {
    expect(extractScore('Security score: 45/100. Robustness: 80/100.')).toBe(45);
  });

  test('returns null when no score is present, so the gate cannot false-fail', () => {
    expect(extractScore('No numeric verdict in this analysis.')).toBeNull();
  });
});

describe('Node CLI buildPrompt', () => {
  test('embeds the model code and the audit focus areas', () => {
    const prompt = buildPrompt('const model = tf.sequential();');
    expect(prompt).toContain('const model = tf.sequential();');
    expect(prompt).toContain('Hardcoded input shapes');
    expect(prompt).toContain('Security score (0-100)');
  });
});
