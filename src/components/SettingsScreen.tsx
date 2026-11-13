import { useState } from 'react';
import { Download, RefreshCw, Lock } from 'lucide-react';

interface SettingsScreenProps {
  onCommitSuccess?: () => void;
  onTestAPISuccess?: () => void;
  onExportReport?: () => void;
}

export const SettingsScreen = ({
  onTestAPISuccess,
  onExportReport,
}: SettingsScreenProps) => {
  const [activeTab, setActiveTab] = useState<
    'tab-rules' | 'tab-roles' | 'tab-api' | 'tab-audit'
  >('tab-rules');
  const [testing, setTesting] = useState(false);

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
      <div className="bg-white rounded-xl border border-[#18181b]/8 flex flex-col relative">
        {/* Sticky Header */}
        <div className="sticky top-14 z-30 bg-white rounded-t-xl border-b border-[#18181b]/8">
          <div className="px-6 py-5 border-b border-[#18181b]/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#71717a]">
                <span className="px-1.5 py-0.5 rounded bg-[#f0eee9] border border-[#18181b]/10 font-mono text-[11px] text-[#52525b]">
                  CONFIG-2569
                </span>
                <span>•</span>
                <span className="text-[#15803d] font-medium">นโยบายมีผลบังคับใช้</span>
                <span>•</span>
                <span>ระเบียบการเงินและธรรมาภิบาล</span>
              </div>
              <h1 className="text-2xl font-medium text-[#18181b] tracking-tight">
                เกณฑ์ควบคุมงบประมาณและเพดานจัดสรร ประจำปีงบประมาณ 2569
              </h1>
            </div>

            {onExportReport && (
              <button
                onClick={onExportReport}
                className="h-9 px-3.5 rounded-lg bg-white border border-[#18181b]/10 hover:bg-[#f0eee9] text-xs font-medium text-[#18181b] flex items-center gap-2 transition-colors duration-150 cursor-pointer self-start sm:self-center"
              >
                <Download size={15} strokeWidth={1.5} className="text-[#52525b]" />
                <span>ส่งออกระเบียบ PDF</span>
              </button>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 bg-[#f7f6f2] flex flex-wrap items-center gap-1 py-2">
            {[
              { id: 'tab-rules', label: 'เกณฑ์ควบคุมและเพดานจัดสรร' },
              { id: 'tab-roles', label: 'สิทธิ์และการอนุมัติ (RBAC)', badge: '8' },
              { id: 'tab-api', label: 'เชื่อมต่อระบบภายนอก (API)', badge: '4/4' },
              { id: 'tab-audit', label: 'ประวัติการเปลี่ยนแปลง (Audit Log)' },
            ].map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`h-8 px-3 rounded-lg text-xs transition-colors duration-150 flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#18181b] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#18181b]/8'
                      : 'text-[#52525b] hover:text-[#18181b] hover:bg-[#18181b]/[0.04]'
                  }`}
                >
                  <span className="whitespace-nowrap">{t.label}</span>
                  {t.badge && (
                    <span className="font-mono text-[11px] text-[#71717a] tabular-nums">
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 bg-[#f7f6f2] space-y-6 rounded-b-xl">
          {activeTab === 'tab-rules' && (
            <div className="space-y-6">
              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-[#18181b]/8">
                  <span className="text-xs text-[#52525b]">เพดานงบประมาณจัดสรรสูงสุด</span>
                  <div className="text-[28px] leading-none font-medium text-[#18181b] mt-3 tabular-nums">
                    ฿12,000,000
                  </div>
                  <div className="text-xs text-[#71717a] mt-3 pt-2.5 border-t border-[#18181b]/6">
                    100% มติสภาวิทยาลัย
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#18181b]/8">
                  <span className="text-xs text-[#52525b]">สำรองงบกลางขั้นต่ำ</span>
                  <div className="text-[28px] leading-none font-medium text-[#c85a17] mt-3 tabular-nums">
                    {centralReserveMin}%
                  </div>
                  <div className="text-xs text-[#71717a] mt-3 pt-2.5 border-t border-[#18181b]/6">
                    กรอบมาตรฐาน 25% – 30%
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#18181b]/8">
                  <span className="text-xs text-[#52525b]">เพดานปรับเกลี่ยงบ</span>
                  <div className="text-[28px] leading-none font-medium text-[#18181b] mt-3 tabular-nums">
                    ฿{reallocationLimit.toLocaleString()}
                  </div>
                  <div className="text-xs text-[#71717a] mt-3 pt-2.5 border-t border-[#18181b]/6">
                    อำนาจคณบดีต่อครั้ง
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#18181b]/8">
                  <span className="text-xs text-[#52525b]">รอบความถี่ซิงก์ข้อมูล</span>
                  <div className="text-[28px] leading-none font-medium text-[#15803d] mt-3 tabular-nums">
                    15 นาที
                  </div>
                  <div className="text-xs text-[#71717a] mt-3 pt-2.5 border-t border-[#18181b]/6">
                    CMU Data Pipeline
                  </div>
                </div>
              </div>

              {/* Editable Configuration Controls */}
              <div className="bg-white p-5 rounded-xl border border-[#18181b]/8 space-y-4 text-xs">
                <div className="pb-3 border-b border-[#18181b]/8">
                  <h3 className="font-medium text-sm text-[#18181b]">
                    ปรับแต่งเกณฑ์ควบคุมและการแจ้งเตือน
                  </h3>
                  <p className="text-xs text-[#71717a] mt-0.5">
                    กำหนดพารามิเตอร์ควบคุมความเสี่ยงงบประมาณและการบริหารสภาพคล่อง
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#f7f6f2] rounded-lg space-y-2 border border-[#18181b]/6">
                    <label className="font-medium text-[#18181b] block">
                      อัตราสำรองงบกลางขั้นต่ำ (% ของงบรวม)
                    </label>
                    <input
                      type="range"
                      min={20}
                      max={35}
                      step={0.25}
                      value={centralReserveMin}
                      onChange={(e) => setCentralReserveMin(Number(e.target.value))}
                      className="w-full accent-[#c85a17]"
                    />
                    <div className="flex justify-between font-mono text-xs text-[#71717a] tabular-nums">
                      <span>20%</span>
                      <span className="text-[#c85a17] font-medium">{centralReserveMin}%</span>
                      <span>35%</span>
                    </div>
                    <p className="text-xs text-[#52525b] tabular-nums">
                      คิดเป็นวงเงินสำรอง: ฿{((12000000 * centralReserveMin) / 100).toLocaleString()}
                    </p>
                  </div>

                  <div className="p-4 bg-[#f7f6f2] rounded-lg space-y-2 border border-[#18181b]/6">
                    <label className="font-medium text-[#18181b] block">
                      เพดานปรับเกลี่ยงบข้ามหมวดในอำนาจคณบดี
                    </label>
                    <select
                      value={reallocationLimit}
                      onChange={(e) => setReallocationLimit(Number(e.target.value))}
                      className="w-full h-9 px-3 rounded-lg border border-[#18181b]/15 bg-white text-[#18181b] outline-none cursor-pointer focus:border-[#c85a17]"
                    >
                      <option value={100000}>฿100,000 ต่อครั้ง</option>
                      <option value={200000}>฿200,000 ต่อครั้ง (มาตรฐานสภาวิทยาลัย)</option>
                      <option value={300000}>฿300,000 ต่อครั้ง</option>
                      <option value={500000}>฿500,000 ต่อครั้ง (วงเงินพิเศษ)</option>
                    </select>
                    <p className="text-xs text-[#52525b]">
                      กรณีเกินเพดานนี้ ต้องเสนอขอความเห็นชอบจากคณะกรรมการบริหารวิทยาลัย
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-[#f7f6f2] rounded-lg flex items-center justify-between border border-[#18181b]/6">
                  <div>
                    <span className="font-medium block text-[#18181b]">
                      ระบบแจ้งเตือนอัตโนมัติเมื่อเบิกจ่ายล่าช้า
                    </span>
                    <span className="text-[#71717a] mt-0.5 block">
                      ส่งอีเมลแจ้งเตือนหัวหน้าโครงการเมื่อการเบิกจ่ายต่ำกว่าแผนรายไตรมาส
                    </span>
                  </div>
                  <button
                    onClick={() => setAutoSLA(!autoSLA)}
                    className={`h-8 px-3.5 rounded-lg font-medium text-xs cursor-pointer transition-colors duration-150 ${
                      autoSLA
                        ? 'bg-[#15803d] text-white'
                        : 'bg-[#e4e2dd] text-[#52525b]'
                    }`}
                  >
                    {autoSLA ? 'เปิดใช้งานอยู่' : 'ปิดการแจ้งเตือน'}
                  </button>
                </div>
              </div>

              {/* Policy Framework */}
              <div className="bg-white p-5 rounded-xl border border-[#18181b]/8 space-y-3 text-xs">
                <h3 className="font-medium text-sm text-[#18181b]">
                  กรอบนโยบายและการกำกับดูแลทางการเงิน
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    {
                      title: 'กรอบงบประมาณรวม',
                      desc: 'วงเงินรวม ฿12,000,000 อนุมัติจากสภาวิทยาลัย แบ่งเป็นงบจัดสรร 37 ส่วนงาน ฿8,550,000 และงบสำรองส่วนกลาง ฿3,450,000',
                    },
                    {
                      title: 'การปรับเกลี่ยงบประมาณ',
                      desc: 'อนุญาตให้ปรับเกลี่ยเงินเหลือจ่ายจากโครงการที่เสร็จสิ้นเข้าสู่งบกลาง เพื่อจัดสรรใหม่ให้โครงการเร่งด่วนตามลำดับความสำคัญ',
                    },
                    {
                      title: 'มาตรฐาน EdPEx และธรรมาภิบาล',
                      desc: 'ติดตามผลสัมฤทธิ์และดัชนีชี้วัดรายไตรมาสผ่านระบบ CMU ERP และบันทึกประวัติการเปลี่ยนแปลงตามมาตรฐานความปลอดภัย',
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="p-4 bg-[#f7f6f2] rounded-lg border border-[#18181b]/6 space-y-1"
                    >
                      <span className="font-medium text-[#18181b] block">{item.title}</span>
                      <p className="text-[#52525b] leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tab-roles' && (
            <div className="bg-white rounded-xl border border-[#18181b]/8 overflow-hidden">
              <div className="p-5 border-b border-[#18181b]/8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="text-base font-medium text-[#18181b]">
                    สิทธิ์และอำนาจการอนุมัติงบประมาณ (Role-Based Access Control)
                  </h3>
                  <p className="text-xs text-[#71717a] mt-0.5">
                    กำหนดขอบเขตอำนาจการลงนามอนุมัติเบิกจ่ายตามระเบียบการเงิน มหาวิทยาลัยเชียงใหม่
                  </p>
                </div>
                <span className="font-mono text-xs text-[#71717a]">8 บทบาท</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[620px]">
                  <thead>
                    <tr className="bg-[#f7f6f2] text-[#71717a] border-b border-[#18181b]/8">
                      <th className="py-3 px-4 font-medium">บทบาท</th>
                      <th className="py-3 px-4 font-medium">ผู้ดำรงตำแหน่ง / ผู้รับผิดชอบ</th>
                      <th className="py-3 px-4 font-medium">เพดานวงเงินอนุมัติ</th>
                      <th className="py-3 px-4 font-medium">การยืนยันตัวตน</th>
                      <th className="py-3 px-4 font-medium text-right">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#18181b]/6">
                    {[
                      {
                        role: 'คณบดี (Dean)',
                        holder: 'รศ.ดร. นพดล ผู้บริหาร',
                        limit: 'มากกว่า ฿500,000',
                        auth: 'CMU OTP + 2FA Hardware Key',
                      },
                      {
                        role: 'รองคณบดีฝ่ายบริหารและการคลัง',
                        holder: 'ผศ. สุรชัย วัฒนา',
                        limit: '฿100,001 – ฿500,000',
                        auth: 'CMU SSO + Mobile OTP',
                      },
                      {
                        role: 'รองคณบดีฝ่ายวิชาการและวิจัย',
                        holder: 'ผศ.ดร. อรัญญา ปัญญาวงศ์',
                        limit: '฿50,001 – ฿200,000',
                        auth: 'CMU SSO + Mobile OTP',
                      },
                      {
                        role: 'หัวหน้าสำนักวิชา / ผู้อำนวยการศูนย์',
                        holder: 'ผศ.ดร. วิเชียร นันตา',
                        limit: '฿50,001 – ฿100,000',
                        auth: 'CMU SSO',
                      },
                      {
                        role: 'หัวหน้าสาขาวิชา (SE, DII, ANIM, MMIT, DG)',
                        holder: 'หัวหน้าภาควิชาและหลักสูตรทั้ง 6',
                        limit: 'ไม่เกิน ฿50,000',
                        auth: 'CMU SSO',
                      },
                      {
                        role: 'หัวหน้าโครงการวิจัยและบริการวิชาการ',
                        holder: 'อาจารย์และนักวิจัยหัวหน้าโครงการ',
                        limit: 'ไม่เกิน ฿30,000 (ตามกรอบแผน)',
                        auth: 'CMU SSO',
                      },
                      {
                        role: 'หัวหน้างานการเงินและพัสดุ',
                        holder: 'นางสาวสมใจ รักษ์คลัง',
                        limit: 'ตรวจสอบและตัดยอดงบประมาณ',
                        auth: 'CMU SSO + Digital Certificate',
                      },
                      {
                        role: 'ผู้ดูแลระบบสารสนเทศ (SuperAdmin)',
                        holder: 'ทีมสารสนเทศ CAMT IT Center',
                        limit: 'จัดการสิทธิ์ (ไม่มีสิทธิ์เบิกจ่าย)',
                        auth: '2FA FIDO2 Hardware Key',
                      },
                    ].map((r) => (
                      <tr
                        key={r.role}
                        className="hover:bg-[#f7f6f2]/60 transition-colors duration-150"
                      >
                        <td className="py-3 px-4 font-medium text-[#18181b] whitespace-nowrap">
                          {r.role}
                        </td>
                        <td className="py-3 px-4 text-[#52525b]">{r.holder}</td>
                        <td className="py-3 px-4 font-mono text-[#18181b] tabular-nums whitespace-nowrap">
                          {r.limit}
                        </td>
                        <td className="py-3 px-4 text-[#52525b] whitespace-nowrap">{r.auth}</td>
                        <td className="py-3 px-4 text-right text-[#15803d] font-medium">
                          เปิดใช้งาน
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-5 py-3.5 bg-[#f7f6f2] border-t border-[#18181b]/8 flex items-center justify-between text-xs text-[#71717a]">
                <span className="flex items-center gap-1.5">
                  <Lock size={14} strokeWidth={1.5} className="text-[#52525b]" />
                  <span>บังคับใช้ระบบ 2FA และ CMU SSO ตามมาตรฐาน ISO/IEC 27001</span>
                </span>
                <span className="font-mono">อัปเดตล่าสุด: 18 พ.ค. 2569</span>
              </div>
            </div>
          )}

          {activeTab === 'tab-api' && (
            <div className="space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-5 rounded-xl border border-[#18181b]/8">
                <div>
                  <h3 className="text-sm font-medium text-[#18181b]">
                    สถานะการเชื่อมต่อ API Gateway และฐานข้อมูลภายนอก
                  </h3>
                  <div className="text-[#15803d] mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                    <span>เชื่อมต่อสมบูรณ์ 4/4 ระบบ (Average Latency: 0.65s)</span>
                  </div>
                </div>
                <button
                  onClick={handleTestAPI}
                  disabled={testing}
                  className="h-8 px-3.5 rounded-lg bg-[#f0eee9] hover:bg-[#e4e2dd] text-[#18181b] font-medium cursor-pointer transition-colors duration-150 flex items-center gap-1.5"
                >
                  <RefreshCw
                    size={14}
                    strokeWidth={1.5}
                    className={testing ? 'animate-spin text-[#52525b]' : 'text-[#52525b]'}
                  />
                  <span>{testing ? 'กำลังทดสอบ...' : 'ทดสอบการเชื่อมต่อ'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: 'CMU-ERP Financial Ledger',
                    endpoint: '/api/v2/finance/gl-cmu',
                    desc: 'เชื่อมต่อสมุดบัญชีแยกประเภทและงบดุลกลางมหาวิทยาลัยเชียงใหม่',
                    latency: '0.62s',
                    updated: '2 นาทีที่แล้ว',
                  },
                  {
                    name: 'GFMIS Thai e-Payment Gateway',
                    endpoint: '/gfmis/v4/mof-sync',
                    desc: 'ระบบการบริหารการเงินการคลังภาครัฐแบบอิเล็กทรอนิกส์ กรมบัญชีกลาง',
                    latency: '1.18s',
                    updated: '5 นาทีที่แล้ว',
                  },
                  {
                    name: 'CMU Central OAuth 2.0 & SSO',
                    endpoint: '/oauth2/v3/cmu-auth',
                    desc: 'บริการยืนยันตัวตนกลาง CMU Account และ Two-Factor Authentication',
                    latency: '0.35s',
                    updated: 'ทำงานต่อเนื่อง',
                  },
                  {
                    name: 'CAMT Budget Data Warehouse',
                    endpoint: '/dw/v1/budget-metrics',
                    desc: 'คลังข้อมูลวิเคราะห์ผลการเบิกจ่ายและดัชนีชี้วัด EdPEx ระดับวิทยาลัย',
                    latency: '0.45s',
                    updated: '1 นาทีที่แล้ว',
                  },
                ].map((api) => (
                  <div
                    key={api.name}
                    className="bg-white p-5 rounded-xl border border-[#18181b]/8 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm text-[#18181b]">{api.name}</span>
                      <span className="text-[#15803d] font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                        <span>ออนไลน์</span>
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-[#f0eee9] border border-[#18181b]/10 font-mono inline-block text-[11px] text-[#52525b]">
                      {api.endpoint}
                    </span>
                    <p className="text-[#52525b]">{api.desc}</p>
                    <div className="pt-2 flex items-center justify-between text-[#71717a] border-t border-[#18181b]/6 font-mono text-[11px]">
                      <span>Latency: {api.latency}</span>
                      <span>อัปเดต: {api.updated}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tab-audit' && (
            <div className="bg-white rounded-xl border border-[#18181b]/8 overflow-hidden text-xs">
              <div className="p-5 border-b border-[#18181b]/8 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-sm text-[#18181b]">
                    บันทึกประวัติการเปลี่ยนแปลง (System Audit Log)
                  </h3>
                  <p className="text-xs text-[#71717a] mt-0.5">
                    ตรวจสอบประวัติการแก้ไขนโยบาย การปรับวงเงิน และการเข้าถึงระบบ
                  </p>
                </div>
                <span className="font-mono text-xs text-[#71717a]">5 รายการล่าสุด</span>
              </div>

              <div className="divide-y divide-[#18181b]/6">
                {[
                  {
                    action: 'ปรับปรุงเพดานงบประมาณรองคณบดี (฿500,000)',
                    time: '18 พ.ค. 2569 • 11:24 น.',
                    actor: 'รศ.ดร. นพดล ผู้บริหาร (คณบดี)',
                    session: 'CAMT-SEC-88219',
                  },
                  {
                    action: 'รับรองแผนจัดสรรงบประมาณไตรมาส 3 (Q3 Final Approval)',
                    time: '16 พ.ค. 2569 • 14:15 น.',
                    actor: 'ผศ. สุรชัย วัฒนา (รองคณบดีฝ่ายบริหารและการคลัง)',
                    session: 'CAMT-SEC-88102',
                  },
                  {
                    action: 'เปิดระบบแจ้งเตือน SLA อัตโนมัติ',
                    time: '15 พ.ค. 2569 • 09:40 น.',
                    actor: 'ผู้ดูแลระบบ Admin-Sec • CMU IT Center',
                    session: 'CAMT-SEC-88044',
                  },
                  {
                    action: 'ซิงก์ข้อมูลยอดเงินคงเหลือจาก GFMIS สำเร็จ',
                    time: 'วันนี้ • 04:30 น.',
                    actor: 'Automated System Service',
                    session: 'SYNC-GFMIS-01',
                  },
                  {
                    action: 'ปรับเกลี่ยเงินเหลือจ่ายโครงการวิจัยเข้าสมทบงบกลาง (฿150,000)',
                    time: '12 พ.ค. 2569 • 16:00 น.',
                    actor: 'นางสาวสมใจ รักษ์คลัง (งานการเงินและพัสดุ)',
                    session: 'CAMT-SEC-87980',
                  },
                ].map((log) => (
                  <div key={log.session} className="p-4 sm:px-5 space-y-1">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="font-medium text-[#18181b]">{log.action}</span>
                      <span className="font-mono text-[#71717a]">{log.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#52525b]">
                      <span>{log.actor}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-[#71717a]">
                        #{log.session}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
