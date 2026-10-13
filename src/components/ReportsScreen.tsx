import { useState } from 'react';
import { ProjectItem } from '../data/mockData';

interface ReportsScreenProps {
  onExportReport?: () => void;
  onSignedSuccess: () => void;
  projects?: ProjectItem[];
  onExportProjectReport?: (prj: ProjectItem) => void;
}

export const ReportsScreen = ({
  onExportReport,
  onSignedSuccess,
  projects = [],
  onExportProjectReport,
}: ReportsScreenProps) => {
  const [activeTab, setActiveTab] = useState<1 | 2>(1);
  const [signState, setSignState] = useState(false);
  const [appliedRecommendations, setAppliedRecommendations] = useState<number[]>([]);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiExpanded, setIsAiExpanded] = useState(false);
  const [benchmarkSegment, setBenchmarkSegment] = useState<'academic' | 'research' | 'student' | 'service' | 'support'>('academic');

  const handleAiSubmit = (customQuery?: string) => {
    const q = customQuery !== undefined ? customQuery : aiQuery;
    if (q.includes('2569') || q.includes('ดิจิทัลเกม') || q.includes('ดูงาน')) {
      setAiResponse('รายงานโครงการ 2569-DG-P1-001: ศึกษาดูงานนักศึกษาดิจิทัลเกม ปี 3 (ปีการศึกษา 2568) วงเงิน ฿386,000 ได้รับการอนุมัติผ่านระบบ CMU ERP เรียบร้อย มีลายเซ็นอนุมัติครบ 4 ลำดับขั้น รหัสบัญชี Fund3D: 0201001 Act3D: 690101010000022 ID3D: 69222D532C00120');
    } else {
      setAiResponse(`ประมวลผลข้อมูลสำหรับ: "${q}" - จากฐานข้อมูล CMU ERP พบว่าการเบิกจ่ายรวมของวิทยาลัยอยู่ที่ 92.4% มีประสิทธิภาพอยู่ในเกณฑ์ EdPEx ยอดเยี่ยม`);
    }
  };

  const toggleApplyRec = (index: number) => {
    setAppliedRecommendations((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSign = () => {
    setSignState(!signState);
    if (!signState) {
      onSignedSuccess();
    }
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="bg-white rounded-2xl shadow-xl border border-[#ddc1b2]/40 relative block w-full min-w-0">
        {/* Card Header Section - Sticky Locked */}
        <div className="sticky top-20 z-30 bg-white rounded-t-2xl shadow-md border-b border-[#e5e8ee] w-full min-w-0">
          {/* Ribbon */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#e87722] via-[#994700] to-[#366847] rounded-t-2xl"></div>

        {/* Header */}
        <div className="px-6 py-4 sm:py-5 border-b border-[#e5e8ee] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#ffdbc8] text-[#743400] text-[11px] font-bold tracking-wider">
                #REP-2569-ANALYTICS
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#b8f0c5] text-[#1d5031] text-[11px] font-bold">
                EdPEx Verified
              </span>
              <span className="text-[11px] text-[#79564b]">รอบรายงานผลระดับนโยบาย</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#181c20] tracking-tight">
              รายงานสรุปและสถิติงบประมาณ ประจำปีงบประมาณ 2569
            </h1>
            <p className="text-sm text-[#564337] mt-1">
              วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มหาวิทยาลัยเชียงใหม่ • Fiscal Intelligence &amp; Performance KPIs
            </p>
          </div>
        </div>

        {/* Navigation Tabs (2 Consolidated Tabs) */}
        <div className="px-4 sm:px-6 bg-[#f1f4f9] border-b border-[#e5e8ee] flex items-center gap-2 py-2 w-full min-w-0 overflow-x-auto flex-nowrap">
          {[
            { id: 1, label: 'สถิติ & ประสิทธิภาพส่วนงาน (KPIs & Benchmarks)', icon: 'query_stats' },
            { id: 2, label: 'ข้อเสนอแนะนโยบาย (Actions)', icon: 'rate_review' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === t.id
                  ? 'bg-[#e87722] text-white shadow-xs'
                  : 'text-[#564337] hover:bg-[#ebeef3]'
                }`}
            >
              <span className="material-symbols-outlined text-[17px]">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
        </div>

        {/* Content Area */}
        <div className="p-6 bg-[#f7f9ff] space-y-6 rounded-b-2xl">
          {/* AI Reports Assistant (Collapsible) */}
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
                    type="text" 
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAiSubmit();
                    }}
                    placeholder="พิมพ์ถามข้อมูลรายงาน เช่น วิเคราะห์งบโครงการ 2569-DG-P1-001 หรือ สรุป 3 หน่วยงานที่เบิกจ่ายสูงสุด..." 
                    className="flex-1 bg-[#f1f4f9] rounded-xl px-4 py-2 text-xs text-[#181c20] focus:outline-none focus:ring-2 focus:ring-[#e87722]/50 border border-transparent focus:border-[#e87722]"
                  />
                  <button 
                    onClick={() => handleAiSubmit()}
                    className="bg-[#e87722] hover:bg-[#994700] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
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
                      className="text-[#994700] hover:text-black p-0.5"
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
                </div>
              </div>
            )}
          </div>

          {activeTab === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#ddc1b2]/30 shadow-xs">
                  <span className="text-xs text-[#79564b] font-bold">ประสิทธิภาพการใช้งบ</span>
                  <div className="text-2xl font-black text-[#181c20] mt-2 tabular-nums">
                    92.4% <span className="text-xs text-[#366847] font-bold">+4.1%</span>
                  </div>
                  <div className="text-xs text-[#366847] font-semibold mt-1">สูงกว่าเป้าหมาย EdPEx</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#ddc1b2]/30 shadow-xs">
                  <span className="text-xs text-[#79564b] font-bold">ดัชนีความคุ้มค่าโครงการ</span>
                  <div className="text-2xl font-black text-[#e87722] mt-2 tabular-nums">
                    4.65 <span className="text-xs text-[#79564b] font-normal">/ 5.00</span>
                  </div>
                  <div className="text-xs text-[#564337] mt-1">ครอบคลุม 186 โครงการ (37 ส่วนงาน)</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#ddc1b2]/30 shadow-xs">
                  <span className="text-xs text-[#79564b] font-bold">ประหยัดต้นทุนและเกลี่ยคืน</span>
                  <div className="text-2xl font-black text-[#181c20] mt-2 tabular-nums">฿840,000</div>
                  <div className="text-xs text-[#564337] mt-1">จากเจรจาจัดซื้อรวมศูนย์</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#366847]/40 shadow-xs">
                  <span className="text-xs text-[#79564b] font-bold">บรรลุเป้าหมายตามกำหนด</span>
                  <div className="text-2xl font-black text-[#366847] mt-2 tabular-nums">
                    165 / 186 โครงการ
                  </div>
                  <div className="text-xs text-[#366847] font-semibold mt-1">
                    88.7% สำเร็จตามไทม์ไลน์
                  </div>
                </div>
              </div>

              {/* ส่วนที่ 2: Summary Cards 5 กลุ่มยุทธศาสตร์ (Strategic Alignment Cards) */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#181c20] flex items-center gap-2">
                      <span>การวิเคราะห์ผลลัพธ์ราย 5 กลุ่มยุทธศาสตร์ (Strategic Alignment Overview)</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#ffdbc8] text-[#743400] text-[10px] font-bold">
                        EdPEx หมวด 2
                      </span>
                    </h3>
                    <p className="text-[11px] text-[#79564b]">
                      คลิกเลือกการ์ดยุทธศาสตร์เพื่อดูสรุปภาพรวม และกรองตารางวิเคราะห์เชิงเปรียบเทียบ (Benchmarks) ด้านล่างโดยอัตโนมัติ
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-[#366847] bg-[#b8f0c5]/50 px-2.5 py-1 rounded-lg shrink-0 self-start sm:self-auto">
                    สอดคล้องยุทธศาสตร์ 100%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {[
                    {
                      id: 'academic' as const,
                      code: 'SO-2',
                      title: 'ยกระดับวิชาการและหลักสูตร',
                      en: 'Academic Excellence',
                      icon: 'school',
                      iconBg: 'bg-[#e0f2fe] text-[#0369a1]',
                      budget: '฿2,450,000',
                      spent: '฿1,720,000',
                      disbPct: '70.2%',
                      kpiScore: '92%',
                      kpiRating: 'ดีเยี่ยม',
                      badgeClass: 'bg-[#b8f0c5] text-[#1d5031]',
                      scope: '14 หลักสูตร (ตรี/โท/เอก)',
                    },
                    {
                      id: 'research' as const,
                      code: 'SO-3',
                      title: 'ขับเคลื่อนงานวิจัยแนวหน้า',
                      en: 'Research & Innovation',
                      icon: 'science',
                      iconBg: 'bg-[#fef3c7] text-[#92400e]',
                      budget: '฿1,680,000',
                      spent: '฿1,150,000',
                      disbPct: '68.5%',
                      kpiScore: '89%',
                      kpiRating: 'ดีเยี่ยม',
                      badgeClass: 'bg-[#b8f0c5] text-[#1d5031]',
                      scope: '2 ศูนย์นวัตกรรม / 8 ทุน',
                    },
                    {
                      id: 'student' as const,
                      code: 'SO-1',
                      title: 'พัฒนาศักยภาพนักศึกษา',
                      en: 'Student Quality',
                      icon: 'diversity_3',
                      iconBg: 'bg-[#b8f0c5] text-[#1d5031]',
                      budget: '฿1,650,000',
                      spent: '฿1,120,000',
                      disbPct: '67.9%',
                      kpiScore: '94%',
                      kpiRating: 'ดีเยี่ยม',
                      badgeClass: 'bg-[#b8f0c5] text-[#1d5031]',
                      scope: 'นศ. มีส่วนร่วม 94.2%',
                    },
                    {
                      id: 'service' as const,
                      code: 'SO-4',
                      title: 'บริการวิชาการสู่สังคม',
                      en: 'Academic Services',
                      icon: 'public',
                      iconBg: 'bg-[#dbeafe] text-[#1e40af]',
                      budget: '฿1,220,000',
                      spent: '฿780,000',
                      disbPct: '63.9%',
                      kpiScore: '88%',
                      kpiRating: 'ดีเยี่ยม',
                      badgeClass: 'bg-[#b8f0c5] text-[#1d5031]',
                      scope: 'Lifelong Learning / SME',
                    },
                    {
                      id: 'support' as const,
                      code: 'SO-5',
                      title: 'บริหารองค์กรอัจฉริยะ',
                      en: 'Smart Org & Ops',
                      icon: 'corporate_fare',
                      iconBg: 'bg-[#ffdbc8] text-[#743400]',
                      budget: '฿1,550,000',
                      spent: '฿1,050,000',
                      disbPct: '67.7%',
                      kpiScore: '95%',
                      kpiRating: 'ดีเยี่ยม',
                      badgeClass: 'bg-[#b8f0c5] text-[#1d5031]',
                      scope: 'SLA ดำเนินงาน 98.2%',
                    },
                  ].map((card) => {
                    const isSelected = benchmarkSegment === card.id;
                    return (
                      <button
                        key={card.id}
                        onClick={() => setBenchmarkSegment(card.id)}
                        className={`text-left p-3.5 rounded-xl bg-white border transition-all cursor-pointer relative shadow-xs flex flex-col justify-between ${
                          isSelected
                            ? 'ring-2 ring-[#e87722] border-transparent bg-white shadow-md'
                            : 'border-[#ddc1b2]/40 hover:border-[#e87722]/50 hover:bg-[#fffaf6]'
                        }`}
                      >
                        <div>
                          {/* Top row: Icon + Code on left, subtle 'กำลังเลือกดู' status badge on right */}
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${card.iconBg}`}>
                                <span className="material-symbols-outlined text-[15px]">{card.icon}</span>
                              </span>
                              <span className="text-[11px] font-black text-[#79564b]">{card.code}</span>
                            </div>
                            {isSelected && (
                              <div className="flex items-center gap-0.5 text-[8px] font-bold text-[#e87722] bg-[#fff2e8] px-1.5 py-0.5 rounded-full border border-[#f97316]/25 shadow-2xs shrink-0">
                                <span className="material-symbols-outlined text-[10px]">check_circle</span>
                                <span className="whitespace-nowrap">กำลังเลือกดู</span>
                              </div>
                            )}
                          </div>

                          {/* Full width title without truncation - wraps cleanly up to 2 lines */}
                          <h4
                            className="text-xs font-bold text-[#181c20] leading-snug min-h-[32px] flex items-center line-clamp-2"
                            title={card.title}
                          >
                            {card.title}
                          </h4>

                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-[11px] font-semibold text-[#564337]">
                              <span>เบิกจ่ายแล้ว</span>
                              <span className="font-extrabold text-[#181c20] tabular-nums">{card.spent}</span>
                            </div>
                            <div className="w-full bg-[#ebeef3] h-2.5 rounded-full overflow-hidden flex shadow-inner">
                              <div
                                className="h-full rounded-full transition-all duration-500 shadow-2xs"
                                style={{
                                  width: card.disbPct,
                                  background: 'linear-gradient(90deg, #164e22 0%, #2e7d32 75%, #3fa64d 100%)',
                                }}
                              />
                            </div>
                            <div className="flex justify-between text-[10px] text-[#79564b]">
                              <span>กรอบ {card.budget}</span>
                              <span className="font-bold text-[#366847]">{card.disbPct}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-[#ebeef3] flex items-center justify-between gap-1.5 min-w-0 text-[10px]">
                          <span className={`whitespace-nowrap shrink-0 px-1.5 py-0.5 rounded font-bold ${card.badgeClass}`}>
                            KPI: {card.kpiScore} ({card.kpiRating})
                          </span>
                          <span className="text-[9px] text-[#79564b] truncate min-w-0 text-right" title={card.scope}>
                            {card.scope}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ส่วนที่ 3: ตารางเจาะลึกประสิทธิภาพส่วนงาน (Dynamic Benchmarks Table) */}
              <div className="bg-white p-6 rounded-2xl border border-[#ddc1b2]/30 space-y-4 shadow-xs">
                {/* Segment Switcher Header in a clean single line with zero overflow */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#ebeef3] min-w-0">
                  <div className="flex items-center gap-2 min-w-0 shrink-0">
                    <span className="material-symbols-outlined text-[18px] text-[#e87722]">tune</span>
                    <h3 className="text-xs sm:text-sm font-bold text-[#181c20] truncate">
                      ตารางเปรียบเทียบกลุ่มภารกิจ (Benchmarks)
                    </h3>
                  </div>

                  {/* Switcher Buttons in a single row - guaranteed no overflow */}
                  <div className="flex items-center gap-1 p-1 bg-[#f1f4f9] rounded-xl border border-[#e5e8ee] overflow-x-auto max-w-full min-w-0">
                    {[
                      { id: 'academic' as const, label: 'วิชาการ', icon: 'school', count: '5' },
                      { id: 'research' as const, label: 'วิจัย', icon: 'science', count: '4' },
                      { id: 'student' as const, label: 'พัฒนานักศึกษา', icon: 'diversity_3', count: '4' },
                      { id: 'service' as const, label: 'บริการวิชาการ', icon: 'public', count: '4' },
                      { id: 'support' as const, label: 'สนับสนุน', icon: 'corporate_fare', count: '5' },
                    ].map((seg) => (
                      <button
                        key={seg.id}
                        onClick={() => setBenchmarkSegment(seg.id)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                          benchmarkSegment === seg.id
                            ? 'bg-[#e87722] text-white shadow-xs'
                            : 'text-[#564337] hover:bg-white/80'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">{seg.icon}</span>
                        <span>{seg.label}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${
                            benchmarkSegment === seg.id ? 'bg-white/25 text-white' : 'bg-[#e2e7ef] text-[#564337]'
                          }`}
                        >
                          {seg.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-Header Context Description */}
                <div className="p-3 bg-[#FFF7F0] border border-[#e87722]/30 rounded-xl flex items-center justify-between text-xs text-[#743400] gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#e87722]">info</span>
                    <span>
                      {benchmarkSegment === 'academic' &&
                        'บริบทสายวิชาการ (SO-2): วัดประสิทธิภาพการใช้ทรัพยากรผ่าน "ต้นทุนต่อหัวนักศึกษา" และผลสัมฤทธิ์ "ROI / Outcome"'}
                      {benchmarkSegment === 'research' &&
                        'บริบทสายวิจัย & นวัตกรรม (SO-3): วัดประสิทธิภาพผ่าน "งบเฉลี่ยต่อโครงการวิจัย" และ "คะแนน Impact Factor / การนำไปใช้จริง"'}
                      {benchmarkSegment === 'student' &&
                        'บริบทพัฒนานักศึกษา (SO-1): วัดผ่าน "อัตราการมีส่วนร่วมของ นศ." และ "ผลประเมินสมรรถนะ / ทักษะสากล"'}
                      {benchmarkSegment === 'service' &&
                        'บริบทบริการวิชาการ (SO-4): วัดผ่าน "จำนวนผู้รับบริการ/อบรม" และ "คะแนนความพึงพอใจชุมชนและสังคม"'}
                      {benchmarkSegment === 'support' &&
                        'บริบทสายสนับสนุน (SO-5): วัดผ่าน "อัตราการดำเนินงานตาม SLA" และ "คะแนนความพึงพอใจการให้บริการ (CSAT)"'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-[#ddc1b2]/40 text-[#564337] shrink-0">
                    {benchmarkSegment === 'academic' && 'EdPEx 7.1'}
                    {benchmarkSegment === 'research' && 'EdPEx 7.2'}
                    {benchmarkSegment === 'student' && 'EdPEx 7.3'}
                    {benchmarkSegment === 'service' && 'EdPEx 7.4'}
                    {benchmarkSegment === 'support' && 'EdPEx 7.5'}
                  </span>
                </div>

                {/* Dynamic Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#f1f4f9] uppercase text-[#79564b] font-bold border-b border-[#e5e8ee]">
                        <th className="py-3 px-4">
                          {benchmarkSegment === 'academic' && 'ส่วนงาน / หลักสูตร'}
                          {benchmarkSegment === 'research' && 'ศูนย์วิจัย / หน่วยงาน'}
                          {benchmarkSegment === 'student' && 'หน่วยงาน / พันธกิจ'}
                          {benchmarkSegment === 'service' && 'โครงการ / ศูนย์บริการวิชาการ'}
                          {benchmarkSegment === 'support' && 'หน่วยงานสนับสนุน (สาย ก.)'}
                        </th>
                        <th className="py-3 px-3 text-right">งบประมาณจัดสรร</th>
                        <th className="py-3 px-4 text-center">เบิกจ่ายจริง (Data Bar)</th>
                        <th className="py-3 px-3 text-right">
                          {benchmarkSegment === 'academic' && 'ต้นทุนต่อหัวนักศึกษา'}
                          {benchmarkSegment === 'research' && 'งบเฉลี่ยต่อโครงการ'}
                          {benchmarkSegment === 'student' && 'อัตราการมีส่วนร่วม นศ.'}
                          {benchmarkSegment === 'service' && 'จำนวนผู้รับบริการ/อบรม'}
                          {benchmarkSegment === 'support' && 'อัตราดำเนินงานตาม SLA'}
                        </th>
                        <th className="py-3 px-4 text-center">
                          {benchmarkSegment === 'academic' && 'ROI / OUTCOME'}
                          {benchmarkSegment === 'research' && 'IMPACT FACTOR / นำไปใช้จริง'}
                          {benchmarkSegment === 'student' && 'สมรรถนะ / ทักษะสากล'}
                          {benchmarkSegment === 'service' && 'ความพึงพอใจชุมชน & สังคม'}
                          {benchmarkSegment === 'support' && 'ความพึงพอใจบริการ (CSAT)'}
                        </th>
                        <th className="py-3 px-3 text-center">จุดเด่นเชิงประจักษ์</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ebeef3]">
                      {(benchmarkSegment === 'academic'
                        ? [
                            { dept: 'วิศวกรรมซอฟต์แวร์ (SE - International)', bud: '฿480,000', pct: '88.0%', metric: '฿14,200 / คน', score: '4.82 / 5.0', isTop: true, badge: 'ผลงานเด่น EdPEx' },
                            { dept: 'บูรณาการอุตสาหกรรมดิจิทัล (DII)', bud: '฿380,000', pct: '86.4%', metric: '฿15,100 / คน', score: '4.70 / 5.0', isTop: false, badge: 'บัณฑิตตรงสายงาน 95%' },
                            { dept: 'บัณฑิตศึกษา ป.โท/ป.เอก (Graduate Studies - DTM & KMI)', bud: '฿320,000', pct: '86.8%', metric: '฿18,200 / คน', score: '4.75 / 5.0', isTop: false, badge: 'งานวิจัยตีพิมพ์สากล Scopus' },
                            { dept: 'แอนิเมชันและวิชวลเอฟเฟกต์ (ANIM)', bud: '฿350,000', pct: '84.2%', metric: '฿16,800 / คน', score: '4.60 / 5.0', isTop: false, badge: 'รางวัลนวัตกรรมระดับชาติ' },
                            { dept: 'การจัดการความรู้และนวัตกรรม (MMIT)', bud: '฿280,000', pct: '81.5%', metric: '฿13,500 / คน', score: '4.55 / 5.0', isTop: false, badge: 'ต้นทุนประหยัดต่อหัวดีเด่น' },
                          ]
                        : benchmarkSegment === 'research'
                        ? [
                            { dept: 'ศูนย์เทคโนโลยีและนวัตกรรมดิจิทัล (DITC)', bud: '฿420,000', pct: '84.0%', metric: '฿178,500 / โครงการ', score: '4.80 / 5.0', isTop: true, badge: 'ถ่ายทอดเทคโนโลยีเอกชน 100%' },
                            { dept: 'ห้องปฏิบัติการวิจัยดิจิทัลและ AI Research Lab', bud: '฿360,000', pct: '82.0%', metric: '฿162,500 / โครงการ', score: '4.72 / 5.0', isTop: false, badge: 'ทุนวิจัยร่วมต่างประเทศ' },
                            { dept: 'ศูนย์ WIL & BRIDGE (ความร่วมมืออุตสาหกรรม)', bud: '฿340,000', pct: '79.2%', metric: '฿175,000 / โครงการ', score: '4.70 / 5.0', isTop: false, badge: 'Regulatory Sandbox มช.' },
                            { dept: 'หน่วยบริหารงานวิจัยและทรัพย์สินทางปัญญา (RES-01)', bud: '฿380,000', pct: '76.5%', metric: '฿141,600 / โครงการ', score: '4.65 / 5.0', isTop: false, badge: 'ยื่นจดสิทธิบัตร 5 รายการ' },
                          ]
                        : benchmarkSegment === 'student'
                        ? [
                            { dept: 'หน่วยวิเทศสัมพันธ์และความร่วมมือนานาชาติ (RES-02)', bud: '฿420,000', pct: '81.0%', metric: '88.5% แลกเปลี่ยน/Global', score: '4.80 / 5.0', isTop: true, badge: 'MOU 12 สถาบันคู่สัญญา' },
                            { dept: 'โครงการเตรียมความพร้อมวิชาชีพและสหกิจศึกษา (WIL)', bud: '฿280,000', pct: '80.2%', metric: '96.0% อัตราได้งานทำ', score: '4.85 / 5.0', isTop: false, badge: 'นายจ้างพึงพอใจ 98%' },
                            { dept: 'หน่วยกิจการนักศึกษาและศิษย์เก่าสัมพันธ์ (EDU-02)', bud: '฿320,000', pct: '86.5%', metric: '94.2% นศ. ร่วมกิจกรรม', score: '4.75 / 5.0', isTop: false, badge: 'จิตสาธารณะ & Soft skills' },
                            { dept: 'ห้องสร้างสรรค์และบ่มเพาะทักษะนักศึกษา (EDU-05)', bud: '฿350,000', pct: '85.4%', metric: '91.0% อัตราการใช้พื้นที่', score: '4.68 / 5.0', isTop: false, badge: 'เปิด 24 ชม. ปลอดภัย' },
                          ]
                        : benchmarkSegment === 'service'
                        ? [
                            { dept: 'ศูนย์ Lifelong Learning & Micro-credentials', bud: '฿320,000', pct: '45.0%', metric: '850 คน / ปี', score: '4.80 / 5.0', isTop: true, badge: 'พัฒนาทักษะอาชีพดิจิทัล' },
                            { dept: 'โครงการถ่ายทอดดิจิทัลคอนเทนต์สู่โรงเรียนชนบท', bud: '฿180,000', pct: '35.0%', metric: '650 นักเรียน', score: '4.85 / 5.0', isTop: false, badge: 'ลดความเหลื่อมล้ำดิจิทัล' },
                            { dept: 'โครงการ AI Literacy สำหรับผู้สูงอายุและท้องถิ่น', bud: '฿250,000', pct: '40.0%', metric: '420 คน / ปี', score: '4.75 / 5.0', isTop: false, badge: 'บริการสังคมเพื่อความยั่งยืน' },
                            { dept: 'ศูนย์ให้คำปรึกษานวัตกรรมดิจิทัล SME ภาคเหนือ', bud: '฿270,000', pct: '38.0%', metric: '24 วิสาหกิจ', score: '4.70 / 5.0', isTop: false, badge: 'เพิ่มมูลค่าธุรกิจชุมชน' },
                          ]
                        : [
                            { dept: 'หน่วยคอมพิวเตอร์และพัฒนาระบบ IT (ADM-03)', bud: '฿380,000', pct: '91.2%', metric: '99.1% ระบบออนไลน์พร้อมใช้', score: '4.85 / 5.0', isTop: true, badge: 'Digital Transformation 100%' },
                            { dept: 'หน่วยนโยบายและแผนฯ (PLN-01)', bud: '฿220,000', pct: '86.0%', metric: '98.5% รายงาน EdPEx ตรงเวลา', score: '4.80 / 5.0', isTop: false, badge: 'ติดตามงบประมาณเรียลไทม์' },
                            { dept: 'หน่วยการเงินและพัสดุ (FIN-01 / FIN-02)', bud: '฿350,000', pct: '88.6%', metric: '97.4% เบิกจ่ายตรงรอบบัญชี', score: '4.75 / 5.0', isTop: false, badge: 'ตรวจสอบบัญชี 0 ข้อทักท้วง' },
                            { dept: 'หน่วยบริหารงานบุคคล HR (ADM-01)', bud: '฿180,000', pct: '85.0%', metric: '98.0% สวัสดิการ/อบรมบุคลากร', score: '4.70 / 5.0', isTop: false, badge: 'ประเมิน KPI ครบถ้วน 100%' },
                            { dept: 'หน่วยอาคารสถานที่และยานพาหนะ (ADM-04)', bud: '฿250,000', pct: '87.5%', metric: '96.5% ความปลอดภัย/บำรุงรักษา', score: '4.65 / 5.0', isTop: false, badge: 'Smart Green Campus' },
                          ]
                      ).map((row, i) => (
                        <tr key={i} className="hover:bg-[#FFF7F0]/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#181c20]">
                            <div className="flex items-center gap-2">
                              {row.isTop && (
                                <span className="material-symbols-outlined text-[16px] text-[#e87722]" data-tooltip="อันดับ 1 สูงสุด">
                                  workspace_premium
                                </span>
                              )}
                              <span>{row.dept}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-right tabular-nums text-[#564337] font-semibold">{row.bud}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col items-center gap-1">
                              <span className="font-extrabold text-xs text-[#366847] tabular-nums">{row.pct}</span>
                              <div className="w-24 bg-[#ebeef3] h-2.5 rounded-full overflow-hidden shadow-inner">
                                <div
                                  className="h-full rounded-full transition-all duration-500 shadow-2xs"
                                  style={{
                                    width: row.pct,
                                    background: 'linear-gradient(90deg, #164e22 0%, #2e7d32 75%, #3fa64d 100%)',
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-right text-[#564337] font-semibold tabular-nums">{row.metric}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black shadow-xs ${
                                parseFloat(row.score) >= 4.8
                                  ? 'bg-[#b8f0c5] text-[#1d5031] ring-1 ring-[#366847]/30'
                                  : parseFloat(row.score) >= 4.65
                                  ? 'bg-[#d8f3dc] text-[#1d5031]'
                                  : 'bg-[#ebeef3] text-[#181c20]'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[14px]">star</span>
                              {row.score}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className="whitespace-nowrap inline-block px-2 py-0.5 rounded-md bg-[#f1f4f9] text-[#564337] text-[10px] font-semibold border border-[#e5e8ee]">
                              {row.badge}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-4 text-xs">
              {[
                {
                  id: 1,
                  icon: 'cloud',
                  iconBg: 'bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]',
                  category: 'Digital Infrastructure',
                  title: '1. ปรับเพิ่มสัดส่วนงบ AI & Cloud Infrastructure อีก 15%',
                  desc: 'เพื่อรองรับงานวิจัยขั้นสูง Advanced Gen-AI ของนักศึกษาและคณาจารย์ ลดความซ้ำซ้อนของการจัดซื้อซอฟต์แวร์รายบุคคล',
                },
                {
                  id: 2,
                  icon: 'public',
                  iconBg: 'bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]',
                  category: 'Internationalization',
                  title: '2. จัดตั้งกองทุนหมุนเวียนหลักสูตรนานาชาติแบบ Co-funding',
                  desc: 'ส่งเสริม Micro-credentials และ Joint Degree ร่วมกับภาคอุตสาหกรรมดิจิทัลชั้นนำทั้งในและต่างประเทศ',
                },
                {
                  id: 3,
                  icon: 'rocket_launch',
                  iconBg: 'bg-[#fff7ed] text-[#c2410c] border border-[#ffedd5]',
                  category: 'Research Acceleration',
                  title: '3. เกณฑ์ Fast-track จัดซื้อจัดจ้างสำหรับโครงการวิจัยทุนภายนอก',
                  desc: 'ลดระยะเวลาพิจารณาจาก 45 วัน เหลือ 14 วัน เพื่อความคล่องตัวในการส่งมอบผลงานวิจัยตามกำหนดสัญญาทุน',
                },
              ].map((rec) => {
                const isApplied = appliedRecommendations.includes(rec.id);
                return (
                  <div
                    key={rec.id}
                    className="p-5 bg-white rounded-2xl border border-[#ddc1b2]/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#e87722]/50 transition-colors"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-10 h-10 rounded-xl ${rec.iconBg} flex items-center justify-center shrink-0 shadow-xs mt-0.5`}>
                        <span className="material-symbols-outlined text-[22px]">{rec.icon}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f1f4f9] text-[#79564b]">
                            {rec.category}
                          </span>
                        </div>
                        <div className="font-bold text-sm text-[#181c20]">{rec.title}</div>
                        <p className="text-[#564337] leading-relaxed mt-1">{rec.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleApplyRec(rec.id)}
                      className={`px-3.5 py-2 rounded-xl font-bold text-xs whitespace-nowrap cursor-pointer transition-colors shadow-xs shrink-0 flex items-center gap-1.5 ${isApplied
                          ? 'bg-[#366847] text-white hover:bg-[#2b5338]'
                          : 'bg-[#ebeef3] text-[#181c20] hover:bg-[#e0e3e8]'
                        }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isApplied ? 'check_circle' : 'add_task'}
                      </span>
                      {isApplied ? 'นำไปปฏิบัติแล้ว ✓' : 'รับเป็นนโยบาย'}
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
