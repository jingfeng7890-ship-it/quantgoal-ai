import jwt
import time

def generate_client_secret():
    team_id = '5CSJ2N875L'
    client_id = 'com.quantgoal.platform.service'
    key_id = 'TW6F7CS749'
    key_file = 'backend/apple_key.p8'

    with open(key_file, 'r') as f:
        private_key_content = f.read()

    headers = {
        'kid': key_id,
        'alg': 'ES256'
    }

    payload = {
        'iss': team_id,
        'iat': int(time.time()),
        'exp': int(time.time()) + 15777000, # 6 months
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
    print(generate_client_secret())
