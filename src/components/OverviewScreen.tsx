import { useState } from 'react';
import { ProjectItem, StrategicCategory, QuarterType, INITIAL_DEPARTMENTS } from '../data/mockData';
import { DeptBudgetBarChart, BudgetDonutChart, DisbursementTrendChart } from './BudgetCharts';

interface OverviewScreenProps {
  categories: StrategicCategory[];
  projects: ProjectItem[];
  searchQuery: string;
  centralReserve: number;
  totalAllocated: number;
  totalSpent: number;
  selectedQuarter: QuarterType;
  onChangeQuarter: (q: QuarterType) => void;
  onOpenProjectModal: (prj?: ProjectItem) => void;
  onOpenReduceModal: (prj: ProjectItem) => void;
  onOpenCloseModal: (prj: ProjectItem) => void;
  pendingApproved: boolean;
  onToggleApprovePending: () => void;
  onExportReport?: (projects?: ProjectItem[]) => void;
}

export const OverviewScreen = ({
  categories,
  projects,
  searchQuery,
  centralReserve,
  totalAllocated,
  totalSpent,
  selectedQuarter,
  onChangeQuarter,
  onOpenProjectModal,
  onOpenReduceModal,
  onOpenCloseModal,
  pendingApproved,
  onToggleApprovePending,
  onExportReport,
}: OverviewScreenProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  // Filter projects by search, category, and selected quarter
  const quarterProjects = selectedQuarter === 'all'
    ? projects
    : projects.filter(p => p.quarter === selectedQuarter);

  const filteredProjects = quarterProjects.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.dept.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategoryId === 'all' || p.category === selectedCategoryId;

    return matchesSearch && matchesCategory;
  });

  // Calculate active totals directly from projects
  const isAllFilter = selectedQuarter === 'all' && selectedCategoryId === 'all';
  const projectsAllocated = filteredProjects.reduce((s, p) => s + p.allocated, 0);
  const activeAllocated = isAllFilter ? totalAllocated : projectsAllocated;
  const activeSpent = filteredProjects.reduce((s, p) => s + p.spent, 0);
  const activeRemaining = Math.max(0, activeAllocated - activeSpent);
  const activeSpentPct = activeAllocated > 0 ? ((activeSpent / activeAllocated) * 100).toFixed(1) : '0';



  const quarterLabels: Record<QuarterType, string> = {
    all: 'ทุกไตรมาส (ทั้งปีงบประมาณ 2569)',
    q1: 'ไตรมาส 1 (ต.ค. - ธ.ค. 2568)',
    q2: 'ไตรมาส 2 (ม.ค. - มี.ค. 2569)',
    q3: 'ไตรมาส 3 (เม.ย. - มิ.ย. 2569 • ปัจจุบัน)',
    q4: 'ไตรมาส 4 (ก.ค. - ก.ย. 2569)',
  };

  return (
    <div className="space-y-8">
      {/* Title & Quick Actions Row */}
      <section className="sticky top-20 z-30 bg-[#f7f9ff]/95 backdrop-blur-md py-3 -mx-6 px-6 sm:-mx-8 sm:px-8 border-b border-[#ddc1b2]/40 shadow-xs flex flex-col xl:flex-row xl:items-end justify-between gap-4 transition-all">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 whitespace-nowrap">

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#366847]/10 text-[#366847] text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#366847]"></span>
              กำลังแสดง: {quarterLabels[selectedQuarter]}
            </span>
            <span className="text-xs text-[#79564b] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              ข้อมูลอัปเดต: วันนี้ 09:30 น.
            </span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#181c20] tracking-tight whitespace-nowrap">
            ภาพรวมงบประมาณผู้บริหาร
          </h1>
          <p className="text-sm text-[#564337]">
            วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มหาวิทยาลัยเชียงใหม่ • ปีงบประมาณ 2569 (CAMT CMU Fiscal Dashboard)
          </p>
        </div>

        {/* Quarter Filter & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Segmented Fiscal Quarter Control */}
          <div className="inline-flex p-1 bg-[#ebeef3] rounded-xl shadow-xs text-xs font-bold">
            {(['all', 'q1', 'q2', 'q3', 'q4'] as const).map((q) => {
              const label =
                q === 'all'
                  ? 'ทุกไตรมาส'
                  : q === 'q1'
                    ? 'ไตรมาส 1'
                    : q === 'q2'
                      ? 'ไตรมาส 2'
                      : q === 'q3'
                        ? 'ไตรมาส 3 (ใช้งานอยู่)'
                        : 'ไตรมาส 4';
              const isActive = selectedQuarter === q;
              return (
                <button
                  key={q}
                  onClick={() => onChangeQuarter(q)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center whitespace-nowrap gap-1 ${isActive
                    ? 'bg-white text-[#994700] font-extrabold shadow-xs'
                    : 'text-[#564337] hover:text-[#181c20]'
                    }`}
                >
                  <span>{label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#e87722]"></span>}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onExportReport && onExportReport()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#181c20] text-xs font-bold shadow-xs hover:bg-[#ebeef3] transition-colors border border-[#ddc1b2]/40 cursor-pointer whitespace-nowrap"
              title="ดูข้อมูลก่อนส่งออกและพิมพ์รายงาน PDF"
            >
              <span className="material-symbols-outlined text-[18px] text-[#79564b]">download</span>
              ส่งออกรายงาน
            </button>
            <button
              onClick={onToggleApprovePending}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap ${pendingApproved
                ? 'bg-[#366847] text-white hover:bg-[#1d5031]'
                : 'bg-[#e87722] hover:bg-[#994700] text-white'
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              {pendingApproved ? 'อนุมัติเรียบร้อยแล้ว ✓' : 'อนุมัติรายการค้าง (5 รายการ)'}
            </button>
          </div>
        </div>
      </section>

      {/* AI Executive Summary Box */}
      <section className="bg-gradient-to-r from-[#FFF7F0] to-white border border-[#e87722]/30 rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute -top-4 -right-4 p-4 opacity-5">
          <span className="material-symbols-outlined text-[80px] text-[#e87722]">smart_toy</span>
        </div>
        <div className="relative z-10 flex gap-3">
          <div className="mt-1">
            <div className="w-8 h-8 rounded-full bg-[#e87722]/10 flex items-center justify-center text-[#e87722]">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#994700] mb-1">AI ผู้ช่วยสรุปภาพรวมผู้บริหาร</h3>
            <p className="text-xs text-[#564337] leading-relaxed max-w-4xl">
              สถานะงบกลางคงเหลือแบบเรียลไทม์อยู่ที่ <span className="font-bold text-[#181c20]">{(centralReserve / 1000000).toFixed(2)} ล้านบาท</span> ({((centralReserve / totalAllocated) * 100).toFixed(1)}%)
              {selectedCategoryId === 'all' ? (
                <> ภาพรวมการเบิกจ่ายจริงของวิทยาลัยสะสมอยู่ที่ <span className="font-bold text-[#e87722]">{activeSpentPct}%</span> (฿{(activeSpent / 1000000).toFixed(2)}M จากกรอบ ฿{(activeAllocated / 1000000).toFixed(1)}M) กลุ่มที่เบิกจ่ายสูงสุดคือ "พัฒนาวิชาการและหลักสูตร" (62.4%) และกลุ่มที่ต้องเร่งรัดคือ "บริการวิชาการ" (54.1%)</>
              ) : (
                <> ขณะนี้กำลังกรองดูเฉพาะกลุ่ม <span className="font-bold text-[#181c20]">"{categories.find(c => c.id === selectedCategoryId)?.title}"</span> มียอดอนุมัติ ฿{(activeAllocated / 1000000).toFixed(2)}M เบิกจ่ายจริงแล้ว ฿{(activeSpent / 1000000).toFixed(2)}M (<span className="font-bold text-[#366847]">{activeSpentPct}%</span>)</>
              )}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button className="text-[11px] font-bold px-3 py-1.5 bg-white border border-[#ddc1b2] rounded-lg text-[#564337] hover:bg-[#ebeef3] transition-colors flex items-center gap-1 cursor-pointer shadow-xs">
                <span className="material-symbols-outlined text-[14px]">query_stats</span>
                วิเคราะห์จำลองแนวทางบริหารงบ (AI Scenario)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Row 1: KPI Cards (Adapt to selected quarter or annual) */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#ddc1b2]/30 flex flex-col justify-between hover:border-[#e87722] transition-colors">
          <div>
            <div className="flex justify-between items-center text-xs text-[#79564b] uppercase font-bold tracking-wider">
              <span>{isAllFilter ? 'งบอนุมัติรวมทั้งคณะ' : selectedQuarter === 'all' ? 'งบจัดสรรตามกลุ่มยุทธศาสตร์' : `งบจัดสรรเฉพาะ ${selectedQuarter.toUpperCase()}`}</span>
              <span className="text-[#366847] font-bold">อนุมัติสมบูรณ์</span>
            </div>
            <div className="text-3xl font-black text-[#181c20] mt-3 tabular-nums">
              {activeAllocated.toLocaleString()}{' '}
              <span className="text-sm font-semibold text-[#564337]">บาท</span>
            </div>
            <div className="text-xs text-[#564337] mt-1.5">
              {isAllFilter ? '100% กรอบงบประมาณประจำปี 2569 (รวมสำรองกลาง ฿3.45M)' : `ครอบคลุม ${filteredProjects.length} โครงการในมุมมองนี้`}
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-[#ebeef3] text-xs flex justify-between text-[#79564b]">
            <span>{isAllFilter ? 'จัดสรรให้โครงการส่วนงาน' : 'ยอดงบประมาณจัดสรร'}</span>
            <span className="text-[#366847] font-bold">
              {isAllFilter ? `฿${projectsAllocated.toLocaleString()}` : `฿${activeAllocated.toLocaleString()}`}
            </span>
          </div>
        </div>

        {/* KPI 2 (Highlighted Central Reserve) */}
        <div className="bg-[#FFF7F0] rounded-2xl p-6 shadow-sm border-2 border-[#e87722] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-xs text-[#994700] font-bold">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#e87722]">savings</span>
                งบกลางคงเหลือ
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#e87722] text-white text-[11px] font-bold">
                {((centralReserve / totalAllocated) * 100).toFixed(1)}% พิเศษ
              </span>
            </div>
            <div className="text-3xl font-black text-[#994700] mt-3 tabular-nums">
              {centralReserve.toLocaleString()}{' '}
              <span className="text-sm font-semibold text-[#994700]">บาท</span>
            </div>
            <div className="text-xs text-[#564337] mt-1.5">วงเงินสำรองส่วนกลาง (Reserve Fund)</div>
          </div>
          <div className="mt-5 pt-3 border-t border-[#e87722]/30 text-xs flex justify-between text-[#994700] font-bold">
            <span>รองรับคำขอเร่งด่วน</span>
            <span className="flex items-center gap-1 text-[#366847]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#366847]"></span>
              พร้อมอนุมัติทันที
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#ddc1b2]/30 flex flex-col justify-between hover:border-[#e87722] transition-colors">
          <div>
            <div className="flex justify-between items-center text-xs text-[#79564b] uppercase font-bold tracking-wider">
              <span>{isAllFilter ? 'ยอดเบิกจ่ายจริงสะสม' : selectedQuarter === 'all' ? 'เบิกจ่ายจริงกลุ่มนี้' : `เบิกจ่ายแล้วใน ${selectedQuarter.toUpperCase()}`}</span>
              <span className="text-[#564337] font-bold">{filteredProjects.length} โครงการ</span>
            </div>
            <div className="text-3xl font-black text-[#181c20] mt-3 tabular-nums">
              {activeSpent.toLocaleString()}{' '}
              <span className="text-sm font-semibold text-[#564337]">บาท</span>
            </div>
            <div className="text-xs text-[#564337] mt-1.5">บันทึกใบเสร็จและ PO เรียบร้อย</div>
          </div>
          <div className="mt-5 pt-3 border-t border-[#ebeef3] text-xs flex justify-between text-[#79564b]">
            <span>คงเหลือเบิกจ่าย</span>
            <span className="text-[#181c20] font-bold">
              ฿{activeRemaining.toLocaleString()}
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#ddc1b2]/30 flex flex-col justify-between hover:border-[#e87722] transition-colors">
          <div>
            <div className="flex justify-between items-center text-xs text-[#79564b] uppercase font-bold tracking-wider">
              <span>เปอร์เซ็นต์เบิกจ่ายจริงรวม</span>
              <span className="text-[#366847] font-bold">
                {selectedQuarter === 'q1' || selectedQuarter === 'q2' ? 'Completed' : 'On Track'}
              </span>
            </div>
            <div className="text-3xl font-black text-[#366847] mt-3 tabular-nums">
              {activeSpentPct}%
            </div>
            <div className="w-full bg-[#ebeef3] rounded-full h-3 overflow-hidden mt-3 shadow-inner">
              <div
                className="h-full rounded-full transition-all duration-500 shadow-xs"
                style={{
                  width: `${Math.min(100, Number(activeSpentPct))}%`,
                  background: 'linear-gradient(90deg, #164e22 0%, #246d33 35%, #2e7d32 75%, #3fa64d 100%)',
                }}
              />
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-[#ebeef3] text-xs flex justify-between text-[#79564b]">
            <span>เป้าหมายงวด</span>
            <span className="text-[#366847] font-bold">
              {selectedQuarter === 'q1' ? '100% สำเร็จ' : selectedQuarter === 'q2' ? '95.2% สำเร็จ' : selectedQuarter === 'q3' ? '+3.5% สูงกว่าเป้า' : 'อยู่ระหว่างดำเนินการ'}
            </span>
          </div>
        </div>
      </section>

      {/* Strategic Categories Drilldown Cards */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#181c20] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e87722]">account_tree</span>
            5 กลุ่มงบประมาณ (Strategic Budget Categories)
          </h2>
          <div className="flex items-center gap-2">
            {selectedCategoryId !== 'all' && (
              <button
                onClick={() => setSelectedCategoryId('all')}
                className="text-xs text-[#e87722] font-bold hover:underline cursor-pointer"
              >
                แสดงทุกกลุ่ม
              </button>
            )}
            <span className="text-xs text-[#79564b]">คลิกเลือกหมวดเพื่อกรองโครงการด้านล่าง</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            
            // Calculate dynamic values directly from projects active in the selected quarter
            const catProjects = quarterProjects.filter(p => p.category === cat.id);
            const dynamicAllocated = catProjects.reduce((s, p) => s + p.allocated, 0);
            const dynamicSpent = catProjects.reduce((s, p) => s + p.spent, 0);
            const dynamicPct = dynamicAllocated > 0 ? ((dynamicSpent / dynamicAllocated) * 100).toFixed(1) + '%' : '0.0%';

            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategoryId(isSelected ? 'all' : cat.id)}
                className={`p-4 rounded-2xl cursor-pointer transition-all flex flex-col justify-between ${isSelected
                  ? 'bg-white border-2 border-[#e87722] shadow-md ring-2 ring-[#e87722]/20'
                  : 'bg-white border border-[#ddc1b2]/30 hover:border-[#e87722]/40 shadow-xs'
                  }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#366847] bg-[#b8f0c5]/50 px-2 py-0.5 rounded-full">
                        {dynamicPct}
                      </span>
                      <span className="text-[10px] font-bold text-[#79564b] bg-[#ebeef3] px-1.5 py-0.5 rounded-full">
                        {catProjects.length} โครงการ
                      </span>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] bg-[#e87722] text-white px-2 py-0.5 rounded font-bold">
                        เลือกอยู่
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-sm text-[#181c20] line-clamp-1">{cat.title}</div>
                  <div className="text-[11px] text-[#79564b] mb-3 truncate">{cat.en}</div>
                  <div className="text-xs space-y-1.5 pt-1 border-t border-[#ebeef3]">
                    <div className="flex justify-between text-[#564337]">
                      <span>อนุมัติ:</span>
                      <strong className="tabular-nums">{dynamicAllocated.toLocaleString()} บ.</strong>
                    </div>
                    <div className="flex justify-between text-[#366847]">
                      <span>ใช้จริง:</span>
                      <strong className="tabular-nums">{dynamicSpent.toLocaleString()} บ.</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategoryId(isSelected ? 'all' : cat.id);
                  }}
                  className={`mt-3.5 w-full py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${isSelected
                    ? 'bg-[#e87722] text-white'
                    : 'bg-[#ebeef3] text-[#181c20] hover:bg-[#e0e3e8]'
                    }`}
                >
                  {isSelected ? 'กำลังกรองรายการ' : 'กรองโครงการกลุ่มนี้'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      
      {/* Row 2: Visual Charts Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-[#181c20] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e87722]">insights</span>
            กราฟวิเคราะห์ภาพรวมงบประมาณ
          </h2>
          <span className="text-xs text-[#79564b]">Visual Analytics • อัปเดตแบบเรียลไทม์</span>
        </div>

        {/* Trend Line Chart — Full width */}
        <DisbursementTrendChart selectedQuarter={selectedQuarter} selectedCategoryId={selectedCategoryId} />

        {/* Bar + Donut side by side (Aligned to exact same height & bottom border) */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 items-stretch">
          <div className="xl:col-span-3 flex flex-col h-full">
            <DeptBudgetBarChart 
              departments={INITIAL_DEPARTMENTS} 
              projects={filteredProjects} 
              selectedQuarter={selectedQuarter} 
              selectedCategoryId={selectedCategoryId}
            />
          </div>
          <div className="xl:col-span-2 flex flex-col h-full">
            <BudgetDonutChart categories={categories} projects={quarterProjects} selectedQuarter={selectedQuarter} />
          </div>
        </div>
      </section>

      {/* Sub-projects Ledger Table (Shows projects according to selected Quarter & Filters) */}
      <section className="bg-white rounded-2xl shadow-xs border border-[#ddc1b2]/30 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#ebeef3]">
          <div>
            <h3 className="text-base font-bold text-[#181c20] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#e87722]">folder_open</span>
              โครงการย่อยในงบประมาณ ({filteredProjects.length} โครงการ • {quarterLabels[selectedQuarter]})
            </h3>
            <p className="text-xs text-[#564337] mt-0.5">
              ดึงข้อมูลอัตโนมัติจาก CMU ERP พร้อมหลักฐานเบิกจ่ายและเครื่องมือจัดการงบ
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onExportReport && onExportReport(filteredProjects)}
              className="px-3.5 py-1.5 rounded-xl bg-[#e87722] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-[#994700] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">summarize</span>
              สรุปภาพรวมกลุ่มนี้
            </button>
          </div>
        </div>

        {/* Project Card Items */}
        <div className="space-y-3">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-10 bg-[#f8fafc] rounded-xl text-xs text-[#79564b]">
              ไม่พบโครงการตามเงื่อนไขที่เลือกในไตรมาสนี้
            </div>
          ) : (
            filteredProjects.map((prj) => {
              const isClosed = prj.status === 'approved' && prj.allocated === prj.spent;
              return (
                <div
                  key={prj.id}
                  className={`p-4 rounded-xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all ${isClosed
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-[#ddc1b2]/30 hover:border-[#e87722]/50 bg-white hover:bg-[#FFF7F0]/30'
                    }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#181c20]">{prj.title}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#ffdbc8] text-[#743400] text-[11px] font-bold">
                        {prj.code}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold uppercase">
                        {prj.quarter} ({prj.periodLabel})
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${isClosed
                          ? 'bg-[#b8f0c5] text-[#1d5031]'
                          : 'bg-[#b8f0c5]/80 text-[#1d5031]'
                          }`}
                      >
                        {isClosed ? 'ปิดโครงการแล้ว' : 'ERP Synced'}
                      </span>
                    </div>
                    <div className="text-xs text-[#564337] flex flex-wrap gap-x-4 gap-y-1">
                      <span>{prj.dept}</span>
                      <span>หัวหน้า: <strong>{prj.head}</strong></span>
                      <span>
                        งบอนุมัติ: <strong className="tabular-nums">฿{prj.allocated.toLocaleString()}</strong>
                      </span>
                      <span>
                        เบิกจ่ายแล้ว: <strong className="tabular-nums text-[#366847]">฿{prj.spent.toLocaleString()}</strong>
                      </span>
                      <span>
                        คงเหลือ: <strong className="tabular-nums text-[#e87722]">฿{(prj.allocated - prj.spent).toLocaleString()}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-3 pt-1 max-w-sm">
                      <span className="text-[11px] text-[#79564b] whitespace-nowrap">ความคืบหน้า:</span>
                      <div className="w-full bg-[#ebeef3] rounded-full h-2.5 overflow-hidden shadow-inner">
                        <div
                          className="h-full rounded-full transition-all duration-300 shadow-2xs"
                          style={{
                            width: `${prj.completionPct}%`,
                            background: 'linear-gradient(90deg, #164e22 0%, #2e7d32 75%, #3fa64d 100%)',
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-[#366847] tabular-nums">
                        {prj.completionPct}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end lg:self-center">
                    <button
                      onClick={() => onOpenProjectModal(prj)}
                      className="px-3 py-1.5 rounded-xl bg-[#ebeef3] text-xs font-bold text-[#181c20] hover:bg-[#e0e3e8] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#e87722]">visibility</span>
                      ดูข้อมูล
                    </button>

                    <button
                      onClick={() => onOpenReduceModal(prj)}
                      disabled={isClosed || prj.allocated <= prj.spent}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${isClosed || prj.allocated <= prj.spent
                        ? 'opacity-40 border-slate-300 text-slate-400 cursor-not-allowed'
                        : 'border-[#e87722] text-[#e87722] hover:bg-[#ffdbc8]/30'
                        }`}
                    >
                      ปรับลดงบ
                    </button>

                    <button
                      onClick={() => onOpenCloseModal(prj)}
                      disabled={isClosed}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${isClosed
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-[#366847] text-white hover:bg-[#1d5031]'
                        }`}
                    >
                      {isClosed ? 'ปิดแล้ว' : 'ปิดโครงการ'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
