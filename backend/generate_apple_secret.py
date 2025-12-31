import jwt
import time
import argparse
import os

def generate_client_secret(private_key_content, team_id, client_id, key_id):
    headers = {
        'kid': key_id,
        'alg': 'ES256'
    }

    payload = {
        'iss': team_id,
        'iat': int(time.time()),
        'exp': int(time.time()) + 15777000, # Valid for 6 months (maximum allowed by Apple)
        'aud': 'https://appleid.apple.com',
        'sub': client_id,
    }

    client_secret = jwt.encode(
        payload, 
        private_key_content, 
        algorithm='ES256', 
        headers=headers
    )

    return client_secret

if __name__ == '__main__':
    print("----------------------------------------------------------------")
    print("   Apple Sign In - Client Secret Generator (JWT)")
    print("----------------------------------------------------------------")
    
    print("\nPlease enter the following details from your Apple Developer Account:")
    
    team_id = input("1. Team ID (e.g., 4D3K...): ").strip()
    client_id = input("2. Service ID (e.g., com.quantgoal.platform.service): ").strip()
    key_id = input("3. Key ID (e.g., TW6F...): ").strip()
    p8_path = input("4. Path to your .p8 file (drag and drop file here): ").strip().replace('"', '')

    try:
        with open(p8_path, 'r') as f:
            private_key_content = f.read()

        secret = generate_client_secret(private_key_content, team_id, client_id, key_id)
        
        print("\n" + "="*60)
        print("SUCCESS! Here is your Apple Client Secret (JWT):")
        print("="*60 + "\n")
        print(secret)
        print("\n" + "="*60)
        print("Copy the long string above and paste it into the Supabase 'Secret' field.")
        
    except FileNotFoundError:
        print(f"\nError: Could not find file at {p8_path}")
    except Exception as e:
        print(f"\nError generating secret: {e}")
