# 🛡️ AEGIS - Enterprise AI Defense Protocol

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Gemini](https://img.shields.io/badge/AI-Gemini%203%20Pro-purple)
![Docker](https://img.shields.io/badge/docker-ready-blue)

> **The world's first comprehensive AI defense platform that proves vulnerabilities with live attacks and fixes them automatically.**

**AEGIS** (Advanced Electronic Guard & Intelligence System) is powered by Google Gemini 3 Pro to perform deep static and dynamic analysis of neural networks across multiple frameworks (PyTorch, TensorFlow, Keras, Go).

🎥 **[Watch Demo Video](https://youtu.be/QBqkJdfmxhk)**

---

## 🌟 Key Features

### 🎯 Active Defense System (Unique Innovation)
- **Red Team Mode:** Generates working exploit code (FGSM attacks, DoS vectors)
- **Blue Team Mode:** Generates remediated code with security patches
- **Code Diff Viewer:** Side-by-side comparison showing exact fixes
- **Only tool that generates both the attack AND the fix**

### ⚔️ Live Attack Simulator
- Real-time FGSM attack visualization
- Watch model confidence degrade (98% → 2%)
- Animated attack success rate (87%)
- Visual proof of vulnerabilities

### 🧠 RL Auto-Optimizer
- AI improving AI through reinforcement learning
- Live episode streaming (Episode 1: +10 reward, Episode 2: +15...)
- Security improvements: 50/100 → 85/100 in 5 iterations
- Impossible before Gemini 3 Pro

### 🏢 Enterprise Features
- **Multi-Language CI/CD Agents:** Python, Node.js, Go
- **EU AI Act Compliance Certificates:** Downloadable PDF reports
- **Threat Intelligence Feed:** Real-time security statistics
- **System Architecture Visualization:** Interactive flowcharts

### 📊 Comprehensive Analysis
- **Vulnerability Detection:** Hardcoded shapes, adversarial susceptibility, missing regularization
- **Architecture Analysis:** Layer-by-layer breakdown, bottleneck identification
- **Performance Metrics:** Parameters, FLOPs, memory usage, efficiency
- **Explainability:** Decision process, feature importance, interactive Q&A

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# 1. Fork the repository on GitHub (click Fork button)

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/aegis-ai-defence.git
cd aegis-ai-defence

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
aegis-ai-defence/
├── components/          # React UI components
│   ├── AnalysisPanel.tsx       # Main dashboard
│   ├── AttackSimulator.tsx     # Live attack visualization
│   ├── ActiveDefense.tsx       # Red/Blue team modes
│   ├── ComplianceCertificate.tsx
│   └── ...
├── services/
│   └── geminiService.ts        # Gemini 3 Pro integration
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
- **AI Engine:** Google Gemini 3 Pro
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

### Python
```bash
python cli/python/aegis_audit.py --file model.py --api-key KEY --threshold 80
```

### Node.js
```bash
node cli/nodejs/aegis-audit.js --file model.js --api-key KEY --threshold 80
```

### Go
```bash
go run cli/go/aegis-audit.go --file model.go --api-key KEY --threshold 80
```

---

## 📖 Documentation

- [Installation Guide](docs/INSTALLATION.md)
- [User Guide](docs/USER_GUIDE.md)
- [API Reference](docs/API.md)
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
- **Issues:** [GitHub Issues](https://github.com/yourusername/aegis-ai-defence/issues)

---

## 📧 Contact

- **Author:** Pralay Ghosh
- **Email:** pralay.ghosh@gmail.com

---

## 🙏 Acknowledgments

- **Google DeepMind** for Gemini 3 Pro API
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
