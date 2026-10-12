import re

with open('src/data/mockData.ts', 'r') as f:
    content = f.read()

new_departments = """export const INITIAL_DEPARTMENTS: DepartmentSummary[] = [
  { code: 'EDU', name: 'หน่วยบริหารการศึกษา', en: 'Education Administration', prjCount: 0, share: '0%', amount: 0, spent: 0, head: '-' },
  { code: 'SA', name: 'หน่วยกิจการนักศึกษา & INTER UNIT', en: 'Student Affairs & INTER UNIT', prjCount: 0, share: '0%', amount: 0, spent: 0, head: '-' },
  { code: 'PR', name: 'หน่วยประชาสัมพันธ์', en: 'PR & Marketing', prjCount: 0, share: '0%', amount: 0, spent: 0, head: '-' },
  { code: 'WIL', name: 'ศูนย์ WIL & BRIDGE', en: 'WIL & BRIDGE Center', prjCount: 0, share: '0%', amount: 0, spent: 0, head: '-' },
  { code: 'CR', name: 'ห้องสร้างสรรค์', en: 'Creative Room', prjCount: 0, share: '0%', amount: 0, spent: 0, head: '-' },
  { code: 'HR', name: 'หน่วยบริหารงานบุคคล', en: 'Human Resources (HR)', prjCount: 0, share: '0%', amount: 0, spent: 0, head: '-' },
  { code: 'ADMIN', name: 'หน่วยธุรการสารบรรณ', en: 'Administration', prjCount: 0, share: '0%', amount: 0, spent: 0, head: '-' },
  { code: 'IT', name: 'หน่วยคอมพิวเตอร์และพัฒนาระบบ', en: 'IT & System Development', prjCount: 0, share: '0%', amount: 0, spent: 0, head: '-' },
  { code: 'FAC', name: 'หน่วยอาคารและสถานที่', en: 'Facility Management', prjCount: 0, share: '0%', amount: 0, spent: 0, head: '-' },
  { code: 'PLAN', name: 'หน่วยนโยบายและแผนฯ', en: 'Policy and Planning', prjCount: 2, share: '100%', amount: 96000, spent: 10040, head: '-' },
  { code: 'RES', name: 'หน่วยวิจัย', en: 'Research Unit', prjCount: 0, share: '0%', amount: 0, spent: 0, head: '-' },
  { code: 'IR', name: 'หน่วยวิเทศสัมพันธ์', en: 'International Relations', prjCount: 0, share: '0%', amount: 0, spent: 0, head: '-' },
  { code: 'FIN', name: 'หน่วยการเงินและบัญชี', en: 'Finance & Accounting', prjCount: 0, share: '0%', amount: 0, spent: 0, head: '-' },
  { code: 'PROC', name: 'หน่วยพัสดุ', en: 'Procurement', prjCount: 0, share: '0%', amount: 0, spent: 0, head: '-' },
];"""

content = re.sub(r'export const INITIAL_DEPARTMENTS: DepartmentSummary\[\] = \[.*?\];', new_departments, content, flags=re.DOTALL)

with open('src/data/mockData.ts', 'w') as f:
    f.write(content)
