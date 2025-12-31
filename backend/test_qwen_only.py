import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

def test_qwen_strict():
    print("--- Testing Qwen (DashScope) Strict Mode ---")
    key = os.getenv("DASHSCOPE_API_KEY")
    if not key:
        print("❌ No DASHSCOPE_API_KEY found in .env")
        return

    print(f"Key found: {key[:10]}...")

    # Urls to try
    urls = [
        "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", # OpenAI Compatible
        "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation" # Native
    ]
    
    payload_openai = {
        "model": "qwen-max",
        "messages": [{"role": "user", "content": "Hi"}]
    }

    payload_native = {
        "model": "qwen-max",
        "input": {"messages": [{"role": "user", "content": "Hi"}]}
    }

    # 1. Try OpenAI Mode
    print("\n[1] Testing OpenAI Compatible Endpoint...")
    try:
        r = requests.post(urls[0], json=payload_openai, headers={"Authorization": f"Bearer {key}"}, timeout=10)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text[:200]}")
    except Exception as e:
        print(f"Error: {e}")

    # 2. Try Native Mode
    print("\n[2] Testing Native Endpoint...")
    try:
        r = requests.post(urls[1], json=payload_native, headers={"Authorization": f"Bearer {key}"}, timeout=10)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text[:200]}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_qwen_strict()
