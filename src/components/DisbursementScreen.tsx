import { useState, useEffect } from 'react';

interface CommitmentItem {
  no: string;
  title: string;
  vendor: string;
  amt: string;
  amountNumber: number;
  status: string;
}

interface DisbursementScreenProps {
  searchQuery?: string;
  onNotifyAlert: () => void;
  onApprovePO: (poNo: string) => void;
  onBulkApprovePO?: () => void;
  onExportReport: () => void;
  onOpenProjectModal?: (project: any) => void;
}

export const DisbursementScreen = ({
  searchQuery = '',
  onNotifyAlert,
  onApprovePO,
  onBulkApprovePO,
  onExportReport,
  onOpenProjectModal,
}: DisbursementScreenProps) => {
  const [activeTab, setActiveTab] = useState<'tab-overview' | 'tab-departments' | 'tab-commitments' | 'tab-risks'>('tab-overview');
  const [signed, setSigned] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const [commitments, setCommitments] = useState<CommitmentItem[]>([
    { no: 'PO-2569-DG01', title: 'ค่าพาหนะและที่พักศึกษาดูงานดิจิทัลเกม (2569-DG-P1-001)', vendor: 'บจก. ทราเวล คอนเน็คชั่น แอนด์ ทรานสปอร์ต', amt: '฿310,440', amountNumber: 310440, status: 'ตรวจรับแล้ว รอเบิกจ่าย' },
    { no: 'PO-2569-041', title: 'ชุดเซิร์ฟเวอร์ Cloud Lab SE', vendor: 'บจก. สยามเน็ตเวิร์ก โซลูชั่นส์', amt: '฿680,000', amountNumber: 680000, status: 'รอตรวจรับ (ส่งมอบ 80%)' },
    { no: 'PO-2569-038', title: 'ลิขสิทธิ์ซอฟต์แวร์แอนิเมชัน ANIM', vendor: 'บจก. ดิจิทัล ซิสเต็มส์ คอนซัลติ้ง', amt: '฿520,000', amountNumber: 520000, status: 'ตรวจรับแล้ว รอเบิกจ่าย' },
    { no: 'PO-2569-035', title: 'จ้างพัฒนาระบบ Hybrid Learning DTM', vendor: 'บจก. อินโนเวทีฟ เอ็ดดูเทค', amt: '฿380,000', amountNumber: 380000, status: 'ดำเนินงานงวด 2' },
    { no: 'PO-2569-029', title: 'ชุดอุปกรณ์เซนเซอร์ IoT ห้อง FabLab DII', vendor: 'หจก. ลานนา ไมโครเทค', amt: '฿295,000', amountNumber: 295000, status: 'ส่งมอบครบถ้วน รอเบิกจ่าย' },
  ]);

  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [amountFilter, setAmountFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [departmentFilter, statusFilter, amountFilter]);

  const [projects] = useState([
    { code: '2569-DG-P1-001', name: 'โครงการศึกษาดูงานนักศึกษาชั้นปีที่ 3 สาขาวิชาดิจิทัลเกม', dept: 'SQE', bud: 386000, act: 386000, po: 0, status: 'due', statusText: 'เบิกจ่ายครบตามแผน 100%' },
    { code: 'PRJ-2569-ACI-01', name: 'โครงการปรับปรุงหลักสูตรสมัยใหม่', dept: 'ACI', bud: 500000, act: 250000, po: 120000, status: 'overdue', statusText: 'เลยกำหนด (15 วัน)', deadline: '15 พ.ค. 2569', issue: 'รอตรวจรับ' },
    { code: 'PRJ-2569-SQE-03', name: 'อบรมพัฒนาศักยภาพนักศึกษา', dept: 'SQE', bud: 120000, act: 100000, po: 0, status: 'upcoming', statusText: 'ยังไม่ถึงกำหนด (ต.ค.)' },
    { code: 'PRJ-2569-RGI-02', name: 'โครงการจัดซื้ออุปกรณ์ห้อง Lab วิจัย', dept: 'RGI', bud: 300000, act: 180000, po: 120000, status: 'due', statusText: 'ครบกำหนดสัปดาห์นี้' },
    { code: 'PRJ-2569-SQE-05', name: 'โครงการประกวดนวัตกรรมนักศึกษา', dept: 'SQE', bud: 150000, act: 65000, po: 20000, status: 'upcoming', statusText: 'ยังไม่ถึงกำหนด (พ.ย.)' },
    { code: 'PRJ-2569-RGI-01', name: 'ทุนอุดหนุนการวิจัยขั้นสูง', dept: 'RGI', bud: 200000, act: 50000, po: 150000, status: 'overdue', statusText: 'เลยกำหนด (10 วัน)', deadline: '5 มิ.ย. 2569', issue: 'ขาดเอกสารรายงาน' },
    { code: 'PRJ-2569-ASC-01', name: 'บริการวิชาการแก่ชุมชนรอบมหาวิทยาลัย', dept: 'ASC', bud: 450000, act: 150000, po: 50000, status: 'due', statusText: 'ครบกำหนดวันนี้' },
    { code: 'PRJ-2569-AGO-02', name: 'ค่าใช้จ่ายบริหารจัดการองค์กร', dept: 'AGO', bud: 1200000, act: 800000, po: 250000, status: 'upcoming', statusText: 'ยังไม่ถึงกำหนด (ธ.ค.)' },
    { code: 'PRJ-2569-SQE-01', name: 'สวัสดิการและทุนการศึกษานักศึกษา', dept: 'SQE', bud: 850000, act: 600000, po: 150000, status: 'due', statusText: 'ครบกำหนดพรุ่งนี้' },
    { code: 'PRJ-2569-AGO-03', name: 'จ้างเหมาบริการรักษาความสะอาด', dept: 'AGO', bud: 80000, act: 40000, po: 20000, status: 'overdue', statusText: 'เลยกำหนด (5 วัน)', deadline: '20 มิ.ย. 2569', issue: 'รอใบเสร็จ' },
    { code: 'PRJ-2569-ACI-03', name: 'จัดซื้อครุภัณฑ์สำหรับห้องเรียน', dept: 'ACI', bud: 650000, act: 200000, po: 350000, status: 'upcoming', statusText: 'ยังไม่ถึงกำหนด (ม.ค.)' },
    { code: 'PRJ-2569-ASC-03', name: 'ส่งเสริมการถ่ายทอดเทคโนโลยีสู่สังคม', dept: 'ASC', bud: 400000, act: 150000, po: 150000, status: 'due', statusText: 'ครบกำหนดสัปดาห์นี้' },
    { code: 'PRJ-2569-AGO-01', name: 'โครงการพัฒนาระบบสารสนเทศองค์กร', dept: 'AGO', bud: 350000, act: 120000, po: 80000, status: 'overdue', statusText: 'เลยกำหนด (20 วัน)', deadline: '10 พ.ค. 2569', issue: 'รอเอกสารชี้แจง' },
    { code: 'PRJ-2569-ACI-04', name: 'พัฒนาทักษะดิจิทัลสำหรับอาจารย์', dept: 'ACI', bud: 200000, act: 50000, po: 0, status: 'upcoming', statusText: 'ยังไม่ถึงกำหนด (พ.ย.)' },
    { code: 'PRJ-2569-SQE-06', name: 'ค่ายอาสาพัฒนาชนบท', dept: 'SQE', bud: 180000, act: 180000, po: 0, status: 'due', statusText: 'ครบกำหนดวันนี้' },
    { code: 'PRJ-2569-RGI-04', name: 'เผยแพร่ผลงานวิชาการระดับนานาชาติ', dept: 'RGI', bud: 400000, act: 200000, po: 50000, status: 'overdue', statusText: 'เลยกำหนด (7 วัน)', deadline: '8 มิ.ย. 2569', issue: 'รอตรวจรับงานพิมพ์' },
    { code: 'PRJ-2569-ASC-04', name: 'คลินิกเทคโนโลยีชุมชน', dept: 'ASC', bud: 150000, act: 80000, po: 20000, status: 'due', statusText: 'ครบกำหนดสัปดาห์หน้า' },
    { code: 'PRJ-2569-AGO-05', name: 'ปรับปรุงภูมิทัศน์และสภาพแวดล้อม', dept: 'AGO', bud: 600000, act: 100000, po: 450000, status: 'upcoming', statusText: 'ยังไม่ถึงกำหนด (ก.พ.)' },
    { code: 'PRJ-2569-ACI-05', name: 'โครงการผลิตสื่อการเรียนรู้ VR/AR', dept: 'ACI', bud: 750000, act: 250000, po: 100000, status: 'overdue', statusText: 'เลยกำหนด (30 วัน)', deadline: '1 เม.ย. 2569', issue: 'ผู้รับจ้างส่งงานช้า' },
    { code: 'PRJ-2569-SQE-07', name: 'แข่งขัน E-Sports ภายในวิทยาลัย', dept: 'SQE', bud: 80000, act: 30000, po: 0, status: 'upcoming', statusText: 'ยังไม่ถึงกำหนด (มี.ค.)' },
    { code: 'PRJ-2569-RGI-05', name: 'จัดตั้งหน่วยวิจัยปัญญาประดิษฐ์', dept: 'RGI', bud: 1500000, act: 1000000, po: 400000, status: 'due', statusText: 'ครบกำหนดพรุ่งนี้' },
    { code: 'PRJ-2569-ASC-05', name: 'อบรมโค้ดดิ้งสำหรับโรงเรียนมัธยม', dept: 'ASC', bud: 250000, act: 150000, po: 50000, status: 'upcoming', statusText: 'ยังไม่ถึงกำหนด (ธ.ค.)' },
    { code: 'PRJ-2569-AGO-06', name: 'ซ่อมบำรุงระบบปรับอากาศ', dept: 'AGO', bud: 420000, act: 200000, po: 200000, status: 'overdue', statusText: 'เลยกำหนด (2 วัน)', deadline: '25 มิ.ย. 2569', issue: 'รอใบส่งของ' },
    { code: 'PRJ-2569-ACI-06', name: 'เชิญผู้เชี่ยวชาญพิเศษบรรยายพิเศษ', dept: 'ACI', bud: 100000, act: 50000, po: 0, status: 'upcoming', statusText: 'ยังไม่ถึงกำหนด (ส.ค.)' },
  ]);

  const filteredProjects = projects.filter(p => {
    let match = true;
    if (departmentFilter !== 'All' && p.dept !== departmentFilter) match = false;
    if (statusFilter !== 'All' && p.status !== statusFilter) match = false;
    if (amountFilter !== 'All') {
      if (amountFilter === 'low' && p.bud >= 100000) match = false;
      if (amountFilter === 'mid' && (p.bud < 100000 || p.bud > 300000)) match = false;
      if (amountFilter === 'high' && p.bud <= 300000) match = false;
    }
    return match;
  });

  const overdueProjects = projects.filter(p => p.status === 'overdue');

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const filteredCommitments = commitments.filter((c) =>
    !searchQuery ||
    c.no.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = commitments.filter(c => !c.status.includes('อนุมัติ')).length;

  const handleSendAlertClick = () => {
    setIsAlertModalOpen(true);
  };

  const handleConfirmSendAlert = () => {
    setAlertSent(true);
    setIsAlertModalOpen(false);
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

  const handleBulkApprove = () => {
    setCommitments((prev) =>
      prev.map((item) => ({ ...item, status: 'อนุมัติเบิกจ่ายเรียบร้อย (ERP Cleared)' }))
    );
    if (onBulkApprovePO) {
      onBulkApprovePO();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl border border-[#ddc1b2]/40 flex flex-col relative">
        {/* Card Header Section - Sticky Locked */}
        <div className="sticky top-20 z-30 bg-white rounded-t-2xl shadow-sm border-b border-[#e5e8ee]">
          {/* Ribbon */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#e87722] via-[#994700] to-[#366847] rounded-t-2xl"></div>

          {/* Header */}
          <div className="px-6 py-3.5 border-b border-[#e5e8ee] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-[#ffdbc8] text-[#743400] text-[11px] font-bold tracking-wider">
                  #DISB-2569-TRACK
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#b8f0c5] text-[#1d5031] text-[11px] font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#366847] animate-pulse"></span>
                  Q3 On Track
                </span>
                <span className="text-[11px] text-[#79564b]">รอบตรวจสอบประจำไตรมาส 3</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#181c20]">
                ติดตามการเบิกจ่ายงบประมาณ ประจำปีงบประมาณ 2569
              </h2>
              <p className="text-[11px] text-[#564337]">
                วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มหาวิทยาลัยเชียงใหม่ • Fiscal Burn-Rate &amp; Risk Monitor
              </p>
            </div>
            <div className="flex items-center gap-2">
              {activeTab === 'tab-departments' && (
                <button
                  onClick={handleSendAlertClick}
                  disabled={alertSent}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm ${alertSent
                    ? 'bg-[#ebeef3] text-[#79564b] cursor-not-allowed'
                    : 'bg-[#ba1a1a] text-white hover:bg-[#93000a] cursor-pointer'
                    }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {alertSent ? 'notifications_paused' : 'notifications_active'}
                  </span>
                  <span className="hidden sm:inline">
                    {alertSent ? 'ส่งแจ้งเตือนแล้ว' : `เร่งรัดการเบิกจ่าย (${overdueProjects.length} โครงการ)`}
                  </span>
                </button>
              )}

              {activeTab === 'tab-commitments' && (
                <button
                  onClick={handleBulkApprove}
                  disabled={pendingCount === 0}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm ${pendingCount === 0
                    ? 'bg-[#ebeef3] text-[#79564b] cursor-not-allowed'
                    : 'bg-[#366847] text-white hover:bg-[#2b5338] cursor-pointer'
                    }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {pendingCount === 0 ? 'verified' : 'fact_check'}
                  </span>
                  <span className="hidden sm:inline">
                    {pendingCount === 0 ? 'ไม่มีรายการค้าง' : `อนุมัติเบิกจ่ายทั้งหมด (${pendingCount})`}
                  </span>
                </button>
              )}

              <button
                onClick={onExportReport}
                className="p-2 rounded-xl text-[#564337] hover:bg-[#ebeef3] transition-colors cursor-pointer border border-[#ddc1b2]/40 bg-white"
                title="ดาวน์โหลด PDF รายงานเบิกจ่าย"
              >
                <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 bg-[#f1f4f9] border-b border-[#e5e8ee] flex gap-2 overflow-x-auto py-2">
            {[
              { id: 'tab-overview', label: `ติดตามเบิกจ่าย ${projects.length} โครงการทั้งหมด`, icon: 'query_stats' },
              { id: 'tab-departments', label: 'รายการโครงการค้างเบิกจ่าย (เกินกำหนด)', icon: 'account_tree' },
              { id: 'tab-commitments', label: 'รายการ PO และใบสำคัญผูกพันงบ', icon: 'receipt_long', badge: commitments.length.toString() },
              { id: 'tab-risks', label: 'การแจ้งเตือนงบเสี่ยงเบิกจ่ายช้า', icon: 'warning', badge: '3 รายการ', isError: true },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === t.id
                  ? 'bg-[#e87722] text-white shadow-xs'
                  : 'text-[#564337] hover:bg-[#ebeef3]'
                  }`}
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${t.isError && activeTab !== t.id ? 'text-[#ba1a1a]' : ''
                    }`}
                >
                  {t.icon}
                </span>
                <span>{t.label}</span>
                {t.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${t.isError
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
        </div>

        {/* Body Content */}
        <div className="p-6 bg-[#f7f9ff] space-y-6 rounded-b-2xl">
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

              <div className="bg-white rounded-2xl border border-[#ddc1b2]/30 shadow-xs overflow-hidden">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 p-4 border-b border-[#e5e8ee] bg-[#f1f4f9]/40">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#79564b]">filter_list</span>
                    <span className="text-xs font-bold text-[#564337]">กรองข้อมูล:</span>
                  </div>

                  <div className="relative">
                    <select
                      className="appearance-none bg-white border border-[#e5e8ee] text-[#181c20] text-xs rounded-xl pl-3 pr-8 py-2 outline-none focus:ring-2 focus:ring-[#e87722]/50 shadow-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">ทุกสถานะเบิกจ่าย</option>
                      <option value="overdue">เลยกำหนด</option>
                      <option value="due">ครบกำหนด</option>
                      <option value="upcoming">ยังไม่ถึงกำหนด</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-[#79564b] pointer-events-none">expand_more</span>
                  </div>

                  <div className="relative">
                    <select
                      className="appearance-none bg-white border border-[#e5e8ee] text-[#181c20] text-xs rounded-xl pl-3 pr-8 py-2 outline-none focus:ring-2 focus:ring-[#e87722]/50 shadow-sm"
                      value={amountFilter}
                      onChange={(e) => setAmountFilter(e.target.value)}
                    >
                      <option value="All">ทุกระดับวงเงิน</option>
                      <option value="low">ต่ำกว่า ฿100,000</option>
                      <option value="mid">฿100,000 - ฿300,000</option>
                      <option value="high">มากกว่า ฿300,000</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-[#79564b] pointer-events-none">expand_more</span>
                  </div>

                  <div className="relative">
                    <select
                      className="appearance-none bg-white border border-[#e5e8ee] text-[#181c20] text-xs rounded-xl pl-3 pr-8 py-2 outline-none focus:ring-2 focus:ring-[#e87722]/50 shadow-sm"
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                    >
                      <option value="All">ทุกกลุ่มงบประมาณ</option>
                      <option value="SQE">พัฒนาคุณภาพนักศึกษา</option>
                      <option value="ACI">พัฒนาวิชาการและหลักสูตร</option>
                      <option value="RGI">ส่งเสริมการวิจัยและนวัตกรรม</option>
                      <option value="ASC">บริการวิชาการแก่สังคม</option>
                      <option value="AGO">บริหารจัดการและพัฒนาองค์กร</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-[#79564b] pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-white uppercase text-[#79564b] font-bold border-b border-[#e5e8ee]">
                        <th className="py-3 px-4">รหัส / ชื่อโครงการ</th>
                        <th className="py-3 px-4">กลุ่มงบประมาณ</th>
                        <th className="py-3 px-3 text-right">วงเงินจัดสรร</th>
                        <th className="py-3 px-3 text-right">เบิกจ่ายจริง</th>
                        <th className="py-3 px-3 text-right">ภาระผูกพัน PO</th>
                        <th className="py-3 px-3 text-center">สถานะเบิกจ่าย</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ebeef3]">
                      {filteredProjects.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-[#79564b]">
                            ไม่พบโครงการที่ตรงกับเงื่อนไข
                          </td>
                        </tr>
                      ) : (
                        <>
                          {paginatedProjects.map((d) => (
                            <tr key={d.code} className="hover:bg-[#FFF7F0]/30 transition-colors">
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-[#181c20]">{d.name}</div>
                                <div className="text-[10px] text-[#79564b]">{d.code}</div>
                              </td>
                              <td className="py-3.5 px-4 text-[#564337] font-semibold">
                                {d.dept === 'SQE' ? 'พัฒนาคุณภาพนักศึกษา' :
                                  d.dept === 'ACI' ? 'พัฒนาวิชาการและหลักสูตร' :
                                    d.dept === 'RGI' ? 'ส่งเสริมการวิจัยและนวัตกรรม' :
                                      d.dept === 'ASC' ? 'บริการวิชาการแก่สังคม' : 'บริหารจัดการและพัฒนาองค์กร'}
                              </td>
                              <td className="py-3.5 px-3 text-right tabular-nums text-[#564337]">฿{d.bud.toLocaleString()}</td>
                              <td className="py-3.5 px-3 text-right text-[#366847] font-bold tabular-nums">
                                ฿{d.act.toLocaleString()}
                              </td>
                              <td className="py-3.5 px-3 text-right text-[#994700] font-bold tabular-nums">
                                ฿{d.po.toLocaleString()}
                              </td>
                              <td className="py-3.5 px-3 text-center">
                                <span className={`px-2.5 py-1.5 rounded-full font-bold text-[10px] ${d.status === 'overdue' ? 'bg-[#ffdad6] text-[#ba1a1a]' :
                                  d.status === 'due' ? 'bg-[#ffeedb] text-[#994700]' :
                                    'bg-[#e2f5e8] text-[#366847]'
                                  }`}>
                                  {d.statusText}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {/* Placeholder empty rows to keep the table height locked */
                            paginatedProjects.length > 0 && paginatedProjects.length < ITEMS_PER_PAGE && (
                              Array.from({ length: ITEMS_PER_PAGE - paginatedProjects.length }).map((_, i) => (
                                <tr key={`empty-${i}`}>
                                  <td className="py-3.5 px-4 opacity-0 pointer-events-none">
                                    <div className="font-bold text-[#181c20]">&nbsp;</div>
                                    <div className="text-[10px] text-[#79564b]">&nbsp;</div>
                                  </td>
                                  <td className="py-3.5 px-4 opacity-0 pointer-events-none">&nbsp;</td>
                                  <td className="py-3.5 px-3 opacity-0 pointer-events-none">&nbsp;</td>
                                  <td className="py-3.5 px-3 opacity-0 pointer-events-none">&nbsp;</td>
                                  <td className="py-3.5 px-3 opacity-0 pointer-events-none">&nbsp;</td>
                                  <td className="py-3.5 px-3 opacity-0 pointer-events-none">&nbsp;</td>
                                </tr>
                              ))
                            )
                          }
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="px-4 py-3 border-t border-[#e5e8ee] flex items-center justify-between bg-white">
                    <div className="text-xs text-[#79564b]">
                      แสดง {(currentPage - 1) * ITEMS_PER_PAGE + 1} ถึง {Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length)} จาก {filteredProjects.length} โครงการ
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#564337] bg-white border border-[#e5e8ee] hover:bg-[#f1f4f9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${currentPage === page
                            ? 'bg-[#e87722] text-white'
                            : 'text-[#564337] bg-white border border-[#e5e8ee] hover:bg-[#f1f4f9]'
                            }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#564337] bg-white border border-[#e5e8ee] hover:bg-[#f1f4f9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'tab-departments' && (
            <div className="bg-white rounded-2xl border border-[#ddc1b2]/30 shadow-xs overflow-hidden">
              {/* Delayed Projects List */}
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="px-5 py-4 border-b border-[#e5e8ee] flex flex-wrap justify-between items-center gap-3 bg-[#fff0f1]">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-[#ba1a1a] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">warning</span>
                      รายการโครงการค้างเบิกจ่าย (เกินกำหนด)
                    </h3>
                    <span className="text-xs font-bold bg-[#ffdad6] text-[#93000a] px-2.5 py-1 rounded-md">
                      {overdueProjects.length} รายการ
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#f9fafc] text-[#79564b] border-b border-[#e5e8ee]">
                        <th className="py-3 px-5 font-bold">ชื่อโครงการ / รหัส</th>
                        <th className="py-3 px-4 font-bold">หน่วยงาน</th>
                        <th className="py-3 px-4 font-bold text-right">ยอดค้างเบิกจ่าย</th>
                        <th className="py-3 px-5 font-bold text-right">กำหนดส่งเอกสาร (Deadline)</th>
                        <th className="py-3 px-5 font-bold text-center">สถานะ</th>
                        <th className="py-3 px-5 font-bold text-center">การดำเนินการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ebeef3]">
                      {overdueProjects.map(op => {
                        const remaining = op.bud - op.act;
                        const deptText = op.dept === 'SQE' ? 'พัฒนาคุณภาพนักศึกษา (SQE)' :
                          op.dept === 'ACI' ? 'พัฒนาวิชาการและหลักสูตร (ACI)' :
                            op.dept === 'RGI' ? 'ส่งเสริมการวิจัยและนวัตกรรม (RGI)' :
                              op.dept === 'ASC' ? 'บริการวิชาการแก่สังคม (ASC)' : 'บริหารจัดการและพัฒนาองค์กร (AGO)';
                        const daysLate = op.statusText.match(/\((.*?)\)/)?.[1] || '';
                        return (
                          <tr key={op.code} className="hover:bg-[#fff0f1]/50 transition-colors">
                            <td className="py-3 px-5">
                              <div className="font-bold text-[#181c20]">{op.name}</div>
                              <div className="text-[10px] text-[#79564b]">{op.code}</div>
                            </td>
                            <td className="py-3 px-4 text-[#564337]">{deptText}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="font-bold text-[#994700]">฿{remaining.toLocaleString()}</div>
                              <div className="text-[10px] text-[#79564b]">จากงบ ฿{op.bud.toLocaleString()} (เบิกแล้ว ฿{op.act.toLocaleString()})</div>
                            </td>
                            <td className="py-3 px-5 text-right font-semibold text-[#ba1a1a]">{op.deadline} <span className="text-[10px] font-normal">({daysLate})</span></td>
                            <td className="py-3 px-5 text-center">
                              <span className="bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded text-[10px] font-bold">{op.issue}</span>
                            </td>
                            <td className="py-3 px-5 text-center">
                              <button
                                onClick={handleSendAlertClick}
                                disabled={alertSent}
                                className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer ${
                                  alertSent
                                    ? 'bg-[#f1f4f9] text-[#79564b] border-slate-200 cursor-not-allowed'
                                    : 'bg-white border-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffdad6]'
                                }`}
                                title="ส่งหนังสือเร่งรัดโครงการนี้"
                              >
                                <span className="material-symbols-outlined text-[13px]">
                                  {alertSent ? 'check' : 'notifications_active'}
                                </span>
                                {alertSent ? 'แจ้งแล้ว' : 'เร่งรัด'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tab-commitments' && (
            <div className="bg-white p-6 rounded-2xl border border-[#ddc1b2]/30 space-y-3 text-xs shadow-xs">
              <h3 className="font-bold text-sm text-[#181c20] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#e87722]">assignment</span>
                รายการใบสั่งซื้อสั่งจ้าง (Purchase Orders - PO)
              </h3>
              {filteredCommitments.length === 0 ? (
                <div className="p-4 bg-[#f1f4f9] rounded-xl text-center text-[#79564b]">
                  ไม่พบรายการใบสั่งซื้อสั่งจ้างที่ค้นหา
                </div>
              ) : (
                filteredCommitments.map((item) => (
                  <div
                    key={item.no}
                    onClick={() => onOpenProjectModal && onOpenProjectModal(undefined)}
                    className="p-3.5 bg-[#f1f4f9] rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 cursor-pointer hover:bg-[#e2e8f0] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <strong className="text-[#994700] font-bold">{item.no}</strong>: {item.title}
                      <div className="text-[#79564b] mt-0.5">
                        คู่สัญญา: {item.vendor}
                      </div>
                    </div>

                    <div className="sm:w-36 shrink-0 flex items-center">
                      <span className="text-[#79564b] mr-2">วงเงิน</span>
                      <strong className="text-[#181c20] text-sm">{item.amt}</strong>
                    </div>

                    <div className="sm:w-[300px] shrink-0 flex items-center sm:justify-end gap-2">
                      <span className="px-3 py-1 rounded-full bg-white font-bold text-[#564337] border border-[#ddc1b2]/40 shadow-xs text-[10px] sm:text-xs text-center w-full sm:w-auto whitespace-nowrap">
                        {item.status}
                      </span>
                      {!item.status.includes('อนุมัติ') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProcessPO(item.no);
                          }}
                          className="px-3 py-1 rounded-lg bg-[#e87722] hover:bg-[#994700] text-white font-bold text-[10px] sm:text-xs shadow-xs cursor-pointer transition-colors whitespace-nowrap"
                        >
                          อนุมัติเบิกจ่าย
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
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
                  onClick={handleSendAlertClick}
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
                  onClick={handleSendAlertClick}
                  className="px-3 py-1 rounded-lg bg-[#e87722] text-white font-bold text-xs hover:bg-[#994700] cursor-pointer"
                >
                  แจ้งเตือนนักวิจัย DTA
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Alert Details Modal */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#181c20]/60 backdrop-blur-sm" onClick={() => setIsAlertModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#ddc1b2]/40 bg-[#fff0f1] flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#ba1a1a] flex items-center gap-2">
                <span className="material-symbols-outlined">notification_important</span>
                รายละเอียดการแจ้งเตือนเร่งรัด
              </h3>
              <button
                onClick={() => setIsAlertModalOpen(false)}
                className="text-[#79564b] hover:bg-[#ffdad6] p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-6 text-sm text-[#564337] space-y-4">
              <div className="bg-[#f1f4f9] p-4 rounded-xl border border-[#ddc1b2]/40">
                <div className="flex mb-2">
                  <span className="w-20 font-bold text-[#79564b]">ส่งถึง:</span>
                  <div className="flex-1 flex flex-wrap gap-1.5">
                    <span className="bg-white border border-[#ddc1b2] px-2 py-0.5 rounded-md text-xs font-bold whitespace-nowrap inline-flex">หัวหน้าหน่วยวิจัย (RES-01)</span>
                    <span className="bg-white border border-[#ddc1b2] px-2 py-0.5 rounded-md text-xs font-bold whitespace-nowrap inline-flex">หน.ห้องปฏิบัติการ SE</span>
                    <span className="bg-white border border-[#ddc1b2] px-2 py-0.5 rounded-md text-xs font-bold whitespace-nowrap inline-flex">นักวิจัย DTA</span>
                  </div>
                </div>
                <div className="flex mb-2">
                  <span className="w-20 font-bold text-[#79564b]">ช่องทาง:</span>
                  <span className="flex-1 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#e87722]">mail</span> CMU Email &amp; <span className="material-symbols-outlined text-[16px] text-[#e87722]">mark_email_unread</span> CMU MIS Notification
                  </span>
                </div>
                <div className="flex flex-col mt-4">
                  <span className="font-bold text-[#79564b] mb-1">ข้อความที่จะส่ง:</span>
                  <div className="bg-white p-3 border border-[#ddc1b2] rounded-lg text-xs leading-relaxed italic text-[#181c20]">
                    "เรียน ท่านหัวหน้าโครงการ/หัวหน้าส่วนงาน<br /><br />
                    ระบบขอแจ้งเตือนเร่งรัดการเบิกจ่ายงบประมาณไตรมาส 3 เนื่องจากยอดเบิกจ่ายของท่านปัจจุบันต่ำกว่าเป้าหมาย (Fiscal Run-Rate ต่ำกว่า 45%)<br />
                    กรุณาเร่งดำเนินการจัดซื้อจัดจ้าง หรือนำส่งใบสำคัญ/ใบเสร็จ เพื่อเบิกจ่ายงบประมาณภายในวันที่ 30 มิถุนายน 2569<br /><br />
                    หากมีข้อสงสัย กรุณาติดต่อหน่วยการเงินและบัญชี CAMT"<br /><br />
                    <span className="text-[#79564b] text-[10px]">-- ส่งโดยระบบ CAMT Budget Dashboard อัตโนมัติ --</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#f9fafc] border-t border-[#e5e8ee] flex justify-end gap-3">
              <button
                onClick={() => setIsAlertModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-[#79564b] hover:bg-[#ebeef3] transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmSendAlert}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#ba1a1a] hover:bg-[#93000a] shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                ยืนยันการส่งแจ้งเตือน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
