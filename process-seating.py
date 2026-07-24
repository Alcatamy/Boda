import json

with open('seating_plan_data.json', 'r', encoding='utf-8') as f:
    plan = json.load(f)

plan_data = plan[0]['plan_data']
guests = plan_data.get('guests', [])

print("=== Guests in Table 9 ===")
for g in guests:
    if g.get('table') == 9:
        print(g)
