
export interface Vulnerability {
  id: string;
  name: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  mitigation: string;
  businessImpact?: string; // e.g. "$50k/hr loss"
  exploitability?: string; // e.g. "Easy (Script kiddie)"
}

export interface Metric {
  name: string;
  value: number; // 0-1 or raw number
  unit?: string;
  benchmark?: number;
  status: 'good' | 'average' | 'poor';
}

export interface ArchitectureLayer {
  name: string;
  type: string;
  params: string; // Display string (e.g. "1024")
  paramCount: number; // Numeric for charts
  details: string;
  isBottleneck?: boolean; // For red warning visualization
}

export interface AttackScenario {
  name: string;
  type: string;
  description: string;
  timeToExploit: string; // e.g. "10 seconds"
  severity: 'Critical' | 'High' | 'Medium';
}

export interface ComplianceCheck {
  regulation: string; // e.g. "EU AI Act"
  status: 'Pass' | 'Fail' | 'Warning';
  details: string;
}

export interface ThreatIntel {
    cves: { id: string; description: string; severity: string }[];
    realWorldIncidents: string; // e.g. "Similar architectures breached via Model Inversion in 2023"
    affectedSystemsCount: string; // e.g. "45,000+"
}

export interface AnalysisResult {
  valid: boolean; // Validation flag
  error?: string; // Validation error message
  summary: string;
  scores: {
    security: number; // 0-100
    robustness: number; // 0-100
    efficiency: number; // 0-100
    accuracy: number; // 0-100 (Theoretical)
  };
  architecture: {
    overview: string;
    layers: ArchitectureLayer[];
    totalParams: string;
  };
  explainability: {
    decisionProcess: string;
    topFeatures: { feature: string; importance: number }[]; // Importance 0-100
    attentionMechanism: string | null;
  };
  vulnerabilities: Vulnerability[];
  securityAnalysis: {
    adversarial: {
      susceptibilityScore: number; // 0-100
      attackVectors: { name: string; successRate: string }[]; // e.g. "FGSM: 85%"
      description: string;
    };
    privacy: {
      riskScore: number; // 0-100
      leakageRisk: string; // e.g. "High - Model Inversion possible"
      membershipInference: string; // e.g. "70% Success Rate"
    };
    robustness: { metric: string; score: number }[]; // For Radar Chart (Noise, Blur, etc.)
    attackScenarios: AttackScenario[];
    compliance: ComplianceCheck[];
  };
  performance: {
    metrics: Metric[];
    efficiencyAnalysis: string;
    bottlenecks: string[];
    parameterBreakdown: { layer: string; count: number; percentage: number }[];
  };
  recommendations: string[];
  
  // New Active Defense Fields
  remediatedCode: string; // The full code rewritten with fixes
  exploitPoC: {
    title: string;
    code: string; // Python script demonstrating an attack
    description: string;
  };
  threatIntelligence: ThreatIntel;
}

export interface RLOptimizationResult {
  optimizedCode: string;
  iterations: {
    episode: number;
    action: string; // e.g., "Added Dropout(0.5)"
    reward: number; // Change in score
    outcome: string;
  }[];
  finalStats: {
    securityGain: string;
    performanceImpact: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum SampleModelType {
  MNIST = 'MNIST Classifier (PyTorch)',
  SENTIMENT = 'Sentiment Analysis (Keras)',
  REC_SYS = 'Recommendation System (PyTorch)',
  OBJ_DETECTION = 'Object Detection (TorchVision)',
  GO_NEURAL = 'Simple Neural Network (Golang)',
}
