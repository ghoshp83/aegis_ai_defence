import { describe, test, expect } from 'vitest';
import { parseRLOutput, parseJSONRobust } from '../services/geminiService';

describe('parseRLOutput', () => {
  const wellFormed = `Intro chatter from the model.
<EPISODE>
Episode: 1
Action: Added Dropout(0.5) after fc1
Reward: +10
Outcome: Reduced overfitting surface
</EPISODE>
<EPISODE>
Episode: 2
Action: Replaced hardcoded input shape
Reward: +15
Outcome: DoS vector closed
</EPISODE>
<FINAL_CODE>
\`\`\`python
import torch
model = build_secure_model()
\`\`\`
</FINAL_CODE>
<STATS>
SecurityGain: +25%
PerformanceImpact: -5% latency
</STATS>`;

  test('parses episodes with action, reward and outcome', () => {
    const result = parseRLOutput(wellFormed);
    expect(result.iterations).toHaveLength(2);
    expect(result.iterations[0]).toEqual({
      episode: 1,
      action: 'Added Dropout(0.5) after fc1',
      reward: 10,
      outcome: 'Reduced overfitting surface',
    });
    expect(result.iterations[1].reward).toBe(15);
  });

  test('strips markdown fences the model wraps inside FINAL_CODE', () => {
    const result = parseRLOutput(wellFormed);
    expect(result.optimizedCode).toBe('import torch\nmodel = build_secure_model()');
    expect(result.optimizedCode).not.toContain('```');
  });

  test('parses final stats', () => {
    const result = parseRLOutput(wellFormed);
    expect(result.finalStats).toEqual({
      securityGain: '+25%',
      performanceImpact: '-5% latency',
    });
  });

  test('missing FINAL_CODE yields the explicit incomplete marker, never empty output', () => {
    const result = parseRLOutput('<EPISODE>\nEpisode: 1\nAction: A\nReward: +1\nOutcome: O\n</EPISODE>');
    expect(result.optimizedCode).toContain('incomplete or format error');
  });

  test('unstructured garbage degrades to an empty, well-typed result', () => {
    const result = parseRLOutput('The model ignored the format entirely.');
    expect(result.iterations).toEqual([]);
    expect(result.finalStats.securityGain).toBe('Unknown');
  });

  test('episode blocks without a valid episode number are dropped', () => {
    const result = parseRLOutput('<EPISODE>\nAction: no number here\n</EPISODE>');
    expect(result.iterations).toEqual([]);
  });
});

describe('parseJSONRobust', () => {
  test('parses clean JSON and markdown-fenced JSON', () => {
    expect(parseJSONRobust('{"a": 1}')).toEqual({ a: 1 });
    expect(parseJSONRobust('```json\n{"a": 1}\n```')).toEqual({ a: 1 });
  });

  test('repairs a response truncated inside a string', () => {
    const truncated = '{"summary": "The model is vul';
    expect(parseJSONRobust(truncated)).toEqual({ summary: 'The model is vul' });
  });

  test('repairs truncated nested objects and arrays via bracket stack', () => {
    const truncated = '{"scores": {"security": 45}, "vulnerabilities": [{"severity": "HIGH"}';
    const result = parseJSONRobust(truncated);
    expect(result.scores.security).toBe(45);
    expect(result.vulnerabilities[0].severity).toBe('HIGH');
  });

  test('does not mistake brackets inside strings for structure', () => {
    const tricky = '{"code": "if (x[0] > {threshold}) {", "ok": true}';
    expect(parseJSONRobust(tricky).ok).toBe(true);
  });

  test('throws on unrecoverable input instead of returning junk', () => {
    expect(() => parseJSONRobust('not json at all')).toThrow('truncated and unrecoverable');
  });
});
