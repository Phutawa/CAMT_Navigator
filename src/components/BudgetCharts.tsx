import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList,
  PieChart, Pie, Cell,
  AreaChart, Area, ReferenceLine,
} from 'recharts';
import { DepartmentSummary, ProjectItem, StrategicCategory, QuarterType, INITIAL_CATEGORIES } from '../data/mockData';
import { MONTHLY_DISBURSEMENT_TREND, BUDGET_BY_TYPE } from '../data/chartData';

// ===================== Shared Helpers =====================

const formatCurrency = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toString();
};

const CustomTooltipStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.96)',
  border: '1px solid #ddc1b2',
  borderRadius: '12px',
  padding: '10px 14px',
  fontSize: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
};

// ===================== 1. BAR / BULLET / CAPSULE CHART: Allocated vs Used by Department =====================

interface DeptBarChartProps {
  departments: DepartmentSummary[];
  projects: ProjectItem[];
  selectedQuarter: QuarterType;
  selectedCategoryId?: string;
}

export const DeptBudgetBarChart = ({
  departments,
  projects,
  selectedQuarter,
  selectedCategoryId = 'all',
}: DeptBarChartProps) => {
  const [viewCount, setViewCount] = useState<8 | 15 | 'all'>(8);
  const [sortMode, setSortMode] = useState<'allocated_desc' | 'pct_desc' | 'pct_asc'>('allocated_desc');
  const [chartMode, setChartMode] = useState<'capsule' | 'bullet' | 'bar'>('capsule');

  const rawData = departments
    .map((d) => {
      // Find all projects belonging to this department in the current filtered projects view
      const deptProjects = projects.filter((p) => p.dept.includes(`(${d.code})`));
      const allocated = deptProjects.reduce((sum, p) => sum + p.allocated, 0);
      const spent = deptProjects.reduce((sum, p) => sum + p.spent, 0);
      const prjCount = deptProjects.length;

      const pct = allocated > 0 ? (spent / allocated) * 100 : 0;
      return {
        name: d.code,
        fullName: d.name,
        en: d.en,
        prjCount,
        จัดสรร: allocated,
        เบิกจ่าย: spent,
        remaining: Math.max(0, allocated - spent),
        pct,
        pctFormatted: pct.toFixed(1) + '%',
        overBudget: spent > allocated,
      };
    })
    .filter((d) => d.จัดสรร > 0 || d.เบิกจ่าย > 0);

  // Sorting
  const sortedData = [...rawData].sort((a, b) => {
    if (sortMode === 'allocated_desc') {
      return b.จัดสรร - a.จัดสรร; // Descending by allocated budget (User recommendation #2)
    }
    if (sortMode === 'pct_desc') {
      return b.pct - a.pct; // Descending by execution percentage
    }
    if (sortMode === 'pct_asc') {
      return a.pct - b.pct; // Ascending by execution percentage (Warning attention)
    }
    return 0;
  });

  const displayData = viewCount === 'all' ? sortedData : sortedData.slice(0, viewCount);
  const maxAllocated = Math.max(...rawData.map((d) => Math.max(d.จัดสรร, d.เบิกจ่าย)), 1);
  const totalProjectsInView = rawData.reduce((s, d) => s + d.prjCount, 0);

  // Executive Insights for Subtitle (User recommendation #5: Data-Ink Ratio)
  const top5Allocated = sortedData.slice(0, 5).reduce((s, d) => s + d.จัดสรร, 0);
  const totalAllocatedAll = rawData.reduce((s, d) => s + d.จัดสรร, 0);
  const top5Share =
    totalAllocatedAll > 0 ? ((top5Allocated / totalAllocatedAll) * 100).toFixed(1) : '0';
  const topDept = sortedData[0] || { name: '-', fullName: '-', จัดสรร: 0, pctFormatted: '0%' };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const item = payload[0]?.payload;
    return (
      <div style={CustomTooltipStyle}>
        <p className="font-bold text-[#181c20] mb-1">
          {item?.fullName} ({label || item?.name})
        </p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#ffdbc8] border border-[#e87722]"></span>
            <span className="text-[#564337]">
              งบจัดสรร: <strong className="tabular-nums">฿{item?.จัดสรร?.toLocaleString()}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#2e7d32]"></span>
            <span className="text-[#564337]">
              เบิกจ่ายจริง: <strong className="tabular-nums">฿{item?.เบิกจ่าย?.toLocaleString()}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-[#ebeef3] text-[11px]">
            <span className="text-[#79564b]">อัตราเบิกจ่าย:</span>
            <span
              className={`font-bold ${
                item?.pct >= 70 ? 'text-[#2e7d32]' : item?.pct >= 40 ? 'text-[#e87722]' : 'text-[#ba1a1a]'
              }`}
            >
              {item?.pctFormatted}
            </span>
          </div>
          {item?.overBudget && (
            <div className="text-[#ba1a1a] font-bold text-[11px]">⚠️ เบิกจ่ายเกินงบจัดสรร!</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#ddc1b2]/30 flex flex-col justify-between h-full">
      {/* Header Container: Clean 2-Row Layout to Guarantee Zero Overlap on All Screen Sizes */}
      <div className="mb-3.5 space-y-2.5">
        {/* Row 1: Title, Department Count Badge, and View Mode Toggle */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#e87722] flex-shrink-0">view_timeline</span>
            <h3 className="text-sm font-bold text-[#181c20] whitespace-nowrap">
              งบจัดสรร vs เบิกจ่ายจริง รายหน่วยงาน
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-[#ffdbc8] text-[#743400] text-[10px] font-bold whitespace-nowrap">
              {rawData.length} หน่วยงาน
            </span>
          </div>

          {/* View Mode Toggle (Capsule vs Bullet vs Bar) on far right of Row 1 */}
          <div className="flex items-center bg-[#f1f4f9] rounded-xl p-0.5 text-xs flex-shrink-0">
            <button
              onClick={() => setChartMode('capsule')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold ${
                chartMode === 'capsule'
                  ? 'bg-white text-[#e87722] shadow-xs'
                  : 'text-[#79564b] hover:text-[#181c20]'
              }`}
              title="มุมมองแคปซูลอินโฟกราฟิก (สไตล์รูปตัวอย่าง)"
            >
              <span className="material-symbols-outlined text-[15px]">view_stream</span>
              <span className="hidden sm:inline">แคปซูล</span>
            </button>
            <button
              onClick={() => setChartMode('bullet')}
              className={`p-1 rounded-lg transition-colors cursor-pointer ${
                chartMode === 'bullet'
                  ? 'bg-white text-[#e87722] shadow-xs'
                  : 'text-[#79564b] hover:text-[#181c20]'
              }`}
              title="มุมมอง Bullet Chart แนวนอน"
            >
              <span className="material-symbols-outlined text-[16px]">view_agenda</span>
            </button>
            <button
              onClick={() => setChartMode('bar')}
              className={`p-1 rounded-lg transition-colors cursor-pointer ${
                chartMode === 'bar'
                  ? 'bg-white text-[#e87722] shadow-xs'
                  : 'text-[#79564b] hover:text-[#181c20]'
              }`}
              title="มุมมอง Recharts แนวนอน"
            >
              <span className="material-symbols-outlined text-[16px]">bar_chart</span>
            </button>
          </div>
        </div>

        {/* Row 2: Executive Insight Subtitle with 100% Full Width (Never Truncates!) */}
        <div className="text-[11px] text-[#564337] bg-[#f8fafc] px-3 py-1.5 rounded-xl border border-slate-100 flex items-center justify-between">
          <p className="leading-relaxed">
            <span className="font-semibold text-[#181c20]">{topDept.name}</span> ได้รับจัดสรรสูงสุด (฿{formatCurrency(topDept.จัดสรร)}) •{' '}
            {rawData.length > 1
              ? `${Math.min(5, rawData.length)} ลำดับแรกครองสัดส่วน `
              : 'ครองสัดส่วน '}
            <strong className="text-[#e87722]">{top5Share}%</strong> ของงบรวม{selectedCategoryId !== 'all' ? 'กลุ่มนี้' : 'ทั้งคณะ'}
          </p>
        </div>
      </div>

      {/* Visual Legend & Interactive Toolbar (Row 3: Clean & Spacious) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 text-[11px] pb-3 mb-2 border-b border-[#ebeef3]">
        <div className="flex items-center gap-3">
          {chartMode === 'capsule' ? (
            <>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#e87722] text-white text-[9px] font-black flex items-center justify-center">1</span>
                <span className="text-[#564337] font-semibold">อันดับหน่วยงาน</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-2 rounded-full bg-[#ffdbc8] border border-[#e87722]/50 inline-block"></span>
                <span className="text-[#564337] font-semibold">งบจัดสรร (Target)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded-full bg-[#2e7d32] inline-block"></span>
                <span className="text-[#564337] font-semibold">เบิกจ่ายจริง (Actual)</span>
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-2 rounded-sm bg-[#ffdbc8] border border-[#e87722]/50 inline-block"></span>
                <span className="text-[#564337] font-semibold">งบจัดสรร (Target)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded-sm bg-[#2e7d32] inline-block"></span>
                <span className="text-[#564337] font-semibold">เบิกจ่ายจริง (Actual)</span>
              </span>
            </>
          )}
          <span className="text-[10px] text-[#79564b]">
            แสดงผล {displayData.length}/{rawData.length} หน่วยงาน
          </span>
        </div>

        {/* Filter Controls: All Aligned Flush Right with Ample Space */}
        <div className="flex items-center gap-1.5 flex-wrap justify-end ml-auto">
          {/* Sorting Buttons */}
          <div className="flex items-center gap-0.5 bg-[#f1f4f9] rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setSortMode('allocated_desc')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                sortMode === 'allocated_desc'
                  ? 'bg-white text-[#994700] shadow-xs'
                  : 'text-[#564337] hover:text-[#181c20]'
              }`}
              title="เรียงจากงบจัดสรรมากไปน้อย"
            >
              งบสูงสุด ▾
            </button>
            <button
              onClick={() => setSortMode('pct_desc')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                sortMode === 'pct_desc'
                  ? 'bg-white text-[#2e7d32] shadow-xs'
                  : 'text-[#564337] hover:text-[#181c20]'
              }`}
              title="เรียงจาก % เบิกจ่ายสูงสุด"
            >
              % สูงสุด ▾
            </button>
            <button
              onClick={() => setSortMode('pct_asc')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                sortMode === 'pct_asc'
                  ? 'bg-white text-[#ba1a1a] shadow-xs'
                  : 'text-[#564337] hover:text-[#181c20]'
              }`}
              title="เรียงจาก % เบิกจ่ายต่ำสุด"
            >
              % ต่ำสุด ▴
            </button>
          </div>

          {/* View Count Pills */}
          <div className="flex items-center gap-0.5 bg-[#f1f4f9] rounded-xl p-0.5 text-xs">
            {([8, 15, 'all'] as const)
              .filter((cnt) => cnt === 'all' || rawData.length > cnt)
              .map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => setViewCount(cnt)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                    viewCount === cnt || (rawData.length <= 8 && cnt === 'all')
                      ? 'bg-[#e87722] text-white shadow-xs'
                      : 'text-[#564337] hover:text-[#181c20]'
                  }`}
                >
                  {cnt === 'all' ? `ทั้งหมด (${rawData.length})` : `Top ${cnt}`}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* VIEW 1: HORIZONTAL CAPSULE INFOGRAPHIC CHART (Capsule shape + Original Green/Orange Colors) */}
      {chartMode === 'capsule' ? (
        <div
          className={`space-y-2.5 pr-1 flex-1 flex flex-col justify-start ${
            viewCount === 'all' || displayData.length > 8 ? 'max-h-[460px] overflow-y-auto' : ''
          }`}
        >
          {displayData.map((d, index) => {
            const allocPct = (d.จัดสรร / maxAllocated) * 100;
            const spentPctOfMax = (d.เบิกจ่าย / maxAllocated) * 100;

            const badgeStyle =
              d.pct >= 70
                ? { bg: '#b8f0c5', text: '#1d5031', border: '#366847' }
                : d.pct >= 40
                ? { bg: '#ffdbc8', text: '#743400', border: '#e87722' }
                : { bg: '#ffdad6', text: '#ba1a1a', border: '#ba1a1a' };

            return (
              <div
                key={d.name}
                className="group relative flex items-center justify-between p-1.5 sm:p-2 pr-3 sm:pr-4 rounded-full border border-[#ddc1b2]/30 bg-[#faf8f6] shadow-2xs transition-all duration-200 hover:shadow-md hover:scale-[1.008] hover:bg-[#fdf9f6] cursor-default"
              >
                {/* Left Circular Rank Badge */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-white text-sm sm:text-base shadow-sm flex-shrink-0 ring-2 ring-white/70 bg-[#e87722]">
                  {index + 1}
                </div>

                {/* Department Info */}
                <div className="flex flex-col min-w-0 w-36 sm:w-52 ml-2.5 sm:ml-3.5 flex-shrink-0">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-mono font-bold text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-md bg-[#f1f4f9] text-[#181c20] border border-slate-200 shadow-2xs">
                      {d.name}
                    </span>
                    <span
                      className="font-bold text-xs text-[#181c20] truncate"
                      title={`${d.fullName} (${d.en})`}
                    >
                      {d.fullName}
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#564337] mt-0.5 tabular-nums flex items-center gap-1 truncate">
                    <span className="font-bold text-[#2e7d32]">฿{formatCurrency(d.เบิกจ่าย)}</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-500">฿{formatCurrency(d.จัดสรร)}</span>
                  </div>
                </div>

                {/* Center: Horizontal Progress Bar (กราฟแนวนอน - สีเขียว/ส้ม) */}
                <div className="flex-1 relative h-5 sm:h-6 mx-2 sm:mx-3 flex items-center min-w-[70px]">
                  {/* Background Target Bar (งบจัดสรร / ส้มอ่อน) */}
                  <div
                    className="absolute left-0 h-3.5 sm:h-4 rounded-full bg-[#ffdbc8]/80 border border-[#e87722]/40 transition-all duration-300 group-hover:bg-[#ffd5bc]"
                    style={{ width: `${allocPct}%` }}
                    title={`งบจัดสรร: ฿${d.จัดสรร.toLocaleString()}`}
                  >
                    {/* Target tick line */}
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#e87722] rounded-r-full" />
                  </div>

                  {/* Foreground Actual Bar (เบิกจ่ายจริง / เขียวเข้ม) */}
                  <div
                    className="absolute left-0 h-2 sm:h-2.5 rounded-full bg-[#2e7d32] transition-all duration-500 z-10 shadow-xs group-hover:brightness-110"
                    style={{ width: `${Math.min(allocPct, spentPctOfMax)}%` }}
                    title={`เบิกจ่ายจริง: ฿${d.เบิกจ่าย.toLocaleString()} (${d.pctFormatted})`}
                  />

                  {/* Overbudget segment */}
                  {d.overBudget && (
                    <div
                      className="absolute h-2 sm:h-2.5 rounded-r-full bg-[#ba1a1a] z-10"
                      style={{
                        left: `${allocPct}%`,
                        width: `${spentPctOfMax - allocPct}%`,
                      }}
                      title="เบิกจ่ายเกินงบจัดสรร!"
                    />
                  )}
                </div>

                {/* Right: Percentage Pill Badge */}
                <div className="flex items-center gap-2 flex-shrink-0 text-right">
                  <span
                    className="px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-black tabular-nums shadow-xs border"
                    style={{
                      backgroundColor: badgeStyle.bg,
                      color: badgeStyle.text,
                      borderColor: `${badgeStyle.border}40`,
                    }}
                    title={`อัตราการเบิกจ่ายจริง: ${d.pctFormatted}`}
                  >
                    {d.pctFormatted}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : chartMode === 'bullet' ? (
        /* VIEW 2: HORIZONTAL BULLET CHART (Classic) */
        <div
          className={`space-y-2.5 pr-1 flex-1 flex flex-col justify-start ${
            viewCount === 'all' || displayData.length > 8 ? 'max-h-[380px] overflow-y-auto' : ''
          }`}
        >
          {displayData.map((d, index) => {
            const allocPct = (d.จัดสรร / maxAllocated) * 100;
            const spentPctOfMax = (d.เบิกจ่าย / maxAllocated) * 100;

            const badgeStyle =
              d.pct >= 70
                ? 'bg-[#b8f0c5]/70 text-[#1d5031] border-[#366847]/30'
                : d.pct >= 40
                ? 'bg-[#ffdbc8]/70 text-[#743400] border-[#e87722]/30'
                : 'bg-[#ffdad6]/80 text-[#ba1a1a] border-[#ba1a1a]/30';

            return (
              <div
                key={d.name}
                className="group relative p-2 rounded-xl hover:bg-[#f8fafc] transition-all border border-transparent hover:border-[#ddc1b2]/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  {/* Left: Code + Full Name */}
                  <div className="flex items-center gap-2 sm:w-56 flex-shrink-0">
                    <span className="w-5 text-[10px] text-[#79564b] font-mono text-right flex-shrink-0">
                      #{index + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-[#f1f4f9] text-[#181c20] flex-shrink-0 border border-slate-200">
                      {d.name}
                    </span>
                    <span
                      className="font-medium text-[#181c20] truncate text-xs cursor-default"
                      title={`${d.fullName} (${d.en})`}
                    >
                      {d.fullName}
                    </span>
                  </div>

                  {/* Center: Overlapping Bullet Bar */}
                  <div className="flex-1 relative h-6 flex items-center px-1">
                    {/* Background Target Bar (งบจัดสรร / ส้มอ่อน) */}
                    <div
                      className="absolute left-1 h-4 rounded-md bg-[#ffdbc8]/80 border border-[#e87722]/40 transition-all duration-300 group-hover:bg-[#ffd5bc]"
                      style={{ width: `calc(${allocPct}% - 6px)` }}
                    >
                      {/* Target tick line at the far right edge of the bar */}
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#e87722] rounded-r-md"></div>
                    </div>

                    {/* Foreground Actual Bar (เบิกจ่ายจริง / เขียวเข้มซ้อนด้านในตรงกลาง) */}
                    <div
                      className="absolute left-1 h-2 rounded-sm bg-[#2e7d32] transition-all duration-300 z-10 shadow-2xs group-hover:brightness-110"
                      style={{ width: `calc(${Math.min(allocPct, spentPctOfMax)}% - 6px)` }}
                    ></div>

                    {/* Overbudget segment if spent > allocated */}
                    {d.overBudget && (
                      <div
                        className="absolute left-1 h-2 rounded-r-sm bg-[#ba1a1a] transition-all duration-300 z-10"
                        style={{
                          left: `calc(${allocPct}% - 5px)`,
                          width: `calc(${spentPctOfMax - allocPct}% - 1px)`,
                        }}
                        title="เบิกจ่ายเกินงบจัดสรร!"
                      ></div>
                    )}
                  </div>

                  {/* Right: Actual / Allocated Figures + Progress Badge */}
                  <div className="flex items-center justify-end gap-2.5 sm:w-52 flex-shrink-0 text-right">
                    <div className="text-[11px] tabular-nums">
                      <span className="font-bold text-[#2e7d32]">฿{formatCurrency(d.เบิกจ่าย)}</span>
                      <span className="text-slate-300 mx-1">/</span>
                      <span className="text-slate-500 font-medium">฿{formatCurrency(d.จัดสรร)}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black tabular-nums border ${badgeStyle}`}
                      title={`ความคืบหน้าการเบิกจ่าย: ${d.pctFormatted}`}
                    >
                      {d.pctFormatted}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW 3: HORIZONTAL RECHARTS BAR CHART */
        <div
          className={`flex-1 flex flex-col justify-start ${
            viewCount === 'all' || displayData.length > 8 ? 'max-h-[380px] overflow-y-auto' : ''
          }`}
        >
          <ResponsiveContainer
            width="100%"
            height={
              displayData.length <= 2
                ? 130
                : displayData.length <= 4
                ? 180
                : Math.max(260, displayData.length * 36)
            }
          >
            <BarChart
              layout="vertical"
              data={displayData}
              barGap={displayData.length <= 3 ? -18 : -14}
              margin={{ top: 8, right: 65, left: 15, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ebeef3" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={formatCurrency}
                tick={{ fontSize: 10, fill: '#79564b' }}
                axisLine={{ stroke: '#ddc1b2' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: '#181c20', fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={false} />
              {/* Outer Bar: Budget Allocated */}
              <Bar
                dataKey="จัดสรร"
                fill="#ffdbc8"
                stroke="#e87722"
                strokeWidth={1}
                barSize={displayData.length <= 3 ? 18 : 14}
                radius={[0, 6, 6, 0]}
              />
              {/* Inner Overlapping Bar: Actual Spent */}
              <Bar
                dataKey="เบิกจ่าย"
                fill="#2e7d32"
                barSize={displayData.length <= 3 ? 10 : 8}
                radius={[0, 4, 4, 0]}
              >
                <LabelList
                  dataKey="pctFormatted"
                  position="right"
                  style={{ fontSize: '10px', fontWeight: 800, fill: '#366847' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

// ===================== 2. DONUT CHART: Budget Distribution by Category =====================

interface BudgetDonutChartProps {
  categories: StrategicCategory[];
  projects: ProjectItem[];
  selectedQuarter: QuarterType;
}

export const BudgetDonutChart = ({ categories, projects, selectedQuarter }: BudgetDonutChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // High-contrast categorical color palette (User Recommendation #2)
  const colors: Record<string, string> = {
    'academic': '#e87722',  // พัฒนาวิชาการและหลักสูตร (CAMT Primary Orange)
    'research': '#2e7d32',  // ส่งเสริมการวิจัยและนวัตกรรม (Emerald Green)
    'student': '#0284c7',   // พัฒนาคุณภาพนักศึกษา (Vibrant Ocean Blue)
    'org': '#475569',       // บริหารจัดการและพัฒนาองค์กร (Slate Charcoal)
    'service': '#d97706',   // บริการวิชาการแก่สังคม (Amber Gold)
  };

  // Aggregate category stats directly from projects in the current view
  const categoryStats = categories.map((cat) => {
    const catProjects = projects.filter((p) => p.category === cat.id);
    const allocated = catProjects.reduce((sum, p) => sum + p.allocated, 0);
    const spent = catProjects.reduce((sum, p) => sum + p.spent, 0);
    const remaining = Math.max(0, allocated - spent);
    const spentPct = allocated > 0 ? (spent / allocated) * 100 : 0;

    return {
      id: cat.id,
      name: cat.title,
      code: cat.code,
      value: allocated, // for donut slice size
      color: colors[cat.id] || '#79564b',
      allocated,
      spent,
      remaining,
      spentPct,
      projectCount: catProjects.length,
    };
  });

  // Sort descending by allocated budget
  const donutData = categoryStats
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const total = donutData.reduce((s, d) => s + d.value, 0);
  const strategicExecutionData = donutData;
  const totalRemaining = strategicExecutionData.reduce((s, d) => s + d.remaining, 0);

  const activeItem = hoveredIndex !== null ? donutData[hoveredIndex] : null;
  const activePct = activeItem && total > 0 ? ((activeItem.value / total) * 100).toFixed(1) : null;

  // Direct Labeling inside donut slices (User Recommendation #4)
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (percent < 0.08) return null; // Hide on slices smaller than 8% to prevent clipping
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.52;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-bold text-[11px] pointer-events-none select-none"
        style={{ fontWeight: 800, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#ddc1b2]/30 flex flex-col justify-between h-full">
      {/* Card Header: Clean Title without redundant Total in Subtitle */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-bold text-[#181c20] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#e87722]">donut_large</span>
              สัดส่วนประเภทงบประมาณ
            </h3>
            <p className="text-[11px] text-[#79564b] mt-0.5">
              สัดส่วน 5 กลุ่มยุทธศาสตร์ (เรียงลำดับจากมากไปน้อยตามเข็มนาฬิกา)
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#f1f4f9] text-[#564337] text-[10px] font-bold whitespace-nowrap">
            5 ยุทธศาสตร์
          </span>
        </div>

        {/* Donut Chart + Legend Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Donut Chart with Interactive Center Inspector */}
          <div className="relative w-full sm:w-[48%] h-[170px] flex items-center justify-center flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={44}
                  outerRadius={74}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  labelLine={false}
                  label={renderCustomizedLabel}
                  stroke="#ffffff"
                  strokeWidth={2}
                  onMouseEnter={(_, index) => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {donutData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.4}
                      className="transition-all duration-200 cursor-pointer"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Interactive Center Inspector */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-1 transition-all duration-200">
              {activeItem ? (
                <div className="animate-in fade-in zoom-in-95 duration-150 flex flex-col items-center">
                  <span
                    className="text-[8.5px] font-bold px-1.5 py-0.2 rounded-full mb-0.5 max-w-[110px] truncate shadow-2xs text-white"
                    style={{ backgroundColor: activeItem.color }}
                  >
                    {activeItem.name}
                  </span>
                  <span className="text-sm font-extrabold text-[#181c20] tabular-nums tracking-tight">
                    ฿{(activeItem.value / 1000000).toFixed(1)}M
                  </span>
                  <span className="text-[9.5px] font-extrabold tabular-nums" style={{ color: activeItem.color }}>
                    {activePct}% ของงบรวม
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-[8.5px] font-bold text-[#79564b] uppercase tracking-wider">
                    งบจัดสรรรวม
                  </span>
                  <span className="text-sm font-extrabold text-[#181c20] tabular-nums tracking-tight">
                    ฿{(total / 1000000).toFixed(1)}M
                  </span>
                  <span className="text-[8.5px] text-[#79564b] tabular-nums mt-0.5">
                    5 ยุทธศาสตร์
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Legend List on Right */}
          <div className="flex-1 w-full space-y-1 min-w-0">
            {donutData.map((item, idx) => {
              const pct = total > 0 ? ((item.value / total) * 100).toFixed(0) : '0';
              const isHovered = hoveredIndex === idx;
              return (
                <div
                  key={item.name}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`px-1.5 py-1 rounded-xl transition-all flex items-center gap-2 border cursor-pointer ${
                    isHovered
                      ? 'bg-[#fff8f5] border-[#ffdbc8] shadow-xs'
                      : 'border-transparent hover:bg-[#f8fafc]'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-md flex-shrink-0 shadow-2xs"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 text-[11px]">
                      <span className="font-bold text-[#181c20] truncate text-[10px]" title={item.name}>
                        #{idx + 1} {item.name}
                      </span>
                      <span
                        className="font-extrabold text-[10px] tabular-nums flex-shrink-0 px-1 py-0.2 rounded bg-slate-100"
                        style={{ color: item.color }}
                      >
                        {pct}%
                      </span>
                    </div>
                    <div className="text-[9px] text-[#79564b] tabular-nums">
                      ฿{(item.value / 1000000).toFixed(1)}M ({item.value.toLocaleString()} บาท)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Strategic Execution & Unspent Balance Panel (Fills empty vertical space with high-value decision data) */}
      <div className="pt-2.5 mt-2.5 border-t border-[#ebeef3] space-y-1.5">
        {/* Sub-header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-[#2e7d32]">account_balance_wallet</span>
            <span className="text-xs font-bold text-[#181c20]">ผลการเบิกจ่ายจริง & งบคงเหลือ</span>
            <span className="text-[9.5px] text-[#79564b] hidden sm:inline">(Actual vs Unspent)</span>
          </div>
          <div className="text-[9.5px] text-[#564337] flex items-center gap-1">
            <span>คงเหลือรวม:</span>
            <strong className="text-[#743400] tabular-nums font-bold text-[10.5px] bg-[#ffdbc8]/70 px-1.5 py-0.2 rounded-md">
              ฿{(totalRemaining / 1000000).toFixed(2)}M
            </strong>
          </div>
        </div>

        {/* 5 Strategic Execution Progress Rows */}
        <div className="space-y-1">
          {strategicExecutionData.map((item, idx) => {
            const isHovered = hoveredIndex === idx;
            const statusConfig =
              item.spentPct >= 65
                ? { label: 'ตามเป้า', dot: 'bg-[#2e7d32]', text: 'text-[#2e7d32]' }
                : item.spentPct >= 45
                ? { label: 'ปานกลาง', dot: 'bg-[#e87722]', text: 'text-[#e87722]' }
                : { label: 'เร่งรัด', dot: 'bg-[#ba1a1a]', text: 'text-[#ba1a1a]' };

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`px-2 py-1.5 rounded-xl transition-all cursor-pointer border ${
                  isHovered
                    ? 'bg-[#fff8f5] border-[#ffdbc8] shadow-xs ring-1 ring-[#e87722]/30'
                    : 'bg-[#f8fafc]/70 border-slate-100 hover:bg-[#f1f4f9] hover:border-slate-200'
                }`}
              >
                {/* Top line of row: Code Badge, Title, Spent % and Status */}
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="px-1.5 py-0.2 rounded text-[8.5px] font-black tracking-wider uppercase flex-shrink-0 text-white"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.code || `SO-${idx + 1}`}
                    </span>
                    <span className="text-[10.5px] font-bold text-[#181c20] truncate">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="flex items-center gap-1 text-[9.5px]">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
                      <span className={`font-bold ${statusConfig.text}`}>
                        {item.spentPct.toFixed(1)}%
                      </span>
                    </span>
                  </div>
                </div>

                {/* Dual Progress Bar: Shows spent portion */}
                <div className="w-full h-1 bg-slate-200/80 rounded-full overflow-hidden flex mb-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, item.spentPct)}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>

                {/* Bottom line: Financial breakdown (Spent vs Remaining) */}
                <div className="flex items-center justify-between text-[9px] text-[#79564b] tabular-nums">
                  <span>
                    เบิกจ่าย <strong className="text-[#181c20] font-semibold">฿{(item.spent / 1000000).toFixed(2)}M</strong>
                  </span>
                  <span>
                    คงเหลือ <strong className="text-[#994700] font-semibold">฿{(item.remaining / 1000000).toFixed(2)}M</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ===================== 3. AREA/LINE CHART: Cumulative Disbursement Trend =====================

interface DisbursementTrendChartProps {
  selectedQuarter: QuarterType;
  selectedCategoryId?: string;
}

export const DisbursementTrendChart = ({ selectedQuarter, selectedCategoryId = 'all' }: DisbursementTrendChartProps) => {
  const [showQuarterlySubSection, setShowQuarterlySubSection] = useState(true);
  let chartData = selectedQuarter === 'all' 
    ? MONTHLY_DISBURSEMENT_TREND 
    : MONTHLY_DISBURSEMENT_TREND.filter(d => d.label.toLowerCase() === selectedQuarter.toLowerCase());
    
  const selectedCat = selectedCategoryId !== 'all' ? INITIAL_CATEGORIES.find(c => c.id === selectedCategoryId) : null;
  const activeCeiling = selectedCat ? selectedCat.budget : 12000000;

  if (selectedCat) {
    const ratio = selectedCat.budget / 8550000;
    const spentRatio = selectedCat.actual / 5159023; // Total actual spent across department projects is 5,159,023
    chartData = chartData.map(d => ({
      ...d,
      plan: Math.round(d.plan * ratio),
      actual: d.actual !== null ? Math.round(d.actual * spentRatio) : null,
    }));
  }

  // Calculate dynamic footer metrics from the latest available month with actual disbursement
  const latestDataWithActual = [...chartData].reverse().find(d => d.actual !== null);
  const latestMonth = latestDataWithActual?.month || 'มิ.ย. 69';
  const latestActual = latestDataWithActual?.actual || 0;
  const latestPlan = latestDataWithActual?.plan || 1;
  const diffPct = ((latestActual - latestPlan) / latestPlan) * 100;
  const isAheadOrOnTrack = diffPct >= 0;
  const diffText = isAheadOrOnTrack 
    ? diffPct === 0 ? 'ตรงเป้า 100%' : `สูงกว่าแผน +${diffPct.toFixed(1)}%`
    : `ต่ำกว่าแผน ${Math.abs(diffPct).toFixed(1)}%`;

  const formattedActual = latestActual >= 1000000 
    ? `฿${(latestActual / 1000000).toFixed(2)}M` 
    : `฿${latestActual.toLocaleString()}`;

  const categoryLabel = selectedCat ? ` (${selectedCat.title})` : ' (ภาพรวมทั้งวิทยาลัย)';

  const CustomTrendTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={CustomTooltipStyle}>
        <p className="font-bold text-[#181c20] mb-1">{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }}></span>
            <span className="text-[#564337]">
              {p.name}: <strong className="tabular-nums">฿{p.value?.toLocaleString()}</strong>
            </span>
          </div>
        ))}
        {payload.length === 2 && payload[0].value && payload[1].value && (
          <div className="mt-1 pt-1 border-t border-[#ebeef3] text-[11px]">
            <span className={payload[1].value >= payload[0].value ? 'text-[#366847]' : 'text-[#ba1a1a]'}>
              {payload[1].value >= payload[0].value ? '✅ ตรงเป้า' : '⚠️ ต่ำกว่าเป้า'}{' '}
              ({((payload[1].value / payload[0].value) * 100).toFixed(0)}%)
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#ddc1b2]/30">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#181c20] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#e87722]">trending_up</span>
            แนวโน้มการเบิกจ่ายสะสมรายเดือน vs แผน {selectedCat && <span className="text-xs text-[#e87722] font-semibold">({selectedCat.title})</span>}
          </h3>
          <p className="text-[11px] text-[#79564b] mt-0.5">ปีงบประมาณ 2569 (ต.ค. 2568 - ก.ย. 2569) • เส้นส้ม = แผน, เส้นเขียว = เบิกจ่ายจริง</p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-[#e87722] rounded-full inline-block"></span>
            <span className="text-[#79564b] font-bold">แผน</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-[#366847] rounded-full inline-block"></span>
            <span className="text-[#79564b] font-bold">จริง</span>
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="gradPlan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e87722" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#e87722" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#366847" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#366847" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ebeef3" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: '#79564b' }}
            axisLine={{ stroke: '#ddc1b2' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatCurrency}
            tick={{ fontSize: 10, fill: '#79564b' }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip content={<CustomTrendTooltip />} />
          <ReferenceLine
            y={activeCeiling}
            stroke="#ba1a1a"
            strokeDasharray="6 3"
            strokeWidth={1.5}
            label={{
              value: `เพดานงบ ฿${(activeCeiling / 1000000).toFixed(1)}M`,
              position: 'right',
              fontSize: 10,
              fill: '#ba1a1a',
              fontWeight: 700,
            }}
          />
          <Area
            type="monotone"
            dataKey="plan"
            name="แผนการเบิกจ่าย"
            stroke="#e87722"
            strokeWidth={2.5}
            strokeDasharray="6 3"
            fill="url(#gradPlan)"
            dot={false}
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="actual"
            name="เบิกจ่ายจริง"
            stroke="#366847"
            strokeWidth={2.5}
            fill="url(#gradActual)"
            dot={{ r: 3.5, fill: '#366847', stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 5, fill: '#366847', stroke: '#fff', strokeWidth: 2 }}
            connectNulls={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-[#ebeef3]">
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="material-symbols-outlined text-[14px] text-[#e87722]">info</span>
          <span className="text-[#79564b]">
            เดือน {latestMonth}{categoryLabel}: เบิกจ่ายจริง <strong className="text-[#181c20]">{formattedActual}</strong>{' '}
            (<strong className={isAheadOrOnTrack ? 'text-[#366847]' : 'text-[#ba1a1a]'}>{diffText}</strong>)
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="material-symbols-outlined text-[14px] text-[#366847]">speed</span>
          <span className="text-[#79564b]">
            คาดว่าจะใช้งบครบ:{' '}
            <strong className="text-[#181c20]">
              {latestActual >= activeCeiling ? 'บรรลุเป้าหมายแล้ว' : 'ก.ย. 2569'}
            </strong>
          </span>
        </div>
      </div>

      {/* Sub-extension: Quarterly Run-Rate & Forecast Bar Breakdown */}
      <div className="mt-4 pt-3 border-t border-[#ebeef3]">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setShowQuarterlySubSection(!showQuarterlySubSection)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#181c20] hover:text-[#e87722] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#e87722]">
              {showQuarterlySubSection ? 'expand_more' : 'chevron_right'}
            </span>
            <span>ส่วนขยายย่อย: สรุปยอดเบิกจ่ายและพยากรณ์รายไตรมาส (Q1 - Q4 Fiscal Run-Rate Forecast)</span>
          </button>
          <span className="text-[10px] font-bold text-[#79564b] bg-[#f1f4f9] px-2 py-0.5 rounded-md">
            เป้าหมาย: ฿2.85M / ไตรมาส
          </span>
        </div>

        {showQuarterlySubSection && (
          <div className="space-y-3 pt-2 bg-[#fcfdfa] p-3.5 rounded-xl border border-[#ddc1b2]/30">
            {/* Chart with Target Line */}
            <div className="relative pt-6 pb-2">
              {/* Horizontal Target Line across bars - accurately scaled to target ฿2.85M */}
              <div className="absolute left-0 right-0 bottom-[145px] z-10 pointer-events-none">
                <div className="w-full border-b-2 border-dashed border-[#e87722]/80"></div>
              </div>

              {/* 4 Quarterly Columns with Solid, Balanced Bars */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 h-48 items-end border-b border-[#ebeef3] pb-2 text-center">
                {/* Q1 */}
                <div className="flex flex-col items-center justify-end h-full z-20">
                  <div className="mb-2 text-center">
                    <span className="font-extrabold text-xs sm:text-sm text-[#181c20] block">฿2.80M</span>
                    <span className="text-[10px] text-[#564337] font-semibold block">98.2% ของเป้า</span>
                  </div>
                  <div className="w-16 sm:w-20 md:w-24 bg-gradient-to-t from-[#264b33] to-[#366847] hover:brightness-110 transition-all rounded-t-xl h-[101px] shadow-sm flex items-center justify-center text-white text-xs font-bold">
                    ฿2.80M
                  </div>
                  <div className="pt-2 w-full max-w-[135px]">
                    <span className="px-2 py-0.5 rounded-md bg-[#dcfce7] text-[#166534] border border-[#86efac]/50 text-[10px] font-bold block truncate">
                      Q1 (สำเร็จ 98%)
                    </span>
                  </div>
                </div>

                {/* Q2 */}
                <div className="flex flex-col items-center justify-end h-full z-20">
                  <div className="mb-2 text-center">
                    <span className="font-extrabold text-xs sm:text-sm text-[#181c20] block">฿3.00M</span>
                    <span className="text-[10px] text-[#166534] font-semibold block">105.3% ของเป้า</span>
                  </div>
                  <div className="w-16 sm:w-20 md:w-24 bg-gradient-to-t from-[#264b33] to-[#366847] hover:brightness-110 transition-all rounded-t-xl h-[108px] shadow-sm flex items-center justify-center text-white text-xs font-bold">
                    ฿3.00M
                  </div>
                  <div className="pt-2 w-full max-w-[135px]">
                    <span className="px-2 py-0.5 rounded-md bg-[#bbf7d0] text-[#14532d] border border-[#4ade80] text-[10px] font-extrabold block truncate shadow-xs">
                      Q2 (ทะลุเป้า 105%)
                    </span>
                  </div>
                </div>

                {/* Q3 */}
                <div className="flex flex-col items-center justify-end h-full z-20">
                  <div className="mb-2 text-center">
                    <span className="font-extrabold text-xs sm:text-sm text-[#181c20] block">฿2.70M</span>
                    <span className="text-[10px] text-[#92400e] font-semibold block">94.7% ของเป้า</span>
                  </div>
                  <div className="w-16 sm:w-20 md:w-24 bg-gradient-to-t from-[#264b33] to-[#366847] hover:brightness-110 transition-all rounded-t-xl h-[98px] shadow-sm flex items-center justify-center text-white text-xs font-bold">
                    ฿2.70M
                  </div>
                  <div className="pt-2 w-full max-w-[135px]">
                    <span className="px-2 py-0.5 rounded-md bg-[#fef3c7] text-[#92400e] border border-[#fcd34d] text-[10px] font-bold block truncate">
                      Q3 (ปิดรอบ 95%)
                    </span>
                  </div>
                </div>

                {/* Q4 */}
                <div className="flex flex-col items-center justify-end h-full z-20">
                  <div className="mb-2 text-center">
                    <span className="font-extrabold text-xs sm:text-sm text-[#e87722] block">฿3.50M</span>
                    <span className="text-[10px] text-[#e87722] font-semibold block">แผนเร่งรัด 123%</span>
                  </div>
                  <div className="w-16 sm:w-20 md:w-24 bg-gradient-to-t from-[#c2410c] to-[#e87722] hover:brightness-110 transition-all rounded-t-xl h-[126px] border-2 border-dashed border-[#994700] shadow-sm flex items-center justify-center text-white text-xs font-bold">
                    ฿3.50M Est.
                  </div>
                  <div className="pt-2 w-full max-w-[135px]">
                    <span className="px-2 py-0.5 rounded-md bg-[#ffdbc8] text-[#743400] border border-[#e87722]/40 text-[10px] font-bold block truncate">
                      Q4 (คาดการณ์)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-[#FFF7F0] border border-[#e87722]/30 rounded-lg text-xs text-[#994700] font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#e87722]">psychology</span>
              <span>โมเดล AI พยากรณ์ความแม่นยำ 96.8% ว่าการเบิกจ่ายสิ้นงวดปี 2569 จะอยู่ที่ 92.4% - 94.0% ตามเป้าหมายของคณะฯ</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
