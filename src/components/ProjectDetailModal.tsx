import { useState } from 'react';
import { LAB_IMG, ProjectItem } from '../data/mockData';
import { OfficialProjectReportDocument } from './OfficialProjectReportDocument';

interface ProjectDetailModalProps {
  isOpen: boolean;
  project?: ProjectItem | null;
  onClose: () => void;
  onApproveSuccess?: () => void;
  onExportPreview: (prj: ProjectItem) => void;
  onOpenReduceModal?: (prj: ProjectItem) => void;
}

export const ProjectDetailModal = ({
  isOpen,
  project,
  onClose,
  onApproveSuccess,
  onExportPreview,
  onOpenReduceModal,
}: ProjectDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1);
  const [approved, setApproved] = useState(false);

  if (!isOpen) return null;

  const handleApprove = () => {
    setApproved(true);
    if (onApproveSuccess) onApproveSuccess();
    onClose();
    setApproved(false);
  };

  const defaultProject: ProjectItem = {
    id: 'prj-1',
    code: 'PRJ-2569-SE01',
    title: 'โครงการปรับปรุงห้องปฏิบัติการ AI & Software Architecture',
    dept: 'สาขาวิชาวิศวกรรมซอฟต์แวร์ (SE)',
    category: 'academic',
    allocated: 650000,
    spent: 536250,
    head: 'รศ.ดร. อนันต์ วรคุณากร',
    status: 'active',
    completionPct: 82.5,
    quarter: 'q3',
    periodLabel: 'เม.ย. - มิ.ย. 2569',
  };

  const currentProject = project || defaultProject;
  const remaining = currentProject.allocated - currentProject.spent;

  return (
    <div className="fixed inset-0 z-50 bg-[#181c20]/65 backdrop-blur-[6px] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-[980px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] border border-[#ddc1b2]/40">
        {/* Top color ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#e87722] via-[#994700] to-[#366847]"></div>

        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 bg-white flex flex-col gap-3 border-b border-[#e5e8ee]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded bg-[#ffdbc8] text-[#743400] text-xs font-bold uppercase tracking-wider">
                #{currentProject.code}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#b8f0c5] text-[#1d5031] text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#366847]"></span>
                {currentProject.dept}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#ebeef3] text-[#564337] text-xs font-semibold uppercase">
                {currentProject.quarter} ({currentProject.periodLabel})
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#564337]">
              <button
                onClick={() => onExportPreview(currentProject)}
                className="px-3 py-1.5 rounded-lg bg-[#ebeef3] hover:bg-[#e0e3e8] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="รายงานโครงการนี้ก่อนพิมพ์"
              >
                <span className="material-symbols-outlined text-[18px] text-[#e87722]">print</span>
                <span>พิมพ์</span>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-[#ffdad6] hover:text-[#ba1a1a] flex items-center justify-center transition-colors cursor-pointer"
                title="ปิด"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#181c20] tracking-tight">
              {currentProject.title}
            </h2>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-1 text-xs text-[#79564b]">
              <span className="flex items-center gap-1 text-[#181c20] font-bold">
                <span className="material-symbols-outlined text-[16px] text-[#e87722]">school</span>
                {currentProject.dept}
              </span>
              <span>•</span>
              <span>
                หัวหน้าโครงการ: <strong className="text-[#181c20]">{currentProject.head}</strong>
              </span>
              <span>•</span>
              <span className="text-[#366847] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                เบิกจ่ายแล้ว {currentProject.completionPct}% (฿{currentProject.spent.toLocaleString()})
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab(1)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 1
                  ? 'bg-[#e87722] text-white shadow-xs'
                  : 'bg-[#f1f4f9] text-[#564337] hover:bg-[#ebeef3]'
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">analytics</span>
              ภาพรวมและงบประมาณ (Overview &amp; Financials)
            </button>
            <button
              onClick={() => setActiveTab(2)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 2
                  ? 'bg-[#e87722] text-white shadow-xs'
                  : 'bg-[#f1f4f9] text-[#564337] hover:bg-[#ebeef3]'
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              แบบฟอร์มรายงานเสนอโครงการทางการ (CMU Form 2569)
            </button>
            <button
              onClick={() => setActiveTab(3)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 3
                  ? 'bg-[#e87722] text-white shadow-xs'
                  : 'bg-[#f1f4f9] text-[#564337] hover:bg-[#ebeef3]'
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              ไทม์ไลน์และหลักฐานการเบิกจ่าย (Disbursement Log)
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#f7f9ff] space-y-6">
          {activeTab === 1 && (
            <div className="space-y-6">
              {/* Financial Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-xs border border-[#ddc1b2]/30">
                  <div className="text-xs text-[#79564b] uppercase font-bold tracking-wider">
                    งบประมาณจัดสรรอนุมัติ
                  </div>
                  <div className="text-2xl font-black text-[#181c20] my-2 tabular-nums">
                    ฿{currentProject.allocated.toLocaleString()}
                  </div>
                  <div className="text-xs text-[#79564b]">แหล่งทุน: งบดำเนินการคณะฯ 2569</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-xs border-2 border-[#e87722]">
                  <div className="text-xs text-[#e87722] uppercase font-bold flex justify-between">
                    <span>เบิกจ่ายจริงสะสม</span>
                    <span className="text-[#366847]">{currentProject.completionPct}%</span>
                  </div>
                  <div className="text-2xl font-black text-[#e87722] my-2 tabular-nums">
                    ฿{currentProject.spent.toLocaleString()}
                  </div>
                  <div className="text-xs text-[#366847] font-semibold">ก้าวหน้าเร็วกว่าแผน +4.2%</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-xs border border-[#366847]/40">
                  <div className="text-xs text-[#366847] uppercase font-bold">คงเหลือเบิกจ่ายได้อีก</div>
                  <div className="text-2xl font-black text-[#366847] my-2 tabular-nums">
                    ฿{remaining.toLocaleString()}
                  </div>
                  <div className="text-xs text-[#564337]">
                    คงเหลือ {((remaining / currentProject.allocated) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div className="bg-white p-5 rounded-xl shadow-xs border border-[#ddc1b2]/30 overflow-x-auto">
                <h3 className="text-sm font-bold text-[#181c20] mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#e87722]">list_alt</span>
                  การจัดสรรงบประมาณรายหมวด (Line Items Breakdown)
                </h3>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#f1f4f9] text-[#79564b] uppercase font-bold">
                      <th className="py-2.5 px-3 rounded-l-lg">รายการ</th>
                      <th className="py-2.5 px-3 text-right">งบจัดสรร</th>
                      <th className="py-2.5 px-3 text-right">เบิกจ่ายแล้ว</th>
                      <th className="py-2.5 px-3 text-center rounded-r-lg">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ebeef3]">
                    <tr>
                      <td className="py-3 px-3 font-semibold text-[#181c20]">
                        จัดซื้อ Server Workstation AI Training (NVIDIA GPU x4)
                      </td>
                      <td className="py-3 px-3 text-right font-medium tabular-nums">฿380,000</td>
                      <td className="py-3 px-3 text-right text-[#e87722] font-bold tabular-nums">
                        ฿380,000
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2.5 py-1 rounded-full bg-[#b8f0c5] text-[#1d5031] font-bold">
                          ตรวจรับแล้ว
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-[#181c20]">
                        ปรับปรุงเครือข่ายความเร็วสูง 10Gbps &amp; Interactive Display
                      </td>
                      <td className="py-3 px-3 text-right font-medium tabular-nums">฿156,250</td>
                      <td className="py-3 px-3 text-right text-[#e87722] font-bold tabular-nums">
                        ฿156,250
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2.5 py-1 rounded-full bg-[#b8f0c5] text-[#1d5031] font-bold">
                          ตรวจรับแล้ว
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-[#181c20]">
                        ซอฟต์แวร์ License &amp; Cloud Credits (AWS/Azure for Architecture)
                      </td>
                      <td className="py-3 px-3 text-right font-medium tabular-nums">฿113,750</td>
                      <td className="py-3 px-3 text-right text-[#79564b] font-bold tabular-nums">฿0</td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2.5 py-1 rounded-full bg-[#ffdbc8] text-[#743400] font-bold">
                          รอลงนามจัดซื้อ
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Lab Photo & Key Achievements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#ddc1b2]/30 shadow-xs">
                  <div className="text-xs font-bold text-[#181c20] mb-2 flex items-center justify-between">
                    <span>สภาพพื้นที่ดำเนินโครงการ (CAMT Facility)</span>
                    <span className="text-[11px] text-[#366847] font-semibold">พร้อมใช้งาน 100%</span>
                  </div>
                  <img
                    src={LAB_IMG}
                    alt="AI Lab Room 412"
                    className="w-full h-44 object-cover rounded-lg border border-[#ddc1b2]/30 shadow-xs"
                  />
                  <div className="text-[11px] text-[#79564b] mt-2">
                    รองรับนิสิตและนักวิจัยพร้อมกัน 45 ที่นั่ง
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#ddc1b2]/30 shadow-xs space-y-2.5">
                  <div className="text-xs font-bold text-[#181c20]">
                    ผลสัมฤทธิ์ตามตัวชี้วัด (KPIs &amp; Outcomes)
                  </div>
                  <div className="p-3 bg-[#f1f4f9] rounded-xl flex justify-between items-center text-xs">
                    <span className="text-[#564337]">ผู้เข้าร่วมกิจกรรม/ผู้ใช้งาน</span>
                    <strong className="text-[#e87722] font-bold">120 คน/สัปดาห์ (120%)</strong>
                  </div>
                  <div className="p-3 bg-[#f1f4f9] rounded-xl flex justify-between items-center text-xs">
                    <span className="text-[#564337]">Utilization Rate</span>
                    <strong className="text-[#366847] font-bold">88.4% (ผ่านเกณฑ์ EdPEx)</strong>
                  </div>
                  <div className="p-3 bg-[#f1f4f9] rounded-xl flex justify-between items-center text-xs">
                    <span className="text-[#564337]">ผลงานตีพิมพ์ทางวิชาการ</span>
                    <strong className="text-[#181c20] font-bold">2 ฉบับ (IEEE / Scopus)</strong>
                  </div>
                  <div className="p-3 bg-[#f1f4f9] rounded-xl flex justify-between items-center text-xs">
                    <span className="text-[#564337]">ความพึงพอใจผู้ใช้งาน</span>
                    <strong className="text-[#366847] font-bold">4.85 / 5.00 (ดีเด่น)</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-[#ddc1b2]/40 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#366847]"></span>
                  <span className="font-bold text-xs text-[#181c20]">
                    แบบฟอร์มเอกสารเสนอโครงการและงบประมาณ (ฉบับรับรอง มช. CMU ERP)
                  </span>
                </div>
                <button
                  onClick={() => onExportPreview(currentProject)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#e87722] hover:bg-[#994700] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  พิมพ์ / ส่งออกเอกสารนี้
                </button>
              </div>

              <OfficialProjectReportDocument project={currentProject} interactive={true} />
            </div>
          )}

          {activeTab === 3 && (
            <div className="bg-white p-6 rounded-2xl border border-[#ddc1b2]/30 space-y-4">
              <h3 className="text-sm font-bold text-[#181c20] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#e87722]">history</span>
                บันทึกประวัติการเบิกจ่าย (Disbursement Log)
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-[#f1f4f9] rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="text-[#181c20]">
                      อนุมัติเบิกจ่ายงวดที่ 2 (ตรวจรับงานเรียบร้อย)
                    </strong>
                    <div className="text-[#79564b]">
                      ยอดเงิน ฿156,250 (เลขที่ ตร-69/410 • CMU ERP #GL-9921)
                    </div>
                  </div>
                  <span className="text-[#366847] font-bold bg-[#b8f0c5] px-2.5 py-1 rounded-full">
                    14 ก.ค. 2569
                  </span>
                </div>
                <div className="p-3.5 bg-[#f1f4f9] rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="text-[#181c20]">
                      อนุมัติเบิกจ่ายงวดที่ 1 (จัดซื้อจัดจ้างงวดแรก)
                    </strong>
                    <div className="text-[#79564b]">
                      ยอดเงิน ฿380,000 (เลขที่ ตร-69/302 • CMU ERP #GL-9214)
                    </div>
                  </div>
                  <span className="text-[#366847] font-bold bg-[#b8f0c5] px-2.5 py-1 rounded-full">
                    28 พ.ค. 2569
                  </span>
                </div>
                <div className="p-3.5 bg-[#f1f4f9] rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="text-[#181c20]">อนุมัติจัดสรรงบประมาณโครงการ</strong>
                    <div className="text-[#79564b]">
                      กรอบวงเงินอนุมัติ ฿{currentProject.allocated.toLocaleString()} (มติที่ประชุมสภาวิทยาลัยฯ)
                    </div>
                  </div>
                  <span className="text-[#e87722] font-bold bg-[#ffdbc8] px-2.5 py-1 rounded-full">
                    12 มี.ค. 2569
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#e5e8ee] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-[#366847] flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#366847] animate-pulse"></span>
            ข้อมูลเชื่อมโยงตรงจากระบบ CMU ERP เรียบร้อย
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (onOpenReduceModal) onOpenReduceModal(currentProject);
              }}
              className="px-4 py-2 rounded-xl bg-white border border-[#e87722] hover:bg-[#fff5ef] text-xs font-bold text-[#e87722] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">trending_down</span>
              ปรับลดงบ
            </button>
            <button
              onClick={handleApprove}
              className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${approved ? 'bg-[#366847]' : 'bg-[#e87722] hover:bg-[#994700]'
                }`}
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              {approved ? 'อนุมัติรับรองแล้ว ✓' : 'อนุมัติรับรองรายงาน'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
