import { ProjectItem } from '../data/mockData';

interface ExportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectItem[];
  quarterLabel: string;
  totalAllocated: number;
  totalSpent: number;
  centralReserve: number;
}

export const ExportPreviewModal = ({
  isOpen,
  onClose,
  projects,
  quarterLabel,
  totalAllocated,
  totalSpent,
  centralReserve,
}: ExportPreviewModalProps) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const remaining = totalAllocated - totalSpent;
  const burnRate = totalAllocated > 0 ? ((totalSpent / totalAllocated) * 100).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 z-50 bg-[#181c20]/65 backdrop-blur-[6px] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-[1020px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh] border border-[#ddc1b2]/40 animate-in fade-in zoom-in duration-150">
        {/* Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#e87722] via-[#994700] to-[#366847]"></div>

        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-[#f8fafc] border-b border-[#e5e8ee] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e87722]/10 text-[#e87722] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]">description</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#743400] bg-[#ffdbc8] px-2 py-0.5 rounded-full uppercase">
                  ข้อมูลที่จะส่งออก
                </span>
                <span className="text-xs text-[#366847] font-bold">ช่วงเวลา: {quarterLabel}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#181c20]">
                เอกสารรายงานสรุปผลการบริหารงบประมาณ วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มช.
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[#ebeef3] text-[#79564b] transition-colors"
              title="ปิด"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Document Preview Body (Styled as official executive report) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#f1f4f9] space-y-6">
          <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-[#ddc1b2]/30 max-w-[920px] mx-auto space-y-6 text-xs text-[#181c20]">
            {/* Report Header Logo & Title */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#ddc1b2]/40 gap-4">
              <div>
                <span className="text-xs font-bold text-[#79564b] tracking-wider uppercase block">
                  College of Arts, Media and Technology (CAMT) • Chiang Mai University
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#181c20] mt-1">
                  รายงานสรุปสถานะงบประมาณและการเบิกจ่ายโครงการ
                </h1>
                <p className="text-xs text-[#564337] mt-1">
                  ประจำปีงบประมาณ 2569 • รอบการประเมิน: <strong>{quarterLabel}</strong>
                </p>
              </div>

              <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#ddc1b2]/30 text-right">
                <div className="text-[11px] text-[#79564b]">รหัสอ้างอิงเอกสาร:</div>
                <div className="font-mono font-bold text-xs text-[#181c20]">#CAMT-EXP-2569-{Date.now().toString().slice(-4)}</div>
                <div className="text-[10px] text-[#366847] font-semibold mt-0.5">CMU ERP Certified</div>
              </div>
            </div>

            {/* Financial Scorecard Summary Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f8fafc] p-4 rounded-xl border border-[#ddc1b2]/30">
              <div className="space-y-1">
                <span className="text-[11px] text-[#79564b] font-bold">งบจัดสรรรวมทั้งหมด</span>
                <div className="text-lg font-black text-[#181c20] tabular-nums">
                  ฿{totalAllocated.toLocaleString()}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] text-[#366847] font-bold">เบิกจ่ายจริงสะสม</span>
                <div className="text-lg font-black text-[#366847] tabular-nums">
                  ฿{totalSpent.toLocaleString()} ({burnRate}%)
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] text-[#994700] font-bold">งบกลางสำรองคณะ</span>
                <div className="text-lg font-black text-[#994700] tabular-nums">
                  ฿{centralReserve.toLocaleString()}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] text-[#79564b] font-bold">คงเหลือเบิกจ่ายได้อีก</span>
                <div className="text-lg font-black text-[#181c20] tabular-nums">
                  ฿{remaining.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Section 1: Detailed Projects Table in Export */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-[#181c20] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#e87722]">table_chart</span>
                  รายละเอียดโครงการที่อยู่ในขอบเขตรายงาน ({projects.length} รายการ)
                </h3>
                <span className="text-[11px] text-[#79564b]">หน่วยเงิน: บาท (THB)</span>
              </div>

              <div className="border border-[#ddc1b2]/40 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#ebeef3] text-[#79564b] uppercase font-bold border-b border-[#ddc1b2]/40">
                    <tr>
                      <th className="py-2.5 px-3">รหัส/ชื่อโครงการ</th>
                      <th className="py-2.5 px-2">สาขาวิชา/หน่วยงาน</th>
                      <th className="py-2.5 px-2 text-center">ไตรมาส</th>
                      <th className="py-2.5 px-3 text-right">งบจัดสรร</th>
                      <th className="py-2.5 px-3 text-right">เบิกจ่ายแล้ว</th>
                      <th className="py-2.5 px-2 text-center">ความคืบหน้า</th>
                      <th className="py-2.5 px-2 text-center">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ebeef3]">
                    {projects.map((p, idx) => (
                      <tr key={p.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#faf8f2]'}>
                        <td className="py-2.5 px-3">
                          <span className="font-bold block text-[#181c20]">{p.title}</span>
                          <span className="text-[10px] text-[#79564b] font-mono">{p.code} • ผู้รับผิดชอบ: {p.head}</span>
                        </td>
                        <td className="py-2.5 px-2 text-[#564337]">{p.dept}</td>
                        <td className="py-2.5 px-2 text-center">
                          <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold uppercase">
                            {p.quarter}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold tabular-nums">
                          ฿{p.allocated.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#366847] tabular-nums">
                          ฿{p.spent.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold">
                          {p.completionPct}%
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === 'approved'
                                ? 'bg-[#b8f0c5] text-[#1d5031]'
                                : p.status === 'active'
                                ? 'bg-[#ffdbc8] text-[#743400]'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {p.status === 'approved' ? 'อนุมัติครบ' : p.status === 'active' ? 'กำลังดำเนินงาน' : 'รอพิจารณา'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>


          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-6 py-4 bg-white border-t border-[#e5e8ee] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#79564b] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#366847]">check_circle</span>
            <span>ตรวจสอบความถูกต้องของข้อมูลพร้อมส่งออกเรียบร้อยแล้ว</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#ebeef3] hover:bg-[#e0e3e8] font-bold text-xs text-[#564337] cursor-pointer transition-colors"
            >
              ปิดหน้าต่าง
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-[#e87722] hover:bg-[#994700] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              พิมพ์รายงานนี้ทันที
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
