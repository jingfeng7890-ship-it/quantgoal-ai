import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

def test_grok_final():
    print("\n--- Testing Grok (xAI) Final Check ---")
    key = os.getenv("XAI_API_KEY") or os.getenv("GROK_API_KEY")
    if not key:
        print("SKIP: No XAI_API_KEY")
        return

    print(f"Key found: {key[:8]}...")

    url = "https://api.x.ai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "grok-beta",
        "messages": [
            {"role": "system", "content": "You are Grok. Be concise."},
            {"role": "user", "content": "Hello Grok, are you awake?"}
        ]
    }
    try:
        print("Sending request to xAI...")
        r = requests.post(url, headers=headers, json=payload, timeout=15)
        print(f"Status: {r.status_code}")
        if r.status_code != 200:
            print(f"Error Body: {r.text}")
        else:
            print("Success! Response:")
            print(r.json()['choices'][0]['message']['content'])
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_grok_final()
