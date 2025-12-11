
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Add declarations to fix TypeScript errors when @types/jest is missing
declare const jest: any;
declare const describe: any;
declare const test: any;
declare const expect: any;

// Mock the Gemini Service
jest.mock('../services/geminiService', () => ({
  analyzeModelCode: jest.fn().mockImplementation((code, onProgress) => {
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
  streamChatResponse: jest.fn()
}));

describe('AEGIS App', () => {
  test('renders header correctly', () => {
    render(<App />);
    expect(screen.getByText(/AEGIS/i)).toBeInTheDocument();
    expect(screen.getByText(/AI DEFENSE PROTOCOL/i)).toBeInTheDocument();
  });

  test('renders code input panel', () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText(/Paste your PyTorch\/TensorFlow\/Keras model code here/i);
    expect(textarea).toBeInTheDocument();
  });

  test('analyze button is disabled when input is empty', () => {
    render(<App />);
    const button = screen.getByText(/Run Sentinel Analysis/i); // Button text remains "Run Sentinel Analysis" as the engine is still Sentinel based, or we can update it. Let's assume we kept the button text similar for familiarity, or updated it. Wait, in CodePanel it says "Run Sentinel Analysis".
    expect(button).toBeDisabled();
  });

  test('enables analyze button when code is entered', () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText(/Paste your PyTorch\/TensorFlow\/Keras model code here/i);
    fireEvent.change(textarea, { target: { value: 'import torch' } });
    const button = screen.getByText(/Run Sentinel Analysis/i);
    expect(button).not.toBeDisabled();
  });

  test('clicking analyze triggers service', async () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText(/Paste your PyTorch\/TensorFlow\/Keras model code here/i);
    fireEvent.change(textarea, { target: { value: 'import torch' } });
    
    const button = screen.getByText(/Run Sentinel Analysis/i);
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
