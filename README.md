# 🛡️ AEGIS - Enterprise AI Defense Protocol

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Pro-purple)
![Docker](https://img.shields.io/badge/docker-ready-blue)

> **An AI defense platform that doesn't just find vulnerabilities in your model code — it generates the exploit that proves them and the patch that fixes them.**

**AEGIS** (Advanced Electronic Guard & Intelligence System) is powered by Google Gemini 2.5 Pro to perform deep static analysis of neural-network code across multiple frameworks (PyTorch, TensorFlow, Keras, Go).

🎥 **[Watch Demo Video](https://youtu.be/QBqkJdfmxhk)**

---

## 🌟 Key Features

### 🎯 Active Defense System (Unique Innovation)
- **Red Team Mode:** Generates working exploit code (FGSM attacks, DoS vectors)
- **Blue Team Mode:** Generates remediated code with security patches
- **Code Diff Viewer:** Side-by-side comparison showing exact fixes
- **Only tool that generates both the attack AND the fix**

### ⚔️ Live Attack Simulator *(illustrative)*
- FGSM-style attack **visualization** (UI prototype — see disclaimer below)
- Animated model-confidence degradation (98% → 2%)
- Animated attack success rate (fixed 87%)
- Designed to communicate the threat model to non-ML stakeholders

> **Honest disclaimer:** the Live Attack Simulator is a **UI prototype**. The "FGSM" animation is a `setInterval` loop adding `Math.random() * 5` noise and ending at a hardcoded 87 % success rate — it is **not** a live gradient-descent attack against a real model. The Gemini-driven Active Defense + Code Diff Viewer above are real; this widget exists to communicate the threat-model visually. Roadmap: wire to a real adversarial library (e.g. CleverHans / Foolbox) running against an uploaded model.

### 🧠 RL Auto-Optimizer *(LLM-simulated)*
- Iterative code hardening presented as RL episodes
- Live episode streaming (Episode 1: +10 reward, Episode 2: +15...)
- Security improvements: 50/100 → 85/100 in 5 iterations

> **Honest disclaimer:** the "RL" here is a **prompt-driven simulation** — Gemini is instructed to propose 3–5 improvement iterations and format them as episodes with rewards. No actual reinforcement-learning training loop runs. The streamed episodes and the final hardened code are real Gemini output; the episode/reward framing is presentational.

### 🏢 Enterprise Features
- **Multi-Language CI/CD Agents:** Python available today; Node.js & Go planned
- **EU AI Act Compliance Certificates:** Downloadable PDF reports
- **Threat Intelligence Feed:** Real-time security statistics
- **System Architecture Visualization:** Interactive flowcharts

### 📊 Comprehensive Analysis
- **Vulnerability Detection:** Hardcoded shapes, adversarial susceptibility, missing regularization
- **Architecture Analysis:** Layer-by-layer breakdown, bottleneck identification
- **Performance Metrics:** Parameters, FLOPs, memory usage, efficiency
- **Explainability:** Decision process, feature importance, interactive Q&A

---

## 🏗️ Architecture

```mermaid
flowchart TB
    U["👤 User pastes neural-network code<br/>(PyTorch / TensorFlow / Keras / Go)"] --> UI["React 19 + TypeScript UI (Vite)"]

    UI --> GS["geminiService.ts"]
    GS -->|"structured JSON schema,<br/>streaming + robust repair"| G["Gemini 2.5 Pro"]
    GS -->|"executive video briefing"| V["Veo 3.1"]

    G --> RES["Typed AnalysisResult"]
    RES --> DASH["📊 Dashboard<br/>scores · vulnerabilities · performance"]
    RES --> DEF["⚔️ Active Defense<br/>exploit PoC + remediated code diff"]
    RES --> CERT["📜 EU AI Act certificate"]
    RES --> CHAT["💬 Context-aware Q&A chat"]
    RES --> RL["🧠 RL-style optimizer<br/>(streamed improvement episodes)"]

    UI -.-> SIM["Attack Simulator<br/>(illustrative UI prototype)"]

    CLI["cli/python/aegis_audit.py"] -->|"security score vs --threshold<br/>gates CI/CD pipelines"| G
```

### Why this stack

- **React 19 + Vite, no backend** — the whole platform is a static SPA; your model code goes directly from the browser to the Gemini API and nowhere else. Nothing to host, nothing that stores your code.
- **Gemini structured output** — analysis responses are constrained by a JSON `Schema`, so the typed dashboard (`types.ts`) is driven by contract, not prose-scraping. A stack-based JSON repairer recovers truncated streaming responses instead of failing the whole audit.
- **Recharts** for the score gauges and telemetry, **Tailwind** for the dark console aesthetic.
- **Vitest + React Testing Library** for CI-run tests; **Docker** for a one-command deployment.
- **Python CLI** for pipelines — the same audit as an exit-code gate (`--threshold`), so a low-scoring model fails the build.

### Operational characteristics

- Analysis streams progressively; a typical audit renders in seconds rather than blocking on the full response.
- The RL-style optimizer is capped by a 90-second timeout; quota/429 errors from Gemini are surfaced in the UI, not swallowed.
- Stateless by design: no database, no persistence — every audit is a fresh call with your API key.

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# 1. Fork the repository on GitHub (click Fork button)

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/aegis_ai_defence.git
cd aegis_ai_defence

# 3. Set your Gemini API key
echo "GEMINI_API_KEY=your_api_key_here" > .env

# 4. Run with Docker
docker-compose up -d

# 5. Access AEGIS
open http://localhost:3000
```

### Option 2: Local Development

```bash
# Install dependencies
npm install

# Set API key
export GEMINI_API_KEY=your_api_key_here

# Run development server
npm run dev

# Access AEGIS
open http://localhost:3000
```

### Option 3: Python CLI

```bash
# Install dependencies
pip install google-generativeai

# Run audit
python cli/python/aegis_audit.py \
  --file your_model.py \
  --api-key YOUR_GEMINI_KEY \
  --threshold 80
```

---

## 📁 Project Structure

```
aegis_ai_defence/
├── components/          # React UI components
│   ├── AnalysisPanel.tsx       # Main dashboard
│   ├── AttackSimulator.tsx     # Live attack visualization
│   ├── CodePanel.tsx           # Red/Blue team code views
│   ├── DiffViewer.tsx          # Original vs remediated diff
│   ├── ComplianceCertificate.tsx
│   └── ...
├── services/
│   └── geminiService.ts        # Gemini 2.5 Pro integration
├── cli/
│   ├── python/                 # Python CLI auditor
│   ├── nodejs/                 # Node.js CLI auditor
│   └── go/                     # Go CLI auditor
├── docs/                       # Documentation
├── docker-compose.yml          # Docker setup
├── Dockerfile
└── README.md
```

---

## 🎯 Use Cases

### Healthcare AI
Audit diagnostic models for bias and explainability before deployment. Generate FDA/CE compliance documentation.

### Financial Services
Validate credit scoring models for fairness. Detect adversarial manipulation of fraud detection systems.

### Autonomous Systems
Security audit for safety-critical AI. Prevent adversarial attacks on perception systems.

### Hiring Platforms
Ensure recruitment AI is unbiased. Explain hiring decisions for legal compliance.

### Content Moderation
Verify fairness across user groups. Detect manipulation attempts.

---

## 🔧 CI/CD Integration

### GitHub Actions

```yaml
name: AI Security Gate

on: [push, pull_request]

jobs:
  aegis-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Run AEGIS Audit
        run: |
          python cli/python/aegis_audit.py \
            --file ./models/net.py \
            --api-key ${{ secrets.GEMINI_KEY }} \
            --threshold 80
```

### GitLab CI

```yaml
aegis-audit:
  script:
    - python cli/python/aegis_audit.py --file model.py --api-key $GEMINI_KEY --threshold 80
  only:
    - main
```

---

## 📊 Example Analysis

**Input:** SimpleCNN (MNIST classifier)

**Output:**
- **Security Score:** 50/100
- **Vulnerabilities:** 4 (1 Critical, 1 High, 2 Medium)
  - ❌ **CRITICAL:** Hardcoded input shape (DoS vulnerability)
  - ⚠️ **HIGH:** Adversarial susceptibility (87%)
  - ⚠️ **MEDIUM:** Missing regularization
  - ⚠️ **MEDIUM:** Parameter bottleneck (94% in fc1 layer)

**Generated:**
- ✅ `exploit_fgsm.py` - Working FGSM attack script
- ✅ `secure_model.py` - Fixed model with patches
- ✅ `compliance_certificate.pdf` - EU AI Act report

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **AI Engine:** Google Gemini 2.5 Pro
- **Visualization:** Recharts
- **Video Generation:** Google Veo 3.1
- **Deployment:** Docker, Vite
- **Testing:** Vitest, React Testing Library

---

## 🎓 How It Works

1. **Code Upload:** Paste or upload neural network code
2. **Gemini Analysis:** Streaming analysis with structured JSON schemas
3. **Vulnerability Detection:** Identifies security flaws with severity scoring
4. **Active Defense:** Generates exploit code + remediated code
5. **RL Optimization:** Iteratively improves model security
6. **Compliance:** Generates EU AI Act certificates

---

## 🌐 Multi-Language Support

### Python (available)
```bash
python cli/python/aegis_audit.py --file model.py --api-key KEY --threshold 80
```

### Node.js & Go (planned)

Not yet implemented — `cli/nodejs/` and `cli/go/` currently contain roadmaps
only. Use the Python CLI or the web interface today.

---

## 📖 Documentation

- [Installation Guide](docs/INSTALLATION.md)
- [User Guide](docs/USER_GUIDE.md)
- [CI/CD Integration](docs/CICD.md)
- [Contributing](CONTRIBUTING.md)

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

```bash
# Fork the repository
# Create a feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m 'Add amazing feature'

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Demo Video:** https://youtu.be/QBqkJdfmxhk
- **Documentation:** [docs/](docs/)
- **Issues:** [GitHub Issues](https://github.com/ghoshp83/aegis_ai_defence/issues)

---

## 📧 Contact

- **Author:** Pralay Ghosh
- **Email:** pralay.ghosh@gmail.com

---

## 🙏 Acknowledgments

- **Google DeepMind** for the Gemini API
- **Google Veo** for video generation capabilities
- **Open Source Community** for amazing tools and libraries

---

## ⚠️ Disclaimer

AEGIS is a security auditing tool. The exploit code generated is for educational and security testing purposes only. Always obtain proper authorization before testing systems you don't own.

---

<div align="center">

**Making AI Safe, Transparent, and Compliant - One Model at a Time**

⭐ Star this repo if you find it useful!

</div>
