export const AVATAR_IMG =
  "/N profile.jpg";

export const LOGO_IMG =
  "/camt navigator.png";

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
  fund3D?: string;
  act3D?: string;
  id3D?: string;
}

export interface ProjectCommitteeMember {
  name: string;
  role: string;
}

export interface ProjectObjectiveItem {
  id: number;
  objective: string;
  kpi: string;
  target: number | string;
  unit: string;
}

export interface ProjectActionPlanItem {
  item: string;
  amount: number;
  fiscalYear: string;
  activeMonths: string[];
}

export interface ProjectBudgetItem {
  exCode: string;
  categoryName: string;
  formula: string;
  description: string;
  amount: number;
}

export interface ProjectParticipantGroup {
  id: number;
  group: string;
  count: number;
}

export interface ProjectOfficialSignature {
  roleTitle: string;
  name: string;
  position: string;
  signatureStyle?: string;
}

export interface OfficialProjectReportData {
  projectCode: string;
  fund3D: string;
  act3D: string;
  id3D: string;
  title: string;
  unit: string;
  work: string;
  startDate: string;
  endDate: string;
  committee: ProjectCommitteeMember[];
  rationale: string;
  objectives: ProjectObjectiveItem[];
  benefits: string[];
  actionPlan: ProjectActionPlanItem[];
  strategies: {
    national: {
      name: string;
      items: string[];
    };
    cmu: {
      name: string;
      items: string[];
    };
    camt: {
      name: string;
      items: string[];
    };
  };
  qualityAssurance: {
    criteria: string;
    items: string[];
  };
  participants: ProjectParticipantGroup[];
  budgetItems: ProjectBudgetItem[];
  totalBudget: number;
  totalBudgetText: string;
  note: string;
  signatures: ProjectOfficialSignature[];
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

export interface CommitmentItem {
  no: string;
  title: string;
  vendor: string;
  amt: string;
  amountNumber: number;
  status: string;
}

export const INITIAL_COMMITMENTS: CommitmentItem[] = [
  { no: 'PO-2569-DG01', title: 'ค่าพาหนะและที่พักศึกษาดูงานดิจิทัลเกม (2569-DG-P1-001)', vendor: 'บจก. ทราเวล คอนเน็คชั่น แอนด์ ทรานสปอร์ต', amt: '฿310,440', amountNumber: 310440, status: 'ตรวจรับแล้ว รอเบิกจ่าย' },
  { no: 'PO-2569-041', title: 'ชุดเซิร์ฟเวอร์ Cloud Lab SE', vendor: 'บจก. สยามเน็ตเวิร์ก โซลูชั่นส์', amt: '฿680,000', amountNumber: 680000, status: 'รอตรวจรับ (ส่งมอบ 80%)' },
  { no: 'PO-2569-038', title: 'ลิขสิทธิ์ซอฟต์แวร์แอนิเมชัน ANIM', vendor: 'บจก. ดิจิทัล ซิสเต็มส์ คอนซัลติ้ง', amt: '฿520,000', amountNumber: 520000, status: 'ตรวจรับแล้ว รอเบิกจ่าย' },
  { no: 'PO-2569-035', title: 'จ้างพัฒนาระบบ Hybrid Learning DTM', vendor: 'บจก. อินโนเวทีฟ เอ็ดดูเทค', amt: '฿380,000', amountNumber: 380000, status: 'ดำเนินงานงวด 2' },
  { no: 'PO-2569-029', title: 'ชุดอุปกรณ์เซนเซอร์ IoT ห้อง FabLab DII', vendor: 'หจก. ลานนา ไมโครเทค', amt: '฿295,000', amountNumber: 295000, status: 'ส่งมอบครบถ้วน รอเบิกจ่าย' },
];

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
  { id: 'student', code: 'SO-1', title: 'พัฒนาคุณภาพนักศึกษา', en: 'Student Quality & Experience', budget: 1650000, actual: 1120000, pct: '67.9%' },
  { id: 'academic', code: 'SO-2', title: 'พัฒนาวิชาการและหลักสูตร', en: 'Academic & Curriculum Innovation', budget: 2450000, actual: 1720000, pct: '70.2%' },
  { id: 'research', code: 'SO-3', title: 'ส่งเสริมการวิจัยและนวัตกรรม', en: 'Research & Global Innovation', budget: 1680000, actual: 1150000, pct: '68.5%' },
  { id: 'service', code: 'SO-4', title: 'บริการวิชาการแก่สังคม', en: 'Academic Services & Community Impact', budget: 1220000, actual: 780000, pct: '63.9%' },
  { id: 'org', code: 'SO-5', title: 'บริหารจัดการและพัฒนาองค์กร', en: 'Agile Governance & Operations', budget: 1550000, actual: 1050000, pct: '67.7%' },
];

