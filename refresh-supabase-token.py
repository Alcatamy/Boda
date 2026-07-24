import json
import urllib.request
import re

def load_env(path):
    env = {}
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if '=' in line:
                key, val = line.split('=', 1)
                env[key.strip()] = val.strip()
    return env

env = load_env('.env.local')

file_path = r"C:\Users\adria\AppData\Local\Google\Chrome\User Data\Default\Local Storage\leveldb\002678.ldb"
try:
    with open(file_path, 'rb') as f:
        content = f.read()
    
    # Use regex to find refresh token
    # Format is: "refresh_token":"[A-Za-z0-9-_]+"
    match = re.search(br'"refresh_token":"([A-Za-z0-9-_]+)"', content)
    if not match:
        print("Refresh token not found using regex.")
        # Try a broader search for any string that looks like a refresh token
        # In newer Supabase versions, it might contain other characters
        match = re.search(br'"refresh_token":"([^"]+)"', content)
    
    if match:
        refresh_token = match.group(1).decode('utf-8')
        print(f"Found refresh token: {refresh_token[:10]}...")
        
        # Perform refresh token request
        # Endpoint: POST https://<project-ref>.supabase.co/auth/v1/token?grant_type=refresh_token
        url = f"{env['NEXT_PUBLIC_SUPABASE_URL']}/auth/v1/token?grant_type=refresh_token"
        headers = {
            'apikey': env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
            'Content-Type': 'application/json'
        }
        body = {
            'refresh_token': refresh_token
        }
        
        data_bytes = json.dumps(body).encode('utf-8')
        req = urllib.request.Request(url, data=data_bytes, headers=headers, method='POST')
        
        try:
            with urllib.request.urlopen(req) as response:
                resp_data = json.loads(response.read().decode('utf-8'))
                new_access_token = resp_data['access_token']
                new_refresh_token = resp_data['refresh_token']
                print(f"Success! Got new access token (Length={len(new_access_token)})")
                with open('token_0.txt', 'w') as tf:
                    tf.write(new_access_token)
                print("Saved new access token to token_0.txt")
        except Exception as e:
            # Print response error details if available
            if hasattr(e, 'read'):
                print(f"Error response from Supabase: {e.read().decode('utf-8')}")
            else:
                print(f"Error during request: {e}")
    else:
        print("Could not locate refresh token in LevelDB.")
except Exception as e:
    print(f"Error: {e}")
