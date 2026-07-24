import os
import re

file_path = r"C:\Users\adria\AppData\Local\Google\Chrome\User Data\Default\Local Storage\leveldb\002678.ldb"
try:
    with open(file_path, 'rb') as f:
        content = f.read()
    
    # Let's search for "refresh_token" in content
    idx = content.find(b'"refresh_token"')
    if idx != -1:
        print("Found 'refresh_token' keyword.")
        # Let's extract from index-100 to index+1000
        start = max(0, idx - 100)
        end = min(len(content), idx + 2000)
        snippet = content[start:end]
        # Let's save the snippet to a file so we can view it
        with open('refresh_token_snippet.txt', 'wb') as rf:
            rf.write(snippet)
        print("Saved snippet to refresh_token_snippet.txt")
    else:
        print("Keyword 'refresh_token' not found in this file.")
except Exception as e:
    print(f"Error: {e}")
