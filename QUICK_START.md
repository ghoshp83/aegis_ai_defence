# 🚀 AEGIS Quick Start

## 30-Second Setup

```bash
# 1. Fork the repository on GitHub (click Fork button)

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/aegis-ai-defence.git
cd aegis-ai-defence

# 3. Set API Key
echo "GEMINI_API_KEY=your_key_here" > .env

# 4. Run
docker-compose up -d

# 5. Open
open http://localhost:3000
```

## Test It

1. Select "MNIST Classifier (PyTorch)" from dropdown
2. Click "Run Analysis"
3. Go to "Attack Sim" tab → Click "Simulate FGSM Attack"
4. Go to "Active Defense" tab → See exploit + fix
5. Click "Certificate" button → Generate compliance report

## Links

- **Video:** https://youtu.be/QBqkJdfmxhk
- **Docs:** [docs/](docs/)

## Need Help?

- [Installation Guide](docs/INSTALLATION.md)
- [User Guide](docs/USER_GUIDE.md)
- [CI/CD Integration](docs/CICD.md)
