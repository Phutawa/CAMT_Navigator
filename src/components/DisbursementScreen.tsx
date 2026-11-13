import { useState, useEffect, useMemo } from 'react';
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  X,
  Send,
  Check,
} from 'lucide-react';
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
  if (current >= total - 3)
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
};

export const DisbursementScreen = ({
  searchQuery = '',
  commitments: propCommitments,
  pendingApproved = false,
  onNotifyAlert,
  onApprovePO,
  onBulkApprovePO,
  onOpenProjectModal,
}: DisbursementScreenProps) => {
  const [activeTab, setActiveTab] = useState<
    'tab-overview' | 'tab-departments' | 'tab-commitments'
  >('tab-overview');
  const [alertSent, setAlertSent] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const [localCommitments, setLocalCommitments] =
    useState<CommitmentItem[]>(INITIAL_COMMITMENTS);
  const commitments = propCommitments ?? localCommitments;

  useEffect(() => {
    if (pendingApproved && !propCommitments) {
      setLocalCommitments((prev) =>
        prev.map((item) => ({
          ...item,
          status: 'อนุมัติเบิกจ่ายเรียบร้อย (ERP Cleared)',
        }))
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

  const projects = useMemo(() => {
    return ALL_SYNCED_PROJECTS.map((p, idx) => {
      const deptCode = CATEGORY_TO_DEPT_CODE[p.category] || 'ACI';
      const remaining = p.allocated - p.spent;

      let status: 'due' | 'overdue' | 'upcoming' = 'due';
      let statusText = 'ครบตามแผน 100%';
      let po = 0;
      let deadline: string | undefined;
      let issue: string | undefined;

      if (p.quarter === 'q4') {
        status = 'upcoming';
        statusText = 'รอเปิดรอบ Q4';
        po = 0;
      } else if (p.quarter === 'q1') {
        status = 'due';
        statusText = 'ครบตามแผน 100%';
        po = 0;
      } else {
        if (
          idx === 1 ||
          idx === 5 ||
          idx === 11 ||
          idx === 17 ||
          idx === 23 ||
          idx === 31 ||
          idx === 45
        ) {
          status = 'overdue';
          statusText = `เลยกำหนด ${(idx % 15) + 5} วัน`;
          deadline = `${(idx % 20) + 1} มิ.ย. 2569`;
          issue = idx % 2 === 0 ? 'รอตรวจรับงวดงาน' : 'ขาดเอกสารเบิกจ่าย';
          po = Math.round(remaining * 0.45);
        } else if (p.spent >= p.allocated) {
          status = 'due';
          statusText = 'ครบตามแผน 100%';
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

  const filteredProjects = projects.filter((p) => {
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

  const overdueProjects = projects.filter((p) => p.status === 'overdue');

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const filteredCommitments = commitments.filter(
    (c) =>
      !searchQuery ||
      c.no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = commitments.filter((c) => !c.status.includes('อนุมัติ')).length;

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
      prev.map((item) => ({
        ...item,
        status: 'อนุมัติเบิกจ่ายเรียบร้อย (ERP Cleared)',
      }))
    );
    if (onBulkApprovePO) {
      onBulkApprovePO();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[#18181b]/8 flex flex-col relative">
        {/* Sticky Header */}
        <div className="sticky top-14 z-30 bg-white rounded-t-xl border-b border-[#18181b]/8">
          <div className="px-6 py-5 border-b border-[#18181b]/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#71717a]">
                <span className="px-1.5 py-0.5 rounded bg-[#f0eee9] border border-[#18181b]/10 font-mono text-[11px] text-[#52525b]">
                  DISB-2569
                </span>
                <span>•</span>
                <span className="text-[#15803d] font-medium">ไตรมาส 3 ตามแผนงาน</span>
                <span>•</span>
                <span>ติดตามการเบิกจ่ายและภาระผูกพัน</span>
              </div>
              <h1 className="text-2xl font-medium text-[#18181b] tracking-tight">
                ติดตามการเบิกจ่ายงบประมาณ ประจำปีงบประมาณ 2569
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {activeTab === 'tab-departments' && (
                <button
                  onClick={handleSendAlertClick}
                  disabled={alertSent}
                  className={`h-9 px-3.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors duration-150 ${
                    alertSent
                      ? 'bg-[#f0eee9] text-[#71717a] cursor-not-allowed'
                      : 'bg-[#dc2626] text-white hover:bg-[#b91c1c] cursor-pointer'
                  }`}
                >
                  <Bell size={14} strokeWidth={1.5} />
                  <span>
                    {alertSent
                      ? 'ส่งแจ้งเตือนแล้ว'
                      : `เร่งรัดการเบิกจ่าย (${overdueProjects.length} โครงการ)`}
                  </span>
                </button>
              )}

              {activeTab === 'tab-commitments' && (
                <button
                  onClick={handleBulkApprove}
                  disabled={pendingCount === 0}
                  className={`h-9 px-3.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors duration-150 ${
                    pendingCount === 0
                      ? 'bg-[#f0eee9] text-[#71717a] cursor-not-allowed'
                      : 'bg-[#18181b] text-white hover:bg-[#27272a] cursor-pointer'
                  }`}
                >
                  <CheckCircle2 size={14} strokeWidth={1.5} />
                  <span>
                    {pendingCount === 0
                      ? 'ไม่มีรายการค้าง'
                      : `อนุมัติเบิกจ่ายทั้งหมด (${pendingCount})`}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 bg-[#f7f6f2] flex flex-wrap items-center gap-1 py-2">
            {[
              { id: 'tab-overview', label: 'ภาพรวม 186 โครงการ (37 ส่วนงาน)' },
              {
                id: 'tab-departments',
                label: 'โครงการรอติดตามเบิกจ่าย',
                badge: String(overdueProjects.length),
              },
              {
                id: 'tab-commitments',
                label: 'ใบสั่งซื้อและภาระผูกพัน (PO)',
                badge: pendingCount > 0 ? pendingCount.toString() : undefined,
              },
            ].map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`h-8 px-3 rounded-lg text-xs whitespace-nowrap transition-colors duration-150 flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#18181b] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#18181b]/8'
                      : 'text-[#52525b] hover:text-[#18181b] hover:bg-[#18181b]/[0.04]'
                  }`}
                >
                  <span>{t.label}</span>
                  {t.badge && (
                    <span className="font-mono text-[11px] text-[#c85a17] font-medium tabular-nums">
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 bg-[#f7f6f2] space-y-6 rounded-b-xl">
          {activeTab === 'tab-overview' && (
            <div className="space-y-6">
              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-[#18181b]/8">
                  <span className="text-xs text-[#52525b]">งบจัดสรรรวม</span>
                  <div className="text-[28px] leading-none font-medium text-[#18181b] mt-3 tabular-nums">
                    ฿12,000,000
                  </div>
                  <div className="text-xs text-[#71717a] mt-3 pt-2.5 border-t border-[#18181b]/6">
                    100% กรอบงบประจำปี
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#18181b]/8">
                  <span className="text-xs text-[#52525b]">ยอดเบิกจ่ายจริงสะสม</span>
                  <div className="text-[28px] leading-none font-medium text-[#15803d] mt-3 tabular-nums">
                    ฿5,820,000
                  </div>
                  <div className="text-xs text-[#71717a] mt-3 pt-2.5 border-t border-[#18181b]/6">
                    68.1% ของงบจัดสรรส่วนงาน
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#18181b]/8">
                  <span className="text-xs text-[#52525b]">รอเบิกจ่ายผูกพัน (PO)</span>
                  <div className="text-[28px] leading-none font-medium text-[#c85a17] mt-3 tabular-nums">
                    ฿2,730,000
                  </div>
                  <div className="text-xs text-[#71717a] mt-3 pt-2.5 border-t border-[#18181b]/6">
                    22.75% อยู่ระหว่างตรวจรับ
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#18181b]/8">
                  <span className="text-xs text-[#52525b]">คงเหลือสำรองคลังกลาง</span>
                  <div className="text-[28px] leading-none font-medium text-[#18181b] mt-3 tabular-nums">
                    ฿3,450,000
                  </div>
                  <div className="text-xs text-[#71717a] mt-3 pt-2.5 border-t border-[#18181b]/6">
                    28.75% สำรองไตรมาส 4
                  </div>
                </div>
              </div>

              {/* Clean Segmented Run-Rate Bar */}
              <div className="bg-white p-5 rounded-xl border border-[#18181b]/8 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="font-medium text-sm text-[#18181b]">
                    ความคืบหน้าเทียบเป้าหมายไตรมาส 3 (Fiscal Run-Rate)
                  </span>
                  <span className="text-[#15803d] font-medium tabular-nums">
                    เบิกจ่ายจริง 48.5% (+3.5% เทียบเป้าหมาย 45%)
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-[#e4e2dd] overflow-hidden flex">
                  <div
                    className="h-full bg-[#15803d]"
                    style={{ width: '48.5%' }}
                    title="เบิกจ่ายจริง: 48.5% (฿5,820,000)"
                  />
                  <div
                    className="h-full bg-[#c85a17]"
                    style={{ width: '22.75%' }}
                    title="ผูกพัน PO: 22.75% (฿2,730,000)"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-5 text-xs text-[#52525b]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#15803d] inline-block" />
                    <span className="tabular-nums">เบิกจ่ายจริง: ฿5,820,000 (48.5%)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#c85a17] inline-block" />
                    <span className="tabular-nums">ผูกพัน PO: ฿2,730,000 (22.75%)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#e4e2dd] inline-block" />
                    <span className="tabular-nums">คงเหลือสำรอง: ฿3,450,000 (28.75%)</span>
                  </span>
                </div>
              </div>

              {/* Projects Table */}
              <div className="bg-white rounded-xl border border-[#18181b]/8 overflow-hidden">
                <div className="flex flex-wrap items-center gap-2.5 p-4 border-b border-[#18181b]/8 bg-[#f7f6f2]/60">
                  <span className="text-xs text-[#52525b]">ตัวกรอง:</span>

                  <div className="relative">
                    <select
                      className="h-8 appearance-none bg-white border border-[#18181b]/10 text-[#18181b] text-xs rounded-lg pl-3 pr-7 outline-none focus:border-[#c85a17] cursor-pointer"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">ทุกสถานะเบิกจ่าย</option>
                      <option value="overdue">เลยกำหนด</option>
                      <option value="due">ครบกำหนด</option>
                      <option value="upcoming">ยังไม่ถึงกำหนด</option>
                    </select>
                    <ChevronDown
                      size={13}
                      strokeWidth={1.5}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none"
                    />
                  </div>

                  <div className="relative">
                    <select
                      className="h-8 appearance-none bg-white border border-[#18181b]/10 text-[#18181b] text-xs rounded-lg pl-3 pr-7 outline-none focus:border-[#c85a17] cursor-pointer"
                      value={amountFilter}
                      onChange={(e) => setAmountFilter(e.target.value)}
                    >
                      <option value="All">ทุกระดับวงเงิน</option>
                      <option value="low">ต่ำกว่า ฿100,000</option>
                      <option value="mid">฿100,000 – ฿300,000</option>
                      <option value="high">มากกว่า ฿300,000</option>
                    </select>
                    <ChevronDown
                      size={13}
                      strokeWidth={1.5}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none"
                    />
                  </div>

                  <div className="relative">
                    <select
                      className="h-8 appearance-none bg-white border border-[#18181b]/10 text-[#18181b] text-xs rounded-lg pl-3 pr-7 outline-none focus:border-[#c85a17] cursor-pointer"
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
                    <ChevronDown
                      size={13}
                      strokeWidth={1.5}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#f7f6f2] text-[#71717a] border-b border-[#18181b]/8">
                        <th className="py-3 px-4 font-medium">รหัส / ชื่อโครงการ</th>
                        <th className="py-3 px-4 font-medium">กลุ่มงบประมาณ</th>
                        <th className="py-3 px-3 text-right font-medium">วงเงินจัดสรร</th>
                        <th className="py-3 px-3 text-right font-medium">เบิกจ่ายจริง</th>
                        <th className="py-3 px-3 text-right font-medium">ภาระผูกพัน PO</th>
                        <th className="py-3 px-4 text-right font-medium">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#18181b]/6">
                      {filteredProjects.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-[#71717a]">
                            ไม่พบโครงการที่ตรงกับเงื่อนไข
                          </td>
                        </tr>
                      ) : (
                        paginatedProjects.map((d) => (
                          <tr
                            key={d.code}
                            className="hover:bg-[#f7f6f2]/60 transition-colors duration-150"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="px-1.5 py-0.5 rounded bg-[#f0eee9] border border-[#18181b]/10 font-mono text-[11px] text-[#52525b] shrink-0">
                                  {d.code}
                                </span>
                                <span className="font-medium text-[#18181b]">{d.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-[#52525b] whitespace-nowrap">
                              {d.dept === 'SQE'
                                ? 'พัฒนาคุณภาพนักศึกษา'
                                : d.dept === 'ACI'
                                  ? 'พัฒนาวิชาการและหลักสูตร'
                                  : d.dept === 'RGI'
                                    ? 'ส่งเสริมการวิจัยและนวัตกรรม'
                                    : d.dept === 'ASC'
                                      ? 'บริการวิชาการแก่สังคม'
                                      : 'บริหารจัดการและพัฒนาองค์กร'}
                            </td>
                            <td className="py-3 px-3 text-right font-mono text-[#52525b] tabular-nums whitespace-nowrap">
                              ฿{d.bud.toLocaleString()}
                            </td>
                            <td className="py-3 px-3 text-right font-mono text-[#15803d] font-medium tabular-nums whitespace-nowrap">
                              ฿{d.act.toLocaleString()}
                            </td>
                            <td className="py-3 px-3 text-right font-mono text-[#18181b] tabular-nums whitespace-nowrap">
                              ฿{d.po.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <span
                                className={`font-medium ${
                                  d.status === 'overdue'
                                    ? 'text-[#dc2626]'
                                    : d.status === 'due'
                                      ? 'text-[#15803d]'
                                      : 'text-[#71717a]'
                                }`}
                              >
                                {d.statusText}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-4 py-3 border-t border-[#18181b]/8 flex items-center justify-between bg-white">
                    <div className="text-xs text-[#71717a] tabular-nums">
                      แสดง {(currentPage - 1) * ITEMS_PER_PAGE + 1} –{' '}
                      {Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length)} จาก{' '}
                      {filteredProjects.length} โครงการ
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="h-7 px-2.5 rounded-md text-xs text-[#52525b] bg-white border border-[#18181b]/10 hover:bg-[#f0eee9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
                      >
                        ก่อนหน้า
                      </button>

                      {getVisiblePages(currentPage, totalPages).map((page, idx) =>
                        typeof page === 'number' ? (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-7 h-7 rounded-md font-mono text-xs flex items-center justify-center transition-colors duration-150 cursor-pointer ${
                              currentPage === page
                                ? 'bg-[#18181b] text-white font-medium'
                                : 'text-[#52525b] bg-white border border-[#18181b]/10 hover:bg-[#f0eee9]'
                            }`}
                          >
                            {page}
                          </button>
                        ) : (
                          <span key={`ellipsis-${idx}`} className="px-1 text-xs text-[#71717a]">
                            ...
                          </span>
                        )
                      )}

                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        className="h-7 px-2.5 rounded-md text-xs text-[#52525b] bg-white border border-[#18181b]/10 hover:bg-[#f0eee9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
                      >
                        ถัดไป
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'tab-departments' && (
            <div className="bg-white rounded-xl border border-[#18181b]/8 overflow-hidden">
              <div className="px-5 py-4 border-b border-[#18181b]/8 flex justify-between items-center">
                <h3 className="font-medium text-sm text-[#18181b]">
                  รายการโครงการรอติดตามเบิกจ่ายตามกำหนดเวลา
                </h3>
                <span className="font-mono text-xs text-[#c85a17] font-medium tabular-nums">
                  {overdueProjects.length} รายการ
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#f7f6f2] text-[#71717a] border-b border-[#18181b]/8">
                      <th className="py-3 px-4 font-medium">รหัส / ชื่อโครงการ</th>
                      <th className="py-3 px-4 font-medium">หน่วยงาน</th>
                      <th className="py-3 px-4 font-medium text-right">ยอดค้างเบิกจ่าย</th>
                      <th className="py-3 px-4 font-medium text-right">กำหนดส่งเอกสาร</th>
                      <th className="py-3 px-4 font-medium">สาเหตุ</th>
                      <th className="py-3 px-4 font-medium text-right">การดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#18181b]/6">
                    {overdueProjects.map((op) => {
                      const remaining = op.bud - op.act;
                      const deptText =
                        op.dept === 'SQE'
                          ? 'พัฒนาคุณภาพนักศึกษา (SQE)'
                          : op.dept === 'ACI'
                            ? 'พัฒนาวิชาการและหลักสูตร (ACI)'
                            : op.dept === 'RGI'
                              ? 'ส่งเสริมการวิจัยและนวัตกรรม (RGI)'
                              : op.dept === 'ASC'
                                ? 'บริการวิชาการแก่สังคม (ASC)'
                                : 'บริหารจัดการและพัฒนาองค์กร (AGO)';
                      return (
                        <tr
                          key={op.code}
                          className="hover:bg-[#f7f6f2]/60 transition-colors duration-150"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded bg-[#f0eee9] border border-[#18181b]/10 font-mono text-[11px] text-[#52525b]">
                                {op.code}
                              </span>
                              <span className="font-medium text-[#18181b]">{op.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-[#52525b] whitespace-nowrap">
                            {deptText}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="font-mono font-medium text-[#18181b] tabular-nums">
                              ฿{remaining.toLocaleString()}
                            </div>
                            <div className="text-[11px] text-[#71717a] tabular-nums">
                              จากงบ ฿{op.bud.toLocaleString()}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-[#dc2626] whitespace-nowrap tabular-nums">
                            {op.deadline} ({op.statusText})
                          </td>
                          <td className="py-3 px-4 text-[#52525b] whitespace-nowrap">
                            {op.issue}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={handleSendAlertClick}
                              disabled={alertSent}
                              className={`h-7 px-2.5 rounded-md border text-xs font-medium inline-flex items-center gap-1 transition-colors duration-150 ${
                                alertSent
                                  ? 'bg-[#f0eee9] text-[#71717a] border-transparent cursor-not-allowed'
                                  : 'bg-white border-[#18181b]/15 text-[#18181b] hover:bg-[#f0eee9] cursor-pointer'
                              }`}
                            >
                              {alertSent ? (
                                <>
                                  <Check size={12} strokeWidth={1.5} />
                                  <span>แจ้งแล้ว</span>
                                </>
                              ) : (
                                <span>ติดตาม</span>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'tab-commitments' && (
            <div className="bg-white rounded-xl border border-[#18181b]/8 overflow-hidden">
              <div className="px-5 py-4 border-b border-[#18181b]/8">
                <h3 className="font-medium text-sm text-[#18181b]">
                  รายการใบสั่งซื้อสั่งจ้าง (Purchase Orders)
                </h3>
              </div>
              <div className="divide-y divide-[#18181b]/6 text-xs">
                {filteredCommitments.length === 0 ? (
                  <div className="p-8 text-center text-[#71717a]">
                    ไม่พบรายการใบสั่งซื้อสั่งจ้างที่ค้นหา
                  </div>
                ) : (
                  filteredCommitments.map((item) => (
                    <div
                      key={item.no}
                      onClick={() => onOpenProjectModal && onOpenProjectModal(undefined)}
                      className="p-4 sm:px-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#f7f6f2]/60 transition-colors duration-150"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-[#f0eee9] border border-[#18181b]/10 font-mono text-[11px] font-medium text-[#52525b]">
                            {item.no}
                          </span>
                          <span className="font-medium text-sm text-[#18181b]">
                            {item.title}
                          </span>
                        </div>
                        <div className="text-[#71717a] mt-1">คู่สัญญา: {item.vendor}</div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                        <span className="font-mono text-sm font-medium text-[#18181b] tabular-nums">
                          {item.amt}
                        </span>
                        <span
                          className={`text-xs ${
                            item.status.includes('อนุมัติ')
                              ? 'text-[#15803d] font-medium'
                              : 'text-[#71717a]'
                          }`}
                        >
                          {item.status}
                        </span>
                        {!item.status.includes('อนุมัติ') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProcessPO(item.no);
                            }}
                            className="h-8 px-3 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-white font-medium text-xs cursor-pointer transition-colors duration-150 whitespace-nowrap"
                          >
                            อนุมัติเบิกจ่าย
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alert Details Modal */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18181b]/50 backdrop-blur-xs">
          <div className="relative bg-white rounded-xl shadow-xl border border-[#18181b]/10 w-full max-w-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-[#18181b]/8 flex justify-between items-center">
              <h3 className="text-sm font-medium text-[#18181b]">
                ยืนยันการส่งหนังสือแจ้งเตือนเร่งรัดเบิกจ่าย
              </h3>
              <button
                onClick={() => setIsAlertModalOpen(false)}
                className="text-[#71717a] hover:text-[#18181b] p-1 rounded-md transition-colors duration-150 cursor-pointer"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            <div className="p-5 text-xs text-[#52525b] space-y-3">
              <div className="bg-[#f7f6f2] p-4 rounded-lg border border-[#18181b]/8 space-y-2.5">
                <div className="flex gap-2">
                  <span className="w-16 text-[#71717a] shrink-0">ผู้รับ:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['RES-01', 'SE Lab', 'DTA'].map((code) => (
                      <span
                        key={code}
                        className="px-1.5 py-0.5 rounded bg-white border border-[#18181b]/10 font-mono text-[11px] text-[#18181b]"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="w-16 text-[#71717a] shrink-0">ช่องทาง:</span>
                  <span className="text-[#18181b]">CMU Email & ระบบแจ้งเตือนภายใน</span>
                </div>
                <div className="pt-2 border-t border-[#18181b]/8">
                  <div className="text-[#71717a] mb-1">ข้อความแจ้งเตือน:</div>
                  <div className="bg-white p-3 border border-[#18181b]/8 rounded-md text-xs leading-relaxed text-[#18181b]">
                    เรียน หัวหน้าโครงการ/หัวหน้าส่วนงาน — ขอความอนุเคราะห์เร่งรัดการส่งมอบหลักฐานและใบสำคัญเบิกจ่ายประจำไตรมาส 3 ภายในวันที่ 30 มิถุนายน 2569 เพื่อให้เป็นไปตามแผนการใช้จ่ายงบประมาณของวิทยาลัย
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-[#f7f6f2] border-t border-[#18181b]/8 flex justify-end gap-2">
              <button
                onClick={() => setIsAlertModalOpen(false)}
                className="h-8 px-3.5 rounded-lg text-xs font-medium text-[#52525b] hover:bg-[#e4e2dd] transition-colors duration-150 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmSendAlert}
                className="h-8 px-4 rounded-lg text-xs font-medium text-white bg-[#dc2626] hover:bg-[#b91c1c] transition-colors duration-150 cursor-pointer flex items-center gap-1.5"
              >
                <Send size={13} strokeWidth={1.5} />
                <span>ส่งแจ้งเตือน</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
