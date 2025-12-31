import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

def test_claude():
    print("\n--- Testing Claude ---")
    key = os.getenv("ANTHROPIC_API_KEY")
    if not key: 
        print("SKIP: No ANTHROPIC_API_KEY")
        return

    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    # Minimal valid payload check
    payload = {
        "model": "claude-3-opus-20240229",
        "max_tokens": 1024,
        "messages": [
            {"role": "user", "content": "Hello, world"}
        ]
    }
    
    try:
        r = requests.post(url, headers=headers, json=payload)
        print(f"Status: {r.status_code}")
        if r.status_code != 200:
            print(f"Error Body: {r.text}")
        else:
            print("Success! Response snippet:", r.json()['content'][0]['text'][:50])
    except Exception as e:
        print(f"Exception: {e}")

def test_gemini():
    print("\n--- Testing Gemini (Google) ---")
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        print("SKIP: No GEMINI_API_KEY")
        return

    # Try gemini-pro first
    models = ["gemini-pro", "gemini-1.5-pro"]
    
    for m in models:
        print(f"Testing Model: {m}")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": "Hello"}]}]
        }
        try:
            r = requests.post(url, headers=headers, json=payload)
            print(f"Status: {r.status_code}")
            if r.status_code == 200:
                print("Success!")
                break
            else:
                print(f"Error Body: {r.text}")
        except Exception as e:
            print(f"Exception: {e}")

def test_qwen():
    print("\n--- Testing Qwen (DashScope) ---")
    key = os.getenv("DASHSCOPE_API_KEY")
    if not key:
        print("SKIP: No DASHSCOPE_API_KEY")
        return
        
    url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation"
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "qwen-max",
        "input": {
            "messages": [{"role": "user", "content": "Hello"}]
        }
    }
    try:
        r = requests.post(url, headers=headers, json=payload)
        print(f"Status: {r.status_code}")
        if r.status_code != 200:
            print(f"Error Body: {r.text}")
        else:
            print("Success!")
    except Exception as e:
        print(f"Exception: {e}")

def test_grok():
    print("\n--- Testing Grok (xAI) ---")
    key = os.getenv("XAI_API_KEY") or os.getenv("GROK_API_KEY")
    if not key:
        print("SKIP: No XAI_API_KEY")
        return

    url = "https://api.x.ai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "grok-beta",
        "messages": [
            {"role": "user", "content": "Hello"}
        ]
    }
    try:
        r = requests.post(url, headers=headers, json=payload)
        print(f"Status: {r.status_code}")
        if r.status_code != 200:
            print(f"Error Body: {r.text}")
        else:
            print("Success!")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    # test_claude() # Known issue: Credit Balance
    print("Skipping Claude (Known Error: Balance Low)")
    test_gemini()
    test_qwen()
    test_grok()
