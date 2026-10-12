export const AVATAR_IMG =
  "https://lh3.googleusercontent.com/aida/AEtjO1XITrEDfq0rh271hd3hcgntMtK4UuE000nBZqnzVZynx9B0jURKeAk5dZ1QEy8aOboBaLKFFvQKa39yJuhDAvjc9ElOm0eQlONdkIy_spCpSIAM4A36XFlnDxf4D7QWgUGipkcU1JBdc6JRGwZiV97rOLQUQotRlxhUyXIC5HZHvuHXiwIKQpm1DjUiJGxxkU9nAtKC-7oXmoZ5ewOwUtcqzgmdoAn00aC9ti_QKEDBGQE5qr-tD1JVFys";

export const LOGO_IMG =
  "https://lh3.googleusercontent.com/aida/AEtjO1XxU3199zEp4it35-Yt8047OaNpJl3k8s5-9Jl6TE9MK8GLgqcpVhEpdqtX5NV5bX7pSn2ZbqaHd_I25waa4Qyuvho7S97Ze0YmQ-2i6gv5sNL0gRP2FBkatGEEXqesDNEUgcCQLv3kEByWwvME8eGf7QwcLQk_ejx5XAbAI9wXzuJahEqnTUxHuSyyWOg2Aoay9NKS4_LD9EneaPsUZfX8qHKsn-0M6xkES0BqjQRfegxmigvinBlVfpI";

export const LAB_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAgjJnzhhwIiY64HSwE67eaJkIKst4TSUEJ2-q-Tku_21apFfu_deYAczX3mCl0Jmmp5gNbvsz42OywEdSkwPO2jeevvxtbJQyb2A-oFjxdhE6Zj4LDtBcYVsGiITfF2Zll-ccBaauj1mVmCJDov_znt4O_5VL4fllwsNgD6JxykQraH3oVy-uv3yRdGHEZeTOAAZCDSDv5jgyFFLtc8bpvTLH2E4eUHU3SMmhgiHU";

export type QuarterType = 'all' | 'q1' | 'q2' | 'q3' | 'q4';

export interface ProjectItem {
  id: string;
  code: string;
  title: string;
  dept: string;
  category: string;
  allocated: number;
  spent: number;
  head: string;
  status: 'active' | 'approved' | 'pending' | 'review';
  completionPct: number;
  description?: string;
  quarter: 'q1' | 'q2' | 'q3' | 'q4';
  periodLabel?: string;
}

export interface DepartmentSummary {
  code: string;
  name: string;
  en: string;
  prjCount: number;
  share: string;
  amount: number;
  spent: number;
  head: string;
}

export interface StrategicCategory {
  id: string;
  title: string;
  en: string;
  budget: number;
  actual: number;
  pct: string;
  code: string;
}

export const INITIAL_CATEGORIES: StrategicCategory[] = [
  { id: 'student', code: 'SO-1', title: 'พัฒนาคุณภาพนักศึกษา', en: 'Student Quality & Experience', budget: 2200000, actual: 1430000, pct: '65.0%' },
  { id: 'academic', code: 'SO-2', title: 'พัฒนาวิชาการและหลักสูตร', en: 'Academic & Curriculum Innovation', budget: 3500000, actual: 2450000, pct: '70.0%' },
  { id: 'research', code: 'SO-3', title: 'ส่งเสริมการวิจัยและนวัตกรรม', en: 'Research & Global Innovation', budget: 2800000, actual: 1120000, pct: '40.0%' },
  { id: 'service', code: 'SO-4', title: 'บริการวิชาการแก่สังคม', en: 'Academic Services & Community Impact', budget: 1500000, actual: 600000, pct: '40.0%' },
  { id: 'org', code: 'SO-5', title: 'บริหารจัดการและพัฒนาองค์กร', en: 'Agile Governance & Operations', budget: 2000000, actual: 1220000, pct: '61.0%' },
];

export const INITIAL_DEPARTMENTS: DepartmentSummary[] = [
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
];

export const INITIAL_PROJECTS: ProjectItem[] = [
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
];
