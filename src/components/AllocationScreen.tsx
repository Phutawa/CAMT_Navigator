import { useState } from 'react';
import {
  Download,
  Check,
  X,
  RotateCcw,
  ChevronDown,
  Pencil,
  CheckCircle2,
} from 'lucide-react';
import { DepartmentSummary, INITIAL_CATEGORIES, INITIAL_PROJECTS } from '../data/mockData';

interface AllocationScreenProps {
  departments: DepartmentSummary[];
  searchQuery?: string;
  onCommitSuccess?: () => void;
  onOpenEditModal: () => void;
  onExportReport?: () => void;
  onOpenProjectModal?: (prj: any) => void;
}

export const AllocationScreen = ({
  departments,
  searchQuery = '',
  onCommitSuccess,
  onOpenEditModal,
  onExportReport,
  onOpenProjectModal,
}: AllocationScreenProps) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'departments' | 'conditions'>('summary');
  const [deptStatuses, setDeptStatuses] = useState<Record<string, 'approved' | 'rejected'>>({});
  const [rejectingDept, setRejectingDept] = useState<{ code: string; name: string } | null>(null);
  const [currentReason, setCurrentReason] = useState('');
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  const FACULTY_GRAND_TOTAL = 12000000;
  const FACULTY_CENTRAL_RESERVE = 3450000;
  const FACULTY_PROJECTS_TOTAL = 8550000;

  const isAll = selectedCategory === 'all';
  const activeStrategicGroup = !isAll
    ? INITIAL_CATEGORIES.find((g) => g.id === selectedCategory) || null
    : null;

  const categoryProjects = isAll
    ? INITIAL_PROJECTS
    : INITIAL_PROJECTS.filter((p) => p.category === selectedCategory);

  const categoryAllocated = isAll
    ? FACULTY_PROJECTS_TOTAL
    : activeStrategicGroup?.budget ?? categoryProjects.reduce((s, p) => s + p.allocated, 0);

  const categorySpent = isAll
    ? INITIAL_CATEGORIES.reduce((s, c) => s + c.actual, 0)
    : activeStrategicGroup?.actual ?? categoryProjects.reduce((s, p) => s + p.spent, 0);

  const categoryRemaining = categoryAllocated - categorySpent;
  const categorySpentPct =
    categoryAllocated > 0 ? ((categorySpent / categoryAllocated) * 100).toFixed(1) : '0.0';
  const categoryRemainingPct =
    categoryAllocated > 0 ? (100 - parseFloat(categorySpentPct)).toFixed(1) : '0.0';

  const shareOfFaculty = isAll
    ? '100.0'
    : ((categoryAllocated / FACULTY_PROJECTS_TOTAL) * 100).toFixed(1);

  const activeDepartments = departments
    .map((d) => {
      const dProjects = categoryProjects.filter((p) => p.dept.includes(`(${d.code})`));
      const dAmount = dProjects.reduce((s, p) => s + p.allocated, 0);
      const dSpent = dProjects.reduce((s, p) => s + p.spent, 0);
      return {
        ...d,
        prjCount: dProjects.length,
        amount: dAmount,
        spent: dSpent,
        share:
          categoryAllocated > 0
            ? ((dAmount / categoryAllocated) * 100).toFixed(1) + '%'
            : '0.0%',
      };
    })
    .filter((d) => (isAll ? true : d.prjCount > 0));

  const filteredDepartments = activeDepartments.filter(
    (d) =>
      !searchQuery ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.en.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const effectiveDepartments = filteredDepartments;

  const handleDeptAction = (code: string, action: 'approve' | 'pending') => {
    if (action === 'pending') {
      const newStatuses = { ...deptStatuses };
      delete newStatuses[code];
      setDeptStatuses(newStatuses);

      const newReasons = { ...rejectReasons };
      delete newReasons[code];
      setRejectReasons(newReasons);
    } else {
      setDeptStatuses({ ...deptStatuses, [code]: 'approved' });
    }
  };

  const handleRejectClick = (dept: { code: string; name: string }) => {
    setRejectingDept(dept);
    setCurrentReason(rejectReasons[dept.code] || '');
  };

  const submitReject = () => {
    if (rejectingDept) {
      setDeptStatuses({ ...deptStatuses, [rejectingDept.code]: 'rejected' });
      setRejectReasons({ ...rejectReasons, [rejectingDept.code]: currentReason });
      setRejectingDept(null);
    }
  };

  const pendingCount = departments.length - Object.keys(deptStatuses).length;
  const isAllProcessed = pendingCount === 0;

  const handleSignAllocation = () => {
    if (!isAllProcessed) {
      const newStatuses = { ...deptStatuses };
      departments.forEach((d) => {
        if (!newStatuses[d.code]) newStatuses[d.code] = 'approved';
      });
      setDeptStatuses(newStatuses);
    } else {
      if (onCommitSuccess) onCommitSuccess();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header & Tab Navigation */}
      <div className="bg-white rounded-xl border border-[#18181b]/8 flex flex-col relative">
        <div className="sticky top-14 z-30 bg-white rounded-t-xl border-b border-[#18181b]/8">
          <div className="px-6 py-5 border-b border-[#18181b]/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#71717a]">
                <span className="px-1.5 py-0.5 rounded bg-[#f0eee9] border border-[#18181b]/10 font-mono text-[11px] text-[#52525b]">
                  ALLOC-2569
                </span>
                <span>•</span>
                <span className={isAllProcessed ? 'text-[#15803d] font-medium' : 'text-[#52525b]'}>
                  {isAllProcessed ? 'ลงนามอนุมัติแล้ว' : 'ฉบับพิจารณาขั้นสุดท้าย'}
                </span>
                <span>•</span>
                <span>รอบการจัดสรรหลักประจำปี</span>
              </div>
              <h1 className="text-2xl font-medium text-[#18181b] tracking-tight">
                แผนการจัดสรรงบประมาณ ประจำปีงบประมาณ 2569
              </h1>
            </div>

            {activeTab === 'summary' && onExportReport && (
              <button
                onClick={onExportReport}
                className="h-9 px-3.5 rounded-lg bg-white text-[#18181b] text-xs font-medium hover:bg-[#f0eee9] transition-colors duration-150 border border-[#18181b]/10 cursor-pointer flex items-center gap-2 whitespace-nowrap self-start sm:self-center"
              >
                <Download size={15} strokeWidth={1.5} className="text-[#52525b]" />
                <span>ส่งออกแผนจัดสรร PDF</span>
              </button>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 bg-[#f7f6f2] border-b border-[#18181b]/8 flex flex-wrap items-center gap-1 py-2">
            {[
              { id: 'summary', label: 'สรุปการจัดสรรภาพรวม' },
              {
                id: 'departments',
                label: 'แจกแจงรายส่วนงาน',
                badge: String(effectiveDepartments.length),
              },
              { id: 'conditions', label: 'เงื่อนไขและข้อกำหนด' },
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
                    <span className="font-mono text-[11px] text-[#71717a] tabular-nums">
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Strategic Filters */}
          {activeTab !== 'conditions' && (
            <div className="px-6 py-3 bg-white">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs text-[#52525b]">
                  การกระจายวงเงินตาม 5 กลุ่มยุทธศาสตร์ (คลิกเพื่อกรอง)
                </span>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="text-xs text-[#c85a17] hover:underline font-medium cursor-pointer"
                  >
                    แสดงทุกกลุ่ม
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {INITIAL_CATEGORIES.map((st) => {
                  const sharePct =
                    ((st.budget / FACULTY_PROJECTS_TOTAL) * 100).toFixed(1) + '%';
                  const isSelected = selectedCategory === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setSelectedCategory(isSelected ? 'all' : st.id)}
                      className={`text-left p-3 rounded-lg transition-colors duration-150 cursor-pointer border ${
                        isSelected
                          ? 'bg-[#f7f6f2] border-[#c85a17]'
                          : 'bg-[#f7f6f2]/60 border-[#18181b]/8 hover:border-[#18181b]/20'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-medium text-[#18181b] truncate pr-1" title={st.title}>
                          {st.title}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-white border border-[#18181b]/10 font-mono text-[11px] text-[#52525b] shrink-0">
                          {st.code}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline font-mono text-xs tabular-nums">
                        <span className="text-[#18181b] font-medium">
                          ฿{st.budget.toLocaleString()}
                        </span>
                        <span className="text-[#71717a]">{sharePct}</span>
                      </div>
                      <div className="w-full bg-[#e4e2dd] h-1 rounded-full overflow-hidden mt-2">
                        <div
                          className={`h-full rounded-full ${
                            isSelected ? 'bg-[#c85a17]' : 'bg-[#71717a]'
                          }`}
                          style={{ width: sharePct }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 bg-[#f7f6f2] space-y-6">
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* 4 Summary Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-[#18181b]/8">
                  <span className="text-xs text-[#52525b]">
                    {isAll ? 'งบประมาณรวมทั้งสิ้น' : 'วงเงินจัดสรรตามกลุ่มยุทธศาสตร์'}
                  </span>
                  <div className="text-[28px] leading-none font-medium text-[#18181b] mt-3 tabular-nums">
                    ฿{(isAll ? FACULTY_GRAND_TOTAL : categoryAllocated).toLocaleString()}
                  </div>
                  <div className="text-xs text-[#71717a] mt-3 pt-2.5 border-t border-[#18181b]/6">
                    {isAll
                      ? '100% สภาวิทยาลัยรับรอง'
                      : `สัดส่วน ${shareOfFaculty}% ของงบโครงการคณะ`}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#18181b]/8">
                  <span className="text-xs text-[#52525b]">
                    {isAll
                      ? `วงเงินจัดสรรให้ ${effectiveDepartments.length} หน่วยงาน`
                      : 'หน่วยงานที่ได้รับจัดสรร'}
                  </span>
                  <div className="text-[28px] leading-none font-medium text-[#18181b] mt-3 tabular-nums">
                    {isAll
                      ? `฿${FACULTY_PROJECTS_TOTAL.toLocaleString()}`
                      : `${effectiveDepartments.length} ส่วนงาน`}
                  </div>
                  <div className="text-xs text-[#71717a] mt-3 pt-2.5 border-t border-[#18181b]/6">
                    {isAll
                      ? 'สัดส่วน 71.25% ของงบรวม'
                      : `จากทั้งหมด ${departments.length} ส่วนงานของคณะ`}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#18181b]/8">
                  <span className="text-xs text-[#52525b]">
                    {isAll ? 'งบสำรองคลังกลางคงเหลือ' : 'ผลการเบิกจ่ายจริงสะสม'}
                  </span>
                  <div className="text-[28px] leading-none font-medium text-[#c85a17] mt-3 tabular-nums">
                    ฿{(isAll ? FACULTY_CENTRAL_RESERVE : categorySpent).toLocaleString()}
                  </div>
                  <div className="text-xs text-[#71717a] mt-3 pt-2.5 border-t border-[#18181b]/6">
                    {isAll
                      ? 'สำรองเร่งด่วน 28.75%'
                      : `เบิกจ่ายแล้ว ${categorySpentPct}% (คงเหลือ ฿${categoryRemaining.toLocaleString()})`}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#18181b]/8">
                  <span className="text-xs text-[#52525b]">
                    {isAll ? 'จำนวนโครงการครอบคลุม' : 'จำนวนโครงการในกลุ่มนี้'}
                  </span>
                  <div className="text-[28px] leading-none font-medium text-[#18181b] mt-3 tabular-nums">
                    {categoryProjects.length} โครงการ
                  </div>
                  <div className="text-xs text-[#71717a] mt-3 pt-2.5 border-t border-[#18181b]/6">
                    {isAll
                      ? `ครบทั้ง ${effectiveDepartments.length} ส่วนงาน`
                      : 'อนุมัติแล้วตามแผนยุทธศาสตร์'}
                  </div>
                </div>
              </div>

              {/* Clean Segmented Share Bar */}
              <div className="bg-white p-5 rounded-xl border border-[#18181b]/8 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-[#18181b]">
                      {isAll
                        ? 'สัดส่วนโครงสร้างงบประมาณรวมทั้งคณะ'
                        : `สัดส่วนการเบิกจ่ายจริงและวงเงินคงเหลือ: ${activeStrategicGroup?.title}`}
                    </span>
                    {!isAll && activeStrategicGroup && (
                      <span className="px-1.5 py-0.5 rounded bg-[#f0eee9] border border-[#18181b]/10 font-mono text-[11px] text-[#52525b]">
                        {activeStrategicGroup.code}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#15803d] font-medium tabular-nums">
                    {isAll
                      ? 'ผ่านเกณฑ์ธรรมาภิบาล (จัดสรร 71.25% : สำรอง 28.75%)'
                      : `สัดส่วน ${shareOfFaculty}% ของงบโครงการคณะ (฿8.55M)`}
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-[#e4e2dd] overflow-hidden flex">
                  <div
                    className="h-full bg-[#15803d] transition-all duration-300"
                    style={{ width: isAll ? '71.25%' : `${categorySpentPct}%` }}
                  />
                  <div
                    className="h-full bg-[#c85a17] transition-all duration-300"
                    style={{ width: isAll ? '28.75%' : `${categoryRemainingPct}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#52525b]">
                  <div className="flex items-center gap-5 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#15803d] inline-block" />
                      <span className="tabular-nums">
                        {isAll
                          ? 'จัดสรรให้หน่วยงาน: ฿8,550,000 (71.25%)'
                          : `เบิกจ่ายจริง: ฿${categorySpent.toLocaleString()} (${categorySpentPct}%)`}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#c85a17] inline-block" />
                      <span className="tabular-nums">
                        {isAll
                          ? 'สำรองคลังกลาง: ฿3,450,000 (28.75%)'
                          : `คงเหลือตามแผน: ฿${categoryRemaining.toLocaleString()} (${categoryRemainingPct}%)`}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Departments Breakdown Table */}
              <div className="bg-white rounded-xl border border-[#18181b]/8 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#f7f6f2] text-[#71717a] border-b border-[#18181b]/8">
                      <th className="py-3 px-4 font-medium">หน่วยงาน / สาขาวิชา</th>
                      <th className="py-3 px-3 font-medium">จำนวนโครงการ</th>
                      <th className="py-3 px-3 text-right font-medium">สัดส่วน</th>
                      <th className="py-3 px-4 text-right font-medium">วงเงินจัดสรร</th>
                      <th className="py-3 px-4 text-center font-medium">พิจารณาแผน</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#18181b]/6">
                    {filteredDepartments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-xs text-[#71717a]">
                          ไม่พบข้อมูลหน่วยงานที่ค้นหา
                        </td>
                      </tr>
                    ) : (
                      effectiveDepartments.map((u) => (
                        <tr
                          key={u.code}
                          className="hover:bg-[#f7f6f2]/60 transition-colors duration-150"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded bg-[#f0eee9] border border-[#18181b]/10 font-mono text-[11px] text-[#52525b]">
                                {u.code}
                              </span>
                              <span className="font-medium text-[#18181b]">{u.name}</span>
                            </div>
                            <div className="text-[11px] text-[#71717a] mt-0.5 pl-1">{u.en}</div>
                          </td>
                          <td className="py-3 px-3 text-[#52525b] tabular-nums">
                            {u.prjCount} โครงการ
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-[#52525b] tabular-nums">
                            {u.share}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-medium text-[#18181b] tabular-nums">
                            ฿{u.amount.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {!deptStatuses[u.code] ? (
                                <>
                                  <button
                                    onClick={() => handleDeptAction(u.code, 'approve')}
                                    className="h-7 px-2.5 rounded-md bg-[#f0eee9] text-[#15803d] hover:bg-[#e4e2dd] transition-colors duration-150 flex items-center gap-1 cursor-pointer font-medium"
                                  >
                                    <Check size={13} strokeWidth={1.5} />
                                    <span>อนุมัติ</span>
                                  </button>
                                  <button
                                    onClick={() => handleRejectClick(u)}
                                    className="h-7 px-2.5 rounded-md bg-[#f0eee9] text-[#dc2626] hover:bg-[#e4e2dd] transition-colors duration-150 flex items-center gap-1 cursor-pointer font-medium"
                                  >
                                    <X size={13} strokeWidth={1.5} />
                                    <span>ตีกลับ</span>
                                  </button>
                                </>
                              ) : (
                                <div className="flex items-center gap-2">
                                  {deptStatuses[u.code] === 'approved' && (
                                    <span className="text-[#15803d] font-medium flex items-center gap-1">
                                      <Check size={13} strokeWidth={1.5} />
                                      <span>อนุมัติแล้ว</span>
                                    </span>
                                  )}
                                  {deptStatuses[u.code] === 'rejected' && (
                                    <span
                                      className="text-[#dc2626] font-medium"
                                      title={rejectReasons[u.code]}
                                    >
                                      ส่งกลับแก้ไข
                                    </span>
                                  )}
                                  <button
                                    onClick={() => handleDeptAction(u.code, 'pending')}
                                    className="p-1 rounded text-[#71717a] hover:bg-[#f0eee9] hover:text-[#18181b] transition-colors duration-150 cursor-pointer"
                                    title="ยกเลิก"
                                  >
                                    <RotateCcw size={13} strokeWidth={1.5} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'departments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {effectiveDepartments.map((u) => {
                const deptPrjs = categoryProjects.filter((p) => p.dept.includes(`(${u.code})`));
                return (
                  <div
                    key={u.code}
                    className={`p-5 rounded-xl bg-white border space-y-3 transition-colors duration-150 ${
                      expandedDept === u.code
                        ? 'border-[#c85a17]'
                        : 'border-[#18181b]/8 hover:border-[#18181b]/20'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-[#f0eee9] border border-[#18181b]/10 font-mono text-[11px] text-[#52525b]">
                            {u.code}
                          </span>
                          <h4 className="font-medium text-sm text-[#18181b] truncate">{u.name}</h4>
                        </div>
                        <div className="text-xs text-[#71717a] mt-1 flex items-center gap-1.5">
                          <span className="truncate">{u.en}</span>
                          <span>•</span>
                          <button
                            onClick={() =>
                              setExpandedDept(expandedDept === u.code ? null : u.code)
                            }
                            className="text-[#c85a17] hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer shrink-0"
                          >
                            <span>{u.prjCount} โครงการ</span>
                            <ChevronDown
                              size={13}
                              strokeWidth={1.5}
                              className={`transition-transform duration-150 ${
                                expandedDept === u.code ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 text-xs">
                        {!deptStatuses[u.code] ? (
                          <>
                            <button
                              onClick={() => handleDeptAction(u.code, 'approve')}
                              className="h-7 px-2.5 rounded-md bg-[#f0eee9] text-[#15803d] hover:bg-[#e4e2dd] transition-colors duration-150 cursor-pointer font-medium"
                            >
                              อนุมัติ
                            </button>
                            <button
                              onClick={() => handleRejectClick(u)}
                              className="h-7 px-2.5 rounded-md bg-[#f0eee9] text-[#dc2626] hover:bg-[#e4e2dd] transition-colors duration-150 cursor-pointer font-medium"
                            >
                              ตีกลับ
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-medium ${
                                deptStatuses[u.code] === 'approved'
                                  ? 'text-[#15803d]'
                                  : 'text-[#dc2626]'
                              }`}
                            >
                              {deptStatuses[u.code] === 'approved'
                                ? 'อนุมัติแล้ว'
                                : 'ส่งกลับแก้ไข'}
                            </span>
                            <button
                              onClick={() => handleDeptAction(u.code, 'pending')}
                              className="p-1 rounded text-[#71717a] hover:bg-[#f0eee9] cursor-pointer"
                            >
                              <RotateCcw size={13} strokeWidth={1.5} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {deptStatuses[u.code] === 'rejected' && rejectReasons[u.code] && (
                      <div className="bg-[#f7f6f2] border border-[#dc2626]/30 rounded-lg p-2.5 text-xs text-[#dc2626]">
                        หมายเหตุ: {rejectReasons[u.code]}
                      </div>
                    )}

                    <div className="bg-[#f7f6f2] p-3 rounded-lg flex justify-between items-center text-xs">
                      <span className="text-[#52525b]">วงเงินจัดสรร:</span>
                      <span className="font-mono text-sm font-medium text-[#18181b] tabular-nums">
                        ฿{u.amount.toLocaleString()} ({u.share})
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#18181b]/6 text-xs text-[#71717a] flex justify-between items-center">
                      <span>
                        หัวหน้าส่วนงาน: <span className="text-[#18181b]">{u.head}</span>
                      </span>
                      <span className="text-[#15803d]">ตรวจสอบแล้ว</span>
                    </div>

                    {expandedDept === u.code && (
                      <div className="pt-3 border-t border-[#18181b]/8 space-y-2">
                        <div className="text-xs text-[#52525b] font-medium">
                          รายการโครงการ ({deptPrjs.length}):
                        </div>
                        <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                          {deptPrjs.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => onOpenProjectModal && onOpenProjectModal(p)}
                              className="bg-[#f7f6f2] rounded-lg p-2.5 border border-[#18181b]/6 cursor-pointer hover:border-[#c85a17] transition-colors duration-150"
                            >
                              <div className="flex justify-between items-start gap-2 mb-1">
                                <span className="font-medium text-[#18181b] text-xs">
                                  {p.title}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-white border border-[#18181b]/10 font-mono text-[10px] text-[#52525b] shrink-0">
                                  {p.code}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-xs text-[#71717a]">
                                <span className="truncate">{p.head}</span>
                                <span className="font-mono font-medium text-[#18181b] tabular-nums">
                                  ฿{p.allocated.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'conditions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {[
                {
                  title: '1. เงื่อนไขการเบิกจ่ายงวดแรก (40%)',
                  body: 'อนุมัติให้ปล่อยงบประมาณงวดแรกในอัตรา 40% ของวงเงินจัดสรรทันทีหลังคณบดีลงนามอนุมัติ เพื่อให้สาขาวิชาตั้งต้นจัดซื้อจัดจ้างได้ทันที',
                },
                {
                  title: '2. เกณฑ์การปรับเกลี่ยงบประมาณ',
                  body: 'อนุญาตให้หัวหน้าภาควิชาปรับเกลี่ยงบข้ามหมวดภายในหน่วยงานได้ไม่เกิน ฿200,000 ต่อปีงบประมาณ โดยแจ้งฝ่ายการคลังเพื่อบันทึกประวัติเข้าระบบ',
                },
                {
                  title: '3. ระยะเวลาการส่งรายงานผล',
                  body: 'จัดส่งเอกสารรายงานความก้าวหน้าทุกสิ้นไตรมาสภายใน 15 วันทำการ หากล่าช้าเกิน 30 วัน ระบบจะระงับการเบิกจ่ายงวดถัดไปชั่วคราว',
                },
                {
                  title: '4. กองทุนสำรองฉุกเฉินคณะ (฿3,450,000)',
                  body: 'การกันงบสำรองคลังกลาง มีวัตถุประสงค์เพื่อรองรับกรณีฉุกเฉิน และทุนสนับสนุนโครงการเร่งด่วนของมหาวิทยาลัย',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white p-5 rounded-xl border border-[#18181b]/8 space-y-2"
                >
                  <div className="font-medium text-sm text-[#18181b]">{item.title}</div>
                  <p className="text-[#52525b] leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Action Bar */}
        {activeTab !== 'conditions' && (
          <div className="px-6 py-4 bg-white border-t border-[#18181b]/8 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-b-xl">
            <div className="flex items-center gap-2 text-xs text-[#71717a]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
              <span>ยืนยันตัวตนผ่านระบบ CMU SSO & 2FA</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onOpenEditModal}
                className="h-9 px-3.5 rounded-lg text-xs font-medium text-[#18181b] bg-[#f0eee9] hover:bg-[#e4e2dd] transition-colors duration-150 cursor-pointer flex items-center gap-1.5"
              >
                <Pencil size={14} strokeWidth={1.5} className="text-[#52525b]" />
                <span>แก้ไขกรอบจัดสรร</span>
              </button>
              <button
                onClick={handleSignAllocation}
                className={`h-9 px-4 rounded-lg text-xs font-medium text-white flex items-center gap-1.5 transition-colors duration-150 cursor-pointer ${
                  isAllProcessed
                    ? 'bg-[#15803d] hover:bg-[#166534]'
                    : 'bg-[#18181b] hover:bg-[#27272a]'
                }`}
              >
                <CheckCircle2 size={15} strokeWidth={1.5} />
                <span>
                  {isAllProcessed
                    ? 'ลงนามประกาศใช้แผนงบประมาณ'
                    : `อนุมัติส่วนงานที่เหลือทั้งหมด (${pendingCount})`}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reject Reason Modal */}
      {rejectingDept && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#18181b]/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl border border-[#18181b]/10 flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-[#18181b]/8 flex justify-between items-center">
              <h3 className="font-medium text-sm text-[#18181b]">ระบุเหตุผลการส่งกลับแก้ไข</h3>
              <button
                onClick={() => setRejectingDept(null)}
                className="text-[#71717a] hover:text-[#18181b] p-1 rounded-md transition-colors duration-150 cursor-pointer"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-[#71717a]">ส่วนงาน:</p>
                <p className="font-medium text-sm text-[#18181b] mt-0.5">{rejectingDept.name}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-[#52525b]">สิ่งที่ต้องปรับปรุง</label>
                <textarea
                  value={currentReason}
                  onChange={(e) => setCurrentReason(e.target.value)}
                  placeholder="ระบุรายละเอียดการปรับลดหรือเอกสารที่ต้องชี้แจงเพิ่มเติม..."
                  className="w-full h-28 p-3 rounded-lg border border-[#18181b]/15 bg-white text-xs text-[#18181b] focus:outline-none focus:border-[#c85a17] resize-none"
                  autoFocus
                />
              </div>
            </div>
            <div className="px-5 py-3.5 bg-[#f7f6f2] border-t border-[#18181b]/8 flex justify-end gap-2">
              <button
                onClick={() => setRejectingDept(null)}
                className="h-8 px-3.5 text-xs font-medium text-[#52525b] hover:bg-[#e4e2dd] rounded-lg transition-colors duration-150 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={submitReject}
                className="h-8 px-4 text-xs font-medium text-white bg-[#dc2626] hover:bg-[#b91c1c] rounded-lg transition-colors duration-150 cursor-pointer"
              >
                ยืนยันส่งกลับ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
