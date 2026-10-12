import { useState } from 'react';

interface ReportsScreenProps {
  onExportReport: () => void;
  onSignedSuccess: () => void;
}

export const ReportsScreen = ({
  onExportReport,
  onSignedSuccess,
}: ReportsScreenProps) => {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 4>(1);
  const [signState, setSignState] = useState(false);
  const [appliedRecommendations, setAppliedRecommendations] = useState<number[]>([]);

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
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl border border-[#ddc1b2]/40 overflow-hidden flex flex-col">
        {/* Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#e87722] via-[#994700] to-[#366847]"></div>

        {/* Header */}
        <div className="px-6 py-5 border-b border-[#e5e8ee] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-1 rounded bg-[#ffdbc8] text-[#743400] text-xs font-bold tracking-wider">
                #REP-2569-ANALYTICS
              </span>
              <span className="px-2.5 py-1 rounded bg-[#b8f0c5] text-[#1d5031] text-xs font-bold">
                EdPEx Verified
              </span>
              <span className="text-xs text-[#79564b]">รอบรายงานผลระดับนโยบาย</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#181c20]">
              รายงานสรุปและสถิติงบประมาณ ประจำปีงบประมาณ 2569
            </h1>
            <p className="text-xs text-[#564337]">
              วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มหาวิทยาลัยเชียงใหม่ • Fiscal Intelligence &amp; Performance KPIs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onExportReport}
              className="p-2.5 rounded-xl text-[#564337] hover:bg-[#ebeef3] transition-colors cursor-pointer border border-[#ddc1b2]/40"
              title="ดาวน์โหลด PDF รายงานสรุป"
            >
              <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 bg-[#f1f4f9] border-b border-[#e5e8ee] flex gap-2 overflow-x-auto py-2.5">
          {[
            { id: 1, label: 'สรุปสถิติและดัชนีชี้วัด (KPIs)', icon: 'query_stats' },
            { id: 2, label: 'แนวโน้มและพยากรณ์เบิกจ่าย (Forecast)', icon: 'trending_up' },
            { id: 3, label: 'ประสิทธิภาพรายหน่วยงาน (Benchmarks)', icon: 'domain_verification' },
            { id: 4, label: 'บันทึกข้อเสนอแนะเชิงนโยบาย (Actions)', icon: 'rate_review' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === t.id
                  ? 'bg-[#e87722] text-white shadow-xs'
                  : 'text-[#564337] hover:bg-[#ebeef3]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6 bg-[#f7f9ff] space-y-6">
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
                  <div className="text-xs text-[#564337] mt-1">ครอบคลุม 24 โครงการ</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#ddc1b2]/30 shadow-xs">
                  <span className="text-xs text-[#79564b] font-bold">ประหยัดต้นทุนและเกลี่ยคืน</span>
                  <div className="text-2xl font-black text-[#181c20] mt-2 tabular-nums">฿840,000</div>
                  <div className="text-xs text-[#564337] mt-1">จากเจรจาจัดซื้อรวมศูนย์</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#366847]/40 shadow-xs">
                  <span className="text-xs text-[#79564b] font-bold">บรรลุเป้าหมายตามกำหนด</span>
                  <div className="text-2xl font-black text-[#366847] mt-2 tabular-nums">
                    21 / 24 โครงการ
                  </div>
                  <div className="text-xs text-[#366847] font-semibold mt-1">
                    87.5% สำเร็จตามไทม์ไลน์
                  </div>
                </div>
              </div>

              {/* Strategic Breakdown */}
              <div className="bg-white p-6 rounded-2xl border border-[#ddc1b2]/30 space-y-4 shadow-xs">
                <h3 className="text-sm font-bold text-[#181c20]">
                  การวิเคราะห์ผลลัพธ์ราย 5 ยุทธศาสตร์ (Strategic Alignment)
                </h3>
                {[
                  { code: 'SO-1', title: 'ยุทธศาสตร์ 1: พัฒนาศักยภาพนักศึกษา (Student Quality)', act: '฿1,430,000', total: '฿2,200,000', pct: '94%' },
                  { code: 'SO-2', title: 'ยุทธศาสตร์ 2: ยกระดับวิชาการและหลักสูตร (Academic Excellence)', act: '฿2,450,000', total: '฿3,500,000', pct: '91%' },
                  { code: 'SO-3', title: 'ยุทธศาสตร์ 3: ขับเคลื่อนงานวิจัยระดับแนวหน้า (Research & Innovation)', act: '฿1,120,000', total: '฿2,800,000', pct: '86%' },
                  { code: 'SO-4', title: 'ยุทธศาสตร์ 4: บริการวิชาการสู่สังคม (Academic Services)', act: '฿600,000', total: '฿1,500,000', pct: '88%' },
                  { code: 'SO-5', title: 'ยุทธศาสตร์ 5: บริหารจัดการองค์กรอัจฉริยะ (Smart Org)', act: '฿1,220,000', total: '฿2,000,000', pct: '95%' },
                ].map((so) => (
                  <div key={so.code} className="p-3.5 bg-[#f1f4f9] rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-[#181c20]">{so.title}</span>
                      <span className="text-[#366847]">
                        {so.pct} ดีเยี่ยม ({so.act} / {so.total})
                      </span>
                    </div>
                    <div className="w-full bg-[#ebeef3] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#366847] h-full rounded-full transition-all duration-500"
                        style={{ width: so.pct }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="bg-white p-6 rounded-2xl border border-[#ddc1b2]/30 space-y-6 shadow-xs">
              <h3 className="text-sm font-bold text-[#181c20]">
                แนวโน้มการเบิกจ่ายเทียบเส้นพยากรณ์ (Q1 - Q4 Fiscal Run-Rate Forecast)
              </h3>
              <div className="grid grid-cols-4 gap-4 h-48 items-end border-b border-[#ebeef3] pb-4 text-center text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-[#181c20]">฿2.8M (65%)</div>
                  <div className="w-full bg-[#366847] rounded-t-lg h-28 shadow-xs"></div>
                  <div className="font-bold text-[#564337]">Q1 (สำเร็จ 100%)</div>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-[#181c20]">฿3.0M (72%)</div>
                  <div className="w-full bg-[#366847] rounded-t-lg h-32 shadow-xs"></div>
                  <div className="font-bold text-[#564337]">Q2 (สำเร็จ 98%)</div>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-[#181c20]">฿2.7M (62%)</div>
                  <div className="w-full bg-[#366847] rounded-t-lg h-24 shadow-xs"></div>
                  <div className="font-bold text-[#564337]">Q3 (ปิดรอบแล้ว)</div>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-[#e87722]">฿3.5M (Est.)</div>
                  <div className="w-full bg-[#e87722] rounded-t-lg h-36 border-2 border-dashed border-[#994700]"></div>
                  <div className="font-bold text-[#994700]">Q4 (คาดการณ์)</div>
                </div>
              </div>
              <div className="p-3.5 bg-[#FFF7F0] border border-[#e87722]/40 rounded-xl text-xs text-[#994700] font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#e87722]">psychology</span>
                โมเดล AI พยากรณ์ความแม่นยำ 96.8% ว่าการเบิกจ่ายสิ้นงวดปี 2569 จะอยู่ที่ 92.4% - 94.0%
                ตามเป้าหมายของคณะฯ
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="bg-white p-6 rounded-2xl border border-[#ddc1b2]/30 overflow-x-auto shadow-xs">
              <h3 className="text-sm font-bold text-[#181c20] mb-3">
                การเปรียบเทียบประสิทธิภาพและการใช้ทรัพยากร (Benchmarks)
              </h3>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#f1f4f9] uppercase text-[#79564b] font-bold border-b border-[#e5e8ee]">
                    <th className="py-3 px-4">ส่วนงาน / หลักสูตร</th>
                    <th className="py-3 px-3 text-right">งบประมาณจัดสรร</th>
                    <th className="py-3 px-3 text-center">เบิกจ่ายจริง</th>
                    <th className="py-3 px-3 text-right">ต้นทุนต่อหัวนักศึกษา</th>
                    <th className="py-3 px-3 text-center">ROI / Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ebeef3]">
                  {[
                    { dept: 'วิศวกรรมซอฟต์แวร์ (SE)', bud: '฿3,100,000', pct: '88.0%', cost: '฿14,200 / คน', roi: '4.82 / 5.0' },
                    { dept: 'แอนิเมชันและวิชวลเอฟเฟกต์ (ANIM)', bud: '฿2,200,000', pct: '84.2%', cost: '฿16,800 / คน', roi: '4.60 / 5.0' },
                    { dept: 'บูรณาการอุตสาหกรรมดิจิทัล (DII)', bud: '฿2,400,000', pct: '86.4%', cost: '฿15,100 / คน', roi: '4.70 / 5.0' },
                    { dept: 'การจัดการความรู้และนวัตกรรม (MMIT)', bud: '฿1,800,000', pct: '81.5%', cost: '฿13,500 / คน', roi: '4.55 / 5.0' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-[#FFF7F0]/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#181c20]">{row.dept}</td>
                      <td className="py-3.5 px-3 text-right tabular-nums text-[#564337]">{row.bud}</td>
                      <td className="py-3.5 px-3 text-center font-bold text-[#366847]">{row.pct}</td>
                      <td className="py-3.5 px-3 text-right text-[#564337] tabular-nums">{row.cost}</td>
                      <td className="py-3.5 px-3 text-center font-extrabold text-[#366847]">
                        {row.roi}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 4 && (
            <div className="space-y-4 text-xs">
              {[
                {
                  id: 1,
                  title: '1. ปรับเพิ่มสัดส่วนงบ AI & Cloud Infrastructure อีก 15%',
                  desc: 'เพื่อรองรับงานวิจัยขั้นสูง Advanced Gen-AI ของนักศึกษาและคณาจารย์ ลดความซ้ำซ้อนของการจัดซื้อซอฟต์แวร์รายบุคคล',
                },
                {
                  id: 2,
                  title: '2. จัดตั้งกองทุนหมุนเวียนหลักสูตรนานาชาติแบบ Co-funding',
                  desc: 'ส่งเสริม Micro-credentials และ Joint Degree ร่วมกับภาคอุตสาหกรรมดิจิทัลชั้นนำทั้งในและต่างประเทศ',
                },
                {
                  id: 3,
                  title: '3. เกณฑ์ Fast-track จัดซื้อจัดจ้างสำหรับโครงการวิจัยทุนภายนอก',
                  desc: 'ลดระยะเวลาพิจารณาจาก 45 วัน เหลือ 14 วัน เพื่อความคล่องตัวในการส่งมอบผลงานวิจัยตามกำหนดสัญญาทุน',
                },
              ].map((rec) => {
                const isApplied = appliedRecommendations.includes(rec.id);
                return (
                  <div
                    key={rec.id}
                    className="p-5 bg-white rounded-2xl border border-[#ddc1b2]/30 space-y-2 shadow-xs flex justify-between items-start gap-4"
                  >
                    <div>
                      <div className="font-bold text-sm text-[#181c20]">{rec.title}</div>
                      <p className="text-[#564337] leading-relaxed mt-1">{rec.desc}</p>
                    </div>
                    <button
                      onClick={() => toggleApplyRec(rec.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap cursor-pointer transition-colors ${
                        isApplied
                          ? 'bg-[#366847] text-white'
                          : 'bg-[#ebeef3] text-[#181c20] hover:bg-[#e0e3e8]'
                      }`}
                    >
                      {isApplied ? 'นำไปปฏิบัติแล้ว ✓' : 'รับเป็นนโยบาย'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#e5e8ee] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-[#79564b]">
            ข้อมูลเชื่อมตรงกับระบบ CMU ERP และฐานข้อมูล EdPEx อัตโนมัติ
          </span>
          <button
            onClick={handleSign}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center gap-2 cursor-pointer ${
              signState ? 'bg-[#366847]' : 'bg-[#e87722] hover:bg-[#994700]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">approval_delegation</span>
            {signState ? 'รับรองและบันทึกผลสำเร็จ ✓' : 'รับรองรายงานสถิติ (Sign & Approve)'}
          </button>
        </div>
      </div>
    </div>
  );
};
