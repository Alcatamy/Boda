import os

def search_in_leveldb(dir_path, search_str):
    search_bytes = search_str.encode('utf-8')
    found = False
    for root, dirs, files in os.walk(dir_path):
        # We only care about leveldb directories
        if 'leveldb' not in root.lower() and 'indexeddb' not in root.lower():
            continue
        for file in files:
            if not file.endswith('.log') and not file.endswith('.ldb'):
                continue
            path = os.path.join(root, file)
            try:
                with open(path, 'rb') as f:
                    content = f.read()
                    if search_bytes in content:
                        print(f"FOUND IN: {path}")
                        idx = content.index(search_bytes)
                        start = max(0, idx - 150)
                        end = min(len(content), idx + 250)
                        print(content[start:end])
                        found = True
            except Exception as e:
                pass
    return found

search_terms = ['supabase.auth.token', 'boda.admin']
paths = [
    os.path.expandvars(r'%LOCALAPPDATA%\Google\Chrome\User Data'),
    os.path.expandvars(r'%LOCALAPPDATA%\Microsoft\Edge\User Data')
]

for term in search_terms:
    print(f"=== Searching for '{term}' ===")
    for p in paths:
        if os.path.exists(p):
            search_in_leveldb(p, term)
