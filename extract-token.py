import os
import re

file_path = r"C:\Users\adria\AppData\Local\Google\Chrome\User Data\Default\Local Storage\leveldb\002678.ldb"
try:
    with open(file_path, 'rb') as f:
        content = f.read()
    
    # Let's search for the access token in the content
    # Supabase tokens are JSON objects containing access_token, refresh_token, etc.
    # The access_token is a JWT (starts with eyJ...)
    # Let's search for JWT patterns: eyJ[A-Za-z0-9-_=]+\.eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+
    jwt_pattern = re.compile(br'eyJ[A-Za-z0-9-_=]+\.eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+')
    jwts = jwt_pattern.findall(content)
    
    print(f"Found {len(jwts)} JWT-like tokens.")
    for i, jwt in enumerate(jwts):
        # Decode and print the first 50 chars and the full token size
        print(f"Token {i}: Length = {len(jwt)}, Start = {jwt[:50].decode('utf-8')}...")
        # Save it to a file so we can use it
        with open(f'token_{i}.txt', 'wb') as tf:
            tf.write(jwt)
except Exception as e:
    print(f"Error: {e}")
