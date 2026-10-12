import { useState } from 'react';
import { DepartmentSummary } from '../data/mockData';

interface AllocationScreenProps {
  departments: DepartmentSummary[];
  onCommitSuccess?: () => void;
  onOpenEditModal: () => void;
  onExportReport: () => void;
}

export const AllocationScreen = ({
  departments,
  onCommitSuccess,
  onOpenEditModal,
  onExportReport,
}: AllocationScreenProps) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'departments' | 'strategic' | 'conditions'>('summary');
  const [approved, setApproved] = useState(false);

  const totalAllocated = departments.reduce((acc, d) => acc + d.amount, 0);
  const centralReserve = 12000000 - totalAllocated;
  const centralReservePct = ((centralReserve / 12000000) * 100).toFixed(2);
  const deptPct = ((totalAllocated / 12000000) * 100).toFixed(2);

  const handleSignAllocation = () => {
    setApproved(!approved);
    if (!approved && onCommitSuccess) onCommitSuccess();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl border border-[#ddc1b2]/40 overflow-hidden flex flex-col">
        {/* Top Gradient */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#e87722] via-[#b58d80] to-[#366847]"></div>

        {/* Header */}
        <div className="px-6 py-5 border-b border-[#e5e8ee] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#ffdbc8] text-[#743400] text-xs font-bold uppercase tracking-wider">
                #ALLOC-2569-PLAN
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#b8f0c5] text-[#1d5031] text-xs font-bold">
                {approved ? 'ลงนามอนุมัติแล้ว' : 'ฉบับพิจารณาขั้นสุดท้าย'}
              </span>
              <span className="text-xs text-[#79564b]">รอบการจัดสรรหลัก (Annual Quota)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#181c20]">
              พรีวิวแผนการจัดสรรงบประมาณ ประจำปีงบประมาณ 2569
            </h2>
            <p className="text-xs text-[#564337] mt-0.5">
              วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มหาวิทยาลัยเชียงใหม่ • Fiscal Allocation Master Matrix
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onExportReport}
              className="p-2.5 rounded-xl text-[#564337] hover:bg-[#ebeef3] transition-colors cursor-pointer border border-[#ddc1b2]/40"
              title="ดาวน์โหลด PDF สรุปแผนงบ"
            >
              <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 bg-[#f1f4f9] border-b border-[#e5e8ee] flex gap-2 overflow-x-auto py-2.5">
          {[
            { id: 'summary', label: 'สรุปการจัดสรรภาพรวม (Overall Summary)', icon: 'query_stats' },
            { id: 'departments', label: 'แจกแจงราย 6 ภาควิชา/หน่วยงาน', icon: 'apartment', badge: '6' },
            { id: 'strategic', label: 'เปรียบเทียบตาม 5 ยุทธศาสตร์', icon: 'flag' },
            { id: 'conditions', label: 'บันทึกเงื่อนไขและข้อกำหนด', icon: 'rule' },
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
              {t.badge && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeTab === t.id ? 'bg-white text-[#994700]' : 'bg-[#e0e3e8] text-[#181c20]'
                  }`}
                >
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 bg-[#f7f9ff] space-y-6">
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Summary KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#ddc1b2]/30 shadow-xs">
                  <span className="text-xs text-[#79564b] font-bold">งบประมาณรวมทั้งสิ้น</span>
                  <div className="text-2xl font-black text-[#181c20] mt-2 tabular-nums">
                    ฿12,000,000
                  </div>
                  <div className="text-xs text-[#366847] font-semibold mt-1">
                    100% สภาวิทยาลัยฯ รับรอง
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#ddc1b2]/30 shadow-xs">
                  <span className="text-xs text-[#79564b] font-bold">วงเงินจัดสรรให้ 6 ส่วนงาน</span>
                  <div className="text-2xl font-black text-[#366847] mt-2 tabular-nums">
                    ฿{totalAllocated.toLocaleString()}
                  </div>
                  <div className="text-xs text-[#564337] mt-1">สัดส่วน {deptPct}% ของงบรวม</div>
                </div>

                <div className="bg-[#FFF7F0] p-4 rounded-xl border-2 border-[#e87722] shadow-xs">
                  <span className="text-xs font-bold text-[#e87722]">งบสำรองคลังกลางคงเหลือ</span>
                  <div className="text-2xl font-black text-[#994700] mt-2 tabular-nums">
                    ฿{centralReserve.toLocaleString()}
                  </div>
                  <div className="text-xs text-[#564337] mt-1">สำรองเร่งด่วน {centralReservePct}%</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#ddc1b2]/30 shadow-xs">
                  <span className="text-xs text-[#79564b] font-bold">จำนวนโครงการครอบคลุม</span>
                  <div className="text-2xl font-black text-[#181c20] mt-2 tabular-nums">
                    24 โครงการ
                  </div>
                  <div className="text-xs text-[#564337] mt-1">ครบทั้ง 6 สาขาวิชา</div>
                </div>
              </div>

              {/* Progress Bar Proportion */}
              <div className="bg-white p-5 rounded-xl border border-[#ddc1b2]/30 space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#181c20]">
                  <span>สัดส่วนการกระจายโครงสร้างงบประมาณ</span>
                  <span className="text-[#366847]">ผ่านเกณฑ์ธรรมาภิบาล</span>
                </div>
                <div className="w-full h-6 rounded-full bg-[#ebeef3] overflow-hidden flex border border-[#ddc1b2]/30">
                  <div
                    className="h-full bg-[#366847] flex items-center justify-center text-[10px] text-white font-bold tracking-wide transition-all duration-500"
                    style={{ width: `${deptPct}%` }}
                  >
                    จัดสรรให้ 6 ส่วนงาน {deptPct}% (฿{(totalAllocated / 1000000).toFixed(2)}M)
                  </div>
                  <div
                    className="h-full bg-[#e87722] flex items-center justify-center text-[10px] text-white font-bold tracking-wide transition-all duration-500"
                    style={{ width: `${centralReservePct}%` }}
                  >
                    สำรองคลังกลาง {centralReservePct}% (฿{(centralReserve / 1000000).toFixed(2)}M)
                  </div>
                </div>
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
                      <th className="py-3 px-3 text-center">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ebeef3]">
                    {departments.map((u) => {
                      const share = totalAllocated > 0 ? ((u.amount / totalAllocated) * 100).toFixed(1) + '%' : '0%';
                      return (
                        <tr key={u.code} className="hover:bg-[#FFF7F0]/30 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#181c20]">
                              {u.name} ({u.code})
                            </div>
                            <div className="text-[11px] text-[#79564b]">{u.en}</div>
                          </td>
                          <td className="py-3.5 px-3">{u.prjCount} โครงการ</td>
                          <td className="py-3.5 px-3 text-right font-bold tabular-nums text-[#564337]">
                            {share}
                          </td>
                          <td className="py-3.5 px-4 text-right font-black text-[#181c20] tabular-nums">
                            ฿{u.amount.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className="px-2.5 py-1 rounded-full bg-[#b8f0c5] text-[#1d5031] font-bold text-[11px]">
                              {approved ? 'อนุมัติเรียบร้อย' : 'พร้อมลงนามจัดสรร'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'departments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departments.map((u) => {
                const share = totalAllocated > 0 ? ((u.amount / totalAllocated) * 100).toFixed(1) + '%' : '0%';
                return (
                  <div
                    key={u.code}
                    className="bg-white p-5 rounded-2xl border border-[#ddc1b2]/30 shadow-xs space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-sm text-[#181c20]">{u.name}</h4>
                        <span className="text-xs text-[#79564b]">
                          {u.en} • {u.prjCount} โครงการ
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#b8f0c5] text-[#1d5031] text-xs font-bold">
                        {approved ? 'อนุมัติแล้ว' : 'พร้อมจัดสรร'}
                      </span>
                    </div>
                    <div className="bg-[#f1f4f9] p-3 rounded-xl flex justify-between items-center text-xs">
                      <span className="text-[#564337] font-semibold">วงเงินจัดสรรประจำปี:</span>
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
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'strategic' && (
            <div className="bg-white p-6 rounded-2xl border border-[#ddc1b2]/30 space-y-4 text-xs shadow-xs">
              <h3 className="text-sm font-bold text-[#181c20] mb-2">
                การกระจายวงเงินตาม 5 ยุทธศาสตร์หลักของวิทยาลัย
              </h3>
              {[
                { id: 'SO1', title: 'ยุทธศาสตร์ 1: พัฒนาศักยภาพนักศึกษา (Student Quality)', amt: '฿3,200,000', pct: '26.7%' },
                { id: 'SO2', title: 'ยุทธศาสตร์ 2: ยกระดับวิชาการและหลักสูตร (Academic Excellence)', amt: '฿3,500,000', pct: '29.2%' },
                { id: 'SO3', title: 'ยุทธศาสตร์ 3: ขับเคลื่อนงานวิจัยระดับแนวหน้า (Research & Innovation)', amt: '฿2,800,000', pct: '23.3%' },
                { id: 'SO4', title: 'ยุทธศาสตร์ 4: บริการวิชาการสู่สังคม (Social Impact)', amt: '฿1,300,000', pct: '10.8%' },
                { id: 'SO5', title: 'ยุทธศาสตร์ 5: บริหารจัดการองค์กรยั่งยืน (Agile Governance)', amt: '฿1,200,000', pct: '10.0%' },
              ].map((st) => (
                <div key={st.id} className="space-y-1.5 p-3 rounded-xl bg-[#f1f4f9]">
                  <div className="flex justify-between font-bold text-[#181c20]">
                    <span>{st.title}</span>
                    <span className="tabular-nums text-[#e87722]">{st.amt} ({st.pct})</span>
                  </div>
                  <div className="w-full bg-[#ebeef3] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#e87722] h-full rounded-full transition-all duration-500"
                      style={{ width: st.pct }}
                    ></div>
                  </div>
                </div>
              ))}
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
                  และทุนสนับสนุนโครงการยุทธศาสตร์เร่งด่วนของมหาวิทยาลัย
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="px-6 py-4 bg-white border-t border-[#e5e8ee] flex flex-col sm:flex-row items-center justify-between gap-3">
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
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                approved ? 'bg-[#366847]' : 'bg-[#e87722] hover:bg-[#994700]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>{approved ? 'ลงนามอนุมัติสำเร็จแล้ว! ✓' : 'ลงนามอนุมัติการจัดสรรงบประมาณ'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
