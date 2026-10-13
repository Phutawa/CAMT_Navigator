import { useState, useEffect, useMemo } from 'react';
import { CommitmentItem, INITIAL_COMMITMENTS, ALL_SYNCED_PROJECTS } from '../data/mockData';

interface DisbursementScreenProps {
  searchQuery?: string;
  commitments?: CommitmentItem[];
  pendingApproved?: boolean;
  onNotifyAlert: () => void;
  onApprovePO: (poNo: string) => void;
  onBulkApprovePO?: () => void;
  onExportReport?: () => void;
  onOpenProjectModal?: (project: any) => void;
}

const CATEGORY_TO_DEPT_CODE: Record<string, 'SQE' | 'ACI' | 'RGI' | 'ASC' | 'AGO'> = {
  student: 'SQE',
  academic: 'ACI',
  research: 'RGI',
  service: 'ASC',
  org: 'AGO',
};

const getVisiblePages = (current: number, total: number): (number | string)[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
};

export const DisbursementScreen = ({
  searchQuery = '',
  commitments: propCommitments,
  pendingApproved = false,
  onNotifyAlert,
  onApprovePO,
  onBulkApprovePO,
  onExportReport,
  onOpenProjectModal,
}: DisbursementScreenProps) => {
  const [activeTab, setActiveTab] = useState<'tab-overview' | 'tab-departments' | 'tab-commitments'>('tab-overview');
  const [signed, setSigned] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const [localCommitments, setLocalCommitments] = useState<CommitmentItem[]>(INITIAL_COMMITMENTS);
  const commitments = propCommitments ?? localCommitments;

  useEffect(() => {
    if (pendingApproved && !propCommitments) {
      setLocalCommitments((prev) =>
        prev.map((item) => ({ ...item, status: 'อนุมัติเบิกจ่ายเรียบร้อย (ERP Cleared)' }))
      );
    }
  }, [pendingApproved, propCommitments]);

  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [amountFilter, setAmountFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [departmentFilter, statusFilter, amountFilter]);

  // Derive all 186 projects from the master Single Source of Truth
  const projects = useMemo(() => {
    return ALL_SYNCED_PROJECTS.map((p, idx) => {
      const deptCode = CATEGORY_TO_DEPT_CODE[p.category] || 'ACI';
      const remaining = p.allocated - p.spent;

      let status: 'due' | 'overdue' | 'upcoming' = 'due';
      let statusText = 'เบิกจ่ายครบตามแผน 100%';
      let po = 0;
      let deadline: string | undefined;
      let issue: string | undefined;

      if (p.quarter === 'q4') {
        status = 'upcoming';
        statusText = 'ยังไม่ถึงกำหนด (รอเปิดรอบ Q4)';
        po = 0;
      } else if (p.quarter === 'q1') {
        status = 'due';
        statusText = 'เบิกจ่ายครบตามแผน 100%';
        po = 0;
      } else {
        // Q2 and Q3 projects: Flag 7 projects as overdue with specific deadlines for governance tracking
        if (idx === 1 || idx === 5 || idx === 11 || idx === 17 || idx === 23 || idx === 31 || idx === 45) {
          status = 'overdue';
          statusText = `เลยกำหนด (${(idx % 15) + 5} วัน)`;
          deadline = `${(idx % 20) + 1} มิ.ย. 2569`;
          issue = idx % 2 === 0 ? 'รอตรวจรับงวดงาน' : 'ขาดเอกสารรายงานเบิกจ่าย';
          po = Math.round(remaining * 0.45);
        } else if (p.spent >= p.allocated) {
          status = 'due';
          statusText = 'เบิกจ่ายครบตามแผน 100%';
          po = 0;
        } else {
          status = idx % 2 === 0 ? 'due' : 'upcoming';
          statusText = status === 'upcoming' ? 'ยังไม่ถึงกำหนด' : 'ครบกำหนดสัปดาห์นี้';
          po = Math.round(remaining * 0.35);
        }
      }

      return {
        code: p.code,
        name: p.title,
        dept: deptCode,
        bud: p.allocated,
        act: p.spent,
        po,
        status,
        statusText,
        deadline,
        issue,
      };
    });
  }, []);

  const filteredProjects = projects.filter(p => {
    let match = true;
    if (departmentFilter !== 'All' && p.dept !== departmentFilter) match = false;
    if (statusFilter !== 'All' && p.status !== statusFilter) match = false;
    if (amountFilter !== 'All') {
      if (amountFilter === 'low' && p.bud >= 100000) match = false;
      if (amountFilter === 'mid' && (p.bud < 100000 || p.bud > 300000)) match = false;
      if (amountFilter === 'high' && p.bud <= 300000) match = false;
    }
    return match;
  });

  const overdueProjects = projects.filter(p => p.status === 'overdue');

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const filteredCommitments = commitments.filter((c) =>
    !searchQuery ||
    c.no.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = commitments.filter(c => !c.status.includes('อนุมัติ')).length;

  const handleSendAlertClick = () => {
    setIsAlertModalOpen(true);
  };

  const handleConfirmSendAlert = () => {
    setAlertSent(true);
    setIsAlertModalOpen(false);
    onNotifyAlert();
  };

  const handleProcessPO = (poNo: string) => {
    setLocalCommitments((prev) =>
      prev.map((item) =>
        item.no === poNo
          ? { ...item, status: 'อนุมัติเบิกจ่ายเรียบร้อย (ERP Cleared)' }
          : item
      )
    );
    onApprovePO(poNo);
  };

  const handleBulkApprove = () => {
    setLocalCommitments((prev) =>
      prev.map((item) => ({ ...item, status: 'อนุมัติเบิกจ่ายเรียบร้อย (ERP Cleared)' }))
    );
    if (onBulkApprovePO) {
      onBulkApprovePO();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl border border-[#ddc1b2]/40 flex flex-col relative">
        {/* Card Header Section - Sticky Locked */}
        <div className="sticky top-20 z-30 bg-white rounded-t-2xl shadow-sm border-b border-[#e5e8ee]">
          {/* Ribbon */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#e87722] via-[#994700] to-[#366847] rounded-t-2xl"></div>

          {/* Header */}
          <div className="px-6 py-4 sm:py-5 border-b border-[#e5e8ee] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-[#ffdbc8] text-[#743400] text-[11px] font-bold tracking-wider">
                  #DISB-2569-TRACK
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#b8f0c5] text-[#1d5031] text-[11px] font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#366847] animate-pulse"></span>
                  Q3 On Track
                </span>
                <span className="text-[11px] text-[#79564b]">รอบตรวจสอบประจำไตรมาส 3</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-[#181c20] tracking-tight">
                ติดตามการเบิกจ่ายงบประมาณ ประจำปีงบประมาณ 2569
              </h1>
              <p className="text-sm text-[#564337] mt-1">
                วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มหาวิทยาลัยเชียงใหม่ • Fiscal Burn-Rate &amp; Risk Monitor
              </p>
            </div>
            <div className="flex items-center gap-2">
              {activeTab === 'tab-departments' && (
                <button
                  onClick={handleSendAlertClick}
                  disabled={alertSent}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm ${alertSent
                    ? 'bg-[#ebeef3] text-[#79564b] cursor-not-allowed'
                    : 'bg-[#ba1a1a] text-white hover:bg-[#93000a] cursor-pointer'
                    }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {alertSent ? 'notifications_paused' : 'notifications_active'}
                  </span>
                  <span className="hidden sm:inline">
                    {alertSent ? 'ส่งแจ้งเตือนแล้ว' : `เร่งรัดการเบิกจ่าย (${overdueProjects.length} โครงการ)`}
                  </span>
                </button>
              )}

              {activeTab === 'tab-commitments' && (
                <button
                  onClick={handleBulkApprove}
                  disabled={pendingCount === 0}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm ${pendingCount === 0
                    ? 'bg-[#ebeef3] text-[#79564b] cursor-not-allowed'
                    : 'bg-[#366847] text-white hover:bg-[#2b5338] cursor-pointer'
                    }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {pendingCount === 0 ? 'verified' : 'fact_check'}
                  </span>
                  <span className="hidden sm:inline">
                    {pendingCount === 0 ? 'ไม่มีรายการค้าง' : `อนุมัติเบิกจ่ายทั้งหมด (${pendingCount})`}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-4 sm:px-6 bg-[#f1f4f9] border-b border-[#e5e8ee] flex flex-wrap items-center gap-1.5 sm:gap-2 py-2">
            {[
              { id: 'tab-overview', label: 'ติดตามเบิกจ่าย 186 โครงการ (37 ส่วนงาน)', icon: 'query_stats' },
              { id: 'tab-departments', label: 'รายการโครงการรอติดตามเบิกจ่าย', icon: 'account_tree' },
              { id: 'tab-commitments', label: 'รายการ PO และใบสำคัญผูกพันงบ', icon: 'receipt_long', badge: pendingCount > 0 ? pendingCount.toString() : undefined },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === t.id
                  ? 'bg-[#e87722] text-white shadow-xs'
                  : 'text-[#564337] hover:bg-[#ebeef3]'
                  }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {t.icon}
                </span>
                <span>{t.label}</span>
                {t.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === t.id
                      ? 'bg-white text-[#994700]'
                      : 'bg-[#e0e3e8] text-[#181c20]'
                      }`}
                  >
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 bg-[#f7f9ff] space-y-6 rounded-b-2xl">
          {activeTab === 'tab-overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#ddc1b2]/30 shadow-xs">
                  <span className="text-xs text-[#79564b] font-bold">งบจัดสรรรวม</span>
                  <div className="text-2xl font-black text-[#181c20] mt-2 tabular-nums">
                    ฿12,000,000
                  </div>
                  <div className="text-xs text-[#564337] mt-1">100% กรอบงบประจำปี</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#366847]/40 shadow-xs">
                  <span className="text-xs text-[#366847] font-bold">ยอดเบิกจ่ายจริงสะสม</span>
                  <div className="text-2xl font-black text-[#366847] mt-2 tabular-nums">
                    ฿5,820,000
                  </div>
                  <div className="text-xs text-[#366847] font-semibold mt-1">
                    68.1% ของงบจัดสรร (บรรลุเป้าหมายตามแผนงาน)
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border-2 border-[#e87722] shadow-xs">
                  <span className="text-xs text-[#e87722] font-bold">รอเบิกจ่ายผูกพัน (PO)</span>
                  <div className="text-2xl font-black text-[#994700] mt-2 tabular-nums">
                    ฿2,730,000
                  </div>
                  <div className="text-xs text-[#564337] mt-1">22.75% อยู่ระหว่างส่งมอบ/ตรวจรับ</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#ddc1b2]/30 shadow-xs">
                  <span className="text-xs text-[#79564b] font-bold">คงเหลือวางแผนเบิกจ่าย</span>
                  <div className="text-2xl font-black text-[#181c20] mt-2 tabular-nums">
                    ฿3,450,000
                  </div>
                  <div className="text-xs text-[#79564b] mt-1">28.75% สำรองใน Q4</div>
                </div>
              </div>

              {/* Multi-stage Progress Breakdown (Capsule Style with Gradients) */}
              <div className="bg-white p-5 rounded-2xl border border-[#ddc1b2]/30 space-y-3.5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#e87722]">speed</span>
                    <span className="text-[#181c20]">ความคืบหน้าเทียบเป้าหมาย Q3 (Fiscal Run-Rate)</span>
                  </div>
                  <span className="text-[#1d5031] bg-[#b8f0c5]/60 px-2.5 py-0.5 rounded-full border border-[#366847]/20 w-fit text-[11px] font-bold">
                    ทำได้ 48.5% (เป้าหมาย 45%)
                  </span>
                </div>

                {/* Capsule Bar with Layered Overlapping Pills & Gradients */}
                <div className="relative w-full h-6 sm:h-7 rounded-full bg-[#ebeef3] border border-[#ddc1b2]/30 shadow-inner flex items-center overflow-hidden">
                  {/* Layer 1: Orange Bar (ผูกพัน PO + เบิกจ่ายจริง = 71.25%) ทรงแคปซูลมนๆ ไล่สีส้ม */}
                  <div
                    className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-500 shadow-2xs"
                    style={{
                      width: '71.25%',
                      background: 'linear-gradient(90deg, #9a4306 0%, #c25e10 35%, #e87722 75%, #f9852c 100%)',
                    }}
                    title="เบิกจ่ายจริง + ผูกพัน PO: 71.25% (฿8,550,000)"
                  />

                  {/* Layer 2: Green Bar (เบิกจ่ายจริง = 48.5%) ซ้อนทับด้านหน้า ทรงแคปซูลมนๆ ไล่สีเขียว */}
                  <div
                    className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-500 z-10 shadow-xs"
                    style={{
                      width: '48.5%',
                      background: 'linear-gradient(90deg, #164e22 0%, #246d33 35%, #2e7d32 75%, #3fa64d 100%)',
                    }}
                    title="เบิกจ่ายจริง: 48.5% (฿5,820,000)"
                  />

                  {/* Text Label 1: เบิกจ่ายจริง (ในแถบเขียว) */}
                  <div
                    className="absolute left-0 top-0 bottom-0 z-20 flex items-center justify-center text-[10px] sm:text-[11px] text-white font-bold tracking-wide drop-shadow-xs px-2 truncate pointer-events-none"
                    style={{ width: '48.5%' }}
                  >
                    เบิกจ่ายจริง 48.5%
                  </div>

                  {/* Text Label 2: ผูกพัน PO (ในแถบส้ม) */}
                  <div
                    className="absolute top-0 bottom-0 z-10 flex items-center justify-center text-[10px] sm:text-[11px] text-white font-bold tracking-wide drop-shadow-xs px-1 truncate pointer-events-none"
                    style={{ left: '48.5%', width: '22.75%' }}
                  >
                    ผูกพัน PO 22.75%
                  </div>

                  {/* Text Label 3: คงเหลือ (ในแถบพื้นหลังสีเทาอ่อน) */}
                  <div
                    className="absolute top-0 bottom-0 z-10 flex items-center justify-center text-[10px] sm:text-[11px] text-[#564337] font-bold tracking-wide px-1 truncate pointer-events-none"
                    style={{ left: '71.25%', width: '28.75%' }}
                  >
                    คงเหลือ 28.75%
                  </div>
                </div>

                {/* Legend Details Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-xs text-[#564337]">
                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-2 rounded-full inline-block shadow-2xs"
                        style={{ background: 'linear-gradient(90deg, #164e22 0%, #3fa64d 100%)' }}
                      />
                      <span className="text-[11px] font-semibold">เบิกจ่ายจริง: ฿5,820,000 (48.5%)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-2 rounded-full inline-block shadow-2xs"
                        style={{ background: 'linear-gradient(90deg, #9a4306 0%, #f9852c 100%)' }}
                      />
                      <span className="text-[11px] font-semibold">ผูกพัน PO: ฿2,730,000 (22.75%)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-2 rounded-full inline-block bg-[#d7dadf]" />
                      <span className="text-[11px] font-semibold">คงเหลือสำรอง: ฿3,450,000 (28.75%)</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#ddc1b2]/30 shadow-xs overflow-hidden">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 p-4 border-b border-[#e5e8ee] bg-[#f1f4f9]/40">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#79564b]">filter_list</span>
                    <span className="text-xs font-bold text-[#564337]">กรองข้อมูล:</span>
                  </div>

                  <div className="relative">
                    <select
                      className="appearance-none bg-white border border-[#e5e8ee] text-[#181c20] text-xs rounded-xl pl-3 pr-8 py-2 outline-none focus:ring-2 focus:ring-[#e87722]/50 shadow-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">ทุกสถานะเบิกจ่าย</option>
                      <option value="overdue">เลยกำหนด</option>
                      <option value="due">ครบกำหนด</option>
                      <option value="upcoming">ยังไม่ถึงกำหนด</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-[#79564b] pointer-events-none">expand_more</span>
                  </div>

                  <div className="relative">
                    <select
                      className="appearance-none bg-white border border-[#e5e8ee] text-[#181c20] text-xs rounded-xl pl-3 pr-8 py-2 outline-none focus:ring-2 focus:ring-[#e87722]/50 shadow-sm"
                      value={amountFilter}
                      onChange={(e) => setAmountFilter(e.target.value)}
                    >
                      <option value="All">ทุกระดับวงเงิน</option>
                      <option value="low">ต่ำกว่า ฿100,000</option>
                      <option value="mid">฿100,000 - ฿300,000</option>
                      <option value="high">มากกว่า ฿300,000</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-[#79564b] pointer-events-none">expand_more</span>
                  </div>

                  <div className="relative">
                    <select
                      className="appearance-none bg-white border border-[#e5e8ee] text-[#181c20] text-xs rounded-xl pl-3 pr-8 py-2 outline-none focus:ring-2 focus:ring-[#e87722]/50 shadow-sm"
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                    >
                      <option value="All">ทุกกลุ่มงบประมาณ</option>
                      <option value="SQE">พัฒนาคุณภาพนักศึกษา</option>
                      <option value="ACI">พัฒนาวิชาการและหลักสูตร</option>
                      <option value="RGI">ส่งเสริมการวิจัยและนวัตกรรม</option>
                      <option value="ASC">บริการวิชาการแก่สังคม</option>
                      <option value="AGO">บริหารจัดการและพัฒนาองค์กร</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-[#79564b] pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-white uppercase text-[#79564b] font-bold border-b border-[#e5e8ee]">
                        <th className="py-3 px-4">รหัส / ชื่อโครงการ</th>
                        <th className="py-3 px-4">กลุ่มงบประมาณ</th>
                        <th className="py-3 px-3 text-right">วงเงินจัดสรร</th>
                        <th className="py-3 px-3 text-right">เบิกจ่ายจริง</th>
                        <th className="py-3 px-3 text-right">ภาระผูกพัน PO</th>
                        <th className="py-3 px-3 text-center whitespace-nowrap min-w-[140px]">สถานะเบิกจ่าย</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ebeef3]">
                      {filteredProjects.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-[#79564b]">
                            ไม่พบโครงการที่ตรงกับเงื่อนไข
                          </td>
                        </tr>
                      ) : (
                        <>
                          {paginatedProjects.map((d) => (
                            <tr key={d.code} className="hover:bg-[#FFF7F0]/30 transition-colors">
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-[#181c20]">{d.name}</div>
                                <div className="text-[10px] text-[#79564b]">{d.code}</div>
                              </td>
                              <td className="py-3.5 px-4 text-[#564337] font-semibold whitespace-nowrap">
                                {d.dept === 'SQE' ? 'พัฒนาคุณภาพนักศึกษา' :
                                  d.dept === 'ACI' ? 'พัฒนาวิชาการและหลักสูตร' :
                                    d.dept === 'RGI' ? 'ส่งเสริมการวิจัยและนวัตกรรม' :
                                      d.dept === 'ASC' ? 'บริการวิชาการแก่สังคม' : 'บริหารจัดการและพัฒนาองค์กร'}
                              </td>
                              <td className="py-3.5 px-3 text-right tabular-nums text-[#564337] whitespace-nowrap">฿{d.bud.toLocaleString()}</td>
                              <td className="py-3.5 px-3 text-right text-[#366847] font-bold tabular-nums whitespace-nowrap">
                                ฿{d.act.toLocaleString()}
                              </td>
                              <td className="py-3.5 px-3 text-right text-[#994700] font-bold tabular-nums whitespace-nowrap">
                                ฿{d.po.toLocaleString()}
                              </td>
                              <td className="py-3.5 px-3 text-center whitespace-nowrap">
                                <span className={`inline-flex items-center justify-center whitespace-nowrap px-3 py-1 rounded-full font-bold text-[10.5px] ${d.status === 'overdue' ? 'bg-[#ffdad6] text-[#ba1a1a]' :
                                  d.status === 'due' ? 'bg-[#ffeedb] text-[#994700]' :
                                    'bg-[#e2f5e8] text-[#366847]'
                                  }`}>
                                  {d.statusText}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {/* Placeholder empty rows to keep the table height locked */
                            paginatedProjects.length > 0 && paginatedProjects.length < ITEMS_PER_PAGE && (
                              Array.from({ length: ITEMS_PER_PAGE - paginatedProjects.length }).map((_, i) => (
                                <tr key={`empty-${i}`}>
                                  <td className="py-3.5 px-4 opacity-0 pointer-events-none">
                                    <div className="font-bold text-[#181c20]">&nbsp;</div>
                                    <div className="text-[10px] text-[#79564b]">&nbsp;</div>
                                  </td>
                                  <td className="py-3.5 px-4 opacity-0 pointer-events-none">&nbsp;</td>
                                  <td className="py-3.5 px-3 opacity-0 pointer-events-none">&nbsp;</td>
                                  <td className="py-3.5 px-3 opacity-0 pointer-events-none">&nbsp;</td>
                                  <td className="py-3.5 px-3 opacity-0 pointer-events-none">&nbsp;</td>
                                  <td className="py-3.5 px-3 opacity-0 pointer-events-none">&nbsp;</td>
                                </tr>
                              ))
                            )
                          }
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="px-4 py-3 border-t border-[#e5e8ee] flex items-center justify-between bg-white">
                    <div className="text-xs text-[#79564b]">
                      แสดง {(currentPage - 1) * ITEMS_PER_PAGE + 1} ถึง {Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length)} จาก {filteredProjects.length} โครงการ
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#564337] bg-white border border-[#e5e8ee] hover:bg-[#f1f4f9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>

                      {getVisiblePages(currentPage, totalPages).map((page, idx) =>
                        typeof page === 'number' ? (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${currentPage === page
                              ? 'bg-[#e87722] text-white'
                              : 'text-[#564337] bg-white border border-[#e5e8ee] hover:bg-[#f1f4f9]'
                              }`}
                          >
                            {page}
                          </button>
                        ) : (
                          <span key={`ellipsis-${idx}`} className="px-1 text-xs text-[#79564b]">
                            ...
                          </span>
                        )
                      )}

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#564337] bg-white border border-[#e5e8ee] hover:bg-[#f1f4f9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'tab-departments' && (
            <div className="bg-white rounded-2xl border border-[#ddc1b2]/30 shadow-xs overflow-hidden">
              {/* Delayed Projects List */}
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="px-5 py-4 border-b border-[#e5e8ee] flex flex-wrap justify-between items-center gap-3 bg-[#fff8f5]">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-[#994700] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">pending_actions</span>
                      รายการโครงการรอติดตามเบิกจ่ายตามกำหนดเวลา
                    </h3>
                    <span className="text-xs font-bold bg-[#ffdbc8] text-[#743400] px-2.5 py-1 rounded-md">
                      {overdueProjects.length} รายการ
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#f9fafc] text-[#79564b] border-b border-[#e5e8ee]">
                        <th className="py-3 px-5 font-bold">ชื่อโครงการ / รหัส</th>
                        <th className="py-3 px-4 font-bold">หน่วยงาน</th>
                        <th className="py-3 px-4 font-bold text-right whitespace-nowrap">ยอดค้างเบิกจ่าย</th>
                        <th className="py-3 px-5 font-bold text-right whitespace-nowrap">กำหนดส่งเอกสาร (Deadline)</th>
                        <th className="py-3 px-5 font-bold text-center whitespace-nowrap min-w-[170px]">สถานะ</th>
                        <th className="py-3 px-5 font-bold text-center whitespace-nowrap min-w-[110px]">การดำเนินการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ebeef3]">
                      {overdueProjects.map(op => {
                        const remaining = op.bud - op.act;
                        const deptText = op.dept === 'SQE' ? 'พัฒนาคุณภาพนักศึกษา (SQE)' :
                          op.dept === 'ACI' ? 'พัฒนาวิชาการและหลักสูตร (ACI)' :
                            op.dept === 'RGI' ? 'ส่งเสริมการวิจัยและนวัตกรรม (RGI)' :
                              op.dept === 'ASC' ? 'บริการวิชาการแก่สังคม (ASC)' : 'บริหารจัดการและพัฒนาองค์กร (AGO)';
                        const daysLate = op.statusText.match(/\((.*?)\)/)?.[1] || '';
                        return (
                          <tr key={op.code} className="hover:bg-[#fff8f5]/60 transition-colors">
                            <td className="py-3 px-5">
                              <div className="font-bold text-[#181c20]">{op.name}</div>
                              <div className="text-[10px] text-[#79564b]">{op.code}</div>
                            </td>
                            <td className="py-3 px-4 text-[#564337] whitespace-nowrap">{deptText}</td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="font-bold text-[#994700]">฿{remaining.toLocaleString()}</div>
                              <div className="text-[10px] text-[#79564b]">จากงบ ฿{op.bud.toLocaleString()} (เบิกแล้ว ฿{op.act.toLocaleString()})</div>
                            </td>
                            <td className="py-3 px-5 text-right font-semibold text-[#b45309] whitespace-nowrap">{op.deadline} <span className="text-[10px] font-normal">({daysLate})</span></td>
                            <td className="py-3 px-5 text-center whitespace-nowrap">
                              <span className="inline-flex items-center justify-center whitespace-nowrap bg-[#ffdbc8] text-[#743400] px-3 py-1 rounded-full text-[10.5px] font-bold shadow-2xs">
                                {op.issue}
                              </span>
                            </td>
                            <td className="py-3 px-5 text-center whitespace-nowrap">
                              <button
                                onClick={handleSendAlertClick}
                                disabled={alertSent}
                                className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer ${
                                  alertSent
                                    ? 'bg-[#f1f4f9] text-[#79564b] border-slate-200 cursor-not-allowed'
                                    : 'bg-white border-[#ffdbc8] text-[#e87722] hover:bg-[#ffdbc8]'
                                }`}
                                title="ส่งหนังสือติดตามโครงการนี้"
                              >
                                <span className="material-symbols-outlined text-[13px]">
                                  {alertSent ? 'check' : 'notifications_active'}
                                </span>
                                {alertSent ? 'แจ้งแล้ว' : 'เร่งรัด'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tab-commitments' && (
            <div className="bg-white p-6 rounded-2xl border border-[#ddc1b2]/30 space-y-3 text-xs shadow-xs">
              <h3 className="font-bold text-sm text-[#181c20] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#e87722]">assignment</span>
                รายการใบสั่งซื้อสั่งจ้าง (Purchase Orders - PO)
              </h3>
              {filteredCommitments.length === 0 ? (
                <div className="p-4 bg-[#f1f4f9] rounded-xl text-center text-[#79564b]">
                  ไม่พบรายการใบสั่งซื้อสั่งจ้างที่ค้นหา
                </div>
              ) : (
                filteredCommitments.map((item) => (
                  <div
                    key={item.no}
                    onClick={() => onOpenProjectModal && onOpenProjectModal(undefined)}
                    className="p-3.5 bg-[#f1f4f9] rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 cursor-pointer hover:bg-[#e2e8f0] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <strong className="text-[#994700] font-bold">{item.no}</strong>: {item.title}
                      <div className="text-[#79564b] mt-0.5">
                        คู่สัญญา: {item.vendor}
                      </div>
                    </div>

                    <div className="sm:w-36 shrink-0 flex items-center">
                      <span className="text-[#79564b] mr-2">วงเงิน</span>
                      <strong className="text-[#181c20] text-sm">{item.amt}</strong>
                    </div>

                    <div className="sm:w-[300px] shrink-0 flex items-center sm:justify-end gap-2">
                      <span className="px-3 py-1 rounded-full bg-white font-bold text-[#564337] border border-[#ddc1b2]/40 shadow-xs text-[10px] sm:text-xs text-center w-full sm:w-auto whitespace-nowrap">
                        {item.status}
                      </span>
                      {!item.status.includes('อนุมัติ') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProcessPO(item.no);
                          }}
                          className="px-3 py-1 rounded-lg bg-[#e87722] hover:bg-[#994700] text-white font-bold text-[10px] sm:text-xs shadow-xs cursor-pointer transition-colors whitespace-nowrap"
                        >
                          อนุมัติเบิกจ่าย
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>

      {/* Alert Details Modal */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#181c20]/60 backdrop-blur-sm" onClick={() => setIsAlertModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#ddc1b2]/40 bg-[#fff0f1] flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#ba1a1a] flex items-center gap-2">
                <span className="material-symbols-outlined">notification_important</span>
                รายละเอียดการแจ้งเตือนเร่งรัด
              </h3>
              <button
                onClick={() => setIsAlertModalOpen(false)}
                className="text-[#79564b] hover:bg-[#ffdad6] p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-6 text-sm text-[#564337] space-y-4">
              <div className="bg-[#f1f4f9] p-4 rounded-xl border border-[#ddc1b2]/40">
                <div className="flex mb-2">
                  <span className="w-20 font-bold text-[#79564b]">ส่งถึง:</span>
                  <div className="flex-1 flex flex-wrap gap-1.5">
                    <span className="bg-white border border-[#ddc1b2] px-2 py-0.5 rounded-md text-xs font-bold whitespace-nowrap inline-flex">หัวหน้าหน่วยวิจัย (RES-01)</span>
                    <span className="bg-white border border-[#ddc1b2] px-2 py-0.5 rounded-md text-xs font-bold whitespace-nowrap inline-flex">หน.ห้องปฏิบัติการ SE</span>
                    <span className="bg-white border border-[#ddc1b2] px-2 py-0.5 rounded-md text-xs font-bold whitespace-nowrap inline-flex">นักวิจัย DTA</span>
                  </div>
                </div>
                <div className="flex mb-2">
                  <span className="w-20 font-bold text-[#79564b]">ช่องทาง:</span>
                  <span className="flex-1 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#e87722]">mail</span> CMU Email &amp; <span className="material-symbols-outlined text-[16px] text-[#e87722]">mark_email_unread</span> CMU MIS Notification
                  </span>
                </div>
                <div className="flex flex-col mt-4">
                  <span className="font-bold text-[#79564b] mb-1">ข้อความที่จะส่ง:</span>
                  <div className="bg-white p-3 border border-[#ddc1b2] rounded-lg text-xs leading-relaxed italic text-[#181c20]">
                    "เรียน ท่านหัวหน้าโครงการ/หัวหน้าส่วนงาน<br /><br />
                    ระบบขอแจ้งเตือนเร่งรัดการเบิกจ่ายงบประมาณไตรมาส 3 เนื่องจากยอดเบิกจ่ายของท่านปัจจุบันต่ำกว่าเป้าหมาย (Fiscal Run-Rate ต่ำกว่า 45%)<br />
                    กรุณาเร่งดำเนินการจัดซื้อจัดจ้าง หรือนำส่งใบสำคัญ/ใบเสร็จ เพื่อเบิกจ่ายงบประมาณภายในวันที่ 30 มิถุนายน 2569<br /><br />
                    หากมีข้อสงสัย กรุณาติดต่อหน่วยการเงินและบัญชี CAMT"<br /><br />
                    <span className="text-[#79564b] text-[10px]">-- ส่งโดยระบบ CAMT Budget Dashboard อัตโนมัติ --</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#f9fafc] border-t border-[#e5e8ee] flex justify-end gap-3">
              <button
                onClick={() => setIsAlertModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-[#79564b] hover:bg-[#ebeef3] transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmSendAlert}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#ba1a1a] hover:bg-[#93000a] shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                ยืนยันการส่งแจ้งเตือน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
