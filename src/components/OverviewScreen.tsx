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
  pendingCount?: number;
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
  pendingCount = 5,
  onToggleApprovePending,
  onExportReport,
}: OverviewScreenProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiExpanded, setIsAiExpanded] = useState(false);

  const handleAiSubmit = (customQuery?: string) => {
    const q = (customQuery !== undefined ? customQuery : aiQuery).trim();
    if (!q) return;

    const lowerQ = q.toLowerCase();

    if (lowerQ.includes('2569') || lowerQ.includes('ดิจิทัลเกม') || lowerQ.includes('ดูงาน')) {
      setAiResponse('รายงานโครงการ 2569-DG-P1-001: ศึกษาดูงานนักศึกษาดิจิทัลเกม ปี 3 (ปีการศึกษา 2568) วงเงิน ฿386,000 ได้รับการอนุมัติผ่านระบบ CMU ERP เรียบร้อย มีลายเซ็นอนุมัติครบ 4 ลำดับขั้น รหัสบัญชี Fund3D: 0201001 Act3D: 690101010000022 ID3D: 69222D532C00120');
    } else if (lowerQ.includes('ค้างท่อ') || lowerQ.includes('ผิดปกติ') || lowerQ.includes('ล่าช้า') || lowerQ.includes('เร่งรัด')) {
      setAiResponse('ผลการสแกนความผิดปกติงบประมาณ: พบ 3 รายการที่มีการเบิกจ่ายล่าช้ากว่ากำหนดเฉลี่ย 15 วันในหมวดจัดซื้อครุภัณฑ์ Lab โดยระบบแนะนำให้ปรับเกลี่ยคืนงบกลาง ฿840,000');
    } else if (lowerQ.includes('ซ้ำซ้อน') || lowerQ.includes('ปิดโครงการ') || lowerQ.includes('ร่างสรุป')) {
      setAiResponse('ไม่พบคำขอตั้งงบซ้ำซ้อนในระบบ CMU ERP ประจำปี 2569 และมี 21 โครงการที่พร้อมจัดทำร่างปิดโครงการและสรุปผลตามมาตรฐาน EdPEx');
    } else if (lowerQ.includes('scenario') || lowerQ.includes('จำลอง') || lowerQ.includes('แนวทาง')) {
      setAiResponse('ผลการจำลอง AI Scenario: หากเร่งรัดการเบิกจ่ายโครงการในไตรมาส 3 ให้บรรลุ 75% คาดว่างบคงเหลือสุทธิสิ้นปีจะอยู่ที่ ฿1.15 ล้านบาท (9.6%) แนะนำให้เตรียมปรับเกลี่ยเข้าสู่งบกลางเพื่อรองรับโครงการพัฒนาระบบ AI ในปีงบประมาณถัดไป');
    } else if (lowerQ.includes('งบกลาง') || lowerQ.includes('สำรอง') || lowerQ.includes('คงเหลือ')) {
      setAiResponse(`สถานะงบกลางคงเหลือแบบเรียลไทม์อยู่ที่ ${(centralReserve / 1000000).toFixed(2)} ล้านบาท (${((centralReserve / totalAllocated) * 100).toFixed(1)}%) ภาพรวมการเบิกจ่ายจริงของวิทยาลัยสะสมอยู่ที่ ${activeSpentPct}% (฿${(activeSpent / 1000000).toFixed(2)}M จากกรอบ ฿${(activeAllocated / 1000000).toFixed(1)}M)`);
    } else if (lowerQ.includes('สรุป') || lowerQ.includes('ผู้บริหาร') || lowerQ.includes('ภาพรวม')) {
      setAiResponse(`สรุปภาพรวมผู้บริหาร: สถานะงบกลางคงเหลือแบบเรียลไทม์อยู่ที่ ${(centralReserve / 1000000).toFixed(2)} ล้านบาท (${((centralReserve / totalAllocated) * 100).toFixed(1)}%) ภาพรวมการเบิกจ่ายจริงของวิทยาลัยสะสมอยู่ที่ ${activeSpentPct}% (฿${(activeSpent / 1000000).toFixed(2)}M จากกรอบ ฿${(activeAllocated / 1000000).toFixed(1)}M) กลุ่มที่เบิกจ่ายสูงสุดคือ "พัฒนาวิชาการและหลักสูตร" (62.4%) และกลุ่มที่ต้องเร่งรัดคือ "บริการวิชาการ" (54.1%)`);
    } else {
      setAiResponse(`ประมวลผลข้อมูลสำหรับ: "${q}" - จากฐานข้อมูล CMU ERP พบว่าการเบิกจ่ายรวมของวิทยาลัยอยู่ที่ 92.4% มีประสิทธิภาพอยู่ในเกณฑ์ EdPEx ยอดเยี่ยม`);
    }
  };

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
  const activeSpentPct = projectsAllocated > 0 ? ((activeSpent / projectsAllocated) * 100).toFixed(1) : '0';



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
      <section className="sticky top-20 z-30 bg-[#f7f9ff]/95 backdrop-blur-md py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-[#ddc1b2]/40 shadow-xs flex flex-col xl:flex-row xl:items-end justify-between gap-4 transition-all">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#366847]/10 text-[#366847] text-xs font-bold whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#366847]"></span>
              กำลังแสดง: {quarterLabels[selectedQuarter]}
            </span>
            <span className="text-xs text-[#79564b] flex items-center gap-1 whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              ข้อมูลอัปเดต: วันนี้ 09:30 น.
            </span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#181c20] tracking-tight">
            ภาพรวมงบประมาณผู้บริหาร
          </h1>
          <p className="text-xs sm:text-sm text-[#564337]">
            วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มหาวิทยาลัยเชียงใหม่ • ปีงบประมาณ 2569 (CAMT CMU Fiscal Dashboard)
          </p>
        </div>

        {/* Quarter Filter & Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 flex-wrap">
          {/* Segmented Fiscal Quarter Control */}
          <div className="inline-flex p-1 bg-[#ebeef3] rounded-xl shadow-xs text-xs font-bold overflow-x-auto max-w-full">
            {(['all', 'q1', 'q2', 'q3', 'q4'] as const).map((q) => {
              const label =
                q === 'all'
                  ? 'ทุกไตรมาส'
                  : q === 'q1'
                    ? 'ไตรมาส 1'
                    : q === 'q2'
                      ? 'ไตรมาส 2'
                      : q === 'q3'
                        ? 'ไตรมาส 3'
                        : 'ไตรมาส 4';
              const isActive = selectedQuarter === q;
              return (
                <button
                  key={q}
                  onClick={() => onChangeQuarter(q)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center whitespace-nowrap gap-1 ${isActive
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

          <button
            onClick={() => onExportReport && onExportReport()}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-white text-[#181c20] text-xs font-bold shadow-xs hover:bg-[#ebeef3] transition-colors border border-[#ddc1b2]/40 cursor-pointer whitespace-nowrap"
            data-tooltip="ดูข้อมูลก่อนส่งออกและพิมพ์รายงาน PDF"
          >
            <span className="material-symbols-outlined text-[18px] text-[#79564b]">download</span>
            <span>ส่งออกรายงาน</span>
          </button>
        </div>
      </section>

      {/* AI Assistant (Collapsible - Same as ReportsScreen) */}
      <div className="bg-white rounded-xl p-3 shadow-xs border border-[#e87722]/30 flex flex-col gap-2 transition-all">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsAiExpanded(!isAiExpanded)}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#fff5ef] border border-[#ffdbc8] flex items-center justify-center text-[#e87722] shadow-xs">
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            </div>
            <div>
              <span className="font-bold text-xs sm:text-sm text-[#181c20] group-hover:text-[#e87722] transition-colors">
                ผู้ช่วย AI ประมวลผลและถาม-ตอบข้อมูล
              </span>
              <span className="hidden sm:inline-block text-[11px] text-[#79564b] ml-2">
                ({isAiExpanded ? 'คลิกเพื่อย่อหน้าต่าง' : 'คลิกเพื่อเปิดถามข้อมูล หรือใช้ปุ่มคำสั่งด่วน'})
              </span>
            </div>
          </button>
          <div className="flex items-center gap-2">
            {!isAiExpanded && (
              <button
                onClick={() => setIsAiExpanded(true)}
                className="text-[11px] font-bold text-[#e87722] bg-[#fff5ef] px-2.5 py-1 rounded-lg border border-[#ffdbc8] hover:bg-[#ffdbc8] transition-colors cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">chat</span>
                พิมพ์ถาม AI
              </button>
            )}
            <button
              onClick={() => setIsAiExpanded(!isAiExpanded)}
              className="p-1 rounded-lg text-[#79564b] hover:bg-[#ebeef3] transition-colors cursor-pointer"
              data-tooltip={isAiExpanded ? 'ย่อหน้าต่าง AI' : 'ขยายหน้าต่าง AI'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isAiExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
              </span>
            </button>
          </div>
        </div>

        {/* Expanded AI Panel */}
        {isAiExpanded && (
          <div className="pt-2 border-t border-[#e5e8ee] space-y-3 animate-in fade-in duration-150">
            <div className="flex gap-2">
              <input
                id="dashboard-ai-input"
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAiSubmit();
                  }
                }}
                placeholder="พิมพ์ถามข้อมูลรายงาน เช่น วิเคราะห์งบโครงการ 2569-DG-P1-001 หรือ สรุป 3 หน่วยงานที่เบิกจ่ายสูงสุด..."
                className="flex-1 bg-[#f1f4f9] rounded-xl px-4 py-2 text-xs text-[#181c20] focus:outline-none focus:ring-2 focus:ring-[#e87722]/50 border border-transparent focus:border-[#e87722]"
              />
              <button
                id="dashboard-ai-submit-btn"
                type="button"
                onClick={() => handleAiSubmit()}
                className="bg-[#e87722] hover:bg-[#994700] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                ถาม
              </button>
            </div>

            {aiResponse && (
              <div className="p-3 bg-[#FFF7F0] border border-[#ffdbc8] rounded-xl text-xs text-[#743400] flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#e87722] mt-0.5">auto_awesome</span>
                  <p className="leading-relaxed font-medium">{aiResponse}</p>
                </div>
                <button
                  onClick={() => setAiResponse(null)}
                  className="text-[#994700] hover:text-black p-0.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] text-[#79564b] font-semibold">ปุ่มควิกแอคชัน:</span>
              <button
                onClick={() => {
                  setAiQuery('วิเคราะห์งบประมาณโครงการ 2569-DG-P1-001 (ศึกษาดูงานดิจิทัลเกม)');
                  handleAiSubmit('วิเคราะห์งบประมาณโครงการ 2569-DG-P1-001');
                }}
                className="text-[10px] px-2.5 py-1.5 bg-[#FFF7F0] text-[#e87722] border border-[#ffdbc8] rounded-full hover:bg-[#ffdbc8] transition-colors cursor-pointer flex items-center gap-1 font-bold"
              >
                <span className="material-symbols-outlined text-[12px]">menu_book</span>
                วิเคราะห์งบดูงานดิจิทัลเกม 2569-DG-P1-001 (฿386,000)
              </button>
              <button
                onClick={() => {
                  setAiQuery('ตรวจจับความผิดปกติงบค้างท่อ');
                  setAiResponse('ผลการสแกนความผิดปกติงบประมาณ: พบ 3 รายการที่มีการเบิกจ่ายล่าช้ากว่ากำหนดเฉลี่ย 15 วันในหมวดจัดซื้อครุภัณฑ์ Lab โดยระบบแนะนำให้ปรับเกลี่ยคืนงบกลาง ฿840,000');
                }}
                className="text-[10px] px-2.5 py-1.5 bg-[#FFF7F0] text-[#e87722] border border-[#ffdbc8] rounded-full hover:bg-[#ffdbc8] transition-colors cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[12px]">search_insights</span>
                ตรวจจับความผิดปกติงบค้างท่อ
              </button>
              <button
                onClick={() => {
                  setAiQuery('ตรวจสอบข้อมูลซ้ำซ้อน & ร่างสรุปปิดโครงการ');
                  setAiResponse('ไม่พบคำขอตั้งงบซ้ำซ้อนในระบบ CMU ERP ประจำปี 2569 และมี 21 โครงการที่พร้อมจัดทำร่างปิดโครงการและสรุปผลตามมาตรฐาน EdPEx');
                }}
                className="text-[10px] px-2.5 py-1.5 bg-[#FFF7F0] text-[#e87722] border border-[#ffdbc8] rounded-full hover:bg-[#ffdbc8] transition-colors cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[12px]">edit_document</span>
                ตรวจสอบข้อมูลซ้ำซ้อน & ร่างสรุปปิดโครงการ
              </button>
              <button
                onClick={() => {
                  setAiQuery('วิเคราะห์จำลองแนวทางบริหารงบ (AI Scenario)');
                  setAiResponse('ผลการจำลอง AI Scenario: หากเร่งรัดการเบิกจ่ายโครงการในไตรมาส 3 ให้บรรลุ 75% คาดว่างบคงเหลือสุทธิสิ้นปีจะอยู่ที่ ฿1.15 ล้านบาท (9.6%) แนะนำให้เตรียมปรับเกลี่ยเข้าสู่งบกลางเพื่อรองรับโครงการพัฒนาระบบ AI ในปีงบประมาณถัดไป');
                }}
                className="text-[10px] px-2.5 py-1.5 bg-[#FFF7F0] text-[#e87722] border border-[#ffdbc8] rounded-full hover:bg-[#ffdbc8] transition-colors cursor-pointer flex items-center gap-1 font-bold"
              >
                <span className="material-symbols-outlined text-[12px]">query_stats</span>
                วิเคราะห์จำลองแนวทางบริหารงบ (AI Scenario)
              </button>
              <button
                onClick={() => {
                  setAiQuery('สรุปภาพรวมผู้บริหาร & สถานะงบกลาง');
                  setAiResponse(`สรุปภาพรวมผู้บริหาร: สถานะงบกลางคงเหลือแบบเรียลไทม์อยู่ที่ ${(centralReserve / 1000000).toFixed(2)} ล้านบาท (${((centralReserve / totalAllocated) * 100).toFixed(1)}%) ภาพรวมการเบิกจ่ายจริงของวิทยาลัยสะสมอยู่ที่ ${activeSpentPct}% (฿${(activeSpent / 1000000).toFixed(2)}M จากกรอบ ฿${(activeAllocated / 1000000).toFixed(1)}M) กลุ่มที่เบิกจ่ายสูงสุดคือ "พัฒนาวิชาการและหลักสูตร" (62.4%) และกลุ่มที่ต้องเร่งรัดคือ "บริการวิชาการ" (54.1%)`);
                }}
                className="text-[10px] px-2.5 py-1.5 bg-[#FFF7F0] text-[#e87722] border border-[#ffdbc8] rounded-full hover:bg-[#ffdbc8] transition-colors cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[12px]">savings</span>
                สรุปภาพรวมผู้บริหาร & สถานะงบกลาง (฿{(centralReserve / 1000000).toFixed(2)}M)
              </button>
            </div>
          </div>
        )}
      </div>

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
              <span>{isAllFilter ? 'ยอดเบิกจ่ายจริงสะสม' : selectedQuarter === 'all' ? 'เบิกจ่ายจริงกลุ่มนี้' : selectedQuarter === 'q4' ? 'เบิกจ่ายจริงใน Q4 (ยังไม่ถึงกำหนด)' : `เบิกจ่ายแล้วใน ${selectedQuarter.toUpperCase()}`}</span>
              <span className="text-[#564337] font-bold">{filteredProjects.length} โครงการ</span>
            </div>
            <div className="text-3xl font-black text-[#181c20] mt-3 tabular-nums">
              {activeSpent.toLocaleString()}{' '}
              <span className="text-sm font-semibold text-[#564337]">บาท</span>
            </div>
            <div className="text-xs text-[#564337] mt-1.5">
              {selectedQuarter === 'q4' ? 'ยังไม่มีการเบิกจ่ายจริง (รอเปิดรอบ ก.ค. - ก.ย. 69)' : 'บันทึกใบเสร็จและ PO เรียบร้อย'}
            </div>
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
                {selectedQuarter === 'q4' ? 'Upcoming (ไตรมาส 4)' : selectedQuarter === 'q1' || selectedQuarter === 'q2' ? 'Completed' : 'On Track'}
              </span>
            </div>
            <div className="text-3xl font-black text-[#366847] mt-3 tabular-nums">
              {selectedQuarter === 'q4' ? '0.0%' : `${activeSpentPct}%`}
            </div>
            <div className="w-full bg-[#ebeef3] rounded-full h-3 overflow-hidden mt-3 shadow-inner">
              <div
                className="h-full rounded-full transition-all duration-500 shadow-xs"
                style={{
                  width: `${Math.min(100, Number(selectedQuarter === 'q4' ? 0 : activeSpentPct))}%`,
                  background: 'linear-gradient(90deg, #164e22 0%, #246d33 35%, #2e7d32 75%, #3fa64d 100%)',
                }}
              />
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-[#ebeef3] text-xs flex justify-between text-[#79564b]">
            <span>เป้าหมายงวด</span>
            <span className="text-[#366847] font-bold">
              {selectedQuarter === 'q4' ? 'แผนเปิดรอบ Q4 (0 บาทจริง)' : selectedQuarter === 'q1' ? '100% สำเร็จ' : selectedQuarter === 'q2' ? '95.2% สำเร็จ' : selectedQuarter === 'q3' ? '+3.5% สูงกว่าเป้า' : 'อยู่ระหว่างดำเนินการ'}
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
                  <div className="font-bold text-xs sm:text-sm text-[#181c20] line-clamp-2 min-h-[38px] flex items-center leading-snug" title={cat.title}>
                    {cat.title}
                  </div>
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
            <BudgetDonutChart 
              categories={categories} 
              projects={quarterProjects} 
              selectedQuarter={selectedQuarter} 
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
            />
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
