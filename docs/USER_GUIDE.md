# User Guide

## Getting Started

### 1. Upload Model Code

- Paste your neural network code in the left panel
- Or select a sample model from the dropdown
- Supports: PyTorch, TensorFlow, Keras, Go

### 2. Run Analysis

- Click "Run Analysis" button
- Wait 5-10 seconds for streaming analysis
- View results in the center panel

### 3. Explore Results

Navigate through tabs:

#### Architecture Tab
- System flowchart
- Technology stack
- Performance telemetry

#### Attack Simulator Tab
- Click "Simulate FGSM Attack"
- Watch live attack visualization
- See attack success rate (87%)

#### Active Defense Tab
- **Remediation Mode:** View fixed code with diff
- **Exploit PoC Mode:** View attack script
- Switch between modes

#### Vulnerabilities Tab
- List of all vulnerabilities
- Severity: Critical, High, Medium, Low
- Mitigation recommendations

#### RL Optimizer Tab
- Select mode: Security, Balanced, or Speed
- Click "Run Simulation"
- Watch episodes stream live
- View optimized code

#### Performance Tab
- Metrics: Parameters, FLOPs, Memory
- Bottleneck identification
- Efficiency analysis

#### CI/CD Tab
- Generate Python/Node/Go agents
- Copy integration code
- Configure thresholds

### 4. Generate Compliance Certificate

- Click "Certificate" button (top right)
- View EU AI Act compliance report
- Click "Print / Save PDF"

### 5. Chat with AI Sentinel

- Use right panel for Q&A
- Ask: "Why is this vulnerable?"
- Get detailed explanations

---

## Features Explained

### Active Defense

**What it does:** Generates both attack code and fixed code

**Use case:** 
- Show stakeholders the actual exploit
- Get production-ready fixes
- Understand exact changes needed

**Example:**
1. Upload vulnerable model
2. Go to "Active Defense" tab
3. See exploit code (Red Team)
4. Switch to "Remediation" (Blue Team)
5. See side-by-side diff

### Live Attack Simulator

**What it does:** Visualizes FGSM attacks in real-time

**Use case:**
- Prove vulnerability to decision-makers
- Understand attack mechanics
- Justify security budget

**How to use:**
1. Go to "Attack Sim" tab
2. Click "Simulate FGSM Attack"
3. Watch confidence degrade
4. Note attack success rate

### RL Auto-Optimizer

**What it does:** AI improves your model iteratively

**Use case:**
- Automatic security improvements
- Learn best practices
- Get optimized architecture

**How to use:**
1. Go to "RL Optimizer" tab
2. Select mode (Security/Balanced/Speed)
3. Click "Run Simulation"
4. Wait 30-60 seconds
5. Copy optimized code

---

## Tips & Best Practices

### For Best Results

1. **Use real model code** (not pseudocode)
2. **Include imports** (helps analysis)
3. **Wait for full analysis** (don't interrupt)
4. **Try RL optimizer** (often finds hidden issues)

### Common Issues

**Analysis takes too long:**
- Check internet connection
- Verify API key is valid
- Try smaller model first

**No vulnerabilities found:**
- Model might be well-designed
- Try RL optimizer for improvements
- Check if code is complete

**Attack simulator doesn't start:**
- Refresh page
- Check browser console (F12)
- Report issue on GitHub

---

## Keyboard Shortcuts

- `Ctrl/Cmd + Enter` - Run analysis
- `Esc` - Close modals
- `F11` - Fullscreen

---

## Next Steps

- [CI/CD Integration](CICD.md)
- [API Reference](API.md)
- [Contributing](../CONTRIBUTING.md)
