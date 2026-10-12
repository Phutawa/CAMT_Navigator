import os
import re

files_to_check = [
    'src/components/DisbursementScreen.tsx',
    'src/components/AllocationScreen.tsx',
    'src/components/SettingsScreen.tsx',
    'src/components/ReportsScreen.tsx'
]

pattern = re.compile(
    r'\s*<button[^>]*>\s*<span[^>]*>visibility</span>\s*<span>พรีวิวเอกสารพิมพ์</span>\s*</button>', 
    re.DOTALL
)

for filepath in files_to_check:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        new_content = pattern.sub('', content)
        
        if new_content != content:
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
        else:
            print(f"No changes for {filepath} - pattern not found.")

