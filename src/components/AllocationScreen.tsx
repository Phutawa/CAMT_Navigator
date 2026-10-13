import { useState } from 'react';
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
  onOpenProjectModal
}: AllocationScreenProps) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'departments' | 'conditions'>('summary');
  const [deptStatuses, setDeptStatuses] = useState<Record<string, 'approved' | 'rejected'>>({});
  const [rejectingDept, setRejectingDept] = useState<{ code: string, name: string } | null>(null);
  const [currentReason, setCurrentReason] = useState('');
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  const FACULTY_GRAND_TOTAL = 12000000;
  const FACULTY_CENTRAL_RESERVE = 3450000;
  const FACULTY_PROJECTS_TOTAL = 8550000;

  const isAll = selectedCategory === 'all';
  const activeStrategicGroup = !isAll ? INITIAL_CATEGORIES.find(g => g.id === selectedCategory) || null : null;

  // Filter projects matching selectedCategory
  const categoryProjects = isAll
    ? INITIAL_PROJECTS
    : INITIAL_PROJECTS.filter(p => p.category === selectedCategory);

  const categoryAllocated = isAll
    ? FACULTY_PROJECTS_TOTAL
    : (activeStrategicGroup?.budget ?? categoryProjects.reduce((s, p) => s + p.allocated, 0));

  const categorySpent = isAll
    ? INITIAL_CATEGORIES.reduce((s, c) => s + c.actual, 0)
    : (activeStrategicGroup?.actual ?? categoryProjects.reduce((s, p) => s + p.spent, 0));

  const categoryRemaining = categoryAllocated - categorySpent;
  const categorySpentPct = categoryAllocated > 0 ? ((categorySpent / categoryAllocated) * 100).toFixed(1) : '0';
  const categoryRemainingPct = categoryAllocated > 0 ? (100 - parseFloat(categorySpentPct)).toFixed(1) : '0';

  // Share of faculty projects budget (฿8.55M)
  const shareOfFaculty = isAll ? '100.0' : ((categoryAllocated / FACULTY_PROJECTS_TOTAL) * 100).toFixed(1);

  // Departments for this view derived from actual projects in category
  const activeDepartments = departments.map(d => {
    const dProjects = categoryProjects.filter(p => p.dept.includes(`(${d.code})`));
    const dAmount = dProjects.reduce((s, p) => s + p.allocated, 0);
    const dSpent = dProjects.reduce((s, p) => s + p.spent, 0);
    return {
      ...d,
      prjCount: dProjects.length,
      amount: dAmount,
      spent: dSpent,
      share: categoryAllocated > 0 ? ((dAmount / categoryAllocated) * 100).toFixed(1) + '%' : '0%',
    };
  }).filter(d => isAll ? true : d.prjCount > 0);

  const filteredDepartments = activeDepartments.filter(d =>
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

  const handleRejectClick = (dept: { code: string, name: string }) => {
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
      // Bulk approve remaining
      const newStatuses = { ...deptStatuses };
      departments.forEach(d => {
        if (!newStatuses[d.code]) newStatuses[d.code] = 'approved';
      });
      setDeptStatuses(newStatuses);
    } else {
      // Actually sign and publish
      if (onCommitSuccess) onCommitSuccess();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl border border-[#ddc1b2]/40 flex flex-col relative">
        {/* Card Header Section - Sticky Locked */}
        <div className="sticky top-20 z-30 bg-white rounded-t-2xl shadow-sm border-b border-[#e5e8ee]">
          {/* Top Gradient */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#e87722] via-[#b58d80] to-[#366847] rounded-t-2xl"></div>

          {/* Header */}
          <div className="px-6 py-4 sm:py-5 border-b border-[#e5e8ee] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-[#ffdbc8] text-[#743400] text-[11px] font-bold uppercase tracking-wider">
                  #ALLOC-2569-PLAN
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${isAllProcessed ? 'bg-[#b8f0c5] text-[#1d5031]' : 'bg-[#e5e8ee] text-[#564337]'}`}>
                  {isAllProcessed ? 'ลงนามอนุมัติแล้ว' : 'ฉบับพิจารณาขั้นสุดท้าย'}
                </span>
                <span className="text-[11px] text-[#79564b]">รอบการจัดสรรหลัก (Annual Quota)</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-[#181c20] tracking-tight">
                แผนการจัดสรรงบประมาณ ประจำปีงบประมาณ 2569
              </h1>
              <p className="text-sm text-[#564337] mt-1">
                วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มหาวิทยาลัยเชียงใหม่ • Fiscal Allocation Master Matrix
              </p>
            </div>
            {activeTab === 'summary' && onExportReport && (
              <div className="flex items-center gap-2">
                <button
                  onClick={onExportReport}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-[#181c20] text-xs font-bold shadow-xs hover:bg-[#ebeef3] transition-colors border border-[#ddc1b2]/40 cursor-pointer whitespace-nowrap"
                  title="พิมพ์ / ดาวน์โหลด PDF เอกสารประกาศแผนจัดสรร"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#79564b]">picture_as_pdf</span>
                  <span>ส่งออกแผนจัดสรร PDF</span>
                </button>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="px-4 sm:px-6 bg-[#f1f4f9] border-b border-[#e5e8ee] flex flex-wrap items-center gap-1.5 sm:gap-2 py-2">
            {[
              { id: 'summary', label: 'สรุปการจัดสรรภาพรวม (Overall Summary)', icon: 'query_stats' },
              { id: 'departments', label: `แจกแจง 5 กลุ่ม/ส่วนงาน`, icon: 'apartment', badge: String(effectiveDepartments.length) },
              { id: 'conditions', label: 'บันทึกเงื่อนไขและข้อกำหนด', icon: 'rule' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === t.id
                  ? 'bg-[#e87722] text-white shadow-xs'
                  : 'text-[#564337] hover:bg-[#ebeef3]'
                  }`}
              >
                <span className="material-symbols-outlined text-[17px]">{t.icon}</span>
                <span>{t.label}</span>
                {t.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === t.id ? 'bg-white text-[#994700]' : 'bg-[#e0e3e8] text-[#181c20]'
                      }`}
                  >
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Strategic Filters - Hidden on conditions tab as requested */}
          {activeTab !== 'conditions' && (
            <div className="px-6 py-2.5 bg-white border-b border-[#e5e8ee]">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold text-[#181c20]">
                  การกระจายวงเงินตาม 5 กลุ่มหลักของวิทยาลัย (คลิกเพื่อคัดกรอง)
                </h3>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="text-[11px] text-[#e87722] hover:underline font-bold cursor-pointer"
                  >
                    ยกเลิกการกรอง (ดูทั้งหมด)
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {INITIAL_CATEGORIES.map((st) => {
                  const sharePct = ((st.budget / FACULTY_PROJECTS_TOTAL) * 100).toFixed(1) + '%';
                  const isSelected = selectedCategory === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setSelectedCategory(isSelected ? 'all' : st.id)}
                      className={`text-left space-y-2 p-3 rounded-xl transition-all cursor-pointer border ${isSelected
                        ? 'bg-[#fff5ef] border-[#e87722] shadow-sm ring-2 ring-[#e87722]/30'
                        : 'bg-[#f1f4f9] border-transparent hover:bg-[#e0e3e8]'
                        }`}
                    >
                      <div className="flex justify-between font-bold text-[#181c20] text-[11px] leading-snug">
                        <span className="truncate pr-1" title={st.title}>{st.title}</span>
                        <span className="text-[10px] text-[#79564b] shrink-0 font-mono font-bold">{st.code}</span>
                      </div>
                      <div className="flex justify-between font-bold items-end">
                        <span className="tabular-nums text-[#e87722] text-sm leading-none">฿{st.budget.toLocaleString()}</span>
                        <span className="tabular-nums text-[#79564b] text-[10px] leading-none bg-white px-1.5 py-0.5 rounded shadow-xs">{sharePct}</span>
                      </div>
                      <div className="w-full bg-[#ebeef3] h-1.5 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full rounded-full transition-all duration-500 shadow-2xs"
                          style={{
                            width: sharePct,
                            background: isSelected
                              ? 'linear-gradient(90deg, #9a4306 0%, #e87722 100%)'
                              : 'linear-gradient(90deg, #8a7065 0%, #b58d80 100%)',
                          }}
                        />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 bg-[#f7f9ff] space-y-6 rounded-b-2xl">
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Summary KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#ddc1b2]/30 shadow-xs">
                  <span className="text-xs text-[#79564b] font-bold">
                    {isAll ? 'งบประมาณรวมทั้งสิ้น' : 'วงเงินจัดสรรตามกลุ่มยุทธศาสตร์'}
                  </span>
                  <div className="text-2xl font-black text-[#181c20] mt-2 tabular-nums">
                    ฿{(isAll ? FACULTY_GRAND_TOTAL : categoryAllocated).toLocaleString()}
                  </div>
                  <div className="text-xs text-[#366847] font-semibold mt-1">
                    {isAll ? '100% สภาวิทยาลัยฯ รับรอง' : `สัดส่วน ${shareOfFaculty}% ของงบโครงการคณะ`}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#ddc1b2]/30 shadow-xs">
                  <span className="text-xs text-[#79564b] font-bold">
                    {isAll ? `วงเงินจัดสรรให้ ${effectiveDepartments.length} หน่วยงาน` : 'หน่วยงานที่ได้รับจัดสรร'}
                  </span>
                  <div className="text-2xl font-black text-[#366847] mt-2 tabular-nums">
                    {isAll ? `฿${FACULTY_PROJECTS_TOTAL.toLocaleString()}` : `${effectiveDepartments.length} ส่วนงาน`}
                  </div>
                  <div className="text-xs text-[#564337] mt-1">
                    {isAll ? 'สัดส่วน 71.25% ของงบรวม' : `จากทั้งหมด ${departments.length} ส่วนงานของคณะ`}
                  </div>
                </div>

                <div className={`${isAll ? 'bg-[#FFF7F0] border-2 border-[#e87722]' : 'bg-white border border-[#ddc1b2]/30'} p-4 rounded-xl shadow-xs`}>
                  <span className={`text-xs font-bold ${isAll ? 'text-[#e87722]' : 'text-[#79564b]'}`}>
                    {isAll ? 'งบสำรองคลังกลางคงเหลือ' : 'ผลการเบิกจ่ายจริงสะสม'}
                  </span>
                  <div className={`text-2xl font-black ${isAll ? 'text-[#994700]' : 'text-[#e87722]'} mt-2 tabular-nums`}>
                    ฿{(isAll ? FACULTY_CENTRAL_RESERVE : categorySpent).toLocaleString()}
                  </div>
                  <div className="text-xs text-[#564337] mt-1">
                    {isAll ? 'สำรองเร่งด่วน 28.75%' : `เบิกจ่ายแล้ว ${categorySpentPct}% (คงเหลือ ฿${categoryRemaining.toLocaleString()})`}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#ddc1b2]/30 shadow-xs">
                  <span className="text-xs text-[#79564b] font-bold">
                    {isAll ? 'จำนวนโครงการครอบคลุม' : 'จำนวนโครงการในกลุ่มนี้'}
                  </span>
                  <div className="text-2xl font-black text-[#181c20] mt-2 tabular-nums">
                    {categoryProjects.length} โครงการ
                  </div>
                  <div className="text-xs text-[#564337] mt-1">
                    {isAll ? `ครบทั้ง ${effectiveDepartments.length} ส่วนงาน` : 'อนุมัติแล้วตามแผนยุทธศาสตร์'}
                  </div>
                </div>
              </div>

              {/* Progress Bar Proportion (Capsule Style with Gradients) */}
              <div className="bg-white p-5 rounded-2xl border border-[#ddc1b2]/30 space-y-3.5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="font-bold text-[#181c20] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#e87722]">pie_chart</span>
                    <span>
                      {isAll
                        ? 'สัดส่วนการกระจายโครงสร้างงบประมาณรวมทั้งคณะ'
                        : `สัดส่วนการเบิกจ่ายจริง & วงเงินคงเหลือ: ${activeStrategicGroup?.title}`}
                    </span>
                    {!isAll && activeStrategicGroup && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#fff5ef] text-[#e87722] border border-[#e87722]/30 font-bold">
                        {activeStrategicGroup.code}
                      </span>
                    )}
                  </div>
                  <span className="text-[#1d5031] bg-[#b8f0c5]/60 px-2.5 py-0.5 rounded-full border border-[#366847]/20 font-bold text-[11px] w-fit sm:w-auto">
                    {isAll
                      ? 'ผ่านเกณฑ์ธรรมาภิบาล (จัดสรร 71.25% : สำรอง 28.75%)'
                      : `คิดเป็นสัดส่วน ${shareOfFaculty}% ของงบโครงการคณะ (฿8.55M)`}
                  </span>
                </div>

                {/* Main Dynamic Proportion Bar (Capsule Overlapping Pills with Gradients) */}
                <div className="relative w-full h-7 sm:h-8 rounded-full bg-[#ebeef3] border border-[#ddc1b2]/30 shadow-inner flex items-center overflow-hidden">
                  {/* Layer 1: Orange Base Bar (100% full width) ทรงแคปซูลมนๆ ไล่สีส้ม */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-full rounded-full transition-all duration-500 shadow-2xs"
                    style={{
                      background: 'linear-gradient(90deg, #9a4306 0%, #c25e10 35%, #e87722 75%, #f9852c 100%)',
                    }}
                    title={isAll ? 'สำรองคลังกลาง: 28.75% (฿3.45M)' : `คงเหลือตามแผน: ${categoryRemainingPct}%`}
                  />

                  {/* Layer 2: Green Foreground Bar ซ้อนทับด้านหน้า ทรงแคปซูลมนๆ ปลายโค้งมนตัดเข้ากับสีส้ม */}
                  <div
                    className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-500 z-10 shadow-xs"
                    style={{
                      width: isAll ? '71.25%' : `${categorySpentPct}%`,
                      background: 'linear-gradient(90deg, #164e22 0%, #246d33 35%, #2e7d32 75%, #3fa64d 100%)',
                    }}
                    title={isAll ? 'จัดสรรให้ 37 หน่วยงาน: 71.25% (฿8.55M)' : `เบิกจ่ายจริงแล้ว: ${categorySpentPct}%`}
                  />

                  {/* Text Label: ฝั่งสีเขียว */}
                  <div
                    className="absolute left-0 top-0 bottom-0 z-20 flex items-center justify-center text-[10px] sm:text-[11px] text-white font-bold tracking-wide drop-shadow-xs px-2 truncate pointer-events-none"
                    style={{ width: isAll ? '71.25%' : `${categorySpentPct}%` }}
                  >
                    {isAll
                      ? `จัดสรรให้ ${effectiveDepartments.length} หน่วยงาน 71.25% (฿8.55M)`
                      : `เบิกจ่ายจริงแล้ว ${categorySpentPct}% (฿${(categorySpent / 1000000).toFixed(2)}M)`}
                  </div>

                  {/* Text Label: ฝั่งสีส้ม */}
                  <div
                    className="absolute top-0 bottom-0 z-10 flex items-center justify-center text-[10px] sm:text-[11px] text-white font-bold tracking-wide drop-shadow-xs px-2 truncate pointer-events-none"
                    style={{
                      left: isAll ? '71.25%' : `${categorySpentPct}%`,
                      width: isAll ? '28.75%' : `${categoryRemainingPct}%`,
                    }}
                  >
                    {isAll
                      ? 'สำรองคลังกลาง 28.75% (฿3.45M)'
                      : `คงเหลือตามแผน ${categoryRemainingPct}% (฿${(categoryRemaining / 1000000).toFixed(2)}M)`}
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
                      <span className="text-[11px] font-semibold">
                        {isAll
                          ? 'จัดสรรให้หน่วยงาน: ฿8,550,000 (71.25%)'
                          : `เบิกจ่ายจริง: ฿${(categorySpent / 1000000).toFixed(2)}M (${categorySpentPct}%)`}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-2 rounded-full inline-block shadow-2xs"
                        style={{ background: 'linear-gradient(90deg, #9a4306 0%, #f9852c 100%)' }}
                      />
                      <span className="text-[11px] font-semibold">
                        {isAll
                          ? 'สำรองคลังกลาง: ฿3,450,000 (28.75%)'
                          : `คงเหลือตามแผน: ฿${(categoryRemaining / 1000000).toFixed(2)}M (${categoryRemainingPct}%)`}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Additional Context Strip for Category Filter */}
                {!isAll && (
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#79564b] border-t border-[#ebeef3] gap-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span>สัดส่วนในงบจัดสรรโครงการคณะ:</span>
                      <span className="font-bold text-[#181c20]">{shareOfFaculty}%</span>
                      <span className="text-[#79564b]">(฿{(categoryAllocated / 1000000).toFixed(2)}M จาก ฿8.55M)</span>
                      <span className="mx-1">•</span>
                      <span>ครอบคลุม:</span>
                      <span className="font-bold text-[#181c20]">{effectiveDepartments.length} ส่วนงาน</span>
                      <span className="text-[#79564b]">({categoryProjects.length} โครงการ)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>คงเหลือพร้อมเบิก:</span>
                      <strong className="text-[#e87722] font-black tabular-nums">฿{categoryRemaining.toLocaleString()}</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Departments Breakdown Table */}
              <div className="bg-white rounded-xl border border-[#ddc1b2]/30 overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#f1f4f9] text-[#79564b] uppercase font-bold border-b border-[#e5e8ee]">
                      <th className="py-3 px-4">หน่วยงาน / สาขาวิชา</th>
                      <th className="py-3 px-3">จำนวนโครงการ</th>
                      <th className="py-3 px-3 text-right">สัดส่วน</th>
                      <th className="py-3 px-4 text-right">วงเงินจัดสรร</th>
                      <th className="py-3 px-3 text-center">พิจารณาแผน</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ebeef3]">
                    {filteredDepartments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-sm text-[#79564b]">
                          ไม่พบข้อมูลหน่วยงานที่ค้นหา
                        </td>
                      </tr>
                    ) : (
                      effectiveDepartments.map((u) => {
                        const share = u.share;
                        return (
                          <tr key={u.code} className="hover:bg-[#FFF7F0]/30 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-[#181c20]">
                                {u.name} ({u.code})
                              </div>
                              <div className="text-[11px] text-[#79564b]">{u.en}</div>
                            </td>
                            <td className="py-3.5 px-3 font-semibold text-[#181c20]">{u.prjCount} โครงการ</td>
                            <td className="py-3.5 px-3 text-right font-bold tabular-nums text-[#564337]">
                              {share}
                            </td>
                            <td className="py-3.5 px-4 text-right font-black text-[#181c20] tabular-nums">
                              ฿{u.amount.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                {!deptStatuses[u.code] ? (
                                  <>
                                    <button onClick={() => handleDeptAction(u.code, 'approve')} className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#e5f8ec] text-[#1d5031] hover:bg-[#b8f0c5] transition-colors border border-[#b8f0c5]">
                                      <span className="material-symbols-outlined text-[14px]">check</span>
                                      <span className="text-[11px] font-bold">อนุมัติ</span>
                                    </button>
                                    <button onClick={() => handleRejectClick(u)} className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#fff0f1] text-[#8c000b] hover:bg-[#fbd0d4] transition-colors border border-[#fbd0d4]">
                                      <span className="material-symbols-outlined text-[14px]">close</span>
                                      <span className="text-[11px] font-bold">ตีกลับ</span>
                                    </button>
                                  </>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    {deptStatuses[u.code] === 'approved' && (
                                      <span className="px-2.5 py-1 rounded-full bg-[#b8f0c5] text-[#1d5031] font-bold text-[11px] flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px]">verified</span>
                                        อนุมัติแล้ว
                                      </span>
                                    )}
                                    {deptStatuses[u.code] === 'rejected' && (
                                      <div className="flex flex-col items-end gap-0.5">
                                        <span className="px-2.5 py-1 rounded-full bg-[#fbd0d4] text-[#8c000b] font-bold text-[11px] flex items-center gap-1" title={rejectReasons[u.code]}>
                                          <span className="material-symbols-outlined text-[12px]">edit_note</span>
                                          ส่งกลับแก้ไข
                                        </span>
                                      </div>
                                    )}
                                    <button onClick={() => handleDeptAction(u.code, 'pending')} className="p-1 rounded text-[#79564b] hover:bg-[#ebeef3] transition-colors" title="ยกเลิก">
                                      <span className="material-symbols-outlined text-[16px]">undo</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      }))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'departments' && (
            <div className="columns-1 md:columns-2 gap-4">
              {effectiveDepartments.map((u) => {
                const share = u.share;
                const deptPrjs = categoryProjects.filter(p => p.dept.includes(`(${u.code})`));
                return (
                  <div
                    key={u.code}
                    className={`break-inside-avoid mb-4 inline-block w-full p-5 rounded-2xl border shadow-xs space-y-3 transition-all duration-300 ${
                      expandedDept === u.code
                        ? 'bg-[#fffaf7] border-[#e87722] ring-2 ring-[#e87722]/15 shadow-md relative z-10'
                        : 'bg-white border-[#ddc1b2]/30 hover:border-[#e87722]/40'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 pr-2">
                        <h4 className="font-extrabold text-sm text-[#181c20]">{u.name}</h4>
                        <div className="text-xs text-[#79564b] mt-0.5 leading-snug">
                          <span className="align-middle">{u.en}</span> <span className="mx-0.5 align-middle">•</span>
                          <button
                            onClick={() => setExpandedDept(expandedDept === u.code ? null : u.code)}
                            className="text-[#e87722] hover:text-[#cc681d] font-bold inline-flex items-center gap-0.5 transition-colors cursor-pointer align-middle ml-0.5"
                          >
                            <span className="whitespace-nowrap">{u.prjCount} โครงการ</span>
                            <span className={`material-symbols-outlined text-[14px] transition-transform ${expandedDept === u.code ? 'rotate-180' : ''}`}>
                              expand_more
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {!deptStatuses[u.code] ? (
                          <>
                            <button onClick={() => handleDeptAction(u.code, 'approve')} className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#e5f8ec] text-[#1d5031] hover:bg-[#b8f0c5] transition-colors border border-[#b8f0c5]">
                              <span className="material-symbols-outlined text-[14px]">check</span>
                              <span className="text-[11px] font-bold">อนุมัติ</span>
                            </button>
                            <button onClick={() => handleRejectClick(u)} className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#fff0f1] text-[#8c000b] hover:bg-[#fbd0d4] transition-colors border border-[#fbd0d4]">
                              <span className="material-symbols-outlined text-[14px]">close</span>
                              <span className="text-[11px] font-bold">ตีกลับ</span>
                            </button>
                          </>
                        ) : (
                          <>
                            {deptStatuses[u.code] === 'approved' && (
                              <span className="px-2.5 py-1 rounded-full bg-[#b8f0c5] text-[#1d5031] font-bold text-[11px] flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">verified</span>
                                อนุมัติแล้ว
                              </span>
                            )}
                            {deptStatuses[u.code] === 'rejected' && (
                              <div className="flex flex-col items-end gap-1">
                                <span className="px-2.5 py-1 rounded-full bg-[#fbd0d4] text-[#8c000b] font-bold text-[11px] flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[12px]">edit_note</span>
                                  ส่งกลับแก้ไข
                                </span>
                              </div>
                            )}
                            <button onClick={() => handleDeptAction(u.code, 'pending')} className="p-1 rounded text-[#79564b] hover:bg-[#ebeef3] transition-colors" title="ยกเลิก">
                              <span className="material-symbols-outlined text-[16px]">undo</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {deptStatuses[u.code] === 'rejected' && rejectReasons[u.code] && (
                      <div className="bg-[#fff0f1] border border-[#fbd0d4] rounded-lg p-2.5 text-xs text-[#8c000b] flex gap-2 items-start mt-[-4px] mb-2">
                        <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">feedback</span>
                        <p><strong>หมายเหตุ:</strong> {rejectReasons[u.code]}</p>
                      </div>
                    )}
                    <div className="bg-[#f1f4f9] p-3 rounded-xl flex justify-between items-center text-xs">
                      <span className="text-[#564337] font-semibold">วงเงินจัดสรรตามกลุ่มที่เลือก:</span>
                      <span className="text-base font-black text-[#e87722] tabular-nums">
                        ฿{u.amount.toLocaleString()} ({share})
                      </span>
                    </div>
                    <div className="pt-2 border-t border-[#ebeef3] text-xs text-[#79564b] flex justify-between items-center">
                      <span>หัวหน้าส่วนงาน: <strong className="text-[#181c20]">{u.head}</strong></span>
                      <span className="text-[#366847] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        ตรวจสอบแล้ว
                      </span>
                    </div>
                    {expandedDept === u.code && (
                      <div className="pt-3 mt-1 border-t border-[#ebeef3] animate-in slide-in-from-top-2 duration-200">
                        <h5 className="text-[11px] font-bold text-[#564337] mb-2 px-1">
                          รายการโครงการที่ขออนุมัติ ({deptPrjs.length} โครงการ):
                        </h5>
                        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#e5e8ee transparent' }}>
                          {deptPrjs.map(p => (
                            <div
                              key={p.id}
                              onClick={() => onOpenProjectModal && onOpenProjectModal(p)}
                              className="bg-[#f9fafc] rounded-lg p-2.5 border border-[#e5e8ee] cursor-pointer hover:border-[#e87722] hover:shadow-sm transition-all"
                            >
                              <div className="flex justify-between items-start gap-2 mb-1">
                                <span className="font-bold text-[#181c20] text-xs leading-tight">{p.title}</span>
                                <span className="text-[10px] font-mono text-[#79564b] bg-white px-1.5 py-0.5 rounded border border-[#e5e8ee] shrink-0">
                                  {p.code}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="text-[#79564b] truncate">{p.head}</span>
                                <span className="font-bold text-[#e87722]">฿{p.allocated.toLocaleString()}</span>
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
              <div className="bg-white p-5 rounded-2xl border-l-4 border-l-[#e87722] border border-[#ddc1b2]/30 space-y-2">
                <strong className="block font-bold text-sm text-[#181c20]">
                  1. เงื่อนไขการเบิกจ่ายงวดแรก (40%)
                </strong>
                <p className="text-[#564337] leading-relaxed">
                  อนุมัติให้ปล่อยงบประมาณงวดแรกในอัตรา 40% ของวงเงินจัดสรรทันทีหลังคณบดีลงนามอนุมัติ
                  เพื่อให้สาขาวิชาตั้งต้นจัดซื้อจัดจ้างได้ทันทีโดยไม่ติดขัด
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border-l-4 border-l-[#366847] border border-[#ddc1b2]/30 space-y-2">
                <strong className="block font-bold text-sm text-[#181c20]">
                  2. เกณฑ์การปรับเกลี่ยงบประมาณ
                </strong>
                <p className="text-[#564337] leading-relaxed">
                  อนุญาตให้หัวหน้าภาควิชาปรับเกลี่ยงบข้ามหมวดภายในหน่วยงานได้ไม่เกิน ฿200,000 ต่อปีงบประมาณ
                  โดยแจ้งฝ่ายการคลังเพื่อบันทึกประวัติเข้าระบบ
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border-l-4 border-l-[#79564b] border border-[#ddc1b2]/30 space-y-2">
                <strong className="block font-bold text-sm text-[#181c20]">
                  3. ระยะเวลาการส่งรายงานผล
                </strong>
                <p className="text-[#564337] leading-relaxed">
                  จัดส่งเอกสารรายงานความก้าวหน้าทุกสิ้นไตรมาสภายใน 15 วันทำการ
                  หากล่าช้าเกิน 30 วัน ระบบจะระงับการเบิกจ่ายงวดถัดไปชั่วคราว
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border-l-4 border-l-[#994700] border border-[#ddc1b2]/30 space-y-2">
                <strong className="block font-bold text-sm text-[#181c20]">
                  4. กองทุนสำรองฉุกเฉินคณะ (฿3.5M)
                </strong>
                <p className="text-[#564337] leading-relaxed">
                  การกันงบสำรองคลังกลาง มีวัตถุประสงค์เพื่อรองรับกรณีฉุกเฉิน
                  และทุนสนับสนุนโครงการเร่งด่วนของมหาวิทยาลัย
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar - Hidden on conditions tab as requested */}
        {activeTab !== 'conditions' && (
          <div className="px-6 py-4 bg-white border-t border-[#e5e8ee] flex flex-col sm:flex-row items-center justify-between gap-3 rounded-b-2xl">
            <div className="flex items-center gap-2 text-xs text-[#79564b]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#366847] animate-pulse"></span>
              <span>บันทึกความปลอดภัย CMU SSO &amp; 2FA (เข้ารหัส 256-bit)</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onOpenEditModal}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#564337] bg-[#ebeef3] hover:bg-[#e0e3e8] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                ขอแก้ไขแผน
              </button>
              <button
                onClick={handleSignAllocation}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer ${isAllProcessed ? 'bg-[#366847] hover:bg-[#2b5338]' : 'bg-[#e87722] hover:bg-[#cc681d]'
                  }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isAllProcessed ? 'verified' : 'checklist'}
                </span>
                <span>
                  {isAllProcessed ? 'ลงนามประกาศใช้แผนงบประมาณ' : `อนุมัติส่วนที่เหลือทั้งหมด (${pendingCount})`}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {rejectingDept && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#181c20]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e5e8ee] bg-[#fff0f1] flex justify-between items-center">
              <div className="flex items-center gap-2 text-[#8c000b]">
                <span className="material-symbols-outlined text-[20px]">edit_note</span>
                <h3 className="font-extrabold text-sm">ระบุเหตุผลการตีกลับแผน</h3>
              </div>
              <button onClick={() => setRejectingDept(null)} className="text-[#8c000b] hover:bg-[#fbd0d4] p-1 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-[#79564b] mb-1">ส่วนงานที่ส่งกลับ:</p>
                <p className="font-bold text-sm text-[#181c20]">{rejectingDept.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#564337]">ข้อเสนอแนะ / สิ่งที่ต้องแก้ไข</label>
                <textarea
                  value={currentReason}
                  onChange={(e) => setCurrentReason(e.target.value)}
                  placeholder="เช่น โปรดปรับลดงบประมาณหมวดค่าวัสดุลง 10% หรือ ชี้แจงความจำเป็นของโครงการที่ 3 เพิ่มเติม..."
                  className="w-full h-32 p-3 rounded-xl border border-[#ddc1b2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#e87722]/50 focus:border-[#e87722] resize-none"
                  autoFocus
                ></textarea>
              </div>
            </div>
            <div className="px-6 py-4 bg-[#f9fafc] border-t border-[#e5e8ee] flex justify-end gap-3">
              <button
                onClick={() => setRejectingDept(null)}
                className="px-4 py-2 text-sm font-bold text-[#564337] hover:bg-[#ebeef3] rounded-xl transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={submitReject}
                className="px-5 py-2 text-sm font-bold text-white bg-[#8c000b] hover:bg-[#6b0008] rounded-xl transition-colors shadow-sm"
              >
                ยืนยันการตีกลับ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
