import { useState } from 'react';
import {
  OfficialProjectReportData,
  OFFICIAL_REPORT_2569_DG_P1_001,
  getOfficialReportForProject,
  ProjectItem,
} from '../data/mockData';

interface OfficialProjectReportDocumentProps {
  reportData?: OfficialProjectReportData;
  project?: ProjectItem | null;
  interactive?: boolean;
}

// Crisp QR code SVG rendering for official CMU ERP verification
const OfficialQRCode = ({ code }: { code: string }) => (
  <div className="flex flex-col items-center">
    <svg
      width="54"
      height="54"
      viewBox="0 0 29 29"
      className="text-[#181c20]"
      fill="currentColor"
    >
      {/* Outer framing and standard QR markers */}
      <rect x="0" y="0" width="7" height="7" fill="black" />
      <rect x="1" y="1" width="5" height="5" fill="white" />
      <rect x="2" y="2" width="3" height="3" fill="black" />

      <rect x="22" y="0" width="7" height="7" fill="black" />
      <rect x="23" y="1" width="5" height="5" fill="white" />
      <rect x="24" y="2" width="3" height="3" fill="black" />

      <rect x="0" y="22" width="7" height="7" fill="black" />
      <rect x="1" y="23" width="5" height="5" fill="white" />
      <rect x="2" y="24" width="3" height="3" fill="black" />

      {/* Stylized QR data cells for authentic look */}
      <rect x="9" y="1" width="2" height="2" />
      <rect x="13" y="1" width="2" height="2" />
      <rect x="17" y="1" width="2" height="2" />
      <rect x="9" y="4" width="2" height="2" />
      <rect x="15" y="4" width="3" height="2" />
      <rect x="8" y="8" width="2" height="2" />
      <rect x="12" y="8" width="3" height="2" />
      <rect x="18" y="8" width="2" height="2" />
      <rect x="22" y="9" width="3" height="2" />
      <rect x="1" y="11" width="2" height="2" />
      <rect x="5" y="11" width="2" height="2" />
      <rect x="9" y="11" width="3" height="2" />
      <rect x="14" y="11" width="2" height="2" />
      <rect x="18" y="11" width="2" height="2" />
      <rect x="23" y="12" width="2" height="2" />
      <rect x="2" y="14" width="2" height="2" />
      <rect x="6" y="14" width="2" height="2" />
      <rect x="11" y="14" width="2" height="2" />
      <rect x="15" y="14" width="3" height="2" />
      <rect x="20" y="14" width="2" height="2" />
      <rect x="25" y="15" width="2" height="2" />
      <rect x="8" y="17" width="3" height="2" />
      <rect x="13" y="17" width="2" height="2" />
      <rect x="18" y="17" width="3" height="2" />
      <rect x="9" y="20" width="2" height="2" />
      <rect x="14" y="20" width="2" height="2" />
      <rect x="20" y="20" width="3" height="2" />
      <rect x="10" y="23" width="3" height="2" />
      <rect x="15" y="23" width="2" height="2" />
      <rect x="19" y="23" width="2" height="2" />
      <rect x="24" y="23" width="3" height="2" />
      <rect x="9" y="26" width="2" height="2" />
      <rect x="13" y="26" width="3" height="2" />
      <rect x="18" y="26" width="2" height="2" />
      <rect x="23" y="26" width="2" height="2" />
    </svg>
  </div>
);

// Realistic handwritten digital signatures matching official Thai academic certificates
interface SignaturesVisualProps {
  type?: 'sumalee' | 'theerawat' | 'ratlapas' | 'worawit';
  name?: string;
  roleIndex?: number;
}

