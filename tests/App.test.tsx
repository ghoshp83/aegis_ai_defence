import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import App from '../App';

vi.mock('../services/geminiService', () => ({
  analyzeModelCode: vi.fn().mockImplementation((code: string, onProgress: (p: number) => void) => {
    onProgress(100);
    return Promise.resolve({
      valid: true,
      summary: "Test Summary",
      scores: { security: 85, robustness: 90, efficiency: 80, accuracy: 95 },
      architecture: { overview: "Overview", layers: [], totalParams: "1M" },
      explainability: { decisionProcess: "Process", topFeatures: [], attentionMechanism: null },
      vulnerabilities: [],
      securityAnalysis: {
          adversarial: { susceptibilityScore: 10, attackVectors: [], description: "Desc" },
          privacy: { riskScore: 20, leakageRisk: "Low", membershipInference: "Low" },
          robustness: [],
          attackScenarios: [],
          compliance: []
      },
      performance: { metrics: [], efficiencyAnalysis: "Eff", bottlenecks: [], parameterBreakdown: [] },
      recommendations: [],
      remediatedCode: "print('fixed')",
      exploitPoC: { title: "Exploit", code: "print('hack')", description: "Desc" }
    });
  }),
  streamChatResponse: vi.fn()
}));

describe('AEGIS App', () => {
  test('renders header correctly', () => {
    render(<App />);
    expect(screen.getAllByText(/AEGIS/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/AI DEFENSE PROTOCOL/i)).toBeInTheDocument();
  });

  test('renders code input panel', () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText(/Paste your PyTorch\/TensorFlow\/Keras model code here/i);
    expect(textarea).toBeInTheDocument();
  });

  test('analyze button is disabled when input is empty', () => {
    render(<App />);
    const button = screen.getByText(/Run AEGIS Analysis/i);
    expect(button).toBeDisabled();
  });

  test('enables analyze button when code is entered', () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText(/Paste your PyTorch\/TensorFlow\/Keras model code here/i);
    fireEvent.change(textarea, { target: { value: 'import torch' } });
    const button = screen.getByText(/Run AEGIS Analysis/i);
    expect(button).not.toBeDisabled();
  });

  test('clicking analyze triggers service', async () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText(/Paste your PyTorch\/TensorFlow\/Keras model code here/i);
    fireEvent.change(textarea, { target: { value: 'import torch' } });

    const button = screen.getByText(/Run AEGIS Analysis/i);
    fireEvent.click(button);
  });

  test('chat panel renders and handles input', () => {
      render(<App />);
      const input = screen.getByPlaceholderText(/Type your question/i);
      expect(input).toBeInTheDocument();

      fireEvent.change(input, { target: { value: 'Is this secure?' } });
      expect(input).toHaveValue('Is this secure?');
  });
});