export const INITIAL_DEPARTMENTS: DepartmentSummary[] = [
  { code: 'EDU-01', name: 'หน่วยบริหารการศึกษา', en: 'Education Administration Unit', prjCount: 2, share: '3.6%', amount: 783750, spent: 359887, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'EDU-02', name: 'หน่วยกิจการนักศึกษา & INTER UNIT', en: 'Student Affairs & Inter Unit', prjCount: 1, share: '1.2%', amount: 268125, spent: 182800, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'EDU-03', name: 'หน่วยประชาสัมพันธ์ PR & Marketing', en: 'PR & Marketing Unit', prjCount: 5, share: '1.4%', amount: 296875, spent: 206301, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'EDU-04', name: 'ศูนย์ WIL & BRIDGE', en: 'WIL & BRIDGE Center', prjCount: 4, share: '2.5%', amount: 534375, spent: 208882, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'EDU-05', name: 'ห้องสร้างสรรค์', en: 'Creative Room', prjCount: 4, share: '2.4%', amount: 515625, spent: 424378, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'ADM-01', name: 'หน่วยบริหารงานบุคคล HR', en: 'HR Unit', prjCount: 3, share: '1.0%', amount: 83378, spent: 29232, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'ADM-02', name: 'หน่วยธุรการสารบรรณ', en: 'General Administration Unit', prjCount: 2, share: '2.6%', amount: 212234, spent: 126188, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'ADM-03', name: 'หน่วยคอมพิวเตอร์และพัฒนาระบบ', en: 'IT & System Development Unit', prjCount: 10, share: '3.0%', amount: 242553, spent: 242553, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'ADM-04', name: 'หน่วยอาคารและสถานที่', en: 'Building & Facility Unit', prjCount: 1, share: '1.9%', amount: 151596, spent: 128913, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'PLN-01', name: 'หน่วยนโยบายและแผนฯ', en: 'Policy & Planning Unit', prjCount: 6, share: '2.5%', amount: 204654, spent: 92595, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'RES-01', name: 'หน่วยวิจัย', en: 'Research Unit', prjCount: 6, share: '1.5%', amount: 506667, spent: 205932, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'RES-02', name: 'หน่วยวิเทศสัมพันธ์', en: 'International Relations Unit', prjCount: 2, share: '3.0%', amount: 1013333, spent: 984889, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'FIN-01', name: 'หน่วยการเงินและบัญชี', en: 'Finance & Accounting Unit', prjCount: 10, share: '2.4%', amount: 197074, spent: 183335, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'FIN-02', name: 'หน่วยพัสดุ', en: 'Procurement Unit', prjCount: 8, share: '4.1%', amount: 333511, spent: 143399, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'DITC', name: 'ศูนย์ DITC', en: 'DITC Center', prjCount: 7, share: '1.4%', amount: 475000, spent: 353036, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'CEN', name: 'ส่วนกลางวิทยาลัย (งบสำรองจ่าย/กองทุนพัฒนา)', en: 'Central Fund & Development', prjCount: 10, share: '3.1%', amount: 127193, spent: 96895, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'STR', name: 'ยุทธศาสตร์', en: 'Strategic Fund', prjCount: 2, share: '1.1%', amount: 237500, spent: 195539, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'ACA', name: 'สำนักวิชา', en: 'Academic Office', prjCount: 5, share: '1.4%', amount: 57815, spent: 55827, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'PHD-KMI', name: 'ป.เอก หลักสูตรการจัดการความรู้และนวัตกรรม', en: 'Ph.D. Knowledge Management & Innovation', prjCount: 2, share: '3.2%', amount: 131047, spent: 71063, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'PHD-DTM', name: 'ป.เอก หลักสูตรการจัดการเทคโนโลยีดิจิทัล', en: 'Ph.D. Digital Technology Management', prjCount: 6, share: '1.9%', amount: 77087, spent: 47014, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'MST-KMI', name: 'ป.โท หลักสูตรการจัดการความรู้และนวัตกรรม', en: 'M.Sc. Knowledge Management & Innovation', prjCount: 4, share: '2.5%', amount: 104067, spent: 88776, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'MST-SE', name: 'ป.โท หลักสูตรวิศวกรรมซอฟต์แวร์', en: 'M.S. Software Engineering', prjCount: 2, share: '4.5%', amount: 185008, spent: 148756, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'MST-DTM-MIT', name: 'ป.โท DTM : การจัดการสมัยใหม่และเทคโนโลยีสารสนเทศ', en: 'M.Sc. DTM - Modern IT Management', prjCount: 9, share: '2.4%', amount: 96358, spent: 44157, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'MST-DTM-HLT', name: 'ป.โท DTM : ดิจิทัลเทคโนโลยีทางด้านสุขภาพ', en: 'M.Sc. DTM - Digital Health Technology', prjCount: 7, share: '2.5%', amount: 104067, spent: 104067, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'MST-DTM-EDU', name: 'ป.โท DTM : เทคโนโลยีการศึกษา', en: 'M.Sc. DTM - Educational Technology', prjCount: 9, share: '2.3%', amount: 92504, spent: 77744, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'MST-DTM-CBE', name: 'ป.โท DTM : พาณิชย์อิเล็กทรอนิกส์ข้ามพรมแดน', en: 'M.Sc. DTM - Cross-border E-commerce', prjCount: 1, share: '2.3%', amount: 92504, spent: 87050, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'MST-DTM-GAM', name: 'ป.โท DTM : เกมดิจิทัล', en: 'M.Sc. DTM - Digital Games', prjCount: 6, share: '3.3%', amount: 134901, spent: 72140, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'MST-DTM-ANI', name: 'ป.โท DTM : แอนิเมชันและวิชวลเอฟเฟกต์', en: 'M.Sc. DTM - Animation & Visual Effects', prjCount: 4, share: '4.3%', amount: 177299, spent: 173940, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'MST-DTM-TOU', name: 'ป.โท DTM : เทคโนโลยีการท่องเที่ยว', en: 'M.Sc. DTM - Tourism Technology', prjCount: 6, share: '2.2%', amount: 88650, spent: 72609, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'MST-DTM-LAB', name: 'ป.โท DTM : แลปวิจัยนักศึกษา', en: 'M.Sc. DTM - Student Research Lab', prjCount: 7, share: '3.7%', amount: 150319, spent: 66621, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'MST-DTM-CEN', name: 'ป.โท DTM (งบประมาณกลาง)', en: 'M.Sc. DTM - Central Budget', prjCount: 3, share: '2.4%', amount: 96358, spent: 85250, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'BSC-SE', name: 'ป.ตรี หลักสูตรวิศวกรรมซอฟต์แวร์ (นานาชาติ)', en: 'B.Sc. Software Engineering (Intl)', prjCount: 9, share: '2.4%', amount: 100213, spent: 88809, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'BSC-ANI', name: 'ป.ตรี หลักสูตรแอนิเมชันและวิชวลเอฟเฟกต์', en: 'B.Sc. Animation & Visual Effects', prjCount: 7, share: '4.4%', amount: 181153, spent: 114363, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'BSC-MMIT', name: 'ป.ตรี หลักสูตรการจัดการสมัยใหม่ฯ', en: 'B.Sc. Modern Management & IT', prjCount: 4, share: '1.7%', amount: 69378, spent: 49402, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'BSC-DG', name: 'ป.ตรี หลักสูตรดิจิทัลเกม', en: 'B.Sc. Digital Games', prjCount: 2, share: '1.2%', amount: 50106, spent: 48596, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'BSC-DII', name: 'ป.ตรี หลักสูตรบูรณาการอุตสาหกรรมดิจิทัล', en: 'B.Sc. Digital Industry Integration', prjCount: 3, share: '4.7%', amount: 192716, spent: 87830, head: 'ผู้รับผิดชอบ (รอระบุ)' },
  { code: 'BSC-DF', name: 'ป.ตรี หลักสูตรภาพยนตร์ดิจิตอล', en: 'B.Sc. Digital Film', prjCount: 7, share: '4.5%', amount: 185007, spent: 71232, head: 'ผู้รับผิดชอบ (รอระบุ)' },
];

type ProjectQuarter = 'q1' | 'q2' | 'q3' | 'q4';
const quarters: ProjectQuarter[] = ['q3', 'q2', 'q1', 'q4'];
const periodLabels: Record<string, string> = {
  q1: 'ต.ค. - ธ.ค. 2568',
  q2: 'ม.ค. - มี.ค. 2569',
  q3: 'เม.ย. - มิ.ย. 2569',
  q4: 'ก.ค. - ก.ย. 2569',
};

