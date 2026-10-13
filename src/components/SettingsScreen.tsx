import { useState } from 'react';

interface SettingsScreenProps {
  onCommitSuccess?: () => void;
  onTestAPISuccess?: () => void;
  onExportReport?: () => void;
}

export const SettingsScreen = ({
  onTestAPISuccess,
  onExportReport,
}: SettingsScreenProps) => {
  const [activeTab, setActiveTab] = useState<'tab-rules' | 'tab-roles' | 'tab-api' | 'tab-audit'>('tab-rules');
  const [testing, setTesting] = useState(false);

  // Editable rules state
  const [centralReserveMin, setCentralReserveMin] = useState<number>(28.75);
  const [reallocationLimit, setReallocationLimit] = useState<number>(200000);
  const [autoSLA, setAutoSLA] = useState<boolean>(true);

  const handleTestAPI = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      onTestAPISuccess?.();
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl border border-[#ddc1b2]/40 flex flex-col relative">
        {/* Card Header Section - Sticky Locked */}
        <div className="sticky top-20 z-30 bg-white rounded-t-2xl shadow-sm border-b border-[#e5e8ee]">
          {/* Ribbon */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#994700] via-[#e87722] to-[#366847] rounded-t-2xl"></div>

          {/* Header */}
          <div className="px-6 py-4 sm:py-5 border-b border-[#e5e8ee] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
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

          {/* Navigation Tabs */}
          <div className="px-4 sm:px-6 bg-[#f1f4f9] flex flex-wrap items-center gap-1.5 sm:gap-2 py-2">
            {[
              { id: 'tab-rules', label: 'เกณฑ์ควบคุมงบประมาณและเพดานจัดสรร', shortLabel: 'เกณฑ์ควบคุมและเพดานจัดสรร', icon: 'tune' },
              { id: 'tab-roles', label: 'สิทธิ์และการอนุมัติลงนาม (RBAC)', shortLabel: 'สิทธิ์และอนุมัติ (RBAC)', icon: 'admin_panel_settings', badge: '8 บทบาท' },
              { id: 'tab-api', label: 'การเชื่อมต่อระบบภายนอก (API Sync)', shortLabel: 'เชื่อมต่อภายนอก (API)', icon: 'hub', badge: '4/4 สมบูรณ์' },
              { id: 'tab-audit', label: 'บันทึกประวัติการเปลี่ยนแปลง (Audit Log)', shortLabel: 'ประวัติระบบ (Audit Log)', icon: 'history' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                  activeTab === t.id
                    ? 'bg-[#e87722] text-white shadow-sm'
                    : 'text-[#181c20] hover:bg-[#e4e8ef]'
                }`}
              >
                <span className="material-symbols-outlined text-[17px] sm:text-[18px]">{t.icon}</span>
                <span className="hidden 2xl:inline whitespace-nowrap">{t.label}</span>
                <span className="inline 2xl:hidden whitespace-nowrap">{t.shortLabel}</span>
                {t.badge && (
                  <span
                    className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      activeTab === t.id ? 'bg-white/25 text-white' : 'bg-[#e2e8f0] text-[#475569]'
                    }`}
                  >
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 bg-[#f7f9ff] space-y-6 rounded-b-2xl">
          {/* TAB 1: Rules & Allocation Thresholds */}
          {activeTab === 'tab-rules' && (
            <div className="space-y-6">
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
          )}

          {/* TAB 2: RBAC Role-Based Access Control (8 Roles) */}
          {activeTab === 'tab-roles' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-[#ddc1b2]/30 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#ebeef3] pb-3">
                  <div>
                    <h3 className="text-base font-bold text-[#181c20] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-[#e87722]">admin_panel_settings</span>
                      สิทธิ์และอำนาจการอนุมัติงบประมาณ (Role-Based Access Control)
                    </h3>
                    <p className="text-xs text-[#79564b] mt-0.5">
                      กำหนดขอบเขตอำนาจการลงนามอนุมัติเบิกจ่ายและโอนเปลี่ยนแปลงงบประมาณ ตามระเบียบการเงิน มหาวิทยาลัยเชียงใหม่
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#f1f4f9] text-[#181c20] text-xs font-bold border border-[#ddc1b2]/40">
                    8 บทบาทผู้ใช้งานที่ได้รับอนุมัติ
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[620px]">
                    <thead>
                      <tr className="bg-[#f1f4f9] uppercase text-[#79564b] font-bold border-b border-[#e5e8ee]">
                        <th className="py-2.5 px-2.5 sm:px-3 whitespace-nowrap">บทบาท (Role)</th>
                        <th className="py-2.5 px-2.5 sm:px-3">ผู้ดำรงตำแหน่ง / ผู้รับผิดชอบ</th>
                        <th className="py-2.5 px-2.5 sm:px-3 whitespace-nowrap">เพดานวงเงินอนุมัติ</th>
                        <th className="py-2.5 px-2.5 sm:px-3">การยืนยันตัวตน (Authentication)</th>
                        <th className="py-2.5 px-2.5 sm:px-3 text-center whitespace-nowrap">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ebeef3]">
                      <tr className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 font-bold text-[#181c20] flex items-center gap-1.5 whitespace-nowrap">
                          <span className="w-2 h-2 rounded-full bg-[#e87722]"></span>
                          คณบดี (Dean)
                        </td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-[#564337] font-medium">รศ.ดร. นพดล ผู้บริหาร</td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 font-black text-[#e87722] tabular-nums whitespace-nowrap">&gt; ฿500,000 (ไม่จำกัดวงเงิน)</td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-[#366847] font-bold flex items-center gap-1 whitespace-nowrap">
                          <span className="material-symbols-outlined text-[15px]">verified</span>
                          CMU OTP + 2FA Hardware Key
                        </td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-[#b8f0c5] text-[#1d5031] text-[10px] font-bold">Active</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 font-bold text-[#181c20] flex items-center gap-1.5 whitespace-nowrap">
                          <span className="w-2 h-2 rounded-full bg-[#e87722]/80"></span>
                          รองคณบดีฝ่ายบริหารและการคลัง
                        </td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-[#564337] font-medium">ผศ. สุรชัย วัฒนา</td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 font-bold text-[#181c20] tabular-nums whitespace-nowrap">฿100,001 - ฿500,000</td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-[#366847] font-semibold flex items-center gap-1 whitespace-nowrap">
                          <span className="material-symbols-outlined text-[15px]">security</span>
                          CMU SSO + Mobile OTP
                        </td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-[#b8f0c5] text-[#1d5031] text-[10px] font-bold">Active</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 font-bold text-[#181c20] flex items-center gap-1.5 whitespace-nowrap">
                          <span className="w-2 h-2 rounded-full bg-[#366847]"></span>
                          รองคณบดีฝ่ายวิชาการและวิจัย
                        </td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-[#564337] font-medium">ผศ.ดร. อรัญญา ปัญญาวงศ์</td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 font-bold text-[#181c20] tabular-nums whitespace-nowrap">฿50,001 - ฿200,000</td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-[#564337] font-medium whitespace-nowrap">CMU SSO + Mobile OTP</td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-[#b8f0c5] text-[#1d5031] text-[10px] font-bold">Active</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 font-bold text-[#181c20] flex items-center gap-1.5 whitespace-nowrap">
                          <span className="w-2 h-2 rounded-full bg-[#366847]"></span>
                          หัวหน้าสำนักวิชา / ผู้อำนวยการศูนย์
                        </td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-[#564337] font-medium">ผศ.ดร. วิเชียร นันตา</td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 font-bold text-[#181c20] tabular-nums whitespace-nowrap">฿50,001 - ฿100,000</td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-[#564337] whitespace-nowrap">CMU SSO</td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-[#b8f0c5] text-[#1d5031] text-[10px] font-bold">Active</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 font-bold text-[#181c20] flex items-center gap-1.5 whitespace-nowrap">
                          <span className="w-2 h-2 rounded-full bg-[#79564b]"></span>
                          หัวหน้าสาขาวิชา (SE, DII, ANI, ฯลฯ)
                        </td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-[#564337] font-medium">หัวหน้าภาควิชาและหลักสูตรทั้ง 6</td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 font-bold text-[#181c20] tabular-nums whitespace-nowrap">ไม่เกิน ฿50,000</td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-[#564337] whitespace-nowrap">CMU SSO</td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-[#b8f0c5] text-[#1d5031] text-[10px] font-bold">Active</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 font-bold text-[#181c20] flex items-center gap-1.5 whitespace-nowrap">
                          <span className="w-2 h-2 rounded-full bg-[#79564b]"></span>
                          หัวหน้าโครงการวิจัยและบริการวิชาการ
                        </td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-[#564337] font-medium">อาจารย์และนักวิจัยหัวหน้าโครงการ</td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 font-bold text-[#181c20] tabular-nums whitespace-nowrap">ไม่เกิน ฿30,000 (ตามกรอบแผน)</td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-[#564337] whitespace-nowrap">CMU SSO</td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-[#b8f0c5] text-[#1d5031] text-[10px] font-bold">Active</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 font-bold text-[#181c20] flex items-center gap-1.5 whitespace-nowrap">
                          <span className="w-2 h-2 rounded-full bg-[#366847]"></span>
                          หัวหน้างานการเงิน พัสดุ และพัสดุกลาง
                        </td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-[#564337] font-medium">นางสาวสมใจ รักษ์คลัง</td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 font-semibold text-[#366847] whitespace-nowrap">ตรวจสอบและตัดยอดงบประมาณ</td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-[#366847] font-semibold whitespace-nowrap">CMU SSO + Digital Certificate</td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-[#b8f0c5] text-[#1d5031] text-[10px] font-bold">Active</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 font-bold text-[#181c20] flex items-center gap-1.5 whitespace-nowrap">
                          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                          ผู้ดูแลระบบสารสนเทศ (SuperAdmin)
                        </td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-[#564337] font-medium">ทีมสารสนเทศ CAMT IT Center</td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-[#79564b] italic whitespace-nowrap">จัดการสิทธิ์และระบบ (ไม่มีสิทธิ์เบิกจ่าย)</td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-[#366847] font-semibold whitespace-nowrap">2FA FIDO2 Hardware Key</td>
                        <td className="py-2.5 sm:py-3 px-2.5 sm:px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-[#b8f0c5] text-[#1d5031] text-[10px] font-bold">Active</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-slate-100 flex items-center justify-between text-xs text-[#79564b]">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#366847]">lock</span>
                    บังคับใช้ระบบ 2FA และ CMU SSO ตามเกณฑ์มาตรฐานความปลอดภัยไซเบอร์สากล ISO/IEC 27001
                  </span>
                  <span className="font-semibold text-[#181c20]">อัปเดตสิทธิ์ล่าสุด: 18 พ.ค. 2569</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: API Gateway & External Integrations */}
          {activeTab === 'tab-api' && (
            <div className="space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-5 rounded-2xl border border-[#ddc1b2]/30 shadow-xs">
                <div>
                  <strong className="text-sm font-bold text-[#181c20] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#e87722]">hub</span>
                    สถานะการเชื่อมต่อ API Gateway &amp; Microservices
                  </strong>
                  <div className="text-[#366847] font-bold mt-0.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#366847] animate-pulse"></span>
                    4/4 จุดเชื่อมต่อสมบูรณ์ (Average Latency: 0.65s)
                  </div>
                </div>
                <button
                  onClick={handleTestAPI}
                  disabled={testing}
                  className="px-4 py-2 rounded-xl bg-[#ebeef3] hover:bg-[#e0e3e8] text-[#181c20] font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <span className={`material-symbols-outlined text-[16px] ${testing ? 'animate-spin' : ''}`}>
                    sync
                  </span>
                  {testing ? 'กำลังทดสอบการเชื่อมต่อ...' : 'ทดสอบเชื่อมต่อ (Test Connection)'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#ddc1b2]/30 shadow-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <strong className="text-sm text-[#181c20]">CMU-ERP Financial Ledger</strong>
                    <span className="text-[10px] bg-[#b8f0c5] text-[#1d5031] px-2 py-0.5 rounded-full font-bold">Online</span>
                  </div>
                  <span className="text-[#79564b] font-mono block text-[11px]">/api/v2/finance/gl-cmu</span>
                  <p className="text-[11px] text-[#564337]">เชื่อมต่อสมุดบัญชีแยกประเภทและงบดุลกลางมหาวิทยาลัยเชียงใหม่</p>
                  <div className="pt-1 flex items-center justify-between text-[#366847] font-bold border-t border-slate-100">
                    <span>Healthy 100% • 0.62s</span>
                    <span className="text-[#79564b] text-[10px] font-normal">อัปเดตเมื่อ 2 นาทีที่แล้ว</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#ddc1b2]/30 shadow-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <strong className="text-sm text-[#181c20]">GFMIS Thai e-Payment Gateway</strong>
                    <span className="text-[10px] bg-[#b8f0c5] text-[#1d5031] px-2 py-0.5 rounded-full font-bold">Online</span>
                  </div>
                  <span className="text-[#79564b] font-mono block text-[11px]">/gfmis/v4/mof-sync</span>
                  <p className="text-[11px] text-[#564337]">ระบบการบริหารการเงินการคลังภาครัฐแบบอิเล็กทรอนิกส์ กรมบัญชีกลาง</p>
                  <div className="pt-1 flex items-center justify-between text-[#366847] font-bold border-t border-slate-100">
                    <span>Healthy 100% • 1.18s</span>
                    <span className="text-[#79564b] text-[10px] font-normal">อัปเดตเมื่อ 5 นาทีที่แล้ว</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#ddc1b2]/30 shadow-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <strong className="text-sm text-[#181c20]">CMU Central OAuth 2.0 &amp; SSO</strong>
                    <span className="text-[10px] bg-[#b8f0c5] text-[#1d5031] px-2 py-0.5 rounded-full font-bold">Online</span>
                  </div>
                  <span className="text-[#79564b] font-mono block text-[11px]">/oauth2/v3/cmu-auth</span>
                  <p className="text-[11px] text-[#564337]">บริการยืนยันตัวตนกลาง CMU Account และ Two-Factor Authentication</p>
                  <div className="pt-1 flex items-center justify-between text-[#366847] font-bold border-t border-slate-100">
                    <span>Healthy 100% • 0.35s</span>
                    <span className="text-[#79564b] text-[10px] font-normal">Realtime Active</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#ddc1b2]/30 shadow-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <strong className="text-sm text-[#181c20]">CAMT Budget Data Warehouse</strong>
                    <span className="text-[10px] bg-[#b8f0c5] text-[#1d5031] px-2 py-0.5 rounded-full font-bold">Online</span>
                  </div>
                  <span className="text-[#79564b] font-mono block text-[11px]">/dw/v1/budget-metrics</span>
                  <p className="text-[11px] text-[#564337]">คลังข้อมูลวิเคราะห์ผลการเบิกจ่ายและดัชนีชี้วัด EdPEx ระดับวิทยาลัย</p>
                  <div className="pt-1 flex items-center justify-between text-[#366847] font-bold border-t border-slate-100">
                    <span>Healthy 100% • 0.45s</span>
                    <span className="text-[#79564b] text-[10px] font-normal">อัปเดตเมื่อ 1 นาทีที่แล้ว</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Audit Log */}
          {activeTab === 'tab-audit' && (
            <div className="bg-white p-6 rounded-2xl border border-[#ddc1b2]/30 space-y-3 text-xs shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#ebeef3]">
                <div>
                  <h3 className="font-bold text-sm text-[#181c20] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#e87722]">history</span>
                    บันทึกประวัติการเปลี่ยนแปลง (System Audit Log)
                  </h3>
                  <p className="text-[11px] text-[#79564b] mt-0.5">
                    ตรวจสอบประวัติการแก้ไขนโยบาย การปรับวงเงิน และการเข้าถึงระบบตามมาตรฐานความปลอดภัย
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#ebeef3] text-[#564337] font-mono text-[11px] font-semibold">
                  5 รายการล่าสุด
                </span>
              </div>

              <div className="p-3.5 bg-[#f8fafc] rounded-xl space-y-1 border border-slate-100">
                <div className="flex justify-between font-bold flex-wrap gap-1">
                  <span className="text-[#e87722]">ปรับปรุงเพดานงบประมาณรองคณบดี (฿500,000)</span>
                  <span className="text-[#79564b]">18 พ.ค. 2569 • 11:24 น.</span>
                </div>
                <p className="text-[#564337]">
                  โดย รศ.ดร. นพดล ผู้บริหาร (คณบดี) • Session #CAMT-SEC-88219 • IP 202.28.24.12
                </p>
              </div>

              <div className="p-3.5 bg-[#f8fafc] rounded-xl space-y-1 border border-slate-100">
                <div className="flex justify-between font-bold flex-wrap gap-1">
                  <span className="text-[#366847]">รับรองแผนจัดสรรงบประมาณไตรมาส 3 (Q3 Final Approval)</span>
                  <span className="text-[#79564b]">16 พ.ค. 2569 • 14:15 น.</span>
                </div>
                <p className="text-[#564337]">
                  โดย ผศ. สุรชัย วัฒนา (รองคณบดีฝ่ายบริหารและการคลัง) • Session #CAMT-SEC-88102 • IP 202.28.24.15
                </p>
              </div>

              <div className="p-3.5 bg-[#f8fafc] rounded-xl space-y-1 border border-slate-100">
                <div className="flex justify-between font-bold flex-wrap gap-1">
                  <span className="text-[#366847]">เปิดระบบแจ้งเตือน SLA อัตโนมัติ</span>
                  <span className="text-[#79564b]">15 พ.ค. 2569 • 09:40 น.</span>
                </div>
                <p className="text-[#564337]">โดย ผู้ดูแลระบบ Admin-Sec • CMU IT Center</p>
              </div>

              <div className="p-3.5 bg-[#f8fafc] rounded-xl space-y-1 border border-slate-100">
                <div className="flex justify-between font-bold flex-wrap gap-1">
                  <span className="text-[#181c20]">ซิงก์ข้อมูลยอดเงินคงเหลือจาก GFMIS สำเร็จ</span>
                  <span className="text-[#79564b]">วันนี้ • 04:30 น.</span>
                </div>
                <p className="text-[#564337]">
                  โดย Automated System Service #SYNC-GFMIS-01 • สรุปยอด 37 ส่วนงานถูกต้องสมบูรณ์
                </p>
              </div>

              <div className="p-3.5 bg-[#f8fafc] rounded-xl space-y-1 border border-slate-100">
                <div className="flex justify-between font-bold flex-wrap gap-1">
                  <span className="text-[#564337]">ปรับเกลี่ยเงินเหลือจ่ายโครงการวิจัยเข้าสมทบงบกลาง</span>
                  <span className="text-[#79564b]">12 พ.ค. 2569 • 16:00 น.</span>
                </div>
                <p className="text-[#564337]">
                  โดย นางสาวสมใจ รักษ์คลัง (งานการเงินและพัสดุ) • Session #CAMT-SEC-87980 • วงเงิน ฿150,000
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
