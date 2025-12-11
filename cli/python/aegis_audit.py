#!/usr/bin/env python3
"""
AEGIS - Simple Python Auditor
Analyzes neural network code for security vulnerabilities
"""

import os
import sys
import argparse
import google.generativeai as genai

def analyze_code(file_path, api_key):
    """Analyze neural network code using Gemini"""
    genai.configure(api_key=api_key)
    
    # Simple safety settings
    safety_settings = [
        {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
    ]
    
    model = genai.GenerativeModel(
        'gemini-3-pro-preview',
        safety_settings=safety_settings
    )
    
    with open(file_path, 'r') as f:
        code = f.read()
    
    prompt = f"""Analyze this neural network code for security vulnerabilities and provide a brief report.

Focus on:
1. Hardcoded input shapes
2. Missing regularization (Dropout, BatchNorm)
3. Adversarial susceptibility
4. Parameter efficiency issues

Code:
```python
{code}
```

Provide:
- Security score (0-100)
- List of vulnerabilities found
- Recommendations

Keep it concise."""

    response = model.generate_content(
        prompt,
        generation_config={"temperature": 0.3}
    )
    
    return response.text

def main():
    parser = argparse.ArgumentParser(description='AEGIS Python Auditor')
    parser.add_argument('--file', required=True, help='Path to model file')
    parser.add_argument('--api-key', required=True, help='Gemini API key')
    parser.add_argument('--threshold', type=int, default=70, help='Security threshold')
    args = parser.parse_args()

    print(f"🛡️  AEGIS Python Agent analyzing {args.file}...")
    print("=" * 60)
    
    try:
        result = analyze_code(args.file, args.api_key)
        print(result)
        print("=" * 60)
        
        # Try to extract score from response
        if "score" in result.lower() or "security" in result.lower():
            # Simple heuristic: look for numbers
            import re
            scores = re.findall(r'(\d+)/100', result)
            if scores:
                score = int(scores[0])
                print(f"\n📊 Security Score: {score}/100")
                
                if score < args.threshold:
                    print(f"❌ FAIL: Score below threshold ({args.threshold})")
                    sys.exit(1)
                else:
                    print(f"✅ PASS: Score >= threshold ({args.threshold})")
                    sys.exit(0)
        
        # If no score found, just show the analysis
        print("\n✅ Analysis complete (no numeric score extracted)")
        sys.exit(0)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