const getProjectCategory = (code: string, projectIndex: number, deptIndex = 0): StrategicCategory['id'] => {
  if (code === 'RES-01' || code === 'MST-DTM-LAB') return 'research';
  if (code === 'RES-02') return (projectIndex + deptIndex) % 2 === 0 ? 'research' : 'academic';
  if (code === 'ADM-03') {
    const c = (projectIndex + deptIndex) % 4;
    if (c === 0) return 'org';
    if (c === 1) return 'academic';
    if (c === 2) return 'student';
    return 'service';
  }
  if (code === 'STR') return (projectIndex + deptIndex) % 2 === 0 ? 'research' : 'academic';
  if (code === 'EDU-03') return (projectIndex + deptIndex) % 2 === 0 ? 'org' : 'student';
  if (code.startsWith('ADM') || code.startsWith('FIN') || code === 'CEN' || code === 'PLN-01') return 'org';
  if (code === 'EDU-02' || code === 'EDU-05') return 'student';
  if (code === 'EDU-04') return 'service';
  if (code === 'DITC') return (projectIndex + deptIndex) % 2 === 0 ? 'service' : 'academic';
  if (code === 'EDU-01' || code === 'ACA') return 'academic';
  if (code.startsWith('PHD')) return (projectIndex + deptIndex) % 3 === 0 ? 'academic' : 'research';
  if (code.startsWith('MST')) {
    const cycle = (projectIndex + deptIndex) % 4;
    if (cycle === 0) return 'research';
    if (cycle === 1) return 'academic';
    if (cycle === 2) return 'student';
    return 'service';
  }
  if (code.startsWith('BSC')) {
    const cycle = (projectIndex + deptIndex) % 4;
    if (cycle === 0) return 'student';
    if (cycle === 1) return 'academic';
    if (cycle === 2) return 'student';
    return 'service';
  }
  return 'academic';
};

const projectThemes: Record<string, string[]> = {
  academic: [
    'โครงการพัฒนาหลักสูตรและการเรียนรู้ดิจิทัล',
    'โครงการอบรมสมรรถนะวิชาชีพและเทคโนโลยีขั้นสูง',
    'โครงการจัดหาและบำรุงรักษาอุปกรณ์แล็บปฏิบัติการ',
    'โครงการส่งเสริมการเรียนรู้เชิงบูรณาการสู่สากล',
  ],
  research: [
    'โครงการขับเคลื่อนงานวิจัยระดับแนวหน้าและตีพิมพ์นานาชาติ',
    'โครงการพัฒนานวัตกรรมต้นแบบเชิงพาณิชย์',
    'โครงการเครือข่ายความร่วมมือวิจัยระดับสากล',
    'โครงการส่งเสริมการนำผลงานวิจัยไปใช้ประโยชน์เชิงพื้นที่',
  ],
  student: [
    'โครงการส่งเสริมกิจกรรมและสุขภาวะนักศึกษา',
    'โครงการพัฒนาทักษะความเป็นผู้นำและผู้ประกอบการรุ่นใหม่',
    'โครงการแนะแนวอาชีพและเตรียมความพร้อมสู่ตลาดแรงงาน',
    'โครงการค่ายบ่มเพาะนวัตกรรมสร้างสรรค์เพื่อสังคม',
  ],
  service: [
    'โครงการบริการวิชาการเพื่อยกระดับชุมชนและสังคม',
    'โครงการถ่ายทอดเทคโนโลยีดิจิทัลสู่ภาคอุตสาหกรรม',
    'โครงการศูนย์เรียนรู้ดิจิทัลเพื่อประชาชน',
    'โครงการจัดอบรมหลักสูตรระยะสั้น Upskill/Reskill',
  ],
  org: [
    'โครงการพัฒนาระบบบริหารจัดการองค์กรอัจฉริยะ',
    'โครงการปรับปรุงประสิทธิภาพงานสารบรรณและการสื่อสาร',
    'โครงการจัดซื้อจัดจ้างและบริหารพัสดุโปร่งใส',
    'โครงการพัฒนาทรัพยากรบุคคลและระบบประเมินผลดิจิทัล',
  ],
};

