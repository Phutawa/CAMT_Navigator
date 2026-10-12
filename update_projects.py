import re

with open('src/data/mockData.ts', 'r') as f:
    content = f.read()

new_projects = """export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'prj-1',
    code: '2569-PNQA-001',
    title: 'ค่าตอบแทนล่วงเวลา',
    dept: 'หน่วยนโยบายและแผนฯ',
    category: 'org', // Assuming org (SO-5)
    allocated: 16000,
    spent: 5040, // based on excel "จ่ายจริง" or similar, let's use 5040
    head: 'น้ำมนต์',
    status: 'active',
    completionPct: (5040/16000)*100,
    quarter: 'q1',
    periodLabel: 'ต.ค. - ธ.ค. 2568',
    description: 'ค่าตอบแทนล่วงเวลา งานนโยบายและแผน',
  },
  {
    id: 'prj-2',
    code: '2569-PNQA-002',
    title: 'ค่าอาหารว่างและเครื่องดื่มในการประชุม',
    dept: 'หน่วยนโยบายและแผนฯ',
    category: 'org',
    allocated: 80000,
    spent: 80000,
    head: 'น้ำมนต์',
    status: 'active',
    completionPct: 100,
    quarter: 'q1',
    periodLabel: 'ต.ค. - ธ.ค. 2568',
    description: 'ค่าอาหารว่างและเครื่องดื่มในการประชุม',
  }
];"""

content = re.sub(r'export const INITIAL_PROJECTS: ProjectItem\[\] = \[.*?\];', new_projects, content, flags=re.DOTALL)

with open('src/data/mockData.ts', 'w') as f:
    f.write(content)
