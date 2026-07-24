import json
import urllib.request
import os

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

with open('token_0.txt', 'r') as tf:
    jwt_token = tf.read().strip()

url = f"{env['NEXT_PUBLIC_SUPABASE_URL']}/rest/v1/seating_plan?id=eq.main&select=*"
headers = {
    'apikey': env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    'Authorization': f"Bearer {jwt_token}"
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
        print(f"Success! Fetched seating plan.")
        with open('seating_plan_data.json', 'w', encoding='utf-8') as jf:
            json.dump(data, jf, indent=2, ensure_ascii=False)
except Exception as e:
    print(f"Error fetching data: {e}")