const flagshipMap: Record<string, Partial<ProjectItem>[]> = {
  'BSC-SE': [
    {
      id: 'prj-1',
      code: 'PRJ-2569-SE01',
      title: 'โครงการปรับปรุงห้องปฏิบัติการ AI & Software Architecture',
      head: 'รศ.ดร. อนันต์ วรคุณากร',
      quarter: 'q3',
      description: 'จัดซื้อเซิร์ฟเวอร์ AI และปรับปรุงระบบเน็ตเวิร์ก 10Gbps ห้อง CAMT 412 สำหรับงานวิจัยและการเรียนการสอนซอฟต์แวร์สถาปัตยกรรมระดับสูง',
    },
  ],
  'BSC-DG': [
    {
      id: 'prj-2569-dg-001',
      code: '2569-DG-P1-001',
      title: 'โครงการศึกษาดูงานนักศึกษาชั้นปีที่ 3 สาขาวิชาดิจิทัลเกม ประจำปีการศึกษา 2568',
      head: 'ผู้ช่วยศาสตราจารย์ ดร.ธีรวัฒน์ กำเนิดศิริ',
      quarter: 'q1',
      description: 'โครงการศึกษาดูงานนักศึกษาชั้นปีที่ 3 สาขาวิชาดิจิทัลเกม ประจำปีการศึกษา 2568 ณ สถานประกอบการธุรกิจจริง',
      fund3D: '0201001',
      act3D: '690101010000022',
      id3D: '69222D532C00120',
    },
  ],
  'RES-01': [
    {
      id: 'prj-6',
      code: 'PRJ-2569-RES01',
      title: 'ศูนย์วิจัยเทคโนโลยีภาษาธรรมชาติและการประมวลผลปัญญาประดิษฐ์ (NLP-Lab)',
      head: 'ศ.ดร. สมชาย มงคลศิลป์',
      quarter: 'q3',
      description: 'พัฒนาโมเดลภาษาไทยเพื่อการแพทย์และเอกสารโบราณล้านนา ทุนสนับสนุนร่วม CMU & Industry',
    },
    {
      id: 'prj-q4-3',
      code: 'PRJ-2569-Q4-03',
      title: 'โครงการทุนวิจัย Seed Fund สำหรับอาจารย์รุ่นใหม่และนักวิจัยหลังปริญญาเอก',
      head: 'ศ.ดร. สมชาย มงคลศิลป์',
      quarter: 'q4',
      description: 'จัดสรรทุนวิจัยนำร่องโครงการต่อยอดเชิงพาณิชย์และตีพิมพ์วารสาร Q1 Top Tier',
    },
  ],
  'EDU-02': [
    {
      id: 'prj-5',
      code: 'PRJ-2569-STU01',
      title: 'กิจกรรมบ่มเพาะนักศึกษาผู้ประกอบการดิจิทัล (CAMT Startup Camp)',
      head: 'ดร. นันทกร พรพิมล',
      quarter: 'q3',
      description: 'การแข่งขัน Hackathon และบ่มเพาะสร้างไอเดียนวัตกรรมเชิงพาณิชย์ร่วมกับศิษย์เก่า',
    },
  ],
  'BSC-DII': [
    {
      id: 'prj-2',
      code: 'PRJ-2569-DII02',
      title: 'อบรมเชิงปฏิบัติการ Smart Robotics Integration & Industrial IoT',
      head: 'อ.ดร. ธีรภัทร์ ภัทรชัย',
      quarter: 'q3',
      description: 'พัฒนาทักษะระบบควบคุมแขนกลอุตสาหกรรมและ PLC Controller สำหรับนักศึกษาชั้นปีที่ 3-4',
    },
  ],
  'BSC-ANI': [
    {
      id: 'prj-3',
      code: 'PRJ-2569-ANI01',
      title: 'พัฒนาสื่อการสอนดิจิทัลและ Virtual Production Studio',
      head: 'ผศ. ศุภลักษณ์ กิจสุวรรณ',
      quarter: 'q3',
      description: 'อัปเกรดสตูดิโอ Motion Capture และระบบ Unreal Engine Virtual Camera',
    },
  ],
  'BSC-MMIT': [
    {
      id: 'prj-4',
      code: 'PRJ-2569-KM03',
      title: 'ระบบคลังความรู้เปิดดิจิทัล (CAMT Open Knowledge Hub)',
      head: 'รศ.ดร. จิรพัฒน์ นิลพันธุ์',
      quarter: 'q3',
      description: 'แพลตฟอร์มเผยแพร่บทความวิชาการ นวัตกรรม และคอร์สอบรมออนไลน์แก่นักศึกษาและประชาชนทั่วไป',
    },
  ],
  'EDU-01': [
    {
      id: 'prj-q4-1',
      code: 'PRJ-2569-Q4-01',
      title: 'โครงการเตรียมความพร้อมหลักสูตรสู่เกณฑ์รับรอง AUN-QA & ABET',
      head: 'ผศ. สุรชัย วัฒนา',
      quarter: 'q3',
      description: 'ตรวจประเมินคุณภาพการศึกษาระดับหลักสูตรและจัดทำเอกสารรับรองมาตรฐานสากล',
    },
  ],
  'ADM-01': [
    {
      id: 'prj-q2-2',
      code: 'PRJ-2569-Q2-02',
      title: 'โครงการยกระดับอาจารย์และบุคลากรสู่มาตรฐานวิชาชีพสากล (UKPSF & AWS Cert)',
      head: 'รศ.ดร. จิรพัฒน์ นิลพันธุ์',
      quarter: 'q2',
      description: 'สนับสนุนค่าสมัครสอบใบรับรองสากล Cloud Architect และอาจารย์มืออาชีพ',
    },
  ],
  'ADM-03': [
    {
      id: 'prj-q1-3',
      code: 'PRJ-2569-Q1-03',
      title: 'ปรับปรุงระบบไฟฟ้าสำรอง UPS อาคารศูนย์ข้อมูล CAMT Data Center',
      head: 'นายธนาธิป เจริญผล',
      quarter: 'q1',
      description: 'เปลี่ยนชุดแบตเตอรี่และระบบตัดไฟฉุกเฉินความจุสูงเพื่อความเสถียรของเซิร์ฟเวอร์คณะ',
    },
  ],
  'ADM-04': [
    {
      id: 'prj-q4-2',
      code: 'PRJ-2569-Q4-02',
      title: 'พัฒนาระบบนิเวศ Digital Green Campus & Smart Energy Monitoring',
      head: 'รศ.ดร. นพดล ผู้บริหาร',
      quarter: 'q3',
      description: 'ติดตั้งระบบ IoT ตรวจวัดพลังงานโซลาร์เซลล์และควบคุมการใช้ไฟฟ้าอัจฉริยะ',
    },
  ],
  'ACA': [
    {
      id: 'prj-q2-3',
      code: 'PRJ-2569-Q2-03',
      title: 'โครงการบริการวิชาการ AI เพื่อพัฒนาผลิตภาพผู้ประกอบการ SMEs ภาคเหนือ',
      head: 'ดร. กอบเกียรติ สิทธิไกรพงษ์',
      quarter: 'q2',
      description: 'อบรมการประยุกต์ใช้ Generative AI สำหรับการตลาดและการจัดการสต๊อกสินค้าชุมชน',
    },
  ],
  'CEN': [
    {
      id: 'prj-q1-2',
      code: 'PRJ-2569-Q1-02',
      title: 'จัดซื้อหนังสือตำราอิเล็กทรอนิกส์และฐานข้อมูลวิชาการ IEEE/ACM',
      head: 'นางสาวจิตราภรณ์ วงศ์ใหญ่',
      quarter: 'q1',
      description: 'ต่ออายุการเข้าถึงฐานข้อมูลงานวิจัยระดับนานาชาติสำหรับอาจารย์และนิสิตปริญญาโท-เอก',
    },
  ],
};

const buildAllSyncedProjects = (): ProjectItem[] => {
  const result: ProjectItem[] = [];

  INITIAL_DEPARTMENTS.forEach((dept, deptIdx) => {
    const n = dept.prjCount;
    const flagships = flagshipMap[dept.code] || [];

    const baseAlloc = Math.floor(dept.amount / n);
    const allocRemainder = dept.amount - baseAlloc * n;

    // Determine quarters first to enforce Timeline Logic: Q4 is in the future -> spent MUST be 0!
    const prjQuarters: ProjectQuarter[] = [];
    for (let i = 0; i < n; i++) {
      const flagship = flagships[i] || null;
      const q: ProjectQuarter = flagship?.quarter || ((n === 1 || i === 0) ? 'q3' : quarters[(deptIdx * 2 + i) % quarters.length]);
      prjQuarters.push(q);
    }

    const nonQ4Count = prjQuarters.filter(q => q !== 'q4').length;
    const baseSpent = nonQ4Count > 0 ? Math.floor(dept.spent / nonQ4Count) : 0;
    const spentRemainder = nonQ4Count > 0 ? dept.spent - baseSpent * nonQ4Count : 0;

    let assignedNonQ4 = 0;
    for (let i = 0; i < n; i++) {
      const q = prjQuarters[i];
      const alloc = i === 0 ? baseAlloc + allocRemainder : baseAlloc;

      // Strict timeline logic: Q4 is in the future -> actual spent MUST be exactly 0!
      let spent = 0;
      if (q !== 'q4') {
        spent = assignedNonQ4 === 0 ? baseSpent + spentRemainder : baseSpent;
        assignedNonQ4++;
      }

      const cat = getProjectCategory(dept.code, i, deptIdx);
      const themes = projectThemes[cat] || projectThemes.academic;
      const theme = themes[i % themes.length];
      const flagship = flagships[i] || null;

      const pct = alloc > 0 ? Math.min(100, Math.round((spent / alloc) * 100)) : 0;
      const status: ProjectItem['status'] =
        q === 'q1' || q === 'q2'
          ? 'approved'
          : q === 'q3'
            ? (pct >= 80 ? 'approved' : 'active')
            : 'pending';

      const completionPct =
        q === 'q1' ? 100 : q === 'q2' ? 92 : q === 'q3' ? pct : 0;

      const project: ProjectItem = {
        id: flagship?.id || `prj-${dept.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i + 1}`,
        code: flagship?.code || `PRJ-2569-${dept.code.replace(/[^A-Za-z0-9]/g, '')}-${String(i + 1).padStart(2, '0')}`,
        title: flagship?.title || `${theme} • ${dept.name}`,
        dept: `${dept.name} (${dept.code})`,
        category: cat,
        allocated: alloc,
        spent: spent,
        head: flagship?.head || (dept.head !== 'ผู้รับผิดชอบ (รอระบุ)' ? dept.head : `ผู้ประสานงาน${dept.name}`),
        status,
        completionPct,
        quarter: q,
        periodLabel: periodLabels[q],
        description: flagship?.description || `โครงการดำเนินงานตามแผนปฏิบัติการประจำปีงบประมาณ 2569 ของ${dept.name} (${dept.code}) สอดคล้องกับยุทธศาสตร์การพัฒนาวิทยาลัย`,
        fund3D: flagship?.fund3D,
        act3D: flagship?.act3D,
        id3D: flagship?.id3D,
      };

      result.push(project);
    }
  });

  return result;
};

