import { useState } from 'react';
import { ProjectItem, DepartmentSummary } from '../data/mockData';
import { OfficialProjectReportDocument } from './OfficialProjectReportDocument';

export type ExportDocumentType =
  | 'overview'
  | 'allocation'
  | 'disbursement'
  | 'reports'
  | 'settings'
  | 'project_detail';

interface DocumentExportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  docType: ExportDocumentType;
  quarterLabel?: string;
  projects?: ProjectItem[];
  departments?: DepartmentSummary[];
  totalAllocated?: number;
  totalSpent?: number;
  centralReserve?: number;
  projectDetail?: ProjectItem | null;
}

export const DocumentExportPreviewModal = ({
  isOpen,
  onClose,
  docType,
  quarterLabel = 'ประจำปีงบประมาณ 2569',
  projects = [],
  departments = [],
  totalAllocated = 12000000,
  totalSpent = 5820000,
  centralReserve = 3450000,
  projectDetail = null,
}: DocumentExportPreviewModalProps) => {
  const [reportViewStyle, setReportViewStyle] = useState<'official' | 'summary'>('official');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const docTitles: Record<ExportDocumentType, { title: string; refCode: string; sub: string }> = {
    overview: {
      title: 'รายงานสรุปสถานะงบประมาณและผลการดำเนินงานโครงการ (Executive Overview)',
      refCode: 'EXP-OVERVIEW-2569',
      sub: 'วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มหาวิทยาลัยเชียงใหม่',
    },
    allocation: {
      title: 'ประกาศแผนการจัดสรรงบประมาณ ประจำปีงบประมาณ 2569 (Allocation Matrix)',
      refCode: 'EXP-ALLOC-2569',
      sub: 'มติที่ประชุมคณะกรรมการประจำวิทยาลัยศิลปะ สื่อ และเทคโนโลยี',
    },
    disbursement: {
      title: 'รายงานการติดตามการเบิกจ่ายและภาระผูกพันงบประมาณ (Disbursement Audit)',
      refCode: 'EXP-DISB-2569',
      sub: 'รอบการประเมินประจำไตรมาส 3 • ระบบเชื่อมโยง CMU-ERP / GFMIS',
    },
    reports: {
      title: 'รายงานการประเมินผลสัมฤทธิ์และดัชนีชี้วัดคุณภาพ (EdPEx & Benchmarks Report)',
      refCode: 'EXP-REP-2569',
      sub: 'เกณฑ์คุณภาพการศึกษาเพื่อการดำเนินการที่เป็นเลิศ (EdPEx CMU)',
    },
    settings: {
      title: 'ประกาศหลักเกณฑ์การกำกับดูแลธรรมาภิบาลและการเงิน (Fiscal Policy & Matrix)',
      refCode: 'EXP-GOV-2569',
      sub: 'ระเบียบการเงินและอำนาจการอนุมัติงบประมาณ วิทยาลัยศิลปะ สื่อ และเทคโนโลยี',
    },
    project_detail: {
      title: `แบบเสนอโครงการและงบประมาณ / รายงานโครงการ: ${projectDetail?.title || 'โครงการศึกษาดูงานนักศึกษาชั้นปีที่ 3 สาขาวิชาดิจิทัลเกม'}`,
      refCode: projectDetail?.code || '2569-DG-P1-001',
      sub: `สาขาวิชา/หน่วยงาน: ${projectDetail?.dept || 'หลักสูตรดิจิทัลเกม'} • รหัส 3D Fund: ${projectDetail?.fund3D || '0201001'}`,
    },
  };

  const currentMeta = docTitles[docType];
  const remaining = totalAllocated - totalSpent;
  const burnRate = totalAllocated > 0 ? ((totalSpent / totalAllocated) * 100).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 z-50 bg-[#181c20]/65 backdrop-blur-[6px] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-[1040px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh] border border-[#ddc1b2]/40 animate-in fade-in zoom-in duration-150">
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
                  เอกสารก่อนส่งออก / พิมพ์จริง
                </span>
                <span className="text-xs text-[#366847] font-bold">ประเภท: {docType.toUpperCase()}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#181c20] mt-0.5">
                {currentMeta.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[#ebeef3] text-[#79564b] transition-colors cursor-pointer"
              title="ปิด"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Document Body (Rendered as executive report) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#f1f4f9] space-y-6">
          <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-[#ddc1b2]/30 max-w-[940px] mx-auto space-y-6 text-xs text-[#181c20]">
            {/* Header with CMU CAMT Official heading */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#ddc1b2]/40 gap-4">
              <div>
                <span className="text-xs font-bold text-[#79564b] tracking-wider uppercase block">
                  College of Arts, Media and Technology (CAMT) • Chiang Mai University
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#181c20] mt-1">
                  {currentMeta.title}
                </h1>
                <p className="text-xs text-[#564337] mt-1">
                  {currentMeta.sub} • ข้อมูล ณ วันที่ <strong>09 ตุลาคม 2569</strong>
                </p>
              </div>

              <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#ddc1b2]/30 text-right">
                <div className="text-[11px] text-[#79564b]">รหัสอ้างอิงเอกสาร:</div>
                <div className="font-mono font-bold text-xs text-[#181c20]">
                  #{currentMeta.refCode}-{Date.now().toString().slice(-4)}
                </div>
                <div className="text-[10px] text-[#366847] font-semibold mt-0.5">
                  CMU ERP &amp; EdPEx Certified
                </div>
              </div>
            </div>

            {/* DYNAMIC CONTENT PER DOCUMENT TYPE */}

            {/* 1. Overview Screen Document */}
            {docType === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f8fafc] p-4 rounded-xl border border-[#ddc1b2]/30">
                  <div>
                    <span className="text-[11px] text-[#79564b] font-bold">งบจัดสรรรวมทั้งหมด</span>
                    <div className="text-lg font-black text-[#181c20] tabular-nums">
                      ฿{totalAllocated.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#366847] font-bold">เบิกจ่ายจริงสะสม</span>
                    <div className="text-lg font-black text-[#366847] tabular-nums">
                      ฿{totalSpent.toLocaleString()} ({burnRate}%)
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#994700] font-bold">งบกลางสำรองคณะ</span>
                    <div className="text-lg font-black text-[#994700] tabular-nums">
                      ฿{centralReserve.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#79564b] font-bold">คงเหลือเบิกจ่ายได้อีก</span>
                    <div className="text-lg font-black text-[#181c20] tabular-nums">
                      ฿{remaining.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="border border-[#ddc1b2]/40 rounded-xl overflow-hidden">
                  <div className="bg-[#ebeef3] px-4 py-2 font-bold text-[#564337] flex justify-between">
                    <span>รายการโครงการในขอบเขต ({projects.length} รายการ)</span>
                    <span>ช่วงเวลา: {quarterLabel}</span>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8fafc] text-[#79564b] border-b">
                      <tr>
                        <th className="py-2.5 px-3">ชื่อโครงการ</th>
                        <th className="py-2.5 px-2">หน่วยงาน</th>
                        <th className="py-2.5 px-2 text-center">ไตรมาส</th>
                        <th className="py-2.5 px-3 text-right">งบจัดสรร</th>
                        <th className="py-2.5 px-3 text-right">เบิกจ่ายแล้ว</th>
                        <th className="py-2.5 px-2 text-center">คืบหน้า</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ebeef3]">
                      {projects.map((p, idx) => (
                        <tr key={p.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#faf8f2]'}>
                          <td className="py-2.5 px-3">
                            <span className="font-bold block text-[#181c20]">{p.title}</span>
                            <span className="text-[10px] text-[#79564b] font-mono">{p.code}</span>
                          </td>
                          <td className="py-2.5 px-2">{p.dept}</td>
                          <td className="py-2.5 px-2 text-center uppercase font-bold text-slate-700">{p.quarter}</td>
                          <td className="py-2.5 px-3 text-right font-bold tabular-nums">฿{p.allocated.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-[#366847] tabular-nums">฿{p.spent.toLocaleString()}</td>
                          <td className="py-2.5 px-2 text-center font-bold">{p.completionPct}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. Allocation Matrix Document */}
            {docType === 'allocation' && (
              <div className="space-y-6">
                <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#ddc1b2]/30 space-y-2">
                  <div className="flex justify-between font-bold text-sm">
                    <span>กรอบวงเงินงบประมาณทั้งคณะ: ฿12,000,000</span>
                    <span className="text-[#366847]">อนุมัติ 100% สภาวิทยาลัยฯ</span>
                  </div>
                  <p className="text-[#564337] leading-relaxed text-xs">
                    แผนการจัดสรรงบประมาณประจำปี 2569 ครอบคลุม 6 ส่วนงานวิชาการ ได้แก่ SE, DII, MMIT, ANI, DG และ AS
                    โดยกันวงเงินสำรองคลังกลาง ฿{centralReserve.toLocaleString()} เพื่อรองรับกรณีฉุกเฉินและพันธกิจเร่งด่วน
                  </p>
                </div>

                <div className="border border-[#ddc1b2]/40 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#ebeef3] text-[#79564b] uppercase font-bold border-b">
                      <tr>
                        <th className="py-3 px-4">สาขาวิชา / หน่วยงาน</th>
                        <th className="py-3 px-3">หัวหน้าส่วนงาน</th>
                        <th className="py-3 px-3 text-center">จำนวนโครงการ</th>
                        <th className="py-3 px-4 text-right">วงเงินจัดสรร (บาท)</th>
                        <th className="py-3 px-3 text-right">สัดส่วน</th>
                        <th className="py-3 px-3 text-center min-w-[110px] whitespace-nowrap">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ebeef3]">
                      {departments.map((d) => (
                        <tr key={d.code} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-[#181c20]">{d.name} ({d.code})</td>
                          <td className="py-3 px-3">{d.head}</td>
                          <td className="py-3 px-3 text-center">{d.prjCount} โครงการ</td>
                          <td className="py-3 px-4 text-right font-black tabular-nums">฿{d.amount.toLocaleString()}</td>
                          <td className="py-3 px-3 text-right font-bold text-[#564337]">{d.share}</td>
                          <td className="py-3 px-3 text-center">
                            <span className="px-2.5 py-1 rounded-full bg-[#b8f0c5] text-[#1d5031] font-bold text-[10px] whitespace-nowrap inline-flex items-center justify-center">
                              อนุมัติสมบูรณ์
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#ddc1b2]/30 space-y-2">
                  <div className="font-bold text-xs text-[#181c20]">เงื่อนไขการเบิกจ่ายและกำกับติดตาม:</div>
                  <ul className="list-disc list-inside space-y-1 text-[#564337] text-[11px]">
                    <li>ปล่อยงบประมาณงวดแรกในอัตรา 40% หลังคณบดีลงนามอนุมัติ</li>
                    <li>อนุญาตให้หัวหน้าส่วนงานปรับเกลี่ยข้ามหมวดได้ไม่เกิน ฿200,000 ต่อปีงบประมาณ</li>
                    <li>ต้องส่งรายงานผลความก้าวหน้าภายใน 15 วันทำการหลังสิ้นไตรมาส</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 3. Disbursement Audit Document */}
            {docType === 'disbursement' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-3 bg-[#f8fafc] p-4 rounded-xl border border-[#ddc1b2]/30">
                  <div>
                    <span className="text-[11px] text-[#79564b] font-bold">งบจัดสรรรวม</span>
                    <div className="text-base font-black text-[#181c20]">฿12,000,000</div>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#366847] font-bold">เบิกจ่ายจริงแล้ว</span>
                    <div className="text-base font-black text-[#366847]">฿5,820,000 (48.5%)</div>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#994700] font-bold">ผูกพันใบสั่งซื้อ (PO)</span>
                    <div className="text-base font-black text-[#994700]">฿2,730,000 (22.75%)</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-[#181c20]">รายการใบสั่งซื้อสั่งจ้างสำคัญ (PO Commitments):</h4>
                  <div className="border border-[#ddc1b2]/40 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#ebeef3] text-[#79564b] font-bold border-b">
                        <tr>
                          <th className="py-2.5 px-3">เลขที่ PO</th>
                          <th className="py-2.5 px-3">รายการ</th>
                          <th className="py-2.5 px-3">คู่สัญญา</th>
                          <th className="py-2.5 px-3 text-right">วงเงิน</th>
                          <th className="py-2.5 px-3 text-center">สถานะตรวจรับ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ebeef3]">
                        <tr>
                          <td className="py-2.5 px-3 font-mono font-bold text-[#e87722]">PO-2569-041</td>
                          <td className="py-2.5 px-3">ชุดเซิร์ฟเวอร์ Cloud Lab SE</td>
                          <td className="py-2.5 px-3">บจก. สยามเน็ตเวิร์ก โซลูชั่นส์</td>
                          <td className="py-2.5 px-3 text-right font-bold">฿680,000</td>
                          <td className="py-2.5 px-3 text-center text-[#366847] font-bold">ส่งมอบแล้ว 80%</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-mono font-bold text-[#e87722]">PO-2569-038</td>
                          <td className="py-2.5 px-3">ลิขสิทธิ์ซอฟต์แวร์แอนิเมชัน ANIM</td>
                          <td className="py-2.5 px-3">บจก. ดิจิทัล ซิสเต็มส์</td>
                          <td className="py-2.5 px-3 text-right font-bold">฿520,000</td>
                          <td className="py-2.5 px-3 text-center text-[#366847] font-bold">ตรวจรับครบถ้วน</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-mono font-bold text-[#e87722]">PO-2569-035</td>
                          <td className="py-2.5 px-3">จ้างพัฒนาระบบ Hybrid Learning DTM</td>
                          <td className="py-2.5 px-3">บจก. อินโนเวทีฟ เอ็ดดูเทค</td>
                          <td className="py-2.5 px-3 text-right font-bold">฿380,000</td>
                          <td className="py-2.5 px-3 text-center text-[#994700] font-bold">งวดงานที่ 2</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Reports & Performance Document */}
            {docType === 'reports' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f8fafc] p-4 rounded-xl border border-[#ddc1b2]/30 text-center">
                  <div>
                    <span className="text-[11px] text-[#79564b]">ประสิทธิภาพการใช้งบ</span>
                    <div className="text-xl font-bold text-[#366847]">92.4%</div>
                    <span className="text-[10px] text-[#366847]">+4.1% เหนือเกณฑ์</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#79564b]">ดัชนีความคุ้มค่า ROI</span>
                    <div className="text-xl font-bold text-[#e87722]">4.65 / 5.0</div>
                    <span className="text-[10px] text-[#564337]">186 โครงการ (37 ส่วนงาน)</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#79564b]">ประหยัดงบรวมศูนย์</span>
                    <div className="text-xl font-bold text-[#181c20]">฿840,000</div>
                    <span className="text-[10px] text-[#366847]">ส่งคืนคลังกลาง</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#79564b]">โครงการสำเร็จตามแผน</span>
                    <div className="text-xl font-bold text-[#366847]">165 / 186</div>
                    <span className="text-[10px] text-[#366847]">ร้อยละ 88.7%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-[#181c20]">ผลการดำเนินงานเทียบ 5 ยุทธศาสตร์ (Strategic KPIs):</h4>
                  <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#ddc1b2]/30 space-y-2">
                    <div className="flex justify-between">
                      <span>1. ยกระดับวิชาการและหลักสูตร (Academic Excellence):</span>
                      <strong className="text-[#366847]">บรรลุ 92% (ยอดใช้ ฿1,720,000 / กรอบ ฿2,450,000)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>2. งานวิจัยและนวัตกรรมแนวหน้า (Research &amp; Innovation):</span>
                      <strong className="text-[#366847]">บรรลุ 89% (ยอดใช้ ฿1,150,000 / กรอบ ฿1,680,000)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>3. พัฒนาศักยภาพนักศึกษา (Student Quality):</span>
                      <strong className="text-[#366847]">บรรลุ 94% (ยอดใช้ ฿1,120,000 / กรอบ ฿1,650,000)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>4. บริการวิชาการสู่สังคม (Social Impact):</span>
                      <strong className="text-[#366847]">บรรลุ 88% (ยอดใช้ ฿780,000 / กรอบ ฿1,220,000)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>5. บริหารจัดการองค์กรอัจฉริยะ (Smart Org):</span>
                      <strong className="text-[#366847]">บรรลุ 95% (ยอดใช้ ฿1,050,000 / กรอบ ฿1,550,000)</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Settings & Governance Document */}
            {docType === 'settings' && (
              <div className="space-y-6">
                <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#ddc1b2]/30 space-y-3">
                  <h4 className="font-bold text-sm text-[#181c20] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#e87722]">tune</span>
                    เกณฑ์ควบคุมงบประมาณและเพดานจัดสรร (Fiscal Policy Controls Matrix):
                  </h4>
                  <table className="w-full text-left text-xs border border-[#ddc1b2]/40 rounded-lg overflow-hidden bg-white mt-2">
                    <thead className="bg-[#ebeef3] font-bold text-[#181c20]">
                      <tr>
                        <th className="py-2.5 px-3">หมวดหมู่นโยบาย</th>
                        <th className="py-2.5 px-3">เกณฑ์ควบคุมและเพดาน</th>
                        <th className="py-2.5 px-3">ผู้มีอำนาจอนุมัติ / กำกับดูแล</th>
                        <th className="py-2.5 px-3">สถานะการบังคับใช้</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-[#181c20]">
                      <tr>
                        <td className="py-2.5 px-3 font-bold">เพดานงบประมาณรวมทั้งคณะ</td>
                        <td className="py-2.5 px-3 font-bold tabular-nums">฿12,000,000 (จัดสรร ฿8.55M + สำรองกลาง ฿3.45M)</td>
                        <td className="py-2.5 px-3">สภาวิทยาลัยศิลปะ สื่อ และเทคโนโลยี</td>
                        <td className="py-2.5 px-3 text-[#366847] font-semibold">อนุมัติสมบูรณ์ 100%</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold">อัตราสำรองงบกลางขั้นต่ำ (Reserve Fund)</td>
                        <td className="py-2.5 px-3 font-bold text-[#994700] tabular-nums">28.75% (฿3,450,000)</td>
                        <td className="py-2.5 px-3">คณะกรรมการบริหารวิทยาลัย (กบว.)</td>
                        <td className="py-2.5 px-3 text-[#366847] font-semibold">เป็นไปตามเกณฑ์ 25%-30%</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold">เพดานปรับเกลี่ยงบข้ามหมวด</td>
                        <td className="py-2.5 px-3 font-bold tabular-nums">฿200,000 ต่อครั้ง</td>
                        <td className="py-2.5 px-3">คณบดี (Dean)</td>
                        <td className="py-2.5 px-3 text-[#366847] font-semibold">มาตรฐานสภาวิทยาลัยฯ</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold">ระบบตรวจสอบและแจ้งเตือนอัตโนมัติ</td>
                        <td className="py-2.5 px-3 font-bold">แจ้งเตือนอัตโนมัติทางระบบและอีเมล</td>
                        <td className="py-2.5 px-3">CMU ERP &amp; Data Pipeline</td>
                        <td className="py-2.5 px-3 text-[#366847] font-semibold">เปิดใช้งานเรียบร้อย</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#ddc1b2]/30 space-y-1.5 text-[11px] text-[#564337]">
                  <strong className="text-xs text-[#181c20] block">มาตรฐานธรรมาภิบาลและความปลอดภัยข้อมูล:</strong>
                  <div>• ระบบตรวจสอบ: สอดคล้องตามมาตรฐาน EdPEx และข้อบังคับมหาวิทยาลัยเชียงใหม่ พ.ศ. 2568</div>
                  <div>• ความถี่การซิงก์ข้อมูล: ดึงข้อมูลอัตโนมัติทุก 15 นาทีผ่าน CMU ERP Data Pipeline</div>
                  <div>• การบันทึกรับรองการตั้งค่า: ผ่านระบบ CMU SSO &amp; 2FA (Session #CAMT-SEC-88219)</div>
                </div>
              </div>
            )}

            {/* 6. Single Project Detail Document */}
            {/* 6. Single Project Detail Document */}
            {docType === 'project_detail' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-[#ddc1b2]/40 print:hidden">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setReportViewStyle('official')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        reportViewStyle === 'official'
                          ? 'bg-[#e87722] text-white shadow-xs'
                          : 'bg-[#f1f4f9] text-[#564337] hover:bg-[#ebeef3]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">menu_book</span>
                      แบบฟอร์มเอกสารทางการ 5 หน้า (CMU Form 2569)
                    </button>
                    <button
                      onClick={() => setReportViewStyle('summary')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        reportViewStyle === 'summary'
                          ? 'bg-[#e87722] text-white shadow-xs'
                          : 'bg-[#f1f4f9] text-[#564337] hover:bg-[#ebeef3]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">dashboard</span>
                      การ์ดสรุปย่อผู้บริหาร
                    </button>
                  </div>
                  <span className="text-[11px] text-[#79564b]">
                    รองรับพิมพ์แยกหน้าตามมาตรฐาน CMU ERP
                  </span>
                </div>

                {reportViewStyle === 'official' ? (
                  <OfficialProjectReportDocument project={projectDetail} interactive={true} />
                ) : (
                  <div className="p-5 bg-[#f8fafc] rounded-xl border border-[#ddc1b2]/30 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#e87722]">
                          #{projectDetail?.code || '2569-DG-P1-001'}
                        </span>
                        <h3 className="text-base font-bold text-[#181c20]">
                          {projectDetail?.title || 'โครงการศึกษาดูงานนักศึกษาชั้นปีที่ 3 สาขาวิชาดิจิทัลเกม ประจำปีการศึกษา 2568'}
                        </h3>
                        <p className="text-[#79564b] text-xs">
                          {projectDetail?.dept || 'หลักสูตรดิจิทัลเกม'} • หัวหน้าโครงการ: {projectDetail?.head || 'ผู้ช่วยศาสตราจารย์ ดร.ธีรวัฒน์ กำเนิดศิริ'}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-[#b8f0c5] text-[#1d5031] font-bold text-xs">
                        เบิกจ่าย {projectDetail?.completionPct || 100}%
                      </span>
                    </div>

                    <p className="text-xs text-[#564337] leading-relaxed border-t border-[#ddc1b2]/30 pt-2">
                      {projectDetail?.description ||
                        'ศึกษาดูงานสถานประกอบการธุรกิจและแหล่งเรียนรู้ด้านดิจิทัลเกม เสริมทักษะการสร้างสรรค์และแรงบันดาลใจในการทำงานจริง'}
                    </p>

                    <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                      <div className="p-2.5 bg-white rounded-lg border">
                        <span className="text-[#79564b]">งบจัดสรร:</span>
                        <div className="font-black text-[#181c20] mt-0.5">
                          ฿{(projectDetail?.allocated || 386000).toLocaleString()}
                        </div>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border">
                        <span className="text-[#366847]">เบิกจ่ายแล้ว:</span>
                        <div className="font-black text-[#366847] mt-0.5">
                          ฿{(projectDetail?.spent || 386000).toLocaleString()}
                        </div>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border">
                        <span className="text-[#e87722]">คงเหลือ:</span>
                        <div className="font-black text-[#e87722] mt-0.5">
                          ฿{((projectDetail?.allocated || 386000) - (projectDetail?.spent || 386000)).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}


          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-6 py-4 bg-white border-t border-[#e5e8ee] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#79564b] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#366847]">verified</span>
            <span>ข้อมูลตรงตามฐานข้อมูล CMU ERP ประจำปีงบประมาณ 2569</span>
          </div>

          <div className="flex items-center gap-2">
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
