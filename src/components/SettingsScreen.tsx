import { useState } from 'react';

interface SettingsScreenProps {
  onCommitSuccess: () => void;
  onTestAPISuccess?: () => void;
  onExportReport?: () => void;
}

export const SettingsScreen = ({
  onCommitSuccess,
  onExportReport,
}: SettingsScreenProps) => {
  const [committed, setCommitted] = useState(false);

  // Editable rules state
  const [centralReserveMin, setCentralReserveMin] = useState<number>(28.75);
  const [reallocationLimit, setReallocationLimit] = useState<number>(200000);
  const [autoSLA, setAutoSLA] = useState<boolean>(true);

  const handleCommit = () => {
    setCommitted(true);
    onCommitSuccess();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl border border-[#ddc1b2]/40 flex flex-col relative overflow-hidden">
        {/* Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#994700] via-[#e87722] to-[#366847]"></div>

        {/* Header */}
        <div className="px-6 py-5 border-b border-[#e5e8ee] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded bg-[#ebeef3] font-mono text-[11px] font-bold text-[#181c20]">
                #CONFIG-2569-GOV
              </span>
              <span className="px-2.5 py-0.5 rounded bg-[#ffdbc8] text-[#743400] text-[11px] font-bold">
                Policy Review 2569
              </span>
              <span className="px-2.5 py-0.5 rounded bg-[#b8f0c5] text-[#1d5031] text-[11px] font-bold flex items-center gap-1 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]"></span>
                นโยบายมีผลบังคับใช้ (Active)
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#181c20] tracking-tight">
              เกณฑ์ควบคุมงบประมาณและเพดานจัดสรร ประจำปีงบประมาณ 2569
            </h1>
            <p className="text-sm text-[#564337] mt-1">
              วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มหาวิทยาลัยเชียงใหม่ • Fiscal Policy &amp; Allocation Limits
            </p>
          </div>

          {onExportReport && (
            <button
              onClick={onExportReport}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#ddc1b2]/60 hover:bg-[#ebeef3] text-xs font-bold text-[#181c20] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer self-start sm:self-center"
            >
              <span className="material-symbols-outlined text-[16px] text-[#79564b]">download</span>
              ส่งออกระเบียบ (PDF)
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 bg-[#f7f9ff] space-y-6">
          {/* Row 1: 4 Key Policy Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#ddc1b2]/30 shadow-xs">
              <span className="text-xs text-[#79564b] font-bold">เพดานงบประมาณจัดสรรสูงสุด</span>
              <div className="text-2xl font-black text-[#181c20] mt-2 tabular-nums">
                ฿12,000,000
              </div>
              <div className="text-xs text-[#366847] font-semibold mt-1">100% มติสภาวิทยาลัยฯ</div>
            </div>

            <div className="bg-[#FFF7F0] p-4 rounded-xl border-2 border-[#e87722] shadow-xs">
              <span className="text-xs font-bold text-[#e87722]">สำรองงบกลางขั้นต่ำ</span>
              <div className="text-2xl font-black text-[#994700] mt-2 tabular-nums">
                {centralReserveMin}%
              </div>
              <div className="text-xs text-[#564337] mt-1">เป้าหมายตามเกณฑ์ 25% - 30%</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#ddc1b2]/30 shadow-xs">
              <span className="text-xs text-[#79564b] font-bold">เพดานปรับเกลี่ยงบ</span>
              <div className="text-2xl font-black text-[#181c20] mt-2 tabular-nums">
                ฿{reallocationLimit.toLocaleString()}
              </div>
              <div className="text-xs text-[#564337] mt-1">อำนาจคณบดีต่อครั้ง</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#ddc1b2]/30 shadow-xs">
              <span className="text-xs text-[#79564b] font-bold">รอบความถี่ซิงก์ข้อมูล</span>
              <div className="text-2xl font-black text-[#366847] mt-2 tabular-nums">ทุก 15 นาที</div>
              <div className="text-xs text-[#564337] mt-1">CMU Data Pipeline</div>
            </div>
          </div>

          {/* Row 2: Editable Configuration Controls */}
          <div className="bg-white p-6 rounded-2xl border border-[#ddc1b2]/30 space-y-4 text-xs shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#ebeef3]">
              <div>
                <h3 className="font-bold text-sm text-[#181c20] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#e87722]">sliders</span>
                  ปรับแต่งเกณฑ์ควบคุมและการแจ้งเตือน (Interactive Policy Controls)
                </h3>
                <p className="text-[11px] text-[#79564b] mt-0.5">
                  ปรับพารามิเตอร์เกณฑ์ควบคุมความเสี่ยงงบประมาณและการบริหารสภาพคล่อง
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#f8fafc] rounded-xl space-y-2 border border-slate-100">
                <label className="font-bold text-[#181c20] block">
                  อัตราสำรองงบกลางขั้นต่ำ (% ของงบรวม):
                </label>
                <input
                  type="range"
                  min={20}
                  max={35}
                  step={0.25}
                  value={centralReserveMin}
                  onChange={(e) => setCentralReserveMin(Number(e.target.value))}
                  className="w-full accent-[#e87722]"
                />
                <div className="flex justify-between font-bold text-xs text-[#79564b]">
                  <span>20%</span>
                  <span className="text-[#e87722] text-sm">{centralReserveMin}%</span>
                  <span>35%</span>
                </div>
                <p className="text-[10.5px] text-[#564337]">
                  คำนวณเป็นวงเงินสำรอง: ฿{((12000000 * centralReserveMin) / 100).toLocaleString()} บ.
                </p>
              </div>

              <div className="p-4 bg-[#f8fafc] rounded-xl space-y-2 border border-slate-100">
                <label className="font-bold text-[#181c20] block">
                  เพดานปรับเกลี่ยงบข้ามหมวดในอำนาจคณบดี (บาท):
                </label>
                <select
                  value={reallocationLimit}
                  onChange={(e) => setReallocationLimit(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-[#ddc1b2]/60 font-bold bg-white text-[#181c20] outline-none cursor-pointer focus:border-[#e87722]"
                >
                  <option value={100000}>฿100,000 ต่อครั้ง</option>
                  <option value={200000}>฿200,000 ต่อครั้ง (มาตรฐานสภาวิทยาลัยฯ)</option>
                  <option value={300000}>฿300,000 ต่อครั้ง</option>
                  <option value={500000}>฿500,000 ต่อครั้ง (วงเงินพิเศษ)</option>
                </select>
                <p className="text-[10.5px] text-[#564337]">
                  กรณีเกินเพดานนี้ ต้องเสนอขอความเห็นชอบจากคณะกรรมการบริหารวิทยาลัย
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#f8fafc] rounded-xl flex items-center justify-between border border-slate-100">
              <div>
                <strong className="block text-[#181c20]">ระบบแจ้งเตือนอัตโนมัติเมื่อเบิกจ่ายล่าช้า</strong>
                <span className="text-[#79564b]">ส่งข้อความและอีเมลแจ้งเตือนหัวหน้าโครงการและผู้รับผิดชอบเมื่อไม่เป็นไปตามแผน</span>
              </div>
              <button
                onClick={() => setAutoSLA(!autoSLA)}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                  autoSLA ? 'bg-[#366847] text-white' : 'bg-[#e0e3e8] text-[#564337]'
                }`}
              >
                {autoSLA ? 'เปิดใช้งานอยู่ ✓' : 'ปิดการแจ้งเตือน'}
              </button>
            </div>
          </div>

          {/* Row 3: Policy Framework and Compliance Guidelines */}
          <div className="bg-white p-6 rounded-2xl border border-[#ddc1b2]/30 space-y-3 text-xs shadow-xs">
            <h3 className="font-bold text-sm text-[#181c20] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#e87722]">verified_user</span>
              กรอบนโยบายและการกำกับดูแลทางการเงิน (Governance &amp; Fiscal Compliance)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-[#181c20] block">กรอบงบประมาณรวม</span>
                <p className="text-[11px] text-[#564337] leading-relaxed">
                  วงเงินรวม ฿12.0M ได้รับการอนุมัติจากสภาวิทยาลัยฯ แบ่งเป็นงบจัดสรร 37 ส่วนงาน ฿8.55M และงบสำรองส่วนกลาง ฿3.45M
                </p>
              </div>
              <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-[#181c20] block">การปรับเกลี่ยงบประมาณ</span>
                <p className="text-[11px] text-[#564337] leading-relaxed">
                  อนุญาตให้ปรับเกลี่ยเงินเหลือจ่ายจากโครงการที่เสร็จสิ้นเข้าสู่งบกลาง เพื่อจัดสรรใหม่ให้โครงการเร่งด่วนตามลำดับความสำคัญ
                </p>
              </div>
              <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-[#181c20] block">มาตรฐาน EdPEx &amp; ธรรมาภิบาล</span>
                <p className="text-[11px] text-[#564337] leading-relaxed">
                  ติดตามผลสัมฤทธิ์และดัชนีชี้วัดรายไตรมาสผ่านระบบ CMU ERP และบันทึกประวัติการเปลี่ยนแปลงตามมาตรฐานความปลอดภัย
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#e5e8ee] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-[#79564b]">
            บันทึกความปลอดภัย CMU SSO &amp; 2FA • Session ID: #CAMT-SEC-88219
          </span>
          <button
            onClick={handleCommit}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center gap-2 cursor-pointer ${
              committed ? 'bg-[#366847]' : 'bg-[#e87722] hover:bg-[#994700]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {committed ? 'check_circle' : 'approval_delegation'}
            </span>
            {committed ? 'บันทึกและรับรองการตั้งค่าแล้ว ✓' : 'รับรองและบันทึกการตั้งค่า (Commit & Sign)'}
          </button>
        </div>
      </div>
    </div>
  );
};
