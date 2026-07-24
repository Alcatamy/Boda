import json
import urllib.request

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

url = f"{env['NEXT_PUBLIC_SUPABASE_URL']}/rest/v1/guests?select=*"
headers = {
    'apikey': env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    'Authorization': f"Bearer {jwt_token}"
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        guests = json.loads(response.read().decode('utf-8'))
        print(f"Total guests in DB: {len(guests)}")
        for g in guests:
            fn = g.get('first_name', '').lower()
            ln = g.get('last_name', '').lower()
            pon = (g.get('plus_one_name') or '').lower()
            if 'alberto' in fn or 'alberto' in ln or 'alberto' in pon:
                print(f"Found match: {g['first_name']} {g['last_name']} - PlusOne: {g['plus_one_name']}")
except Exception as e:
    print(f"Error: {e}")
