# 🐍 AEGIS Python CLI

Standalone Python auditor for CI/CD integration.

## Installation

```bash
pip install google-generativeai
```

## Usage

```bash
python aegis_audit.py \
  --file your_model.py \
  --api-key YOUR_GEMINI_KEY \
  --threshold 80
```

## Arguments

- `--file`: Path to model file (required)
- `--api-key`: Gemini API key (required)
- `--threshold`: Security threshold 0-100 (default: 70)

## Exit Codes

- `0`: PASS (security score >= threshold)
- `1`: FAIL (security score < threshold)

## Example

```bash
# Analyze example model
python aegis_audit.py \
  --file example_model.py \
  --api-key AIzaSy... \
  --threshold 80

# Output:
# 🛡️  AEGIS Python Agent analyzing example_model.py...
# ============================================================
# Security Score: 50/100
# 
# Vulnerabilities Found:
# - CRITICAL: Hardcoded input shape (DoS vulnerability)
# - HIGH: Adversarial susceptibility (87%)
# - MEDIUM: Missing regularization
# 
# ❌ FAIL: Score below threshold (80)
```

## CI/CD Integration

### GitHub Actions

```yaml
- name: AEGIS Security Gate
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
    - pip install google-generativeai
    - python cli/python/aegis_audit.py --file model.py --api-key $GEMINI_KEY --threshold 80
```
