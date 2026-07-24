import json
import urllib.request
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

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
        
        # Only guests who are attending
        confirmed = [g for g in guests if g['attending'] is True]
        
        # Group lists
        meat_list = []
        fish_list = []
        vegetarian_list = []
        child_list = []
        other_list = []
        
        child_count_total = 0
        
        for g in confirmed:
            name = f"{g['first_name']} {g['last_name']}".strip()
            dr = (g.get('dietary_restrictions', '') or '').lower()
            mc = (g.get('menu_choice', '') or '').lower()
            
            # 1. Classify Main Guest
            is_veg = 'vegeta' in dr or 'veg ' in dr or 'vegg' in dr or mc == 'vegetarian'
            is_vegan = 'vegan' in dr or mc == 'vegan'
            
            if is_veg or is_vegan:
                vegetarian_list.append((name, 'Vegetariano' if is_veg else 'Vegano', g.get('dietary_restrictions')))
            elif mc == 'meat':
                meat_list.append((name, 'Carne'))
            elif mc == 'fish':
                fish_list.append((name, 'Pescado'))
            else:
                other_list.append((name, f"Sin definir (Restr: {g.get('dietary_restrictions')})"))
                
            # 2. Classify Companion (+1)
            if g.get('has_plus_one'):
                p1name = (g.get('plus_one_name') or '').strip()
                if not p1name:
                    p1name = f"Acompañante de {g['first_name']}"
                    
                p1mc = (g.get('plus_one_menu_choice', '') or '').lower()
                
                if p1mc == 'child':
                    child_list.append((p1name, 'Infantil'))
                elif p1mc == 'meat':
                    meat_list.append((p1name, 'Carne'))
                elif p1mc == 'fish':
                    fish_list.append((p1name, 'Pescado'))
                else:
                    other_list.append((p1name, 'Sin definir'))
            
            # 3. Children (from children_count)
            cc = g.get('children_count', 0) or 0
            if cc > 0:
                child_count_total += cc
                for i in range(cc):
                    child_list.append((f"Niño de {name} (#{i+1})", 'Infantil'))
                    
        print("=== OFFICIAL CATERING STATS FROM DATABASE ===")
        print(f"Confirmed Guests (Rows): {len(confirmed)}")
        print(f"Total Meat: {len(meat_list)}")
        print(f"Total Fish: {len(fish_list)}")
        print(f"Total Vegetarian/Vegan: {len(vegetarian_list)}")
        print(f"Total Child (declared): {len(child_list)} (from child_count sum = {child_count_total} + plus_one child = {len(child_list)-child_count_total})")
        print(f"Total Other/Sin definir: {len(other_list)}")
        print(f"Total Eating: {len(meat_list) + len(fish_list) + len(vegetarian_list) + len(child_list) + len(other_list)}")
        
        # Print lists
        print("\n=== CARNE ===")
        for idx, item in enumerate(sorted(meat_list), 1):
            print(f"  {idx}. {item[0]}")
            
        print("\n=== PESCADO ===")
        for idx, item in enumerate(sorted(fish_list), 1):
            print(f"  {idx}. {item[0]}")
            
        print("\n=== VEGETARIANO / VEGANO ===")
        for idx, item in enumerate(sorted(vegetarian_list), 1):
            print(f"  {idx}. {item[0]} ({item[1]} - Restr: {item[2]})")
            
        print("\n=== INFANTIL ===")
        for idx, item in enumerate(sorted(child_list), 1):
            print(f"  {idx}. {item[0]}")
            
        print("\n=== OTROS / SIN DEFINIR ===")
        for idx, item in enumerate(sorted(other_list), 1):
            print(f"  {idx}. {item[0]} ({item[1]})")
            
except Exception as e:
    print(f"Error: {e}")
