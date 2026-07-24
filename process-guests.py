import json

with open('guests_data.json', 'r', encoding='utf-8') as f:
    guests = json.load(f)

# Confirmed
confirmed_guests = [g for g in guests if g['attending'] is True]

total_adults = 0
total_children = 0
menus = {
    'meat': 0,
    'fish': 0,
    'vegan': 0,
    'vegetarian': 0,
    'child': 0,
    'other': 0
}
other_restrictions = []

for g in confirmed_guests:
    total_adults += 1
    
    # Check dietary restrictions of main guest
    dr = g.get('dietary_restrictions', '') or ''
    dr_lower = dr.lower()
    
    # Check menu choice of main guest
    mc = g.get('menu_choice', '') or ''
    
    # Classification logic
    is_vegan = 'vegan' in dr_lower
    is_veg = 'vegeta' in dr_lower or 'veg ' in dr_lower or 'vegg' in dr_lower
    
    if is_vegan:
        menus['vegan'] += 1
    elif is_veg:
        menus['vegetarian'] += 1
    elif mc == 'meat':
        menus['meat'] += 1
    elif mc == 'fish':
        menus['fish'] += 1
    else:
        menus['other'] += 1
        
    if dr:
        other_restrictions.append((f"{g['first_name']} {g['last_name']}", dr, "Main"))
        
    # Check plus one
    if g.get('has_plus_one'):
        total_adults += 1
        pmc = g.get('plus_one_menu_choice', '') or ''
        # We assume plus one dietary restrictions are not in a separate column?
        # Wait, the table schema has plus_one_name, but no plus_one_dietary_restrictions.
        # But wait! In the main guest's dietary restrictions, they might describe their partner's restrictions too.
        # Let's check!
        if pmc == 'meat':
            menus['meat'] += 1
        elif pmc == 'fish':
            menus['fish'] += 1
        else:
            menus['other'] += 1
            
    # Check children
    cc = g.get('children_count', 0) or 0
    total_children += cc
    menus['child'] += cc

# Let's write stdout plain summary
print("STDOUT SUMMARY")
print(f"Total guests in DB: {len(guests)}")
print(f"Confirmed guests rows: {len(confirmed_guests)}")
print(f"Confirmed Adults: {total_adults}")
print(f"Confirmed Children: {total_children}")

# Search for target guests
targets = ['andoni', 'gaizka', 'andres', 'andrés']
target_matches = []
for g in guests:
    fn = g['first_name'].lower()
    ln = g['last_name'].lower()
    for t in targets:
        if t in fn or t in ln:
            target_matches.append(g)
            print(f"Found target: {g['first_name']} {g['last_name']} - Attending: {g['attending']}")

# Create detailed report file
report_lines = []
report_lines.append("# Resumen de Confirmaciones y Menús\n")
report_lines.append("## Estadísticas Generales\n")
report_lines.append(f"- **Adultos Confirmados:** {total_adults}")
report_lines.append(f"- **Niños Confirmados:** {total_children}")
report_lines.append(f"- **Total Personas Confirmadas:** {total_adults + total_children}\n")

report_lines.append("## Desglose de Menús (Confirmados)\n")
report_lines.append(f"- **Carnes:** {menus['meat']}")
report_lines.append(f"- **Pescados:** {menus['fish']}")
report_lines.append(f"- **Veganos:** {menus['vegan']}")
report_lines.append(f"- **Vegetarianos:** {menus['vegetarian']}")
report_lines.append(f"- **Infantiles (Niños):** {menus['child']}")
report_lines.append(f"- **Otros / Sin definir:** {menus['other']}\n")

report_lines.append("## Restricciones Alimenticias Detalladas\n")
for name, rest, role in other_restrictions:
    report_lines.append(f"- **{name}** ({role}): {rest}")

report_lines.append("\n## Búsqueda de Invitados Específicos\n")
if target_matches:
    for g in target_matches:
        report_lines.append(f"- **{g['first_name']} {g['last_name']}**:")
        report_lines.append(f"  - Asistencia: {g['attending']}")
        report_lines.append(f"  - Menú: {g['menu_choice']}")
        report_lines.append(f"  - Restricciones: {g['dietary_restrictions']}")
else:
    report_lines.append("No se encontraron coincidencias para Andoni, Gaizka o Andrés.")

with open('seating_summary.md', 'w', encoding='utf-8') as rf:
    rf.write('\n'.join(report_lines))

print("Markdown report saved to seating_summary.md")
