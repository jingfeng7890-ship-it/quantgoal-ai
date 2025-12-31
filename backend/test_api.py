import os
from pathlib import Path
from dotenv import load_dotenv

# Load env explicitly
env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

keys = {
    "OPENAI": ["OPENAI_API_KEY", "OPENAI_KEY"],
    "ANTHROPIC": ["ANTHROPIC_API_KEY", "CLAUDE_KEY", "ANTHROPIC_KEY"],
    "GEMINI": ["GEMINI_API_KEY", "GOOGLE_API_KEY", "GEMINI_KEY"],
    "DEEPSEEK": ["DEEPSEEK_API_KEY", "DEEPSEEK_KEY"],
    "GROK": ["XAI_API_KEY", "GROK_API_KEY", "GROK_KEY"],
    "DASHSCOPE": ["DASHSCOPE_API_KEY", "QWEN_KEY"]
}

print("--- API Key Diagnostics ---")
for provider, variants in keys.items():
    found = False
    for v in variants:
        val = os.getenv(v)
        if val:
            print(f"✅ {provider}: Found as {v} (Length: {len(val)})")
            found = True
            break
    if not found:
        print(f"❌ {provider}: NOT FOUND in .env")

print("\n--- Network Test (Google) ---")
import requests
try:
    r = requests.get("https://www.google.com", timeout=5)
    print(f"Internet Connection: OK ({r.status_code})")
except Exception as e:
    print(f"Internet Connection: FAILED ({e})")
