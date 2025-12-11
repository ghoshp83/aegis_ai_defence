
# 🛡️ AEGIS
> **The Enterprise AI Defense Protocol**

> **Stop auditing. Start defending.**
> AEGIS is the first autonomous security platform for neural networks. Powered by **Google Gemini 3 Pro**, it audits architectures in real-time, generates **Active Defense** patches, simulates adversarial attacks (Red Teaming), and optimizes performance via Reinforcement Learning—all in seconds.

![AEGIS Dashboard](https://placehold.co/1200x600/0f172a/3b82f6?text=AEGIS+Dashboard+Preview)

![Version](https://img.shields.io/badge/version-3.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Build](https://img.shields.io/badge/build-passing-success.svg)
![Engine](https://img.shields.io/badge/AI-Gemini%203%20Pro-purple)

## ⚡ Quick Start in 3 Commands

```bash
# 1. Clone the repository
git clone https://github.com/your-org/aegis-ai.git

# 2. Install dependencies
cd aegis-ai && npm install

# 3. Launch the platform
# (The app will prompt for an API Key or use process.env.API_KEY)
npm start
```

---

## 🆚 Why AEGIS?

Traditional tools catch syntax errors. **AEGIS catches architectural flaws.**

| Feature | 🛡️ AEGIS (AI-Native) | 🔍 Traditional Static Analysis | 👤 Manual Audit |
| :--- | :---: | :---: | :---: |
| **Context Awareness** | ✅ Deep Understanding (Gemini 3) | ❌ Regex/AST based only | ✅ High |
| **Auto-Remediation** | ✅ Generates Patched Code | ❌ Detection only | ❌ Slow & Manual |
| **Red Teaming** | ✅ Generates Exploit PoCs | ❌ None | ✅ Expensive |
| **Optimization** | ✅ RL-Driven Policy Search | ❌ None | ❌ Trial & Error |
| **Reporting** | ✅ Cinematic Video (Veo) | ❌ Text Logs | ❌ PDF Reports |
| **Speed** | ⚡ Seconds | ⚡ Milliseconds | 🐢 Weeks |

---

## 🏗️ Project Structure

```bash
aegis-ai/
├── components/           # React UI Components
│   ├── AnalysisPanel.tsx # Main dashboard (Charts, Reports)
│   ├── ChatPanel.tsx     # Gemini 3 Chat Interface
│   ├── CodePanel.tsx     # Code Editor & File Upload
│   └── PipelineIntegration.tsx # CI/CD Agent Generator
├── services/
│   ├── geminiService.ts  # Gemini API Client (Analysis, Chat, Video)
│   └── geminiService.test.ts # Unit Tests for Service layer
├── tests/
│   └── App.test.tsx      # Integration Tests for App
├── types.ts              # TypeScript Definitions (Strict Mode)
├── constants.ts          # Sample Models & Prompts
├── App.tsx               # Main Layout Controller
├── index.tsx             # Entry Point
├── index.html            # HTML Template
└── package.json          # Dependencies
```

---

## 🚀 Key Features

### 1. 🌐 Multi-Language CI/CD Agents
AEGIS generates standalone auditor CLI tools for your pipeline.
*   **🐍 Python Agent**: Native support for Python ML stacks.
*   **⚡ Node.js Agent**: For JS/TS based pipelines.
*   **🐹 Go Agent**: High-performance compiled auditor.

### 2. ⚔️ Active Defense
*   **Red Team Mode**: Generates `exploit_poc.py` to demonstrate attacks (FGSM, DoS).
*   **Blue Team Mode**: Generates `remediated_model.py` with security patches.

### 3. 🧠 RL Auto-Optimizer
*   Simulates a Reinforcement Learning agent to iteratively optimize model code for **Security**, **Efficiency**, or **Balance**.

### 4. 🎬 Veo Video Briefings
*   Generates 4K cinematic executive briefings using Google Veo.

---

## 🛠️ Installation & Usage

### Prerequisites
*   Node.js v18+
*   Google Cloud Project with Gemini API enabled.
*   API Key (Paid tier recommended for Veo/Gemini 3).

### Local Development
1.  **Clone**:
    ```bash
    git clone https://github.com/your-org/aegis-ai.git
    cd aegis-ai
    ```
2.  **Install**:
    ```bash
    npm install
    ```
3.  **Environment**:
    Create a `.env` file (optional, or inject at runtime):
    ```env
    API_KEY=your_gemini_api_key
    ```
    *Note: The app handles API Key injection via `process.env.API_KEY` provided by the build system.*
4.  **Run**:
    ```bash
    npm start
    ```

### Production Build
1.  **Build**:
    ```bash
    npm run build
    ```
2.  **Serve**:
    Use any static file server (Nginx, Vercel, Netlify).
    ```bash
    npx serve dist
    ```

---

## 🧪 Testing
We maintain high code quality with strict unit tests.

```bash
# Run Unit Tests
npm test

# Check Coverage
npm test -- --coverage
```

---

## 🚢 CI/CD Integration Guide

To gate your deployments based on Model Security Score:

1.  Open **AEGIS Dashboard**.
2.  Go to **CI/CD Integration**.
3.  Select your language (Python/Node/Go).
4.  Download the **AEGIS Agent**.
5.  Add to your pipeline (e.g., GitHub Actions):

```yaml
- name: AI Security Gate
  run: |
    python aegis_audit.py \
      --file ./models/net.py \
      --api-key ${{ secrets.GEMINI_KEY }} \
      --threshold 80
```

---

## 📜 License
MIT License. See LICENSE file for details.
