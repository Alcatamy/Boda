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
headers = {
    'apikey': env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    'Authorization': f"Bearer {env['NEXT_PUBLIC_SUPABASE_ANON_KEY']}"
}

def query_table(table):
    url = f"{env['NEXT_PUBLIC_SUPABASE_URL']}/rest/v1/{table}?select=*"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        return f"Error: {e}"

print("=== GUESTS ===")
guests = query_table('guests')
print(json.dumps(guests, indent=2, ensure_ascii=False))

print("=== MESSAGES ===")
messages = query_table('messages')
print(json.dumps(messages, indent=2, ensure_ascii=False))

print("=== SONG REQUESTS ===")
songs = query_table('song_requests')
print(json.dumps(songs, indent=2, ensure_ascii=False))