const SignaturesVisual = ({ type, name, roleIndex = 0 }: SignaturesVisualProps) => {
  // If specific signature name or type matches original 4
  const resolvedType =
    type ||
    (name?.includes('สุมาลี')
      ? 'sumalee'
      : name?.includes('ธีรวัฒน์')
      ? 'theerawat'
      : name?.includes('รัศมิ์ลภัส')
      ? 'ratlapas'
      : name?.includes('วรวิชญ์')
      ? 'worawit'
      : undefined);

  if (resolvedType === 'sumalee') {
    return (
      <svg viewBox="0 0 160 50" className="w-36 h-12 text-[#103a8a] select-none mx-auto">
        <path
          d="M 15 35 Q 25 15, 40 22 T 65 30 Q 80 12, 100 25 T 135 20 Q 145 28, 150 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M 28 32 Q 55 42, 125 36"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (resolvedType === 'theerawat') {
    return (
      <svg viewBox="0 0 160 50" className="w-40 h-12 text-[#1a3b8b] select-none mx-auto">
        <path
          d="M 12 36 Q 28 10, 48 24 T 80 18 Q 95 35, 115 15 T 148 22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        <path
          d="M 20 28 Q 60 12, 90 28 T 135 25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (resolvedType === 'ratlapas') {
    return (
      <svg viewBox="0 0 160 50" className="w-36 h-12 text-[#16347a] select-none mx-auto">
        <path
          d="M 15 28 Q 28 8, 48 18 Q 65 32, 85 16 T 120 22 Q 138 12, 145 26"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M 85 12 L 85 38"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (resolvedType === 'worawit') {
    return (
      <svg viewBox="0 0 160 50" className="w-36 h-12 text-[#183984] select-none mx-auto">
        <path
          d="M 20 32 C 30 14, 55 10, 75 28 C 90 12, 115 18, 140 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 35 34 C 65 42, 110 38, 145 33"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Deterministic procedural cursive fountain-pen signature for any faculty member
  const seed = (name || 'signer')
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), roleIndex * 19);
  const p1x = 15 + (seed % 10);
  const p1y = 28 + ((seed * 3) % 8);
  const c1x = 35 + ((seed * 7) % 15);
  const c1y = 10 + ((seed * 5) % 12);
  const p2x = 60 + ((seed * 11) % 15);
  const p2y = 22 + ((seed * 2) % 12);
  const c2x = 90 + ((seed * 13) % 15);
  const c2y = 8 + ((seed * 4) % 14);
  const endX = 135 + (seed % 12);
  const endY = 20 + ((seed * 9) % 12);
  const underlineEndX = 120 + ((seed * 6) % 20);

  return (
    <svg viewBox="0 0 160 50" className="w-36 h-12 text-[#1a3b8b] select-none mx-auto">
      <path
        d={`M ${p1x} ${p1y} Q ${c1x} ${c1y}, ${p2x} ${p2y} T ${c2x} ${c2y} Q ${endX - 15} 35, ${endX} ${endY}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <path
        d={`M ${p1x + 10} ${p1y + 6} Q ${(p1x + underlineEndX) / 2} ${38 + (seed % 5)}, ${underlineEndX} 35`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const OfficialProjectReportDocument = ({
  reportData: propReportData,
  project,
  interactive = true,
}: OfficialProjectReportDocumentProps) => {
  const [viewMode, setViewMode] = useState<'all' | '1' | '2' | '3' | '4' | '5'>('all');

  const report: OfficialProjectReportData =
    propReportData ||
    (project ? getOfficialReportForProject(project) : OFFICIAL_REPORT_2569_DG_P1_001);

  const monthsHeader = [
    'ต.ค',
    'พ.ย',
    'ธ.ค',
    'ม.ค',
    'ก.พ',
    'มี.ค',
    'เม.ย',
    'พ.ค',
    'มิ.ย',
    'ก.ค',
    'ส.ค',
    'ก.ย',
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Interactive Controls Bar */}
      {interactive && (
        <div className="w-full max-w-[850px] mb-4 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-[#ddc1b2]/40 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#181c20] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#e87722]">
                contract_edit
              </span>
              แบบฟอร์มเอกสารเสนอ/รายงานโครงการ (มช. Form 2569)
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#ffdbc8] text-[#743400] font-bold text-[10px]">
              #{report.projectCode}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#e8f5e9] text-[#1b5e20] font-semibold text-[10px] hidden sm:inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]"></span>
              แม่แบบมาตรฐาน วศ.มช. (ทุกโครงการ)
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-[#79564b]">เลือกดูหน้า:</span>
            {(['all', '1', '2', '3', '4', '5'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === mode
                    ? 'bg-[#e87722] text-white shadow-xs'
                    : 'bg-[#f1f4f9] text-[#564337] hover:bg-[#ebeef3]'
                }`}
              >
                {mode === 'all' ? 'ทุกหน้า (1-5)' : `หน้า ${mode}`}
              </button>
            ))}

            <button
              onClick={() => window.print()}
              className="ml-2 px-3 py-1 rounded-lg bg-[#FFF7F0] border border-[#ddc1b2] text-[#994700] hover:bg-[#ffdbc8] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="พิมพ์เอกสารราชการนี้"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              พิมพ์
            </button>
          </div>
        </div>
      )}

      {/* DOCUMENT SHEETS CONTAINER */}
      <div className="w-full max-w-[850px] space-y-8 print:space-y-0 print:w-full print:max-w-none text-[#181c20] font-sans antialiased text-[13px] leading-relaxed">
        {/* ============================================================== */}
        {/* PAGE 1 */}
        {/* ============================================================== */}
        {(viewMode === 'all' || viewMode === '1') && (
          <div className="bg-white p-10 sm:p-14 shadow-lg rounded-sm border border-[#e2e8f0] print:border-none print:shadow-none print:p-8 min-h-[1100px] flex flex-col justify-between print:break-after-page">
            <div className="space-y-6">
              {/* Header Page 1 */}
              <div className="flex justify-between items-start text-xs text-[#334155] border-b pb-3 border-transparent">
                <div className="font-medium">รหัสโครงการ : {report.projectCode}</div>
                <OfficialQRCode code={report.projectCode} />
              </div>

              {/* Title Section */}
              <div className="text-center pt-2 pb-4">
                <h1 className="text-base sm:text-lg font-bold text-[#0f172a] leading-snug">
                  {report.title}
                </h1>
              </div>

              {/* 1. รายละเอียดโครงการ */}
              <div className="space-y-2">
                <div className="bg-[#e2e8f0]/75 px-3 py-1 text-xs font-bold text-[#1e293b]">
                  1. รายละเอียดโครงการ
                </div>
                <div className="px-1 text-xs space-y-1.5 text-[#334155]">
                  <div>
                    <span className="font-semibold text-[#181c20]">ชื่อโครงการ : </span>
                    {report.title}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="font-semibold text-[#181c20]">หน่วย : </span>
                      {report.unit}
                    </div>
                    <div>
                      <span className="font-semibold text-[#181c20]">งาน : </span>
                      {report.work || '-'}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="font-semibold text-[#181c20]">วันที่เริ่มต้น : </span>
                      {report.startDate}
                    </div>
                    <div>
                      <span className="font-semibold text-[#181c20]">วันที่สิ้นสุด : </span>
                      {report.endDate}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. ผู้รับผิดชอบโครงการ */}
              <div className="space-y-2">
                <div className="bg-[#e2e8f0]/75 px-3 py-1 text-xs font-bold text-[#1e293b]">
                  2. ผู้รับผิดชอบโครงการ
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-[#cbd5e1] border-collapse">
                    <thead>
                      <tr className="bg-[#f8fafc] text-center font-bold text-[#1e293b] border-b border-[#cbd5e1]">
                        <th className="py-1.5 px-3 border-r border-[#cbd5e1] w-1/2">
                          ผู้รับผิดชอบ
                        </th>
                        <th className="py-1.5 px-3 w-1/2">หน้าที่</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#cbd5e1]">
                      {report.committee.map((c, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-1.5 px-3 border-r border-[#cbd5e1]">{c.name}</td>
                          <td className="py-1.5 px-3 text-center">{c.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. ที่มาและเหตุผล */}
              <div className="space-y-2">
                <div className="bg-[#e2e8f0]/75 px-3 py-1 text-xs font-bold text-[#1e293b]">
                  3. ที่มาและเหตุผล
                </div>
                <div className="text-xs text-[#334155] leading-relaxed text-justify px-1 whitespace-pre-line indent-8">
                  {report.rationale}
                </div>
              </div>
            </div>

            {/* Footer Page 1 */}
            <div className="pt-6 border-t border-slate-200 mt-8 flex justify-end text-[10px] text-slate-500 font-mono">
              Fund3D : {report.fund3D} Act3D : {report.act3D} ID3D : {report.id3D}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PAGE 2 */}
        {/* ============================================================== */}
        {(viewMode === 'all' || viewMode === '2') && (
          <div className="bg-white p-10 sm:p-14 shadow-lg rounded-sm border border-[#e2e8f0] print:border-none print:shadow-none print:p-8 min-h-[1100px] flex flex-col justify-between print:break-after-page">
            <div className="space-y-6">
              {/* Header Page 2 */}
              <div className="flex justify-between items-start text-xs text-[#334155]">
                <div className="font-medium">รหัสโครงการ : {report.projectCode}</div>
                <OfficialQRCode code={report.projectCode} />
              </div>

              {/* 4. จุดประสงค์ */}
              <div className="space-y-2 pt-2">
                <div className="bg-[#e2e8f0]/75 px-3 py-1 text-xs font-bold text-[#1e293b]">
                  4. จุดประสงค์
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-[#cbd5e1] border-collapse">
                    <thead>
                      <tr className="bg-[#f8fafc] text-center font-bold text-[#1e293b] border-b border-[#cbd5e1]">
                        <th className="py-2 px-2 border-r border-[#cbd5e1] w-12">ลำดับ</th>
                        <th className="py-2 px-3 border-r border-[#cbd5e1] text-left">
                          จุดประสงค์
                        </th>
                        <th className="py-2 px-3 border-r border-[#cbd5e1] text-left">ตัวชี้วัด</th>
                        <th className="py-2 px-2 border-r border-[#cbd5e1] w-24">จำนวนเป้าหมาย</th>
                        <th className="py-2 px-2 w-16">หน่วย</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#cbd5e1]">
                      {report.objectives.map((obj) => (
                        <tr key={obj.id} className="align-top hover:bg-slate-50">
                          <td className="py-2.5 px-2 text-center border-r border-[#cbd5e1]">
                            {obj.id}
                          </td>
                          <td className="py-2.5 px-3 border-r border-[#cbd5e1] leading-relaxed">
                            {obj.objective}
                          </td>
                          <td className="py-2.5 px-3 border-r border-[#cbd5e1] leading-relaxed">
                            {obj.kpi}
                          </td>
                          <td className="py-2.5 px-2 text-center border-r border-[#cbd5e1] font-bold">
                            {obj.target}
                          </td>
                          <td className="py-2.5 px-2 text-center">{obj.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer Page 2 */}
            <div className="pt-6 border-t border-slate-200 mt-8 flex justify-end text-[10px] text-slate-500 font-mono">
              Fund3D : {report.fund3D} Act3D : {report.act3D} ID3D : {report.id3D}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PAGE 3 */}
        {/* ============================================================== */}
        {(viewMode === 'all' || viewMode === '3') && (
          <div className="bg-white p-10 sm:p-14 shadow-lg rounded-sm border border-[#e2e8f0] print:border-none print:shadow-none print:p-8 min-h-[1100px] flex flex-col justify-between print:break-after-page">
            <div className="space-y-6">
              {/* Header Page 3 */}
              <div className="flex justify-between items-start text-xs text-[#334155]">
                <div className="font-medium">รหัสโครงการ : {report.projectCode}</div>
                <OfficialQRCode code={report.projectCode} />
              </div>

              {/* 5. ประโยชน์ที่ได้รับ */}
              <div className="space-y-2">
                <div className="bg-[#e2e8f0]/75 px-3 py-1 text-xs font-bold text-[#1e293b]">
                  5. ประโยชน์ที่ได้รับ
                </div>
                <div className="px-2 text-xs space-y-1.5 text-[#334155] leading-relaxed">
                  {report.benefits.map((b, idx) => (
                    <div key={idx}>{b}</div>
                  ))}
                </div>
              </div>

              {/* 6. แผนการดำเนินงานโครงการ */}
              <div className="space-y-2">
                <div className="bg-[#e2e8f0]/75 px-3 py-1 text-xs font-bold text-[#1e293b]">
                  6. แผนการดำเนินงานโครงการ
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] border border-[#cbd5e1] border-collapse text-center">
                    <thead>
                      <tr className="bg-[#f8fafc] font-bold text-[#1e293b] border-b border-[#cbd5e1]">
                        <th className="py-2 px-2 border-r border-[#cbd5e1] text-left">รายการ</th>
                        <th className="py-2 px-2 border-r border-[#cbd5e1] w-24">จำนวนเงิน</th>
                        <th className="py-2 px-1 border-r border-[#cbd5e1] w-14">ปีงบประมาณ</th>
                        {monthsHeader.map((m) => (
                          <th key={m} className="py-2 px-1 border-r border-[#cbd5e1] w-7">
                            {m}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#cbd5e1]">
                      {report.actionPlan.map((plan, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2 px-2 border-r border-[#cbd5e1] text-left">
                            {plan.item}
                          </td>
                          <td className="py-2 px-2 border-r border-[#cbd5e1] text-right tabular-nums">
                            {plan.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2 px-1 border-r border-[#cbd5e1] font-mono">
                            {plan.fiscalYear}
                          </td>
                          {monthsHeader.map((m) => (
                            <td key={m} className="py-2 px-0.5 border-r border-[#cbd5e1] font-bold">
                              {plan.activeMonths.includes(m) ? '✓' : ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 7. ยุทธศาสตร์ */}
              <div className="space-y-3">
                <div className="bg-[#e2e8f0]/75 px-3 py-1 text-xs font-bold text-[#1e293b]">
                  7. ยุทธศาสตร์
                </div>
                <div className="text-xs text-[#334155] space-y-2.5 px-1 leading-relaxed">
                  <div>
                    <div className="font-bold text-[#0f172a]">{report.strategies.national.name}</div>
                    {report.strategies.national.items.map((it, i) => (
                      <div key={i} className="pl-3 text-slate-600">
                        {it}
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="font-bold text-[#0f172a]">{report.strategies.cmu.name}</div>
                    {report.strategies.cmu.items.map((it, i) => (
                      <div key={i} className="pl-3 text-slate-600">
                        {it}
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="font-bold text-[#0f172a]">{report.strategies.camt.name}</div>
                    {report.strategies.camt.items.map((it, i) => (
                      <div key={i} className="pl-3 text-slate-600">
                        {it}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 8. การประกันคุณภาพภายใน */}
              <div className="space-y-2">
                <div className="bg-[#e2e8f0]/75 px-3 py-1 text-xs font-bold text-[#1e293b]">
                  8. การประกันคุณภาพภายใน
                </div>
                <div className="text-xs text-[#334155] px-1 space-y-1">
                  <div className="font-bold text-[#0f172a]">{report.qualityAssurance.criteria}</div>
                  {report.qualityAssurance.items.map((it, i) => (
                    <div key={i} className="pl-3 text-slate-600">
                      {it}
                    </div>
                  ))}
                </div>
              </div>

              {/* 9. ผู้เข้าร่วม (Header section on page 3) */}
              <div className="space-y-2">
                <div className="bg-[#e2e8f0]/75 px-3 py-1 text-xs font-bold text-[#1e293b]">
                  9. ผู้เข้าร่วม
                </div>
                <table className="w-full text-xs border border-[#cbd5e1] border-collapse">
                  <thead>
                    <tr className="bg-[#f8fafc] text-center font-bold text-[#1e293b]">
                      <th className="py-1 px-3 border-r border-[#cbd5e1] w-20">ลำดับ</th>
                      <th className="py-1 px-3 border-r border-[#cbd5e1] text-left">ผู้เข้าร่วม</th>
                      <th className="py-1 px-3 w-32">จำนวน (คน)</th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>

            {/* Footer Page 3 */}
            <div className="pt-6 border-t border-slate-200 mt-8 flex justify-end text-[10px] text-slate-500 font-mono">
              Fund3D : {report.fund3D} Act3D : {report.act3D} ID3D : {report.id3D}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PAGE 4 */}
        {/* ============================================================== */}
        {(viewMode === 'all' || viewMode === '4') && (
          <div className="bg-white p-10 sm:p-14 shadow-lg rounded-sm border border-[#e2e8f0] print:border-none print:shadow-none print:p-8 min-h-[1100px] flex flex-col justify-between print:break-after-page">
            <div className="space-y-6">
              {/* Header Page 4 */}
              <div className="flex justify-between items-start text-xs text-[#334155]">
                <div className="font-medium">รหัสโครงการ : {report.projectCode}</div>
                <OfficialQRCode code={report.projectCode} />
              </div>

              {/* Continuation of 9. ผู้เข้าร่วม (Data rows) */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-[#cbd5e1] border-collapse">
                  <tbody className="divide-y divide-[#cbd5e1]">
                    {report.participants.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 border-r border-[#cbd5e1] w-20 text-center">
                          {p.id}
                        </td>
                        <td className="py-2 px-3 border-r border-[#cbd5e1]">{p.group}</td>
                        <td className="py-2 px-3 w-32 text-center font-bold">{p.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 10. งบประมาณการดำเนินงาน */}
              <div className="space-y-2">
                <div className="bg-[#e2e8f0]/75 px-3 py-1 text-xs font-bold text-[#1e293b]">
                  10. งบประมาณการดำเนินงาน
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-[#cbd5e1] border-collapse">
                    <thead>
                      <tr className="bg-[#f8fafc] text-center font-bold text-[#1e293b] border-b border-[#cbd5e1]">
                        <th className="py-2 px-3 border-r border-[#cbd5e1] text-left w-1/2">
                          รายละเอียดค่าใช้จ่าย
                        </th>
                        <th className="py-2 px-3 border-r border-[#cbd5e1] text-left">
                          รายละเอียด
                        </th>
                        <th className="py-2 px-3 text-right w-32">จำนวนเงิน (บาท)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#cbd5e1]">
                      {report.budgetItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2 px-3 border-r border-[#cbd5e1]">
                            <div className="font-semibold text-[#0f172a]">
                              {item.exCode}-{item.categoryName}
                            </div>
                            <div className="text-[11px] text-slate-500">{item.formula}</div>
                          </td>
                          <td className="py-2 px-3 border-r border-[#cbd5e1] text-slate-700">
                            {item.description}
                          </td>
                          <td className="py-2 px-3 text-right tabular-nums font-medium">
                            {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                      {/* Total row */}
                      <tr className="bg-[#f8fafc] font-bold border-t-2 border-[#94a3b8]">
                        <td
                          colSpan={2}
                          className="py-2 px-3 border-r border-[#cbd5e1] text-center text-[#0f172a]"
                        >
                          รวม
                        </td>
                        <td className="py-2 px-3 text-right tabular-nums text-[#0f172a]">
                          {report.totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Footnote notes & Thai text representation */}
                <div className="pt-2 text-xs text-[#334155] space-y-1">
                  <div>
                    หมายเหตุ <span className="font-bold">{report.note}</span>
                  </div>
                  <div>
                    รวมงบประมาณทั้งสิ้น{' '}
                    <span className="font-bold">
                      {report.totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}{' '}
                      บาท
                    </span>{' '}
                    ( {report.totalBudgetText} )
                  </div>
                </div>
              </div>

              {/* Page 4 Signature Block (ผู้รับผิดชอบโครงการ) */}
              <div className="pt-8 flex flex-col items-end pr-8 space-y-1">
                <SignaturesVisual name={report.signatures[0]?.name} roleIndex={0} />
                <div className="text-xs text-center min-w-[240px]">
                  <div className="text-slate-600 mb-1">ผู้รับผิดชอบโครงการ</div>
                  <div className="font-bold text-[#0f172a]">{report.signatures[0]?.name}</div>
                  <div className="text-slate-500 text-[11px]">
                    {report.signatures[0]?.position}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Page 4 */}
            <div className="pt-6 border-t border-slate-200 mt-8 flex justify-end text-[10px] text-slate-500 font-mono">
              Fund3D : {report.fund3D} Act3D : {report.act3D} ID3D : {report.id3D}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PAGE 5 */}
        {/* ============================================================== */}
        {(viewMode === 'all' || viewMode === '5') && (
          <div className="bg-white p-10 sm:p-14 shadow-lg rounded-sm border border-[#e2e8f0] print:border-none print:shadow-none print:p-8 min-h-[1100px] flex flex-col justify-between print:break-after-page">
            <div className="space-y-14">
              {/* Header Page 5 */}
              <div className="flex justify-between items-start text-xs text-[#334155]">
                <div className="font-medium">รหัสโครงการ : {report.projectCode}</div>
                <OfficialQRCode code={report.projectCode} />
              </div>

              {/* 3 Main Hierarchy Signatures with Authentic Visuals */}
              <div className="space-y-12 max-w-lg mx-auto pt-6 text-center text-xs">
                {/* 1. ผู้เสนอโครงการ/ผู้รับผิดชอบ */}
                <div className="flex flex-col items-center space-y-1">
                  <SignaturesVisual name={report.signatures[1]?.name} roleIndex={1} />
                  <div className="text-slate-600">ผู้เสนอโครงการ/ผู้รับผิดชอบ</div>
                  <div className="font-bold text-[#0f172a] text-sm">
                    ( {report.signatures[1]?.name || 'ผู้ช่วยศาสตราจารย์ ดร.ธีรวัฒน์ กำเนิดศิริ'} )
                  </div>
                  <div className="text-slate-500">
                    {report.signatures[1]?.position || 'ตำแหน่ง ประธานหลักสูตรดิจิทัลเกม'}
                  </div>
                </div>

                {/* 2. ผู้เห็นชอบโครงการ */}
                <div className="flex flex-col items-center space-y-1">
                  <SignaturesVisual name={report.signatures[2]?.name} roleIndex={2} />
                  <div className="text-slate-600">ผู้เห็นชอบโครงการ</div>
                  <div className="font-bold text-[#0f172a] text-sm">
                    ( {report.signatures[2]?.name || 'ผู้ช่วยศาสตราจารย์ ดร.รัศมิ์ลภัส สุตีคา'} )
                  </div>
                  <div className="text-slate-500">
                    {report.signatures[2]?.position ||
                      'ตำแหน่ง หัวหน้าสำนักวิชาการศิลปะ สื่อ และเทคโนโลยี'}
                  </div>
                </div>

                {/* 3. ผู้อนุมัติโครงการ (คณบดี) */}
                <div className="flex flex-col items-center space-y-1">
                  <SignaturesVisual name={report.signatures[3]?.name} roleIndex={3} />
                  <div className="text-slate-600">ผู้อนุมัติโครงการ</div>
                  <div className="font-bold text-[#0f172a] text-sm">
                    ( {report.signatures[3]?.name || 'ผู้ช่วยศาสตราจารย์ ดร.วรวิชญ์ จันทร์ฉาย'} )
                  </div>
                  <div className="text-slate-500">
                    {report.signatures[3]?.position ||
                      'ตำแหน่ง คณบดีวิทยาลัยศิลปะ สื่อ และเทคโนโลยี'}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Page 5 */}
            <div className="pt-6 border-t border-slate-200 mt-8 flex justify-end text-[10px] text-slate-500 font-mono">
              Fund3D : {report.fund3D} Act3D : {report.act3D} ID3D : {report.id3D}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
