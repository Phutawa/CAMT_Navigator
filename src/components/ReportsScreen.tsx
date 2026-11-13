import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Send,
  X,
  Check,
} from 'lucide-react';
import { ProjectItem } from '../data/mockData';

interface ReportsScreenProps {
  onExportReport?: () => void;
  onSignedSuccess: () => void;
  projects?: ProjectItem[];
  onExportProjectReport?: (prj: ProjectItem) => void;
}

export const ReportsScreen = ({
  onSignedSuccess,
}: ReportsScreenProps) => {
  const [activeTab, setActiveTab] = useState<1 | 2>(1);
  const [appliedRecommendations, setAppliedRecommendations] = useState<number[]>([]);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiExpanded, setIsAiExpanded] = useState(false);
  const [benchmarkSegment, setBenchmarkSegment] = useState<
    'academic' | 'research' | 'student' | 'service' | 'support'
  >('student');

  const handleAiSubmit = (customQuery?: string) => {
    const q = customQuery !== undefined ? customQuery : aiQuery;
    if (q.includes('2569') || q.includes('ดิจิทัลเกม') || q.includes('ดูงาน')) {
      setAiResponse(
        'โครงการ 2569-DG-P1-001 (ศึกษาดูงานนักศึกษาดิจิทัลเกม ปี 3) วงเงิน ฿386,000 อนุมัติผ่านระบบ CMU ERP เรียบร้อย รหัสบัญชี Fund3D: 0201001 Act3D: 690101010000022'
      );
    } else {
      setAiResponse(
        `ผลการประมวลผลสำหรับ "${q}" จากฐานข้อมูล CMU ERP: ประสิทธิภาพการใช้งบรวมของวิทยาลัยอยู่ที่ 92.4% สอดคล้องตามเกณฑ์ EdPEx`
      );
    }
  };

  const toggleApplyRec = (index: number) => {
    setAppliedRecommendations((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
    onSignedSuccess();
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="bg-white rounded-xl border border-[#18181b]/8 relative block w-full min-w-0">
        {/* Sticky Header */}
        <div className="sticky top-14 z-30 bg-white rounded-t-xl border-b border-[#18181b]/8 w-full min-w-0">
          <div className="px-6 py-5 border-b border-[#18181b]/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#71717a]">
                <span className="px-1.5 py-0.5 rounded bg-[#f0eee9] border border-[#18181b]/10 font-mono text-[11px] text-[#52525b]">
                  REP-2569
                </span>
                <span>•</span>
                <span className="text-[#15803d] font-medium">EdPEx Verified</span>
                <span>•</span>
                <span>รายงานผลสัมฤทธิ์ระดับนโยบาย</span>
              </div>
              <h1 className="text-2xl font-medium text-[#18181b] tracking-tight">
                รายงานสรุปและสถิติงบประมาณ ประจำปีงบประมาณ 2569
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 bg-[#f7f6f2] flex items-center gap-1 py-2 w-full min-w-0 overflow-x-auto">
            {[
              { id: 1, label: 'สถิติและประสิทธิภาพส่วนงาน (Benchmarks)' },
              { id: 2, label: 'ข้อเสนอแนะเชิงนโยบาย' },
            ].map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`h-8 px-3 rounded-lg text-xs whitespace-nowrap shrink-0 transition-colors duration-150 flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#18181b] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#18181b]/8'
                      : 'text-[#52525b] hover:text-[#18181b] hover:bg-[#18181b]/[0.04]'
                  }`}
                >
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 bg-[#f7f6f2] space-y-6 rounded-b-xl">
          {/* Collapsible Query Bar */}
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
                  สอบถามข้อมูลสถิติและรายงานผลสัมฤทธิ์
                </span>
                <span className="hidden sm:inline text-xs text-[#71717a]">
                  {isAiExpanded ? 'คลิกเพื่อย่อ' : 'คลิกเพื่อเปิดค้นหาคำตอบ'}
                </span>
              </button>
              <button
                onClick={() => setIsAiExpanded(!isAiExpanded)}
                className="w-7 h-7 rounded-md flex items-center justify-center text-[#71717a] hover:bg-[#f0eee9] hover:text-[#18181b] transition-colors duration-150 cursor-pointer"
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
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAiSubmit();
                    }}
                    placeholder="ระบุรหัสโครงการ เช่น 2569-DG-P1-001..."
                    className="flex-1 h-9 bg-[#f7f6f2] rounded-lg px-3.5 text-xs text-[#18181b] placeholder:text-[#71717a] focus:outline-none border border-[#18181b]/10 focus:border-[#c85a17]"
                  />
                  <button
                    onClick={() => handleAiSubmit()}
                    className="h-9 bg-[#18181b] hover:bg-[#27272a] text-white px-4 rounded-lg text-xs font-medium transition-colors duration-150 flex items-center gap-1.5 cursor-pointer"
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
                      className="text-[#71717a] hover:text-[#18181b] p-0.5 cursor-pointer"
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
                      action: () => {
                        setAiQuery('วิเคราะห์งบประมาณโครงการ 2569-DG-P1-001');
                        handleAiSubmit('วิเคราะห์งบประมาณโครงการ 2569-DG-P1-001');
                      },
                    },
                    {
                      label: 'โครงการเบิกจ่ายล่าช้าเกิน 15 วัน',
                      action: () => {
                        setAiQuery('ตรวจจับความผิดปกติงบค้างท่อ');
                        setAiResponse(
                          'พบ 3 โครงการที่มีการเบิกจ่ายล่าช้ากว่ากำหนดเฉลี่ย 15 วันในหมวดจัดซื้อครุภัณฑ์ปฏิบัติการ แนะนำให้ปรับเกลี่ยคืนงบกลาง ฿840,000'
                        );
                      },
                    },
                    {
                      label: 'รายการพร้อมปิดโครงการ (21 รายการ)',
                      action: () => {
                        setAiQuery('ตรวจสอบข้อมูลซ้ำซ้อน & ร่างสรุปปิดโครงการ');
                        setAiResponse(
                          'ไม่พบคำขอตั้งงบซ้ำซ้อนในระบบ CMU ERP ประจำปี 2569 และมี 21 โครงการที่พร้อมปิดโครงการตามมาตรฐาน EdPEx'
                        );
                      },
                    },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      onClick={btn.action}
                      className="text-xs px-2.5 py-1 bg-[#f7f6f2] text-[#52525b] border border-[#18181b]/10 rounded-md hover:bg-[#f0eee9] hover:text-[#18181b] transition-colors duration-150 cursor-pointer"
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {activeTab === 1 && (
            <div className="space-y-6">
              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-[#18181b]/8">
                  <span className="text-xs text-[#52525b]">ประสิทธิภาพการใช้งบประมาณ</span>
                  <div className="text-[28px] leading-none font-medium text-[#18181b] mt-3 tabular-nums">
                    92.4%
                  </div>
                  <div className="text-xs text-[#15803d] mt-3 pt-2.5 border-t border-[#18181b]/6 tabular-nums">
                    +4.1% เทียบเป้าหมาย EdPEx
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#18181b]/8">
                  <span className="text-xs text-[#52525b]">ดัชนีความคุ้มค่าโครงการ</span>
                  <div className="text-[28px] leading-none font-medium text-[#c85a17] mt-3 tabular-nums">
                    4.65 <span className="text-sm font-normal text-[#71717a]">/ 5.00</span>
                  </div>
                  <div className="text-xs text-[#71717a] mt-3 pt-2.5 border-t border-[#18181b]/6">
                    ครอบคลุม 186 โครงการ (37 ส่วนงาน)
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#18181b]/8">
                  <span className="text-xs text-[#52525b]">ประหยัดต้นทุนและเกลี่ยคืน</span>
                  <div className="text-[28px] leading-none font-medium text-[#18181b] mt-3 tabular-nums">
                    ฿840,000
                  </div>
                  <div className="text-xs text-[#71717a] mt-3 pt-2.5 border-t border-[#18181b]/6">
                    จากการจัดซื้อรวมศูนย์ของคณะ
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#18181b]/8">
                  <span className="text-xs text-[#52525b]">บรรลุเป้าหมายตามกำหนด</span>
                  <div className="text-[28px] leading-none font-medium text-[#15803d] mt-3 tabular-nums">
                    165 / 186
                  </div>
                  <div className="text-xs text-[#71717a] mt-3 pt-2.5 border-t border-[#18181b]/6 tabular-nums">
                    88.7% สำเร็จตามไทม์ไลน์
                  </div>
                </div>
              </div>

              {/* 5 Strategic Alignment Cards */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <h3 className="text-base font-medium text-[#18181b]">
                      การวิเคราะห์ผลลัพธ์ราย 5 กลุ่มยุทธศาสตร์ (EdPEx หมวด 2)
                    </h3>
                    <p className="text-xs text-[#71717a] mt-0.5">
                      คลิกเลือกกลุ่มยุทธศาสตร์เพื่อกรองตารางเปรียบเทียบด้านล่าง
                    </p>
                  </div>
                  <span className="text-xs text-[#15803d] font-medium">
                    สอดคล้องแผนยุทธศาสตร์ 100%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {[
                    {
                      id: 'student' as const,
                      code: 'SO-1',
                      title: 'พัฒนาศักยภาพนักศึกษา',
                      budget: '฿1,650,000',
                      spent: '฿1,120,000',
                      disbPct: '67.9%',
                      kpiScore: '94%',
                      scope: 'นศ. มีส่วนร่วม 94.2%',
                    },
                    {
                      id: 'academic' as const,
                      code: 'SO-2',
                      title: 'ยกระดับวิชาการและหลักสูตร',
                      budget: '฿2,450,000',
                      spent: '฿1,720,000',
                      disbPct: '70.2%',
                      kpiScore: '92%',
                      scope: '14 หลักสูตร (ตรี/โท/เอก)',
                    },
                    {
                      id: 'research' as const,
                      code: 'SO-3',
                      title: 'ขับเคลื่อนงานวิจัยแนวหน้า',
                      budget: '฿1,680,000',
                      spent: '฿1,150,000',
                      disbPct: '68.5%',
                      kpiScore: '89%',
                      scope: '2 ศูนย์นวัตกรรม / 8 ทุน',
                    },
                    {
                      id: 'service' as const,
                      code: 'SO-4',
                      title: 'บริการวิชาการสู่สังคม',
                      budget: '฿1,220,000',
                      spent: '฿780,000',
                      disbPct: '63.9%',
                      kpiScore: '88%',
                      scope: 'Lifelong Learning / SME',
                    },
                    {
                      id: 'support' as const,
                      code: 'SO-5',
                      title: 'บริหารองค์กรอัจฉริยะ',
                      budget: '฿1,550,000',
                      spent: '฿1,050,000',
                      disbPct: '67.7%',
                      kpiScore: '95%',
                      scope: 'SLA ดำเนินงาน 98.2%',
                    },
                  ].map((card) => {
                    const isSelected = benchmarkSegment === card.id;
                    return (
                      <button
                        key={card.id}
                        onClick={() => setBenchmarkSegment(card.id)}
                        className={`text-left p-4 rounded-xl bg-white border transition-colors duration-150 cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#c85a17] ring-1 ring-[#c85a17]'
                            : 'border-[#18181b]/8 hover:border-[#18181b]/20'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="px-1.5 py-0.5 rounded bg-[#f0eee9] border border-[#18181b]/10 font-mono text-[11px] font-medium text-[#52525b]">
                              {card.code}
                            </span>
                            <span className="font-mono text-xs text-[#15803d] font-medium tabular-nums">
                              KPI {card.kpiScore}
                            </span>
                          </div>

                          <h4
                            className="text-sm font-medium text-[#18181b] leading-snug min-h-[38px] line-clamp-2"
                            title={card.title}
                          >
                            {card.title}
                          </h4>

                          <div className="mt-3 space-y-1.5">
                            <div className="flex justify-between text-xs text-[#52525b]">
                              <span>เบิกจ่าย</span>
                              <span className="font-mono font-medium text-[#18181b] tabular-nums">
                                {card.spent}
                              </span>
                            </div>
                            <div className="w-full bg-[#e4e2dd] h-1.5 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-[#15803d]"
                                style={{ width: card.disbPct }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-[#71717a] tabular-nums">
                              <span>กรอบ {card.budget}</span>
                              <span className="font-mono text-[#18181b]">{card.disbPct}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-[#18181b]/6 text-xs text-[#71717a] truncate">
                          {card.scope}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Benchmarks Table */}
              <div className="bg-white rounded-xl border border-[#18181b]/8 overflow-hidden">
                <div className="p-5 border-b border-[#18181b]/8 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-medium text-[#18181b]">
                      ตารางเปรียบเทียบประสิทธิภาพรายกลุ่มภารกิจ (Benchmarks)
                    </h3>
                    <p className="text-xs text-[#71717a] mt-0.5">
                      {benchmarkSegment === 'academic' &&
                        'สายวิชาการ (SO-2 • EdPEx 7.1): วัดผ่านต้นทุนต่อหัวนักศึกษาและผลสัมฤทธิ์หลักสูตร'}
                      {benchmarkSegment === 'research' &&
                        'สายวิจัยและนวัตกรรม (SO-3 • EdPEx 7.2): วัดผ่านงบเฉลี่ยต่อโครงการและการนำไปใช้จริง'}
                      {benchmarkSegment === 'student' &&
                        'พัฒนานักศึกษา (SO-1 • EdPEx 7.3): วัดผ่านอัตราการมีส่วนร่วมและสมรรถนะสากล'}
                      {benchmarkSegment === 'service' &&
                        'บริการวิชาการ (SO-4 • EdPEx 7.4): วัดผ่านจำนวนผู้รับบริการและความพึงพอใจชุมชน'}
                      {benchmarkSegment === 'support' &&
                        'สายสนับสนุน (SO-5 • EdPEx 7.5): วัดผ่านการดำเนินงานตาม SLA และความพึงพอใจผู้ใช้บริการ'}
                    </p>
                  </div>

                  <div className="inline-flex p-1 bg-[#f0eee9] rounded-lg border border-[#18181b]/8 overflow-x-auto max-w-full">
                    {[
                      { id: 'student' as const, label: 'SO-1 พัฒนานักศึกษา' },
                      { id: 'academic' as const, label: 'SO-2 วิชาการ' },
                      { id: 'research' as const, label: 'SO-3 วิจัย' },
                      { id: 'service' as const, label: 'SO-4 บริการวิชาการ' },
                      { id: 'support' as const, label: 'SO-5 สนับสนุน' },
                    ].map((seg) => (
                      <button
                        key={seg.id}
                        onClick={() => setBenchmarkSegment(seg.id)}
                        className={`h-7 px-2.5 rounded-md text-xs whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
                          benchmarkSegment === seg.id
                            ? 'bg-white text-[#18181b] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
                            : 'text-[#52525b] hover:text-[#18181b]'
                        }`}
                      >
                        {seg.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#f7f6f2] text-[#71717a] border-b border-[#18181b]/8">
                        <th className="py-3 px-4 font-medium">ส่วนงาน / หน่วยงาน</th>
                        <th className="py-3 px-3 text-right font-medium">งบประมาณจัดสรร</th>
                        <th className="py-3 px-4 text-right font-medium">อัตราเบิกจ่ายจริง</th>
                        <th className="py-3 px-3 text-right font-medium">
                          {benchmarkSegment === 'academic' && 'ต้นทุนต่อหัวนักศึกษา'}
                          {benchmarkSegment === 'research' && 'งบเฉลี่ยต่อโครงการ'}
                          {benchmarkSegment === 'student' && 'การมีส่วนร่วม นศ.'}
                          {benchmarkSegment === 'service' && 'ผู้รับบริการ/อบรม'}
                          {benchmarkSegment === 'support' && 'การดำเนินงานตาม SLA'}
                        </th>
                        <th className="py-3 px-3 text-right font-medium">คะแนนประเมิน</th>
                        <th className="py-3 px-4 font-medium">ผลลัพธ์สำคัญ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#18181b]/6">
                      {(benchmarkSegment === 'academic'
                        ? [
                            {
                              dept: 'วิศวกรรมซอฟต์แวร์ (SE - International)',
                              bud: '฿480,000',
                              pct: '88.0%',
                              metric: '฿14,200 / คน',
                              score: '4.82 / 5.0',
                              badge: 'ผลงานเด่น EdPEx',
                            },
                            {
                              dept: 'บูรณาการอุตสาหกรรมดิจิทัล (DII)',
                              bud: '฿380,000',
                              pct: '86.4%',
                              metric: '฿15,100 / คน',
                              score: '4.70 / 5.0',
                              badge: 'บัณฑิตตรงสายงาน 95%',
                            },
                            {
                              dept: 'บัณฑิตศึกษา ป.โท/ป.เอก (DTM & KMI)',
                              bud: '฿320,000',
                              pct: '86.8%',
                              metric: '฿18,200 / คน',
                              score: '4.75 / 5.0',
                              badge: 'ตีพิมพ์สากล Scopus',
                            },
                            {
                              dept: 'แอนิเมชันและวิชวลเอฟเฟกต์ (ANIM)',
                              bud: '฿350,000',
                              pct: '84.2%',
                              metric: '฿16,800 / คน',
                              score: '4.60 / 5.0',
                              badge: 'รางวัลนวัตกรรมระดับชาติ',
                            },
                            {
                              dept: 'การจัดการความรู้และนวัตกรรม (MMIT)',
                              bud: '฿280,000',
                              pct: '81.5%',
                              metric: '฿13,500 / คน',
                              score: '4.55 / 5.0',
                              badge: 'ต้นทุนต่อหัวประหยัดสุด',
                            },
                          ]
                        : benchmarkSegment === 'research'
                          ? [
                              {
                                dept: 'ศูนย์เทคโนโลยีและนวัตกรรมดิจิทัล (DITC)',
                                bud: '฿420,000',
                                pct: '84.0%',
                                metric: '฿178,500 / โครงการ',
                                score: '4.80 / 5.0',
                                badge: 'ถ่ายทอดเทคโนโลยีเอกชน 100%',
                              },
                              {
                                dept: 'ห้องปฏิบัติการวิจัยดิจิทัลและ AI Research Lab',
                                bud: '฿360,000',
                                pct: '82.0%',
                                metric: '฿162,500 / โครงการ',
                                score: '4.72 / 5.0',
                                badge: 'ทุนวิจัยร่วมต่างประเทศ',
                              },
                              {
                                dept: 'ศูนย์ WIL & BRIDGE (ความร่วมมืออุตสาหกรรม)',
                                bud: '฿340,000',
                                pct: '79.2%',
                                metric: '฿175,000 / โครงการ',
                                score: '4.70 / 5.0',
                                badge: 'Regulatory Sandbox มช.',
                              },
                              {
                                dept: 'หน่วยบริหารงานวิจัยและทรัพย์สินทางปัญญา (RES-01)',
                                bud: '฿380,000',
                                pct: '76.5%',
                                metric: '฿141,600 / โครงการ',
                                score: '4.65 / 5.0',
                                badge: 'ยื่นจดสิทธิบัตร 5 รายการ',
                              },
                            ]
                          : benchmarkSegment === 'student'
                            ? [
                                {
                                  dept: 'หน่วยวิเทศสัมพันธ์และความร่วมมือนานาชาติ (RES-02)',
                                  bud: '฿420,000',
                                  pct: '81.0%',
                                  metric: '88.5% แลกเปลี่ยนสากล',
                                  score: '4.80 / 5.0',
                                  badge: 'MOU 12 สถาบันคู่สัญญา',
                                },
                                {
                                  dept: 'โครงการเตรียมความพร้อมวิชาชีพและสหกิจศึกษา (WIL)',
                                  bud: '฿280,000',
                                  pct: '80.2%',
                                  metric: '96.0% อัตราได้งานทำ',
                                  score: '4.85 / 5.0',
                                  badge: 'นายจ้างพึงพอใจ 98%',
                                },
                                {
                                  dept: 'หน่วยกิจการนักศึกษาและศิษย์เก่าสัมพันธ์ (EDU-02)',
                                  bud: '฿320,000',
                                  pct: '86.5%',
                                  metric: '94.2% นศ. ร่วมกิจกรรม',
                                  score: '4.75 / 5.0',
                                  badge: 'จิตสาธารณะ & Soft skills',
                                },
                                {
                                  dept: 'ห้องสร้างสรรค์และบ่มเพาะทักษะนักศึกษา (EDU-05)',
                                  bud: '฿350,000',
                                  pct: '85.4%',
                                  metric: '91.0% อัตราการใช้พื้นที่',
                                  score: '4.68 / 5.0',
                                  badge: 'เปิดบริการ 24 ชม.',
                                },
                              ]
                            : benchmarkSegment === 'service'
                              ? [
                                  {
                                    dept: 'ศูนย์ Lifelong Learning & Micro-credentials',
                                    bud: '฿320,000',
                                    pct: '45.0%',
                                    metric: '850 คน / ปี',
                                    score: '4.80 / 5.0',
                                    badge: 'พัฒนาทักษะอาชีพดิจิทัล',
                                  },
                                  {
                                    dept: 'โครงการถ่ายทอดดิจิทัลคอนเทนต์สู่โรงเรียนชนบท',
                                    bud: '฿180,000',
                                    pct: '35.0%',
                                    metric: '650 นักเรียน',
                                    score: '4.85 / 5.0',
                                    badge: 'ลดความเหลื่อมล้ำดิจิทัล',
                                  },
                                  {
                                    dept: 'โครงการ AI Literacy สำหรับผู้สูงอายุและท้องถิ่น',
                                    bud: '฿250,000',
                                    pct: '40.0%',
                                    metric: '420 คน / ปี',
                                    score: '4.75 / 5.0',
                                    badge: 'บริการสังคมเพื่อความยั่งยืน',
                                  },
                                  {
                                    dept: 'ศูนย์ให้คำปรึกษานวัตกรรมดิจิทัล SME ภาคเหนือ',
                                    bud: '฿270,000',
                                    pct: '38.0%',
                                    metric: '24 วิสาหกิจ',
                                    score: '4.70 / 5.0',
                                    badge: 'เพิ่มมูลค่าธุรกิจชุมชน',
                                  },
                                ]
                              : [
                                  {
                                    dept: 'หน่วยคอมพิวเตอร์และพัฒนาระบบ IT (ADM-03)',
                                    bud: '฿380,000',
                                    pct: '91.2%',
                                    metric: '99.1% ความพร้อมระบบ',
                                    score: '4.85 / 5.0',
                                    badge: 'Digital Transformation 100%',
                                  },
                                  {
                                    dept: 'หน่วยนโยบายและแผน (PLN-01)',
                                    bud: '฿220,000',
                                    pct: '86.0%',
                                    metric: '98.5% รายงานตรงเวลา',
                                    score: '4.80 / 5.0',
                                    badge: 'ติดตามงบประมาณเรียลไทม์',
                                  },
                                  {
                                    dept: 'หน่วยการเงินและพัสดุ (FIN-01 / FIN-02)',
                                    bud: '฿350,000',
                                    pct: '88.6%',
                                    metric: '97.4% เบิกจ่ายตรงรอบ',
                                    score: '4.75 / 5.0',
                                    badge: 'ตรวจสอบบัญชี 0 ข้อทักท้วง',
                                  },
                                  {
                                    dept: 'หน่วยบริหารงานบุคคล (ADM-01)',
                                    bud: '฿180,000',
                                    pct: '85.0%',
                                    metric: '98.0% อบรมบุคลากร',
                                    score: '4.70 / 5.0',
                                    badge: 'ประเมิน KPI ครบถ้วน 100%',
                                  },
                                  {
                                    dept: 'หน่วยอาคารสถานที่และยานพาหนะ (ADM-04)',
                                    bud: '฿250,000',
                                    pct: '87.5%',
                                    metric: '96.5% บำรุงรักษา',
                                    score: '4.65 / 5.0',
                                    badge: 'Smart Green Campus',
                                  },
                                ]
                      ).map((row, i) => (
                        <tr
                          key={i}
                          className="hover:bg-[#f7f6f2]/60 transition-colors duration-150"
                        >
                          <td className="py-3 px-4 font-medium text-[#18181b]">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-[#71717a] tabular-nums w-5">
                                {String(i + 1).padStart(2, '0')}
                              </span>
                              <span>{row.dept}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-[#52525b] tabular-nums">
                            {row.bud}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2.5">
                              <div className="w-20 bg-[#e4e2dd] h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-[#15803d]"
                                  style={{ width: row.pct }}
                                />
                              </div>
                              <span className="font-mono font-medium text-[#15803d] tabular-nums w-11 text-right">
                                {row.pct}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right text-[#52525b] tabular-nums">
                            {row.metric}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-medium text-[#18181b] tabular-nums">
                            {row.score}
                          </td>
                          <td className="py-3 px-4 text-[#52525b]">{row.badge}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-3 text-xs">
              {[
                {
                  id: 1,
                  code: 'POL-01',
                  category: 'Digital Infrastructure',
                  title: 'ปรับเพิ่มสัดส่วนงบโครงสร้างพื้นฐาน AI & Cloud อีก 15%',
                  desc: 'รองรับงานวิจัยขั้นสูงของนักศึกษาและคณาจารย์ ลดความซ้ำซ้อนของการจัดซื้อซอฟต์แวร์รายบุคคล',
                },
                {
                  id: 2,
                  code: 'POL-02',
                  category: 'Internationalization',
                  title: 'จัดตั้งกองทุนหมุนเวียนหลักสูตรนานาชาติแบบ Co-funding',
                  desc: 'ส่งเสริม Micro-credentials และ Joint Degree ร่วมกับภาคอุตสาหกรรมดิจิทัลชั้นนำทั้งในและต่างประเทศ',
                },
                {
                  id: 3,
                  code: 'POL-03',
                  category: 'Research Acceleration',
                  title: 'เกณฑ์ Fast-track จัดซื้อจัดจ้างสำหรับโครงการวิจัยทุนภายนอก',
                  desc: 'ลดระยะเวลาพิจารณาจาก 45 วัน เหลือ 14 วัน เพื่อความคล่องตัวในการส่งมอบผลงานวิจัยตามกำหนดสัญญาทุน',
                },
              ].map((rec) => {
                const isApplied = appliedRecommendations.includes(rec.id);
                return (
                  <div
                    key={rec.id}
                    className="p-5 bg-white rounded-xl border border-[#18181b]/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-[#f0eee9] border border-[#18181b]/10 font-mono text-[11px] text-[#52525b]">
                          {rec.code}
                        </span>
                        <span className="text-xs text-[#71717a]">{rec.category}</span>
                      </div>
                      <div className="font-medium text-sm text-[#18181b]">{rec.title}</div>
                      <p className="text-[#52525b] leading-relaxed">{rec.desc}</p>
                    </div>
                    <button
                      onClick={() => toggleApplyRec(rec.id)}
                      className={`h-8 px-3.5 rounded-lg font-medium text-xs whitespace-nowrap cursor-pointer transition-colors duration-150 shrink-0 flex items-center gap-1.5 ${
                        isApplied
                          ? 'bg-[#15803d] text-white'
                          : 'bg-[#f0eee9] text-[#18181b] hover:bg-[#e4e2dd]'
                      }`}
                    >
                      {isApplied && <Check size={13} strokeWidth={1.5} />}
                      <span>{isApplied ? 'รับเป็นนโยบายแล้ว' : 'รับเป็นนโยบาย'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