export const INITIAL_PROJECTS: ProjectItem[] = buildAllSyncedProjects();
export const ALL_SYNCED_PROJECTS: ProjectItem[] = INITIAL_PROJECTS;

export const OFFICIAL_REPORT_2569_DG_P1_001: OfficialProjectReportData = {
  projectCode: '2569-DG-P1-001',
  fund3D: '0201001',
  act3D: '690101010000022',
  id3D: '69222D532C00120',
  title: 'โครงการศึกษาดูงานนักศึกษาชั้นปีที่ 3 สาขาวิชาดิจิทัลเกม ประจำปีการศึกษา 2568',
  unit: 'หลักสูตรดิจิทัลเกม',
  work: 'งานบริการการศึกษาและพัฒนาคุณภาพนักศึกษา',
  startDate: '2025-10-01',
  endDate: '2025-11-30',
  committee: [
    { name: 'ผู้ช่วยศาสตราจารย์ ดร.สุมาลี สง่าเมือง', role: 'ผู้รับผิดชอบโครงการ' },
    { name: 'ผู้ช่วยศาสตราจารย์ ดร.ธีรวัฒน์ กำเนิดศิริ', role: 'หัวหน้าโครงการ' },
    { name: 'ผู้ช่วยศาสตราจารย์ ดร.รัศมิ์ลภัส สุตีคา', role: 'ผู้เห็นชอบโครงการ' },
    { name: 'ผู้ช่วยศาสตราจารย์ ดร.วรวิชญ์ จันทร์ฉาย', role: 'ผู้อนุมัติโครงการ' },
  ],
  rationale: `เนื่องด้วยหลักสูตรดิจิทัลเกม วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มหาวิทยาลัยเชียงใหม่ ได้มีการจัดการเรียนการสอนในหลักสูตรวิทยาศาสตร บัณฑิตสาขาวิชาดิจิทัลเกม ตั้งแต่ปีการศึกษา 2562 ซึ่งในหลักสูตรฯ เป็นการจัดการเรียนการสอนในภาคทฤษฎีและปฏิบัติเป็นส่วนใหญ่ แต่ในทางปฏิบัติจริง นักศึกษาจำเป็นต้องทราบถึงรูปแบบการทำงานและการบริหารจัดการในการประกอบวิชาชีพจริงด้วย เพื่อให้การเรียนการสอนบรรลุวัตถุประสงค์ตามหลักสูตร จำเป็นต้องมีการศึกษาข้อมูล รูปแบบการจัดการ การบริหารงานในสถานประกอบการทางธุรกิจจริง ทั้งนี้เพื่อจะได้ทราบว่าความรู้ทางทฤษฎีที่ได้ศึกษามานั้น มีการนำมาปรับใช้ให้เหมาะสมกับสภาพแวดล้อมในการปฏิบัติงานจริงได้อย่างไร ในด้านต่างๆ ของกระบวนการ ตัวอย่างเช่น ขั้นตอนเตรียมการผลิต ขั้นตอนการผลิต และขั้นตอนหลังการผลิตงานด้านดิจิทัลเกม ของสถานประกอบการจริงเป็นอย่างไร ดังนั้นเพื่อให้การเรียนการสอนในหลักสูตรดิจิทัลเกม ประสบผลสำเร็จ ทางหลักสูตรฯ จึงได้จัดโครงการศึกษาดูงานของนักศึกษาหลักสูตรดิจิทัลเกม ชั้นปีที่ 3 ขึ้น ทั้งนี้ได้รับการตอบรับจากทางสถานประกอบการธุรกิจ และแหล่งเรียนรู้ที่จะเสริมทักษะการสร้างสรรค์และแรงบันดาลใจของนักศึกษาได้ การศึกษาดูงานในครั้งนี้ นักศึกษาจะได้รับทราบถึงประสบการณ์ในการทำงานจริง และสามารถนำความรู้ที่ได้มาประยุกต์ใช้กับการทำงานในหน้าที่ของตนได้อย่างมีประสิทธิภาพ และมีทัศนะคติที่ดีต่อการทำงาน อีกทั้งได้เป็นการแลกเปลี่ยนความรู้และผลงานกับสถาบันการศึกษาที่มีการเรียนการสอนลักษณะเดียวกันอีกด้วย`,
  objectives: [
    {
      id: 1,
      objective: 'นักศึกษาได้รับทราบถึงประสบการณ์ในการทำงานจริง และมีทัศนะคติที่ดีต่อการปฏิบัติงานจริงของสถานประกอบการแต่ละแห่ง และสามารถนำความรู้ที่ได้มาประยุกต์ใช้กับการทำงานในหน้าที่ของตนได้อย่างมีประสิทธิภาพ',
      kpi: 'นักศึกษาที่เข้าร่วมพึงพอใจจากประโยชน์ที่ได้รับ',
      target: 80,
      unit: 'ร้อยละ',
    },
  ],
  benefits: [
    'นักศึกษาได้รับทราบถึงประสบการณ์ในการทำงานจริง และมีทัศนะคติที่ดีต่อการทำงาน',
    'นักศึกษาได้ข้อมูลของสถานประกอบการแต่ละแห่งเพื่อใช้ในการตัดสินใจเลือกสถานที่ฝึกงาน',
    'ได้ความร่วมมือกับสถานประกอบการที่เกี่ยวข้อง',
  ],
  actionPlan: [
    {
      item: 'ศึกษาดูงานสาขาวิชาดิจิทัลเกม',
      amount: 386000.0,
      fiscalYear: '2569',
      activeMonths: ['ต.ค'],
    },
  ],
  strategies: {
    national: {
      name: 'ยุทธศาสตร์ชาติ ระยะ 20 ปี พ.ศ.2560 - 2579',
      items: [
        'ด้านการสร้างโอกาสและความเสมอภาคทางสังคม',
        '- ความก้าวหน้าของการพัฒนาคน',
      ],
    },
    cmu: {
      name: 'ยุทธศาสตร์มหาวิทยาลัยเชียงใหม่ แผนพัฒนาการศึกษามหาวิทยาลัยเชียงใหม่ ระยะที่ 13 (พ.ศ.2566 - 2570)',
      items: [
        '- SO4 : ส่งเสริมการพัฒนาที่ยั่งยืนด้านการจัดการศึกษาเพื่อรองรับทักษะแห่งอนาคต',
      ],
    },
    camt: {
      name: 'ยุทธศาสตร์วิทยาลัยศิลปะ สื่อ และเทคโนโลยี ปีงบประมาณ 2569',
      items: [
        '- SO1 : สร้างระบบนิเวศที่เป็นเลิศเพื่อการพัฒนากำลังคนด้านดิจิทัลเชิงสร้างสรรค์ (ด้านการเรียนการสอน)',
      ],
    },
  },
  qualityAssurance: {
    criteria: 'เกณฑ์ มช.',
    items: ['- ความพึงพอใจของนักศึกษาต่อสิ่งสนับสนุนการเรียนรู้'],
  },
  participants: [
    { id: 1, group: 'นักศึกษา', count: 66 },
    { id: 2, group: 'อาจารย์ เจ้าหน้าที่', count: 7 },
  ],
  budgetItems: [
    {
      exCode: 'EX046',
      categoryName: 'ค่าใช้สอยอื่นๆ',
      formula: 'จำนวน 1 รายการ X 1,000.00 = 1,000.00',
      description: 'ค่าใช้สอยอื่นๆ',
      amount: 1000.0,
    },
    {
      exCode: 'EX005',
      categoryName: 'ค่าใช้จ่ายอื่นในการเดินทาง',
      formula: 'จำนวน 1 รายการ X 1,000.00 = 1,000.00',
      description: 'ค่าใช้จ่ายอื่น ๆ',
      amount: 1000.0,
    },
    {
      exCode: 'EX020',
      categoryName: 'ค่าลงทะเบียนอบรมสัมมนา',
      formula: 'จำนวน 1 รายการ X 1,000.00 = 1,000.00',
      description: 'ค่าลงทะเบียนอบรมสัมมนา',
      amount: 1000.0,
    },
    {
      exCode: 'EX004',
      categoryName: 'ค่าพาหนะการเดินทางไปราชการ',
      formula: 'จำนวน 1 รายการ X 217,440.00 = 217,440.00',
      description: 'ค่าพาหนะเดินทางสำหรับอาจารย์ เจ้าหน้าที่ และนักศึกษา',
      amount: 217440.0,
    },
    {
      exCode: 'EX018',
      categoryName: 'ค่าจ้างเหมาบริการ',
      formula: 'จำนวน 1 รายการ X 20,000.00 = 20,000.00',
      description: 'ค่าจ้างเหมาบริการ',
      amount: 20000.0,
    },
    {
      exCode: 'EX003',
      categoryName: 'ค่าที่พักเดินทางไปราชการ',
      formula: 'จำนวน 1 รายการ X 93,000.00 = 93,000.00',
      description: 'ค่าที่พักสำหรับอาจารย์ เจ้าหน้าที่ และนักศึกษา',
      amount: 93000.0,
    },
    {
      exCode: 'EX002',
      categoryName: 'ค่าเบี้ยเลี้ยงเดินทางไปราชการ',
      formula: 'จำนวน 1 รายการ X 52,560.00 = 52,560.00',
      description: 'ค่าเบี้ยเลี้ยงของอาจารย์ เจ้าหน้าที่ และนักศึกษา',
      amount: 52560.0,
    },
  ],
  totalBudget: 386000.0,
  totalBudgetText: 'สามแสนแปดหมื่นหกพันบาทถ้วน',
  note: '**ขอถัวเฉลี่ยทุกรายการ**',
  signatures: [
    {
      roleTitle: 'ผู้รับผิดชอบโครงการ',
      name: 'ผู้ช่วยศาสตราจารย์ ดร.สุมาลี สง่าเมือง',
      position: 'ตำแหน่ง ผู้ช่วยศาสตราจารย์',
    },
    {
      roleTitle: 'ผู้เสนอโครงการ/ผู้รับผิดชอบ',
      name: 'ผู้ช่วยศาสตราจารย์ ดร.ธีรวัฒน์ กำเนิดศิริ',
      position: 'ตำแหน่ง ประธานหลักสูตรดิจิทัลเกม',
    },
    {
      roleTitle: 'ผู้เห็นชอบโครงการ',
      name: 'ผู้ช่วยศาสตราจารย์ ดร.รัศมิ์ลภัส สุตีคา',
      position: 'ตำแหน่ง หัวหน้าสำนักวิชาการศิลปะ สื่อ และเทคโนโลยี',
    },
    {
      roleTitle: 'ผู้อนุมัติโครงการ',
      name: 'ผู้ช่วยศาสตราจารย์ ดร.วรวิชญ์ จันทร์ฉาย',
      position: 'ตำแหน่ง คณบดีวิทยาลัยศิลปะ สื่อ และเทคโนโลยี',
    },
  ],
};

