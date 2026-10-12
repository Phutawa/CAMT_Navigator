import { useState } from 'react';

interface CommitmentItem {
  no: string;
  title: string;
  vendor: string;
  amt: string;
  amountNumber: number;
  status: string;
}

interface DisbursementScreenProps {
  onNotifyAlert: () => void;
  onApprovePO: (poNo: string) => void;
  onExportReport: () => void;
}

export const DisbursementScreen = ({
  onNotifyAlert,
  onApprovePO,
  onExportReport,
}: DisbursementScreenProps) => {
  const [activeTab, setActiveTab] = useState<'tab-overview' | 'tab-departments' | 'tab-commitments' | 'tab-risks'>('tab-overview');
  const [signed, setSigned] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const [commitments, setCommitments] = useState<CommitmentItem[]>([
    { no: 'PO-2569-041', title: 'ชุดเซิร์ฟเวอร์ Cloud Lab SE', vendor: 'บจก. สยามเน็ตเวิร์ก โซลูชั่นส์', amt: '฿680,000', amountNumber: 680000, status: 'รอตรวจรับ (ส่งมอบ 80%)' },
    { no: 'PO-2569-038', title: 'ลิขสิทธิ์ซอฟต์แวร์แอนิเมชัน ANIM', vendor: 'บจก. ดิจิทัล ซิสเต็มส์ คอนซัลติ้ง', amt: '฿520,000', amountNumber: 520000, status: 'ตรวจรับแล้ว รอเบิกจ่าย' },
    { no: 'PO-2569-035', title: 'จ้างพัฒนาระบบ Hybrid Learning DTM', vendor: 'บจก. อินโนเวทีฟ เอ็ดดูเทค', amt: '฿380,000', amountNumber: 380000, status: 'ดำเนินงานงวด 2' },
    { no: 'PO-2569-029', title: 'ชุดอุปกรณ์เซนเซอร์ IoT ห้อง FabLab DII', vendor: 'หจก. ลานนา ไมโครเทค', amt: '฿295,000', amountNumber: 295000, status: 'ส่งมอบครบถ้วน รอเบิกจ่าย' },
  ]);

  const handleSendAlert = () => {
    setAlertSent(true);
    onNotifyAlert();
  };

  const handleProcessPO = (poNo: string) => {
    setCommitments((prev) =>
      prev.map((item) =>
        item.no === poNo
          ? { ...item, status: 'อนุมัติเบิกจ่ายเรียบร้อย (ERP Cleared)' }
          : item
      )
    );
    onApprovePO(poNo);
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
              <span className="px-2.5 py-1 rounded-full bg-[#ffdbc8] text-[#743400] text-xs font-bold tracking-wider">
                #DISB-2569-TRACK
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#b8f0c5] text-[#1d5031] text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#366847] animate-pulse"></span>
                Q3 On Track
              </span>
              <span className="text-xs text-[#79564b]">รอบตรวจสอบประจำไตรมาส 3</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#181c20]">
              ติดตามการเบิกจ่ายงบประมาณ ประจำปีงบประมาณ 2569
            </h2>
            <p className="text-xs text-[#564337]">
              วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มหาวิทยาลัยเชียงใหม่ • Fiscal Burn-Rate &amp; Risk Monitor
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onExportReport}
              className="p-2.5 rounded-xl text-[#564337] hover:bg-[#ebeef3] transition-colors cursor-pointer border border-[#ddc1b2]/40"
              title="ดาวน์โหลด PDF รายงานเบิกจ่าย"
            >
              <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 bg-[#f1f4f9] border-b border-[#e5e8ee] flex gap-2 overflow-x-auto py-2.5">
          {[
            { id: 'tab-overview', label: 'ภาพรวมการเบิกจ่ายสะสม (Cumulative)', icon: 'query_stats' },
            { id: 'tab-departments', label: 'ติดตามเบิกจ่ายราย 6 สาขาวิชา', icon: 'corporate_fare', badge: '6' },
            { id: 'tab-commitments', label: 'รายการ PO และใบสำคัญผูกพันงบ', icon: 'receipt_long', badge: commitments.length.toString() },
            { id: 'tab-risks', label: 'การแจ้งเตือนงบเสี่ยงเบิกจ่ายช้า', icon: 'warning', badge: '3 รายการ', isError: true },
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
              <span
                className={`material-symbols-outlined text-[18px] ${
                  t.isError && activeTab !== t.id ? 'text-[#ba1a1a]' : ''
                }`}
              >
                {t.icon}
              </span>
              <span>{t.label}</span>
              {t.badge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    t.isError
                      ? 'bg-[#ffdad6] text-[#93000a]'
                      : activeTab === t.id
                      ? 'bg-white text-[#994700]'
                      : 'bg-[#e0e3e8] text-[#181c20]'
                  }`}
                >
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 bg-[#f7f9ff] space-y-6">
          {activeTab === 'tab-overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#ddc1b2]/30 shadow-xs">
                  <span className="text-xs text-[#79564b] font-bold">งบจัดสรรรวม</span>
                  <div className="text-2xl font-black text-[#181c20] mt-2 tabular-nums">
                    ฿12,000,000
                  </div>
                  <div className="text-xs text-[#564337] mt-1">100% กรอบงบประจำปี</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#366847]/40 shadow-xs">
                  <span className="text-xs text-[#366847] font-bold">ยอดเบิกจ่ายจริงสะสม</span>
                  <div className="text-2xl font-black text-[#366847] mt-2 tabular-nums">
                    ฿5,820,000
                  </div>
                  <div className="text-xs text-[#366847] font-semibold mt-1">
                    48.5% (เกินเป้าไตรมาส +3.5%)
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border-2 border-[#e87722] shadow-xs">
                  <span className="text-xs text-[#e87722] font-bold">รอเบิกจ่ายผูกพัน (PO)</span>
                  <div className="text-2xl font-black text-[#994700] mt-2 tabular-nums">
                    ฿2,730,000
                  </div>
                  <div className="text-xs text-[#564337] mt-1">22.75% อยู่ระหว่างส่งมอบ/ตรวจรับ</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#ddc1b2]/30 shadow-xs">
                  <span className="text-xs text-[#79564b] font-bold">คงเหลือวางแผนเบิกจ่าย</span>
                  <div className="text-2xl font-black text-[#181c20] mt-2 tabular-nums">
                    ฿3,450,000
                  </div>
                  <div className="text-xs text-[#79564b] mt-1">28.75% สำรองใน Q4</div>
                </div>
              </div>

              {/* Multi-stage Progress Breakdown */}
              <div className="bg-white p-5 rounded-xl border border-[#ddc1b2]/30 space-y-3 shadow-xs">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#181c20]">ความคืบหน้าเทียบเป้าหมาย Q3 (Fiscal Run-Rate)</span>
                  <span className="text-[#366847]">ทำได้ 48.5% (เป้าหมาย 45%)</span>
                </div>
                <div className="w-full bg-[#ebeef3] rounded-full h-5 overflow-hidden flex border border-[#ddc1b2]/30">
                  <div
                    className="h-full bg-[#366847] flex items-center justify-center text-[10px] text-white font-bold"
                    style={{ width: '48.5%' }}
                  >
                    เบิกจ่ายจริง 48.5%
                  </div>
                  <div
                    className="h-full bg-[#e87722] flex items-center justify-center text-[10px] text-white font-bold"
                    style={{ width: '22.75%' }}
                  >
                    ผูกพัน PO 22.75%
                  </div>
                  <div
                    className="h-full bg-[#d7dadf] flex items-center justify-center text-[10px] text-[#564337] font-bold"
                    style={{ width: '28.75%' }}
                  >
                    คงเหลือ 28.75%
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tab-departments' && (
            <div className="bg-white rounded-2xl border border-[#ddc1b2]/30 overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#f1f4f9] uppercase text-[#79564b] font-bold border-b border-[#e5e8ee]">
                    <th className="py-3 px-4">สาขาวิชา / หน่วยงาน</th>
                    <th className="py-3 px-3 text-right">วงเงินจัดสรร</th>
                    <th className="py-3 px-3 text-right">เบิกจ่ายจริง</th>
                    <th className="py-3 px-3 text-right">ภาระผูกพัน PO</th>
                    <th className="py-3 px-3 text-center">ความคืบหน้า</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ebeef3]">
                  {[
                    { code: 'SE', name: 'วิศวกรรมซอฟต์แวร์', bud: '฿2,850,000', act: '฿1,482,000', po: '฿684,000', pct: '52.0%' },
                    { code: 'ANIM', name: 'แอนิเมชันและวิชวลเอฟเฟกต์', bud: '฿2,400,000', act: '฿1,296,000', po: '฿528,000', pct: '54.0%' },
                    { code: 'DTM', name: 'การจัดการเทคโนโลยีดิจิทัล', bud: '฿1,950,000', act: '฿916,500', po: '฿429,000', pct: '47.0%' },
                    { code: 'DII', name: 'บูรณาการอุตสาหกรรมดิจิทัล', bud: '฿2,100,000', act: '฿1,029,000', po: '฿462,000', pct: '49.0%' },
                    { code: 'DTA', name: 'สำนักวิชาเทคโนโลยีและศิลปะ', bud: '฿1,500,000', act: '฿630,000', po: '฿375,000', pct: '42.0%' },
                    { code: 'CEL', name: 'ศูนย์ความเป็นเลิศฯ', bud: '฿1,200,000', act: '฿466,500', po: '฿252,000', pct: '38.8%' },
                  ].map((d) => (
                    <tr key={d.code} className="hover:bg-[#FFF7F0]/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#181c20]">
                        {d.name} ({d.code})
                      </td>
                      <td className="py-3.5 px-3 text-right tabular-nums text-[#564337]">{d.bud}</td>
                      <td className="py-3.5 px-3 text-right text-[#366847] font-bold tabular-nums">
                        {d.act}
                      </td>
                      <td className="py-3.5 px-3 text-right text-[#994700] font-bold tabular-nums">
                        {d.po}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="px-2.5 py-1 rounded-full bg-[#ebeef3] font-extrabold text-[#181c20]">
                          {d.pct}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'tab-commitments' && (
            <div className="bg-white p-6 rounded-2xl border border-[#ddc1b2]/30 space-y-3 text-xs shadow-xs">
              <h3 className="font-bold text-sm text-[#181c20] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#e87722]">assignment</span>
                รายการใบสั่งซื้อสั่งจ้าง (Purchase Orders - PO)
              </h3>
              {commitments.map((item) => (
                <div
                  key={item.no}
                  className="p-3.5 bg-[#f1f4f9] rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                >
                  <div>
                    <strong className="text-[#994700] font-bold">{item.no}</strong>: {item.title}
                    <div className="text-[#79564b] mt-0.5">
                      คู่สัญญา: {item.vendor} • วงเงิน <strong className="text-[#181c20]">{item.amt}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-white font-bold text-[#564337] border border-[#ddc1b2]/40 shadow-xs">
                      {item.status}
                    </span>
                    {!item.status.includes('อนุมัติ') && (
                      <button
                        onClick={() => handleProcessPO(item.no)}
                        className="px-3 py-1 rounded-lg bg-[#e87722] hover:bg-[#994700] text-white font-bold text-xs shadow-xs cursor-pointer transition-colors"
                      >
                        อนุมัติเบิกจ่าย
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'tab-risks' && (
            <div className="space-y-4 text-xs">
              <div className="p-5 bg-[#ffdad6]/40 border border-[#ba1a1a]/30 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <strong className="text-[#ba1a1a] font-bold text-sm">
                    1. โครงการพัฒนาห้องปฏิบัติการ VR Lab (ศูนย์ CEL)
                  </strong>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ba1a1a] text-white font-bold text-[10px]">
                    เสี่ยงสูง (High Risk)
                  </span>
                </div>
                <p className="text-[#181c20] leading-relaxed">
                  คู่สัญญาขอเลื่อนกำหนดส่งมอบฮาร์ดแวร์ VR แว่นแสดงผล 2 ครั้ง อาจกระทบต่อการตรวจรับงวดสุดท้าย
                  วงเงินคงค้าง ฿480,000 แนะนำเร่งรัดหรือสงวนสิทธิ์ปรับรายวัน
                </p>
                <button
                  onClick={handleSendAlert}
                  className="px-3 py-1 rounded-lg bg-[#ba1a1a] text-white font-bold text-xs hover:bg-[#93000a] cursor-pointer"
                >
                  ส่งหนังสือเร่งรัด CEL
                </button>
              </div>

              <div className="p-5 bg-[#FFF7F0] border border-[#e87722]/40 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <strong className="text-[#994700] font-bold text-sm">
                    2. งบอุดหนุนงานวิจัยนวัตกรรมนานาชาติ รอบ 2 (DTA)
                  </strong>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#e87722] text-white font-bold text-[10px]">
                    เสี่ยงปานกลาง (Medium)
                  </span>
                </div>
                <p className="text-[#181c20] leading-relaxed">
                  นักวิจัยยังไม่นำใบเสร็จการนำเสนอผลงานประชุมวิชาการมาเบิกจ่ายตามกำหนด วงเงิน ฿350,000
                </p>
                <button
                  onClick={handleSendAlert}
                  className="px-3 py-1 rounded-lg bg-[#e87722] text-white font-bold text-xs hover:bg-[#994700] cursor-pointer"
                >
                  แจ้งเตือนนักวิจัย DTA
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#e5e8ee] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-[#79564b]">
            เชื่อมโยงตรงกับระบบ CMU ERP / GFMIS แบบเรียลไทม์
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleSendAlert}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#564337] bg-[#ebeef3] hover:bg-[#e0e3e8] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#e87722]">send</span>
              {alertSent ? 'ส่งแจ้งเตือนแล้ว ✓' : 'ส่งการแจ้งเตือนเร่งรัด'}
            </button>
            <button
              onClick={() => setSigned(!signed)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                signed ? 'bg-[#366847]' : 'bg-[#e87722] hover:bg-[#994700]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              {signed ? 'รับรองผลเรียบร้อย ✓' : 'รับรองผลการติดตาม (Sign Audit)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
