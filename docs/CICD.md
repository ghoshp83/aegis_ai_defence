# CI/CD Integration Guide

## Overview

AEGIS can be integrated into your CI/CD pipeline to automatically audit models before deployment.

---

## GitHub Actions

### Basic Setup

Create `.github/workflows/aegis-audit.yml`:

```yaml
name: AEGIS Security Audit

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  aegis-audit:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        run: pip install google-generativeai
      
      - name: Run AEGIS Audit
        run: |
          python cli/python/aegis_audit.py \
            --file ./models/net.py \
            --api-key ${{ secrets.GEMINI_API_KEY }} \
            --threshold 80
```

### Add Secret

1. Go to repository Settings → Secrets
2. Add `GEMINI_API_KEY`
3. Paste your Gemini API key

---

## GitLab CI

### Basic Setup

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - audit

aegis-audit:
  stage: audit
  image: python:3.10
  before_script:
    - pip install google-generativeai
  script:
    - python cli/python/aegis_audit.py 
        --file models/net.py 
        --api-key $GEMINI_API_KEY 
        --threshold 80
  only:
    - main
    - merge_requests
```

### Add Variable

1. Go to Settings → CI/CD → Variables
2. Add `GEMINI_API_KEY`
3. Mark as "Masked"

---

## Docker-based CI

### Using Docker

```yaml
aegis-audit:
  image: aegis/auditor:latest
  script:
    - aegis-audit --file model.py --threshold 80
```

---

## Threshold Configuration

### Recommended Thresholds

- **Development:** 60 (lenient, catch major issues)
- **Staging:** 75 (moderate, ensure quality)
- **Production:** 85 (strict, maximum security)

### Example

```bash
# Development
python aegis_audit.py --file model.py --threshold 60

# Production
python aegis_audit.py --file model.py --threshold 85
```

---

## Exit Codes

- `0` - PASS (deploy allowed)
- `1` - FAIL (block deployment)

---

## Advanced: Multi-Model Audit

```yaml
- name: Audit All Models
  run: |
    for model in models/*.py; do
      python cli/python/aegis_audit.py \
        --file $model \
        --api-key ${{ secrets.GEMINI_API_KEY }} \
        --threshold 80 || exit 1
    done
```

---

## Notifications

### Slack Integration

```yaml
- name: Notify Slack on Failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'AEGIS audit failed! Security score below threshold.'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Best Practices

1. **Run on every PR** - Catch issues early
2. **Set appropriate thresholds** - Balance security vs velocity
3. **Store API key securely** - Use secrets management
4. **Cache dependencies** - Speed up builds
5. **Fail fast** - Block deployment on critical issues

---

## Troubleshooting

### API Rate Limits

```yaml
- name: Retry on rate limit
  run: |
    for i in {1..3}; do
      python aegis_audit.py ... && break || sleep 10
    done
```

### Timeout Issues

```yaml
- name: Run with timeout
  timeout-minutes: 5
  run: python aegis_audit.py ...
```

---

## Next Steps

- [User Guide](USER_GUIDE.md)
