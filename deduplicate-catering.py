import json
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

with open('seating_plan_data.json', 'r', encoding='utf-8') as f:
    plan = json.load(f)

plan_data = plan[0]['plan_data']
guests = plan_data.get('guests', [])

# Extract confirmed and eating guests
raw_guests = []
for g in guests:
    name = g.get('name', '').strip().replace('  ', ' ')
    ap = g.get('ap', '').strip().replace('  ', ' ')
    fullname = f"{name} {ap}".strip()
    menu = g.get('menu', '').strip()
    table = g.get('table')
    conf = g.get('conf', False)
    
    if conf and menu not in ['?', 'No come', '']:
        raw_guests.append({
            'name': fullname,
            'menu': menu,
            'table': table,
            'guestId': g.get('guestId')
        })

# Separate seated and tray guests
seated = [g for g in raw_guests if g['table'] != '__none__']
tray = [g for g in raw_guests if g['table'] == '__none__']

print(f"Raw seated: {len(seated)}")
print(f"Raw tray: {len(tray)}")

# Smart deduplication:
# We keep all seated guests. For each tray guest, we check if they are already represented in the seated list.
# A tray guest is represented if:
# - Their guestId matches a seated guest's guestId.
# - Or their name is a match (e.g. "Nacho" vs "Nacho Jiménez", "Alba" vs "Alba Ruiz").

final_guests = list(seated)
added_from_tray = []

for tg in tray:
    # Check by guestId
    if tg['guestId'] and any(sg['guestId'] == tg['guestId'] for sg in seated):
        # Already seated
        continue
        
    # Check by name similarity
    tg_name_parts = tg['name'].lower().split()
    is_duplicate = False
    
    for sg in seated:
        sg_name_parts = sg['name'].lower().split()
        # If first names match and one name is a subset of the other, we consider them the same person
        if sg_name_parts and tg_name_parts and sg_name_parts[0] == tg_name_parts[0]:
            # Check if one surname is in the other
            sg_set = set(sg_name_parts)
            tg_set = set(tg_name_parts)
            if sg_set.issubset(tg_set) or tg_set.issubset(sg_set):
                is_duplicate = True
                # Update seated guest name to full database name if it was shorter (e.g. "Nacho" -> "Nacho Jiménez Moya")
                if len(tg['name']) > len(sg['name']):
                    sg['name'] = tg['name']
                break
                
    if not is_duplicate:
        final_guests.append(tg)
        added_from_tray.append(tg)

print(f"Deduplicated total: {len(final_guests)}")
print(f"Added from tray (actual unassigned guests): {len(added_from_tray)}")
for atg in added_from_tray:
    print(f"  - {atg['name']} ({atg['menu']})")

# Group and print final results
menu_groups = {
    'Carne': [],
    'Pescado': [],
    'Vegetariano': [],
    'Infantil': []
}

for g in final_guests:
    m = g['menu']
    # Normalize menu names
    if 'carne' in m.lower():
        menu_groups['Carne'].append(g)
    elif 'pescado' in m.lower():
        menu_groups['Pescado'].append(g)
    elif 'vegeta' in m.lower() or 'vega' in m.lower() or 'especial' in m.lower():
        menu_groups['Vegetariano'].append(g)
    elif 'infantil' in m.lower() or 'niño' in m.lower():
        menu_groups['Infantil'].append(g)
    else:
        menu_groups['Carne'].append(g)

print("\n=== DEDUPLICATED CATERING SUMMARY ===")
for m_name, m_list in menu_groups.items():
    print(f"  - Menú {m_name}: {len(m_list)}")
print(f"Total: {len(final_guests)}")
