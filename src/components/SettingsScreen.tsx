import { useState } from 'react';

interface SettingsScreenProps {
  onCommitSuccess: () => void;
  onTestAPISuccess: () => void;
  onExportReport: () => void;
}

export const SettingsScreen = ({
  onCommitSuccess,
  onTestAPISuccess,
  onExportReport,
}: SettingsScreenProps) => {
  const [activeTab, setActiveTab] = useState<'tab-rules' | 'tab-roles' | 'tab-api' | 'tab-audit'>('tab-rules');
  const [testing, setTesting] = useState(false);
  const [committed, setCommitted] = useState(false);

  // Editable rules state
  const [centralReserveMin, setCentralReserveMin] = useState<number>(28.75);
  const [reallocationLimit, setReallocationLimit] = useState<number>(200000);
  const [autoSLA, setAutoSLA] = useState<boolean>(true);

  const handleTestAPI = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      onTestAPISuccess();
    }, 800);
  };

  const handleCommit = () => {
    setCommitted(true);
    onCommitSuccess();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl border border-[#ddc1b2]/40 flex flex-col relative">
        {/* Card Header Section - Sticky Locked */}
        <div className="sticky top-20 z-30 bg-white rounded-t-2xl shadow-sm border-b border-[#e5e8ee]">
          {/* Ribbon */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#994700] via-[#e87722] to-[#366847] rounded-t-2xl"></div>

        {/* Header */}
        <div className="px-6 py-3.5 border-b border-[#e5e8ee] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded bg-[#ebeef3] font-mono text-[11px] font-bold text-[#181c20]">
                #CONFIG-2569-GOV
              </span>
              <span className="px-2.5 py-0.5 rounded bg-[#ffdbc8] text-[#743400] text-[11px] font-bold">
                Policy Review 2569
              </span>
              <span className="px-2.5 py-0.5 rounded bg-[#b8f0c5] text-[#1d5031] text-[11px] font-bold">
                Compliance Verified
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#181c20]">
              การตั้งค่าระบบและการกำกับดูแล ประจำปีงบประมาณ 2569
            </h1>
            <p className="text-[11px] text-[#564337]">
              วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มหาวิทยาลัยเชียงใหม่ • Fiscal Policy &amp; System Matrix
            </p>
          </div>
          <div className="flex items-center gap-2">

            <button
              onClick={onExportReport}
              className="p-2 rounded-xl text-[#564337] hover:bg-[#ebeef3] transition-colors cursor-pointer border border-[#ddc1b2]/40 bg-white"
              title="พิมพ์"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 bg-[#f1f4f9] border-b border-[#e5e8ee] flex gap-2 overflow-x-auto py-2">
          {[
            { id: 'tab-rules', label: 'เกณฑ์ควบคุมงบประมาณและเพดานจัดสรร', icon: 'tune' },
            { id: 'tab-roles', label: 'สิทธิ์และการอนุมัติลงนาม (RBAC)', icon: 'admin_panel_settings', badge: '8 บทบาท' },
            { id: 'tab-api', label: 'การเชื่อมต่อระบบภายนอก (API Sync)', icon: 'hub', badge: '4/4 สมบูรณ์' },
            { id: 'tab-audit', label: 'บันทึกประวัติการเปลี่ยนแปลง (Audit Log)', icon: 'history' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === t.id
                  ? 'bg-[#e87722] text-white shadow-xs'
                  : 'text-[#564337] hover:bg-[#ebeef3]'
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
              <span>{t.label}</span>
              {t.badge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === t.id ? 'bg-white text-[#994700]' : 'bg-[#e0e3e8] text-[#181c20]'
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
          {activeTab === 'tab-rules' && (
            <div className="space-y-6">
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

              {/* Editable Configuration Controls */}
              <div className="bg-white p-6 rounded-2xl border border-[#ddc1b2]/30 space-y-4 text-xs shadow-xs">
                <h3 className="font-bold text-sm text-[#181c20]">
                  ปรับแต่งเกณฑ์ควบคุมและการแจ้งเตือน (Interactive Policy Controls)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#f1f4f9] rounded-xl space-y-2">
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
                  </div>

                  <div className="p-4 bg-[#f1f4f9] rounded-xl space-y-2">
                    <label className="font-bold text-[#181c20] block">
                      เพดานปรับเกลี่ยงบข้ามหมวดในอำนาจคณบดี (บาท):
                    </label>
                    <select
                      value={reallocationLimit}
                      onChange={(e) => setReallocationLimit(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-[#ddc1b2]/60 font-bold bg-white text-[#181c20] outline-none"
                    >
                      <option value={100000}>฿100,000 ต่อครั้ง</option>
                      <option value={200000}>฿200,000 ต่อครั้ง (มาตรฐานสภาฯ)</option>
                      <option value={300000}>฿300,000 ต่อครั้ง</option>
                      <option value={500000}>฿500,000 ต่อครั้ง (วงเงินพิเศษ)</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-[#f1f4f9] rounded-xl flex items-center justify-between">
                  <div>
                    <strong className="block text-[#181c20]">ระบบแจ้งเตือนอัตโนมัติเมื่อเบิกจ่ายล่าช้าเกินเกณฑ์</strong>
                    <span className="text-[#79564b]">ส่งข้อความและอีเมลแจ้งหัวหน้าสาขาวิชาทันทีเมื่อต่ำกว่า 40% ใน Q3</span>
                  </div>
                  <button
                    onClick={() => setAutoSLA(!autoSLA)}
                    className={`px-4 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-colors ${autoSLA ? 'bg-[#366847] text-white' : 'bg-[#e0e3e8] text-[#564337]'
                      }`}
                  >
                    {autoSLA ? 'เปิดใช้งานอยู่ ✓' : 'ปิดการแจ้งเตือน'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tab-roles' && (
            <div className="bg-white p-6 rounded-2xl border border-[#ddc1b2]/30 overflow-x-auto text-xs shadow-xs">
              <h3 className="text-sm font-bold text-[#181c20] mb-3">
                สิทธิ์และอำนาจการอนุมัติงบประมาณ (Role-Based Access Control)
              </h3>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f1f4f9] uppercase text-[#79564b] font-bold border-b border-[#e5e8ee]">
                    <th className="py-3 px-3">บทบาท</th>
                    <th className="py-3 px-3">ผู้ดำรงตำแหน่ง</th>
                    <th className="py-3 px-3">เพดานวงเงินอนุมัติ</th>
                    <th className="py-3 px-3">การยืนยันตัวตน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ebeef3]">
                  <tr>
                    <td className="py-3.5 px-3 font-bold text-[#181c20]">คณบดี (Dean)</td>
                    <td className="py-3.5 px-3">รศ.ดร. นพดล ผู้บริหาร</td>
                    <td className="py-3.5 px-3 font-black text-[#e87722] tabular-nums">&gt; ฿500,000</td>
                    <td className="py-3.5 px-3 text-[#366847] font-bold">CMU OTP + 2FA</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-3 font-bold text-[#181c20]">รองคณบดีฝ่ายบริหารและการคลัง</td>
                    <td className="py-3.5 px-3">ผศ. สุรชัย วัฒนา</td>
                    <td className="py-3.5 px-3 font-bold tabular-nums">฿100,001 - ฿500,000</td>
                    <td className="py-3.5 px-3 text-[#564337]">CMU SSO</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-3 font-bold text-[#181c20]">หัวหน้าสำนักวิชา / ศูนย์</td>
                    <td className="py-3.5 px-3">ผศ.ดร. วิเชียร นันตา</td>
                    <td className="py-3.5 px-3 font-bold tabular-nums">฿50,001 - ฿100,000</td>
                    <td className="py-3.5 px-3 text-[#564337]">CMU SSO</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-3 font-bold text-[#181c20]">หัวหน้าสาขาวิชา (SE, DII, etc.)</td>
                    <td className="py-3.5 px-3">หัวหน้าภาควิชาทั้ง 6</td>
                    <td className="py-3.5 px-3 font-bold tabular-nums">ไม่เกิน ฿50,000</td>
                    <td className="py-3.5 px-3 text-[#564337]">CMU SSO</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'tab-api' && (
            <div className="space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-5 rounded-2xl border border-[#ddc1b2]/30 shadow-xs">
                <div>
                  <strong className="text-sm font-bold text-[#181c20]">
                    สถานะการเชื่อมต่อ API Gateway &amp; Microservices
                  </strong>
                  <div className="text-[#366847] font-bold mt-0.5">
                    4/4 จุดเชื่อมต่อสมบูรณ์ (Average Latency: 0.84s)
                  </div>
                </div>
                <button
                  onClick={handleTestAPI}
                  disabled={testing}
                  className="px-4 py-2 rounded-xl bg-[#ebeef3] hover:bg-[#e0e3e8] text-[#181c20] font-bold cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <span className={`material-symbols-outlined text-[16px] ${testing ? 'animate-spin' : ''}`}>
                    sync
                  </span>
                  {testing ? 'กำลังทดสอบ...' : 'ทดสอบเชื่อมต่อ (Test Connection)'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#ddc1b2]/30 shadow-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <strong className="text-sm text-[#181c20]">CMU-ERP Financial Ledger</strong>
                    <span className="text-[10px] bg-[#b8f0c5] text-[#1d5031] px-2 py-0.5 rounded-full font-bold">Online</span>
                  </div>
                  <span className="text-[#79564b] font-mono block">/api/v2/finance/gl-cmu</span>
                  <div className="mt-2 text-[#366847] font-bold">Healthy 100% • 0.62s</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#ddc1b2]/30 shadow-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <strong className="text-sm text-[#181c20]">GFMIS Thai e-Payment Gateway</strong>
                    <span className="text-[10px] bg-[#b8f0c5] text-[#1d5031] px-2 py-0.5 rounded-full font-bold">Online</span>
                  </div>
                  <span className="text-[#79564b] font-mono block">/gfmis/v4/mof-sync</span>
                  <div className="mt-2 text-[#366847] font-bold">Healthy 100% • 1.18s</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tab-audit' && (
            <div className="bg-white p-6 rounded-2xl border border-[#ddc1b2]/30 space-y-3 text-xs shadow-xs">
              <h3 className="font-bold text-sm text-[#181c20] mb-2">
                บันทึกประวัติการเปลี่ยนแปลง (System Audit Log)
              </h3>
              <div className="p-3.5 bg-[#f1f4f9] rounded-xl space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-[#e87722]">ปรับปรุงเพดานงบประมาณรองคณบดี (฿500,000)</span>
                  <span className="text-[#79564b]">18 พ.ค. 2569 • 11:24 น.</span>
                </div>
                <p className="text-[#564337]">
                  โดย รศ.ดร. นพดล ผู้บริหาร (คณบดี) • Session #CAMT-SEC-88219 • IP 202.28.24.12
                </p>
              </div>

              <div className="p-3.5 bg-[#f1f4f9] rounded-xl space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-[#366847]">เปิดระบบแจ้งเตือน SLA อัตโนมัติ</span>
                  <span className="text-[#79564b]">15 พ.ค. 2569 • 09:40 น.</span>
                </div>
                <p className="text-[#564337]">โดย ผู้ดูแลระบบ Admin-Sec • CMU IT Center</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#e5e8ee] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-[#79564b]">
            บันทึกความปลอดภัย CMU SSO &amp; 2FA • Session ID: #CAMT-SEC-88219
          </span>
          <button
            onClick={handleCommit}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center gap-2 cursor-pointer ${committed ? 'bg-[#366847]' : 'bg-[#e87722] hover:bg-[#994700]'
              }`}
          >
            <span className="material-symbols-outlined text-[18px]">approval_delegation</span>
            {committed ? 'บันทึกและรับรองการตั้งค่าแล้ว ✓' : 'รับรองและบันทึกการตั้งค่า (Commit & Sign)'}
          </button>
        </div>
      </div>
    </div>
  );
};
