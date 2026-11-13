import { useState } from 'react';
import {
  Download,
  ChevronDown,
  ChevronUp,
  Send,
  X,
  FileSpreadsheet,
} from 'lucide-react';
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
  selectedQuarter,
  onChangeQuarter,
  onOpenProjectModal,
  onOpenReduceModal,
  onOpenCloseModal,
  onExportReport,
}: OverviewScreenProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiExpanded, setIsAiExpanded] = useState(false);

  // Filter projects by search, category, and selected quarter
  const quarterProjects =
    selectedQuarter === 'all'
      ? projects
      : projects.filter((p) => p.quarter === selectedQuarter);

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
  const activeSpentPct =
    projectsAllocated > 0 ? ((activeSpent / projectsAllocated) * 100).toFixed(1) : '0.0';

  const handleAiSubmit = (customQuery?: string) => {
    const q = (customQuery !== undefined ? customQuery : aiQuery).trim();
    if (!q) return;

    const lowerQ = q.toLowerCase();

    if (lowerQ.includes('2569') || lowerQ.includes('ดิจิทัลเกม') || lowerQ.includes('ดูงาน')) {
      setAiResponse(
        'โครงการ 2569-DG-P1-001 (ศึกษาดูงานนักศึกษาดิจิทัลเกม ปี 3) วงเงิน ฿386,000 อนุมัติผ่านระบบ CMU ERP เรียบร้อย รหัสบัญชี Fund3D: 0201001 Act3D: 690101010000022'
      );
    } else if (
      lowerQ.includes('ค้างท่อ') ||
      lowerQ.includes('ผิดปกติ') ||
      lowerQ.includes('ล่าช้า') ||
      lowerQ.includes('เร่งรัด')
    ) {
      setAiResponse(
        'พบ 3 โครงการที่เบิกจ่ายล่าช้ากว่ากำหนดเฉลี่ย 15 วันในหมวดจัดซื้อครุภัณฑ์ปฏิบัติการ แนะนำให้ปรับเกลี่ยคืนงบกลาง ฿840,000'
      );
    } else if (lowerQ.includes('ซ้ำซ้อน') || lowerQ.includes('ปิดโครงการ') || lowerQ.includes('ร่างสรุป')) {
      setAiResponse(
        'ไม่พบคำขอตั้งงบซ้ำซ้อนในระบบ CMU ERP ประจำปี 2569 และมี 21 โครงการที่พร้อมปิดโครงการตามเกณฑ์ EdPEx'
      );
    } else if (lowerQ.includes('scenario') || lowerQ.includes('จำลอง') || lowerQ.includes('แนวทาง')) {
      setAiResponse(
        'การคาดการณ์งบประมาณ: หากเร่งรัดการเบิกจ่ายในไตรมาส 3 ให้ถึง 75% คาดว่างบคงเหลือสุทธิสิ้นปีจะอยู่ที่ ฿1,150,000 (9.6% ของกรอบงบรวม)'
      );
    } else if (
      lowerQ.includes('งบกลาง') ||
      lowerQ.includes('สำรอง') ||
      lowerQ.includes('คงเหลือ') ||
      lowerQ.includes('สรุป') ||
      lowerQ.includes('ผู้บริหาร') ||
      lowerQ.includes('ภาพรวม')
    ) {
      setAiResponse(
        `งบกลางคงเหลือ ฿${centralReserve.toLocaleString()} (${((centralReserve / totalAllocated) * 100).toFixed(1)}% ของงบรวม) ยอดเบิกจ่ายสะสมอยู่ที่ ${activeSpentPct}% (฿${activeSpent.toLocaleString()} จากกรอบ ฿${activeAllocated.toLocaleString()})`
      );
    } else {
      setAiResponse(
        `ผลการค้นหา "${q}" จากฐานข้อมูล CMU ERP: อัตราการเบิกจ่ายสะสมของวิทยาลัยอยู่ในเกณฑ์ตามแผนงาน (${activeSpentPct}%)`
      );
    }
  };

  const quarterLabels: Record<QuarterType, string> = {
    all: 'ทุกไตรมาส (ปีงบประมาณ 2569)',
    q1: 'ไตรมาส 1 (ต.ค. – ธ.ค. 2568)',
    q2: 'ไตรมาส 2 (ม.ค. – มี.ค. 2569)',
    q3: 'ไตรมาส 3 (เม.ย. – มิ.ย. 2569)',
    q4: 'ไตรมาส 4 (ก.ค. – ก.ย. 2569)',
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Controls Row */}
      <section className="sticky top-14 z-30 bg-[#f7f6f2]/95 backdrop-blur-sm py-4 -mx-6 px-6 lg:-mx-8 lg:px-8 border-b border-[#18181b]/8 flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-[#71717a]">
            <span>{quarterLabels[selectedQuarter]}</span>
            <span>•</span>
            <span>อัปเดตล่าสุด วันนี้ 09:30 น.</span>
          </div>
          <h1 className="text-2xl font-medium text-[#18181b] tracking-tight">
            ภาพรวมงบประมาณผู้บริหาร
          </h1>
        </div>

        {/* Quarter Filter & Export Action */}
        <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
          <div className="inline-flex p-1 bg-[#f0eee9] rounded-lg border border-[#18181b]/8 text-xs">
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
                  className={`h-7 px-3 rounded-md transition-colors duration-150 cursor-pointer flex items-center whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-[#18181b] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
                      : 'text-[#52525b] hover:text-[#18181b]'
                  }`}
                >
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onExportReport && onExportReport()}
            className="h-9 px-3.5 rounded-lg bg-white text-[#18181b] text-xs font-medium hover:bg-[#f0eee9] transition-colors duration-150 border border-[#18181b]/10 cursor-pointer flex items-center gap-2 whitespace-nowrap"
            data-tooltip="ส่งออกรายงาน PDF"
          >
            <Download size={15} strokeWidth={1.5} className="text-[#52525b]" />
            <span>ส่งออกรายงาน</span>
          </button>
        </div>
      </section>

      {/* Collapsible Data Query Bar */}
      <div className="bg-white rounded-xl px-4 py-3 border border-[#18181b]/8">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setIsAiExpanded(!isAiExpanded)}
            className="flex items-center gap-2.5 text-left cursor-pointer"
          >
            <span className="px-1.5 py-0.5 rounded bg-[#f0eee9] border border-[#18181b]/10 font-mono text-[11px] text-[#52525b]">
              ERP Query
            </span>
            <span className="font-medium text-xs sm:text-sm text-[#18181b]">
              สอบถามข้อมูลโครงการและงบประมาณด่วน
            </span>
            <span className="hidden sm:inline text-xs text-[#71717a]">
              {isAiExpanded ? 'คลิกเพื่อย่อ' : 'คลิกเพื่อเปิดค้นหาคำตอบจากฐานข้อมูล'}
            </span>
          </button>
          <button
            onClick={() => setIsAiExpanded(!isAiExpanded)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#71717a] hover:bg-[#f0eee9] hover:text-[#18181b] transition-colors duration-150 cursor-pointer"
            aria-label={isAiExpanded ? 'ย่อหน้าต่างค้นหา' : 'ขยายหน้าต่างค้นหา'}
          >
            {isAiExpanded ? (
              <ChevronUp size={16} strokeWidth={1.5} />
            ) : (
              <ChevronDown size={16} strokeWidth={1.5} />
            )}
          </button>
        </div>

        {isAiExpanded && (
          <div className="mt-3 pt-3 border-t border-[#18181b]/8 space-y-3">
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
                placeholder="ระบุรหัสโครงการ เช่น 2569-DG-P1-001 หรือถามสถานะงบกลาง..."
                className="flex-1 h-9 bg-[#f7f6f2] rounded-lg px-3.5 text-xs text-[#18181b] placeholder:text-[#71717a] focus:outline-none border border-[#18181b]/10 focus:border-[#c85a17]"
              />
              <button
                id="dashboard-ai-submit-btn"
                type="button"
                onClick={() => handleAiSubmit()}
                className="h-9 bg-[#18181b] hover:bg-[#27272a] text-white px-4 rounded-lg text-xs font-medium transition-colors duration-150 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Send size={14} strokeWidth={1.5} />
                <span>ค้นหา</span>
              </button>
            </div>

            {aiResponse && (
              <div className="p-3 bg-[#f7f6f2] border border-[#18181b]/10 rounded-lg text-xs text-[#18181b] flex items-start justify-between gap-3">
                <p className="leading-relaxed">{aiResponse}</p>
                <button
                  onClick={() => setAiResponse(null)}
                  className="text-[#71717a] hover:text-[#18181b] p-0.5 cursor-pointer shrink-0"
                >
                  <X size={14} strokeWidth={1.5} />
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-[#71717a]">คำค้นที่ใช้บ่อย:</span>
              {[
                {
                  label: 'โครงการ 2569-DG-P1-001 (฿386,000)',
                  query: 'วิเคราะห์งบประมาณโครงการ 2569-DG-P1-001',
                },
                {
                  label: 'โครงการเบิกจ่ายล่าช้าเกิน 15 วัน',
                  query: 'ตรวจจับความผิดปกติงบค้างท่อ',
                },
                {
                  label: 'รายการพร้อมปิดโครงการ (21 รายการ)',
                  query: 'ตรวจสอบข้อมูลซ้ำซ้อน & ร่างสรุปปิดโครงการ',
                },
                {
                  label: 'สรุปสถานะงบกลางคงเหลือ',
                  query: 'สรุปภาพรวมผู้บริหาร & สถานะงบกลาง',
                },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setAiQuery(item.query);
                    handleAiSubmit(item.query);
                  }}
                  className="text-xs px-2.5 py-1 bg-[#f7f6f2] text-[#52525b] border border-[#18181b]/10 rounded-md hover:bg-[#f0eee9] hover:text-[#18181b] transition-colors duration-150 cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Row 1: 4 Stat Cards — Numbers only, equal height & padding, aligned baselines */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Stat 1: Allocated */}
        <div className="bg-white rounded-xl p-5 border border-[#18181b]/8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center gap-2 text-xs text-[#52525b]">
              <span className="truncate">
                {isAllFilter
                  ? 'งบอนุมัติรวมทั้งคณะ'
                  : selectedQuarter === 'all'
                    ? 'งบจัดสรรตามกลุ่ม'
                    : `งบจัดสรรไตรมาส ${selectedQuarter.replace('q', '')}`}
              </span>
              <span className="font-mono text-[11px] text-[#71717a] shrink-0">FY2569</span>
            </div>
            <div className="text-[28px] leading-none font-medium text-[#18181b] mt-3 tabular-nums">
              ฿{activeAllocated.toLocaleString()}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#18181b]/6 text-xs flex justify-between items-center gap-2 text-[#71717a]">
            <span className="truncate">{isAllFilter ? 'จัดสรรให้ 37 ส่วนงาน' : 'โครงการในมุมมองนี้'}</span>
            <span className="text-[#18181b] font-medium tabular-nums shrink-0">
              {isAllFilter ? `฿${projectsAllocated.toLocaleString()}` : `${filteredProjects.length} โครงการ`}
            </span>
          </div>
        </div>

        {/* Stat 2: Central Reserve */}
        <div className="bg-white rounded-xl p-5 border border-[#18181b]/8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center gap-2 text-xs text-[#52525b]">
              <span className="truncate">งบสำรองส่วนกลาง</span>
              <span className="text-xs text-[#c85a17] font-medium tabular-nums shrink-0">
                {((centralReserve / totalAllocated) * 100).toFixed(1)}% ของงบรวม
              </span>
            </div>
            <div className="text-[28px] leading-none font-medium text-[#c85a17] mt-3 tabular-nums">
              ฿{centralReserve.toLocaleString()}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#18181b]/6 text-xs flex justify-between items-center gap-2 text-[#71717a]">
            <span className="truncate">เทียบเกณฑ์สำรองขั้นต่ำ (25%)</span>
            <span className="text-[#15803d] font-medium tabular-nums shrink-0">+3.8% vs เกณฑ์</span>
          </div>
        </div>

        {/* Stat 3: Actual Spent */}
        <div className="bg-white rounded-xl p-5 border border-[#18181b]/8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center gap-2 text-xs text-[#52525b]">
              <span className="truncate">
                {isAllFilter
                  ? 'เบิกจ่ายจริงสะสม'
                  : selectedQuarter === 'all'
                    ? 'เบิกจ่ายจริงกลุ่มนี้'
                    : `เบิกจ่ายจริงไตรมาส ${selectedQuarter.replace('q', '')}`}
              </span>
              <span className="text-xs text-[#71717a] tabular-nums shrink-0">
                {filteredProjects.length} โครงการ
              </span>
            </div>
            <div className="text-[28px] leading-none font-medium text-[#18181b] mt-3 tabular-nums">
              ฿{activeSpent.toLocaleString()}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#18181b]/6 text-xs flex justify-between items-center gap-2 text-[#71717a]">
            <span className="truncate">คงเหลือเบิกจ่าย</span>
            <span className="text-[#18181b] font-medium tabular-nums shrink-0">
              ฿{activeRemaining.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Stat 4: Disbursement Rate */}
        <div className="bg-white rounded-xl p-5 border border-[#18181b]/8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center gap-2 text-xs text-[#52525b]">
              <span className="truncate">อัตราการเบิกจ่ายจริง</span>
              <span className="text-xs text-[#15803d] font-medium shrink-0">
                {selectedQuarter === 'q4'
                  ? 'รอเปิดรอบ ก.ค. 69'
                  : selectedQuarter === 'q1' || selectedQuarter === 'q2'
                    ? 'ปิดรอบสมบูรณ์'
                    : 'ตามแผนงาน'}
              </span>
            </div>
            <div className="text-[28px] leading-none font-medium text-[#18181b] mt-3 tabular-nums">
              {selectedQuarter === 'q4' ? '0.0%' : `${activeSpentPct}%`}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#18181b]/6 text-xs flex justify-between items-center gap-2 text-[#71717a]">
            <span className="truncate">เทียบเป้าหมายประจำงวด</span>
            <span className="text-[#15803d] font-medium tabular-nums shrink-0">
              {selectedQuarter === 'q4'
                ? 'ยังไม่เริ่มเบิกจ่าย'
                : selectedQuarter === 'q1'
                  ? '100% ตามแผน'
                  : selectedQuarter === 'q2'
                    ? '+2.1% vs เป้าหมาย'
                    : '+3.5% vs เป้าหมาย'}
            </span>
          </div>
        </div>
      </section>

      {/* Strategic Categories Filter Row */}
      <section className="space-y-3">
        <div className="flex justify-between items-baseline">
          <h2 className="text-base font-medium text-[#18181b]">
            5 กลุ่มงบประมาณยุทธศาสตร์
          </h2>
          <div className="flex items-center gap-3">
            {selectedCategoryId !== 'all' && (
              <button
                onClick={() => setSelectedCategoryId('all')}
                className="text-xs text-[#c85a17] font-medium hover:underline cursor-pointer"
              >
                แสดงทุกกลุ่ม
              </button>
            )}
            <span className="text-xs text-[#71717a]">คลิกการ์ดเพื่อกรองข้อมูลด้านล่าง</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const catProjects = quarterProjects.filter((p) => p.category === cat.id);
            const dynamicAllocated = catProjects.reduce((s, p) => s + p.allocated, 0);
            const dynamicSpent = catProjects.reduce((s, p) => s + p.spent, 0);
            const dynamicPct =
              dynamicAllocated > 0
                ? ((dynamicSpent / dynamicAllocated) * 100).toFixed(1) + '%'
                : '0.0%';

            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategoryId(isSelected ? 'all' : cat.id)}
                className={`p-4 rounded-xl cursor-pointer transition-colors duration-150 flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-white border-[#c85a17] ring-1 ring-[#c85a17]'
                    : 'bg-white border-[#18181b]/8 hover:border-[#18181b]/20'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="px-1.5 py-0.5 rounded bg-[#f0eee9] border border-[#18181b]/10 font-mono text-[11px] font-medium text-[#52525b]">
                      {cat.code}
                    </span>
                    <div className="flex items-center gap-2 text-xs tabular-nums">
                      <span className="text-[#71717a]">{catProjects.length} โครงการ</span>
                      <span className="font-mono text-[#15803d] font-medium">{dynamicPct}</span>
                    </div>
                  </div>
                  <div
                    className="font-medium text-sm text-[#18181b] line-clamp-2 min-h-[40px] leading-snug"
                    title={cat.title}
                  >
                    {cat.title}
                  </div>
                  <div className="text-xs text-[#71717a] mt-0.5 truncate">{cat.en}</div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#18181b]/6 text-xs space-y-1">
                  <div className="flex justify-between text-[#52525b]">
                    <span>งบจัดสรร</span>
                    <span className="font-medium text-[#18181b] tabular-nums">
                      ฿{dynamicAllocated.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#52525b]">
                    <span>เบิกจ่ายจริง</span>
                    <span className="font-medium text-[#15803d] tabular-nums">
                      ฿{dynamicSpent.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Visual Analytics Section */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-base font-medium text-[#18181b]">
            การเบิกจ่ายสะสมและสัดส่วนรายหน่วยงาน
          </h2>
          <span className="text-xs text-[#71717a]">ข้อมูลเชื่อมโยงจาก CMU ERP</span>
        </div>

        {/* Main Chart — Full width */}
        <DisbursementTrendChart
          selectedQuarter={selectedQuarter}
          selectedCategoryId={selectedCategoryId}
        />

        {/* Department Ranking + Strategic Breakdown side by side */}
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

      {/* Sub-projects Ledger Table */}
      <section className="bg-white rounded-xl border border-[#18181b]/8 overflow-hidden">
        <div className="p-5 border-b border-[#18181b]/8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-base font-medium text-[#18181b]">
              รายการโครงการย่อย ({filteredProjects.length} โครงการ)
            </h3>
            <p className="text-xs text-[#71717a] mt-0.5">
              {quarterLabels[selectedQuarter]} • แสดงยอดจัดสรร เบิกจ่ายจริง และสถานะโครงการ
            </p>
          </div>
          <button
            onClick={() => onExportReport && onExportReport(filteredProjects)}
            className="h-8 px-3 rounded-lg bg-[#18181b] text-white text-xs font-medium flex items-center gap-1.5 hover:bg-[#27272a] transition-colors duration-150 cursor-pointer"
          >
            <FileSpreadsheet size={14} strokeWidth={1.5} />
            <span>ออกรายงานสรุปกลุ่มนี้</span>
          </button>
        </div>

        <div className="divide-y divide-[#18181b]/6">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#71717a]">
              ไม่พบโครงการตามเงื่อนไขที่เลือกในไตรมาสนี้
            </div>
          ) : (
            filteredProjects.map((prj) => {
              const isClosed = prj.status === 'approved' && prj.allocated === prj.spent;
              return (
                <div
                  key={prj.id}
                  className="p-4 sm:px-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#f7f6f2]/60 transition-colors duration-150"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-1.5 py-0.5 rounded bg-[#f0eee9] border border-[#18181b]/10 font-mono text-[11px] text-[#52525b]">
                        {prj.code}
                      </span>
                      <span className="font-medium text-sm text-[#18181b]">{prj.title}</span>
                      <span className="text-xs text-[#71717a]">
                        • {prj.quarter.toUpperCase()} ({prj.periodLabel})
                      </span>
                      {isClosed && (
                        <span className="text-xs text-[#15803d] font-medium">
                          • ปิดโครงการแล้ว
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-[#52525b] flex flex-wrap gap-x-5 gap-y-1">
                      <span>{prj.dept}</span>
                      <span>ผู้รับผิดชอบ: {prj.head}</span>
                      <span>
                        จัดสรร:{' '}
                        <span className="font-medium text-[#18181b] tabular-nums">
                          ฿{prj.allocated.toLocaleString()}
                        </span>
                      </span>
                      <span>
                        เบิกจ่าย:{' '}
                        <span className="font-medium text-[#15803d] tabular-nums">
                          ฿{prj.spent.toLocaleString()}
                        </span>
                      </span>
                      <span>
                        คงเหลือ:{' '}
                        <span className="font-medium text-[#18181b] tabular-nums">
                          ฿{(prj.allocated - prj.spent).toLocaleString()}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 pt-1 max-w-xs">
                      <div className="w-full bg-[#f0eee9] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#15803d] transition-transform duration-300"
                          style={{ width: `${prj.completionPct}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-[#52525b] tabular-nums w-11 text-right">
                        {prj.completionPct}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                    <button
                      onClick={() => onOpenProjectModal(prj)}
                      className="h-8 px-3 rounded-lg bg-[#f0eee9] text-xs font-medium text-[#18181b] hover:bg-[#e4e2dd] cursor-pointer transition-colors duration-150"
                    >
                      รายละเอียด
                    </button>

                    <button
                      onClick={() => onOpenReduceModal(prj)}
                      disabled={isClosed || prj.allocated <= prj.spent}
                      className={`h-8 px-3 rounded-lg border text-xs font-medium transition-colors duration-150 ${
                        isClosed || prj.allocated <= prj.spent
                          ? 'opacity-40 border-[#18181b]/10 text-[#71717a] cursor-not-allowed'
                          : 'border-[#18181b]/15 text-[#52525b] hover:bg-[#f0eee9] hover:text-[#18181b] cursor-pointer'
                      }`}
                    >
                      ปรับลดงบ
                    </button>

                    <button
                      onClick={() => onOpenCloseModal(prj)}
                      disabled={isClosed}
                      className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors duration-150 ${
                        isClosed
                          ? 'bg-[#f0eee9] text-[#71717a] cursor-not-allowed'
                          : 'bg-[#18181b] text-white hover:bg-[#27272a] cursor-pointer'
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
