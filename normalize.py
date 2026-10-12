import re

with open('src/data/mockData.ts', 'r') as f:
    content = f.read()

dept_pattern = re.compile(r"\{\s*code:\s*'([^']+)',\s*name:\s*'([^']+)',\s*en:\s*'([^']+)',\s*prjCount:\s*(\d+),\s*share:\s*'([^']+)',\s*amount:\s*(\d+),\s*spent:\s*(\d+)")

depts = []
for m in dept_pattern.finditer(content):
    depts.append({
        'match': m,
        'code': m.group(1),
        'name': m.group(2),
        'en': m.group(3),
        'prjCount': int(m.group(4)),
        'share': m.group(5),
        'amount': int(m.group(6)),
        'spent': int(m.group(7))
    })

def get_category(code):
    if code.startswith('BSC') or code.startswith('MST') or code.startswith('PHD') or code in ['ACA', 'CEN']:
        return 'academic'
    if code in ['EDU-01', 'EDU-02', 'EDU-05']:
        return 'student'
    if code.startswith('RES') or code == 'DITC':
        return 'research'
    if code in ['EDU-03', 'EDU-04', 'STR']:
        return 'service'
    return 'org'

targets = {
    'student': 1567500,
    'academic': 2493750,
    'research': 1995000,
    'service': 1068750,
    'org': 1425000
}

groups = {k: [] for k in targets.keys()}
for d in depts:
    groups[get_category(d['code'])].append(d)

new_content = content
for cat, target in targets.items():
    dlist = groups[cat]
    raw_sum = sum(d['amount'] for d in dlist)
    current_sum = 0
    for i, d in enumerate(dlist):
        if i == len(dlist) - 1:
            new_amount = target - current_sum
        else:
            new_amount = int(round(d['amount'] * target / raw_sum))
            current_sum += new_amount
        
        new_spent = int(round(new_amount * (d['spent'] / d['amount'])))
        
        old_str = d['match'].group(0)
        new_str = f"{{ code: '{d['code']}', name: '{d['name']}', en: '{d['en']}', prjCount: {d['prjCount']}, share: '{d['share']}', amount: {new_amount}, spent: {new_spent}"
        new_content = new_content.replace(old_str, new_str)

with open('src/data/mockData.ts', 'w') as f:
    f.write(new_content)
