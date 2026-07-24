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

# 1. Fetch guests from DB
url_guests = f"{env['NEXT_PUBLIC_SUPABASE_URL']}/rest/v1/guests?select=*"
headers = {
    'apikey': env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    'Authorization': f"Bearer {jwt_token}"
}

req_guests = urllib.request.Request(url_guests, headers=headers)
try:
    with urllib.request.urlopen(req_guests) as response:
        db_guests = json.loads(response.read().decode('utf-8'))
except Exception as e:
    print(f"Error fetching guests: {e}")
    exit()

# 2. Fetch seating plan from DB
url_plan = f"{env['NEXT_PUBLIC_SUPABASE_URL']}/rest/v1/seating_plan?id=eq.main&select=plan_data"
req_plan = urllib.request.Request(url_plan, headers=headers)
try:
    with urllib.request.urlopen(req_plan) as response:
        rows = json.loads(response.read().decode('utf-8'))
        plan_guests = rows[0]['plan_data'].get('guests', [])
except Exception as e:
    print(f"Error fetching plan: {e}")
    exit()

# Build map of guestId -> table from seating plan
table_map = {}
for pg in plan_guests:
    gid = pg.get('guestId')
    name = pg.get('name', '').strip()
    table = pg.get('table')
    if gid:
        table_map[gid] = table
    # Also save local/manual guests who don't have a guestId
    if not gid and table != '__none__':
        table_key = f"manual:{name.lower()}"
        table_map[table_key] = table

# Group lists
categories = {
    'Adults': [],
    'Children': [],
    'Meat': [],
    'Fish': [],
    'Vegetarian': [],
    'Other/No eat/No menu': []
}

# Keep track of duplicate control (just in case)
processed_names = set()

confirmed_guests = [g for g in db_guests if g['attending'] is True]

for g in confirmed_guests:
    name = f"{g['first_name']} {g['last_name']}".strip()
    gid = g['id']
    table = table_map.get(gid, 'Sin mesa')
    
    # 1. Main Guest
    dr = (g.get('dietary_restrictions', '') or '').lower()
    mc = (g.get('menu_choice', '') or '').lower()
    
    is_vegetarian = 'vegeta' in dr or 'veg ' in dr or 'vegg' in dr or mc == 'vegetarian'
    is_vegan = 'vegan' in dr or mc == 'vegan'
    
    menu = 'Other'
    if is_vegetarian or is_vegan:
        menu = 'Vegetarian'
        categories['Vegetarian'].append((name, table, 'Vegetariano' if is_vegetarian else 'Vegano'))
    elif mc == 'meat':
        menu = 'Meat'
        categories['Meat'].append((name, table, 'Carne'))
    elif mc == 'fish':
        menu = 'Fish'
        categories['Fish'].append((name, table, 'Pescado'))
    else:
        categories['Other/No eat/No menu'].append((name, table, f"Sin definir (Restr: {g.get('dietary_restrictions')})"))
        
    categories['Adults'].append((name, table, f"Menú: {menu}"))
    
    # 2. Companion (+1)
    if g.get('has_plus_one'):
        p1name = (g.get('plus_one_name') or '').strip()
        if not p1name:
            p1name = f"Acompañante de {g['first_name']}"
            
        p1mc = (g.get('plus_one_menu_choice', '') or '').lower()
        p1table = table # usually same table
        
        # Check if plus one is a child
        if p1mc == 'child':
            categories['Children'].append((p1name, p1table, 'Infantil'))
        elif p1mc == 'meat':
            categories['Meat'].append((p1name, p1table, 'Carne'))
            categories['Adults'].append((p1name, p1table, 'Menú: Meat'))
        elif p1mc == 'fish':
            categories['Fish'].append((p1name, p1table, 'Pescado'))
            categories['Adults'].append((p1name, p1table, 'Menú: Fish'))
        else:
            categories['Other/No eat/No menu'].append((p1name, p1table, 'Sin definir'))
            categories['Adults'].append((p1name, p1table, 'Menú: Other'))

    # 3. Children count (from db)
    cc = g.get('children_count', 0) or 0
    if cc > 0:
        # Since we don't have child names in DB, we'll try to find them in seating plan
        # but for DB counts, we can output placeholder child entries
        pass

# Now let's gather child seats and manual seats from seating plan!
for pg in plan_guests:
    if pg.get('table') == '__none__':
        continue
    gid = pg.get('guestId')
    name = pg.get('name', '').strip()
    ap = pg.get('ap', '').strip()
    fullname = f"{name} {ap}".strip()
    menu = pg.get('menu', '').strip()
    table = pg.get('table')
    is_child = pg.get('child') or pg.get('isChild') or (menu == 'Infantil') or ('niño' in name.lower()) or ('nino' in name.lower())
    
    if is_child:
        if menu == 'Infantil':
            categories['Children'].append((fullname, table, 'Infantil'))
        elif menu in ['?', 'No come']:
            categories['Other/No eat/No menu'].append((fullname, table, f"Sin menú / No come ({menu})"))
            categories['Children'].append((fullname, table, f"Sin menú ({menu})"))
        else:
            categories['Children'].append((fullname, table, menu))
    else:
        # If it is a manual/local guest (no guestId) and not a child
        if not gid:
            if menu == 'Carne':
                categories['Meat'].append((fullname, table, 'Carne'))
                categories['Adults'].append((fullname, table, 'Menú: Meat'))
            elif menu == 'Pescado':
                categories['Fish'].append((fullname, table, 'Pescado'))
                categories['Adults'].append((fullname, table, 'Menú: Fish'))
            elif menu == 'Vegetariano':
                categories['Vegetarian'].append((fullname, table, 'Vegetariano'))
                categories['Adults'].append((fullname, table, 'Menú: Vegetarian'))
            else:
                categories['Other/No eat/No menu'].append((fullname, table, menu))
                categories['Adults'].append((fullname, table, f"Menú: {menu}"))

# Print grouped lists sorted
for cat_name, items in categories.items():
    print(f"\n==================== {cat_name.upper()} ({len(items)} items) ====================")
    # Deduplicate items by name to avoid double display due to couple links or plan links
    unique_items = []
    seen_names = set()
    for item in items:
        cleaned_name = item[0].lower().replace(' ', '')
        if cleaned_name not in seen_names:
            seen_names.add(cleaned_name)
            unique_items.append(item)
            
    # Sort unique items by table then name
    unique_items.sort(key=lambda x: (str(x[1]), x[0]))
    
    for idx, item in enumerate(unique_items, 1):
        print(f"{idx}. {item[0]} (Mesa {item[1]}) - {item[2]}")
