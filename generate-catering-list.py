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

# Filter: must be confirmed (conf == True) and must have a defined menu (menu not in ['?', 'No come', ''])
eating_guests = []
not_eating_guests = []

for g in guests:
    name = g.get('name', '').strip()
    ap = g.get('ap', '').strip()
    fullname = f"{name} {ap}".strip()
    menu = g.get('menu', '').strip()
    table = g.get('table')
    conf = g.get('conf', False)
    
    # Clean up name display
    fullname = fullname.replace('  ', ' ')
    
    is_eating = conf and menu not in ['?', 'No come', '']
    
    # We ignore guests in tray ('__none__') if they are not confirmed,
    # but if they are confirmed (conf == True) and eat, they must be counted.
    if is_eating:
        eating_guests.append({
            'name': fullname,
            'menu': menu,
            'table': table
        })
    else:
        if conf:
            not_eating_guests.append({
                'name': fullname,
                'menu': menu,
                'table': table
            })

# Grouping by Menu
menu_groups = {
    'Carne': [],
    'Pescado': [],
    'Vegetariano': [],
    'Infantil': []
}

for eg in eating_guests:
    m = eg['menu']
    # Normalize menu names
    if 'carne' in m.lower():
        menu_groups['Carne'].append(eg)
    elif 'pescado' in m.lower():
        menu_groups['Pescado'].append(eg)
    elif 'vegeta' in m.lower() or 'vega' in m.lower() or 'especial' in m.lower():
        menu_groups['Vegetariano'].append(eg)
    elif 'infantil' in m.lower() or 'niño' in m.lower():
        menu_groups['Infantil'].append(eg)
    else:
        # Fallback
        menu_groups['Carne'].append(eg)

# Grouping by Table
table_groups = {}
for eg in eating_guests:
    t = eg['table']
    table_label = f"Mesa {t}" if t != '__none__' else "Pendiente de asignar mesa"
    if table_label not in table_groups:
        table_groups[table_label] = []
    table_groups[table_label].append(eg)

# Print Summary
print("=== RESUMEN PARA EL CATERING ===")
total_eating = len(eating_guests)
print(f"Total comensales que comen: {total_eating}")
for m_name, m_list in menu_groups.items():
    print(f"  - Menú {m_name}: {len(m_list)}")

print(f"\nTotal invitados confirmados que NO comen: {len(not_eating_guests)}")
for neg in not_eating_guests:
    print(f"  - {neg['name']} (Mesa {neg['table']})")

# Print List by Menu
print("\n=== LISTADO DETALLADO POR MENÚ ===")
for m_name, m_list in menu_groups.items():
    print(f"\n>>> MENÚ {m_name.upper()} ({len(m_list)} comensales) <<<")
    m_list.sort(key=lambda x: (str(x['table']), x['name']))
    for idx, eg in enumerate(m_list, 1):
        t_str = f"Mesa {eg['table']}" if eg['table'] != '__none__' else "Pendiente de mesa"
        print(f"  {idx}. {eg['name']} ({t_str})")

# Print List by Table
print("\n=== LISTADO DETALLADO POR MESA ===")
sorted_tables = sorted(list(table_groups.keys()), key=lambda x: (0 if "Pendiente" in x else 1, x))
for t_name in sorted_tables:
    t_list = table_groups[t_name]
    print(f"\n>>> {t_name.upper()} ({len(t_list)} comensales) <<<")
    t_list.sort(key=lambda x: x['name'])
    for idx, eg in enumerate(t_list, 1):
        print(f"  {idx}. {eg['name']} — Menú: {eg['menu']}")
