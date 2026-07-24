import os

def search_files(directory, search_str):
    search_bytes = search_str.encode('utf-8')
    for root, dirs, files in os.walk(directory):
        for file in files:
            path = os.path.join(root, file)
            try:
                with open(path, 'rb') as f:
                    content = f.read()
                    if search_bytes in content:
                        print(f"Found in: {path}")
                        # Print some context around the match
                        idx = content.index(search_bytes)
                        start = max(0, idx - 100)
                        end = min(len(content), idx + 200)
                        print(content[start:end])
            except Exception as e:
                pass

chrome_path = os.path.expandvars(r'%LOCALAPPDATA%\Google\Chrome\User Data')
print("Searching Chrome User Data for '@boda.admin'...")
search_files(chrome_path, '@boda.admin')