export function thaiBahtText(num: number): string {
  if (!num || num === 0) return 'ศูนย์บาทถ้วน';
  const digits = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const positions = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

  const convertGroup = (n: number): string => {
    let s = '';
    const str = Math.floor(n).toString();
    const len = str.length;
    for (let i = 0; i < len; i++) {
      const d = parseInt(str[i], 10);
      const pos = len - i - 1;
      if (d !== 0) {
        if (pos === 1 && d === 1) {
          s += 'สิบ';
        } else if (pos === 1 && d === 2) {
          s += 'ยี่สิบ';
        } else if (pos === 0 && d === 1 && len > 1 && parseInt(str[len - 2], 10) !== 0) {
          s += 'เอ็ด';
        } else {
          s += digits[d] + positions[pos];
        }
      }
    }
    return s;
  };

  const integerPart = Math.floor(num);
  if (integerPart >= 1000000) {
    const millions = Math.floor(integerPart / 1000000);
    const remainder = integerPart % 1000000;
    return convertGroup(millions) + 'ล้าน' + (remainder > 0 ? convertGroup(remainder) : '') + 'บาทถ้วน';
  }

  return convertGroup(integerPart) + 'บาทถ้วน';
}

export const getOfficialReportForProject = (project?: ProjectItem | null): OfficialProjectReportData => {
  if (!project || project.code === '2569-DG-P1-001' || project.id === 'prj-2569-dg-001') {
    return OFFICIAL_REPORT_2569_DG_P1_001;
  }

  const budget = project.allocated || 500000;
  const deptCode = project.dept.match(/\(([^)]+)\)/)?.[1] || 'CAMT';
  const cleanDeptName = project.dept.replace(/\s*\([^)]*\)/, '');

  // Category specific budget items with authentic government EX expense codes
  let budgetItems: ProjectBudgetItem[] = [];
  if (project.category === 'academic') {
    const hwAmount = Math.round(budget * 0.45);
    const serviceAmount = Math.round(budget * 0.25);
    const licenseAmount = Math.round(budget * 0.15);
    const travelAmount = Math.round(budget * 0.10);
    const otherAmount = Math.max(0, budget - (hwAmount + serviceAmount + licenseAmount + travelAmount));

    budgetItems = [
      { exCode: 'EX014', categoryName: 'ค่าวัสดุและอุปกรณ์คอมพิวเตอร์', formula: `1 รายการ = ${hwAmount.toLocaleString()}.00`, description: `จัดซื้ออุปกรณ์ฮาร์ดแวร์และเทคโนโลยีเพื่อการศึกษา ${cleanDeptName}`, amount: hwAmount },
      { exCode: 'EX018', categoryName: 'ค่าจ้างเหมาบริการ', formula: `1 รายการ = ${serviceAmount.toLocaleString()}.00`, description: 'ค่าจ้างเหมาพัฒนา ปรับปรุง และติดตั้งระบบห้องปฏิบัติการ', amount: serviceAmount },
      { exCode: 'EX020', categoryName: 'ค่าลงทะเบียนและสิทธิ์การใช้งานซอฟต์แวร์', formula: `1 รายการ = ${licenseAmount.toLocaleString()}.00`, description: 'ลิขสิทธิ์ซอฟต์แวร์เฉพาะทางและการสอบมาตรฐานวิชาชีพสากล', amount: licenseAmount },
      { exCode: 'EX004', categoryName: 'ค่าพาหนะการเดินทางไปราชการ', formula: `1 รายการ = ${travelAmount.toLocaleString()}.00`, description: 'ค่าพาหนะเดินทางประสานงานความร่วมมือทางวิชาการ', amount: travelAmount },
      { exCode: 'EX046', categoryName: 'ค่าใช้สอยอื่นๆ', formula: `1 รายการ = ${otherAmount.toLocaleString()}.00`, description: 'ค่าใช้สอยเบ็ดเตล็ดและเอกสารประกอบการดำเนินงาน', amount: otherAmount },
    ];
  } else if (project.category === 'research') {
    const resAmount = Math.round(budget * 0.50);
    const pubAmount = Math.round(budget * 0.20);
    const travelAmount = Math.round(budget * 0.15);
    const stayAmount = Math.round(budget * 0.10);
    const otherAmount = Math.max(0, budget - (resAmount + pubAmount + travelAmount + stayAmount));

    budgetItems = [
      { exCode: 'EX018', categoryName: 'ค่าจ้างเหมาบริการวิจัย', formula: `1 รายการ = ${resAmount.toLocaleString()}.00`, description: 'ค่าจ้างเหมาผู้ช่วยวิจัย เก็บข้อมูล และประมวลผลโมเดล', amount: resAmount },
      { exCode: 'EX020', categoryName: 'ค่าลงทะเบียนเผยแพร่ผลงานวิชาการ', formula: `1 รายการ = ${pubAmount.toLocaleString()}.00`, description: 'ค่าธรรมเนียมตีพิมพ์วารสารวิชาการนานาชาติ (Scopus/IEEE)', amount: pubAmount },
      { exCode: 'EX004', categoryName: 'ค่าพาหนะการเดินทาง', formula: `1 รายการ = ${travelAmount.toLocaleString()}.00`, description: 'ค่าพาหนะเดินทางนำเสนอผลงานวิจัยและการประชุมวิชาการ', amount: travelAmount },
      { exCode: 'EX003', categoryName: 'ค่าที่พักเดินทางไปราชการ', formula: `1 รายการ = ${stayAmount.toLocaleString()}.00`, description: 'ค่าที่พักสำหรับอาจารย์และนักวิจัย', amount: stayAmount },
      { exCode: 'EX046', categoryName: 'ค่าใช้สอยอื่นๆ', formula: `1 รายการ = ${otherAmount.toLocaleString()}.00`, description: 'ค่าใช้สอยอื่นๆ และวัสดุวิทยาการวิจัย', amount: otherAmount },
    ];
  } else if (project.category === 'student') {
    const travelAmount = Math.round(budget * 0.40);
    const stayAmount = Math.round(budget * 0.25);
    const allowAmount = Math.round(budget * 0.15);
    const serviceAmount = Math.round(budget * 0.12);
    const otherAmount = Math.max(0, budget - (travelAmount + stayAmount + allowAmount + serviceAmount));

    budgetItems = [
      { exCode: 'EX004', categoryName: 'ค่าพาหนะการเดินทางไปราชการ', formula: `1 รายการ = ${travelAmount.toLocaleString()}.00`, description: 'ค่าพาหนะเดินทางสำหรับอาจารย์ เจ้าหน้าที่ และนักศึกษา', amount: travelAmount },
      { exCode: 'EX003', categoryName: 'ค่าที่พักเดินทางไปราชการ', formula: `1 รายการ = ${stayAmount.toLocaleString()}.00`, description: 'ค่าที่พักสำหรับผู้เข้าร่วมโครงการ', amount: stayAmount },
      { exCode: 'EX002', categoryName: 'ค่าเบี้ยเลี้ยงเดินทางไปราชการ', formula: `1 รายการ = ${allowAmount.toLocaleString()}.00`, description: 'ค่าเบี้ยเลี้ยงของผู้ร่วมเดินทาง', amount: allowAmount },
      { exCode: 'EX018', categoryName: 'ค่าจ้างเหมาบริการ', formula: `1 รายการ = ${serviceAmount.toLocaleString()}.00`, description: 'ค่าจ้างเหมาบริการจัดเตรียมสถานที่และวิทยากร', amount: serviceAmount },
      { exCode: 'EX046', categoryName: 'ค่าใช้สอยอื่นๆ', formula: `1 รายการ = ${otherAmount.toLocaleString()}.00`, description: 'ค่าใช้สอยอื่นๆ และวัสดุกิจกรรม', amount: otherAmount },
    ];
  } else {
    const serviceAmount = Math.round(budget * 0.45);
    const equipAmount = Math.round(budget * 0.30);
    const travelAmount = Math.round(budget * 0.15);
    const otherAmount = Math.max(0, budget - (serviceAmount + equipAmount + travelAmount));

    budgetItems = [
      { exCode: 'EX018', categoryName: 'ค่าจ้างเหมาบริการ', formula: `1 รายการ = ${serviceAmount.toLocaleString()}.00`, description: `ค่าจ้างเหมาบริการดำเนินงาน ${cleanDeptName}`, amount: serviceAmount },
      { exCode: 'EX014', categoryName: 'ค่าวัสดุและอุปกรณ์สำนักงาน', formula: `1 รายการ = ${equipAmount.toLocaleString()}.00`, description: 'ค่าวัสดุอุปกรณ์สำหรับการบริหารจัดการ', amount: equipAmount },
      { exCode: 'EX004', categoryName: 'ค่าพาหนะการเดินทาง', formula: `1 รายการ = ${travelAmount.toLocaleString()}.00`, description: 'ค่าพาหนะการเดินทางประสานงานหน่วยงาน', amount: travelAmount },
      { exCode: 'EX046', categoryName: 'ค่าใช้สอยอื่นๆ', formula: `1 รายการ = ${otherAmount.toLocaleString()}.00`, description: 'ค่าใช้สอยอื่นๆ และค่าสาธารณูปโภคที่เกี่ยวข้อง', amount: otherAmount },
    ];
  }

  // Derive active month from quarter
  const quarterMonthMap: Record<string, string[]> = {
    q1: ['ต.ค', 'พ.ย'],
    q2: ['ม.ค', 'ก.พ'],
    q3: ['เม.ย', 'พ.ค'],
    q4: ['ก.ค', 'ส.ค'],
  };
  const activeMonths = quarterMonthMap[project.quarter] || ['ต.ค'];

  // Head title based on department
  const headRoleTitle = deptCode.startsWith('BSC-') || deptCode.startsWith('MST-') || deptCode.startsWith('PHD-')
    ? `ประธานหลักสูตร${cleanDeptName}`
    : `หัวหน้า${cleanDeptName}`;

  return {
    projectCode: project.code,
    fund3D: project.fund3D || '0201001',
    act3D: project.act3D || `6901010100000${(project.code.charCodeAt(project.code.length - 1) % 9) + 1}2`,
    id3D: project.id3D || `69222D532C${(project.code.slice(-3).replace(/\D/g, '') || '100').padStart(5, '0')}`,
    title: project.title,
    unit: cleanDeptName,
    work: 'งานยุทธศาสตร์และพัฒนาคุณภาพการศึกษา',
    startDate: project.quarter === 'q1' ? '2025-10-01' : project.quarter === 'q2' ? '2026-01-01' : project.quarter === 'q3' ? '2026-04-01' : '2026-07-01',
    endDate: project.quarter === 'q1' ? '2025-12-31' : project.quarter === 'q2' ? '2026-03-31' : project.quarter === 'q3' ? '2026-06-30' : '2026-09-30',
    committee: [
      { name: project.head, role: 'ผู้รับผิดชอบโครงการ' },
      { name: project.head, role: 'หัวหน้าโครงการ' },
      { name: 'ผู้ช่วยศาสตราจารย์ ดร.รัศมิ์ลภัส สุตีคา', role: 'ผู้เห็นชอบโครงการ' },
      { name: 'ผู้ช่วยศาสตราจารย์ ดร.วรวิชญ์ จันทร์ฉาย', role: 'ผู้อนุมัติโครงการ' },
    ],
    rationale: project.description
      ? `${project.description} เพื่อสนับสนุนการจัดการศึกษาและการบริหารงานของ ${cleanDeptName} วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มหาวิทยาลัยเชียงใหม่ ให้บรรลุวัตถุประสงค์ตามมาตรฐานวิชาการสากล เสริมสร้างสมรรถนะผู้เรียนและคณาจารย์อย่างต่อเนื่อง`
      : `เนื่องด้วย ${cleanDeptName} วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มหาวิทยาลัยเชียงใหม่ ได้มุ่งเน้นการจัดการเรียนการสอนและการบริหารจัดการที่มีคุณภาพ เพื่อให้การดำเนินงานบรรลุวัตถุประสงค์ตามพันธกิจของวิทยาลัย จึงได้จัดทำโครงการ ${project.title} ขึ้น เพื่อเสริมสร้างศักยภาพและมาตรฐานในการดำเนินงานอย่างยั่งยืน`,
    objectives: [
      {
        id: 1,
        objective: `เพื่อพัฒนาและส่งเสริมการดำเนินงานตามเป้าหมายของ ${project.title} ให้บรรลุผลสำเร็จอย่างมีประสิทธิภาพสูงสุด`,
        kpi: 'ระดับความพึงพอใจและความสำเร็จของตัวชี้วัดโครงการ',
        target: 85,
        unit: 'ร้อยละ',
      },
    ],
    benefits: [
      `1. พัฒนาศักยภาพและทักษะของบุคลากรและนักศึกษา ${cleanDeptName} ให้สอดคล้องกับมาตรฐานสากล`,
      `2. ยกระดับผลสัมฤทธิ์ทางการศึกษาและการดำเนินงานตามเกณฑ์คุณภาพการศึกษาเพื่อการดำเนินการที่เป็นเลิศ (EdPEx)`,
      `3. เสริมสร้างความร่วมมือทางวิชาการและภาคอุตสาหกรรมดิจิทัลเพื่อประโยชน์สูงสุดแก่องค์กร`,
    ],
    actionPlan: [
      {
        item: project.title,
        amount: budget,
        fiscalYear: '2569',
        activeMonths,
      },
    ],
    strategies: {
      national: {
        name: 'ยุทธศาสตร์ชาติ ระยะ 20 ปี พ.ศ.2560 - 2579',
        items: ['ด้านการสร้างโอกาสและความเสมอภาคทางสังคม', '- การพัฒนาและเสริมสร้างศักยภาพทรัพยากรมนุษย์'],
      },
      cmu: {
        name: 'ยุทธศาสตร์มหาวิทยาลัยเชียงใหม่ แผนพัฒนาการศึกษา ระยะที่ 13 (พ.ศ.2566 - 2570)',
        items: ['- SO4 : ส่งเสริมการพัฒนาที่ยั่งยืนด้านการจัดการศึกษาเพื่อรองรับทักษะแห่งอนาคต'],
      },
      camt: {
        name: 'ยุทธศาสตร์วิทยาลัยศิลปะ สื่อ และเทคโนโลยี ปีงบประมาณ 2569',
        items: [
          project.category === 'student'
            ? '- SO1 : สร้างระบบนิเวศที่เป็นเลิศเพื่อการพัฒนากำลังคนด้านดิจิทัลเชิงสร้างสรรค์ (ด้านการเรียนการสอน)'
            : project.category === 'research'
              ? '- SO3 : ผลิตผลงานวิจัย นวัตกรรม และทรัพย์สินทางปัญญาสู่การใช้ประโยชน์เชิงพาณิชย์และสังคม'
              : '- SO2 : ยกระดับหลักสูตรและมาตรฐานวิชาการสู่ความเป็นเลิศระดับสากล',
        ],
      },
    },
    qualityAssurance: {
      criteria: 'เกณฑ์ มช. & EdPEx',
      items: ['- ความพึงพอใจของผู้รับบริการและผู้มีส่วนได้ส่วนเสียต่อผลการดำเนินงาน'],
    },
    participants: [
      { id: 1, group: 'นักศึกษา / ผู้เข้าร่วมโครงการ', count: Math.max(30, Math.round(budget / 10000)) },
      { id: 2, group: 'อาจารย์และบุคลากรผู้รับผิดชอบ', count: 6 },
    ],
    budgetItems,
    totalBudget: budget,
    totalBudgetText: thaiBahtText(budget),
    note: '**ขอถัวเฉลี่ยทุกรายการ**',
    signatures: [
      { roleTitle: 'ผู้รับผิดชอบโครงการ', name: project.head, position: 'ตำแหน่ง ผู้รับผิดชอบโครงการ' },
      { roleTitle: 'ผู้เสนอโครงการ/ผู้รับผิดชอบ', name: project.head, position: `ตำแหน่ง ${headRoleTitle}` },
      { roleTitle: 'ผู้เห็นชอบโครงการ', name: 'ผู้ช่วยศาสตราจารย์ ดร.รัศมิ์ลภัส สุตีคา', position: 'ตำแหน่ง หัวหน้าสำนักวิชาการศิลปะ สื่อ และเทคโนโลยี' },
      { roleTitle: 'ผู้อนุมัติโครงการ', name: 'ผู้ช่วยศาสตราจารย์ ดร.วรวิชญ์ จันทร์ฉาย', position: 'ตำแหน่ง คณบดีวิทยาลัยศิลปะ สื่อ และเทคโนโลยี' },
    ],
  };
};


