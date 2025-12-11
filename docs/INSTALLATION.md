# Installation Guide

## Prerequisites

- **Node.js** 18+ (for web interface)
- **Docker** (recommended for easy setup)
- **Python** 3.8+ (for CLI)
- **Gemini API Key** ([Get one here](https://aistudio.google.com/apikey))

---

## Method 1: Docker (Recommended)

### Quick Start

```bash
# 1. Fork the repository on GitHub (click Fork button)

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/aegis-ai-defence.git
cd aegis-ai-defence

# 3. Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env

# 4. Start AEGIS
docker-compose up -d

# 5. Access at http://localhost:3000
```

### Stop AEGIS

```bash
docker-compose down
```

### View Logs

```bash
docker-compose logs -f
```

---

## Method 2: Local Development

### Install Dependencies

```bash
npm install
```

### Set Environment Variables

```bash
# Copy example
cp .env.example .env

# Edit .env and add your API key
nano .env
```

### Run Development Server

```bash
npm run dev
```

Access at http://localhost:3000

### Build for Production

```bash
npm run build
npm run preview
```

---

## Method 3: Python CLI Only

### Install Python Package

```bash
pip install google-generativeai
```

### Run Audit

```bash
python cli/python/aegis_audit.py \
  --file your_model.py \
  --api-key YOUR_KEY \
  --threshold 80
```

---

## Troubleshooting

### Port Already in Use

```bash
# Change port in docker-compose.yml
ports:
  - "8080:3000"
```

### API Key Not Working

1. Verify key at https://aistudio.google.com/apikey
2. Ensure no extra spaces in .env file
3. Restart container: `docker-compose restart`

### Docker Build Fails

```bash
# Clean and rebuild
docker-compose down
docker system prune -f
docker-compose up -d --build
```

---

## Next Steps

- [User Guide](USER_GUIDE.md)
- [CI/CD Integration](CICD.md)
- [API Reference](API.md)
