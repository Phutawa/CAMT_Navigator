import React, { useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ReferenceLine,
} from 'recharts';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  DepartmentSummary,
  ProjectItem,
  StrategicCategory,
  QuarterType,
  INITIAL_CATEGORIES,
} from '../data/mockData';
import { MONTHLY_DISBURSEMENT_TREND } from '../data/chartData';

// ===================== Shared Helpers =====================

const formatCurrency = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toString();
};

const CustomTooltipStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid rgba(24, 24, 27, 0.1)',
  borderRadius: '8px',
  padding: '10px 12px',
  fontSize: '12px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
};

// ===================== 1. RANKED LIST WITH THIN BARS: Allocated vs Used by Department =====================

interface DeptBarChartProps {
  departments: DepartmentSummary[];
  projects: ProjectItem[];
  selectedQuarter: QuarterType;
  selectedCategoryId?: string;
}

export const DeptBudgetBarChart = ({
  departments,
  projects,
  selectedCategoryId = 'all',
}: DeptBarChartProps) => {
  const [viewCount, setViewCount] = useState<8 | 15 | 'all'>(8);
  const [sortMode, setSortMode] = useState<'allocated_desc' | 'pct_desc' | 'pct_asc'>(
    'allocated_desc'
  );

  const rawData = departments
    .map((d) => {
      const deptProjects = projects.filter((p) => p.dept.includes(`(${d.code})`));
      const allocated = deptProjects.reduce((sum, p) => sum + p.allocated, 0);
      const spent = deptProjects.reduce((sum, p) => sum + p.spent, 0);
      const safeSpent = Math.min(spent, allocated);
      const prjCount = deptProjects.length;

      const pct = allocated > 0 ? (safeSpent / allocated) * 100 : 0;
      return {
        name: d.code,
        fullName: d.name,
        en: d.en,
        prjCount,
        จัดสรร: allocated,
        เบิกจ่าย: safeSpent,
        remaining: Math.max(0, allocated - safeSpent),
        pct,
        pctFormatted: pct.toFixed(1) + '%',
      };
    })
    .filter((d) => d.จัดสรร > 0 || d.เบิกจ่าย > 0);

  const sortedData = [...rawData].sort((a, b) => {
    if (sortMode === 'allocated_desc') return b.จัดสรร - a.จัดสรร;
    if (sortMode === 'pct_desc') return b.pct - a.pct;
    if (sortMode === 'pct_asc') return a.pct - b.pct;
    return 0;
  });

  const displayData = viewCount === 'all' ? sortedData : sortedData.slice(0, viewCount);
  const maxAllocated = Math.max(...rawData.map((d) => Math.max(d.จัดสรร, d.เบิกจ่าย)), 1);

  const top5Allocated = sortedData.slice(0, 5).reduce((s, d) => s + d.จัดสรร, 0);
  const totalAllocatedAll = rawData.reduce((s, d) => s + d.จัดสรร, 0);
  const top5Share =
    totalAllocatedAll > 0 ? ((top5Allocated / totalAllocatedAll) * 100).toFixed(1) : '0.0';
  const topDept = sortedData[0] || { name: '-', fullName: '-', จัดสรร: 0, pctFormatted: '0.0%' };

  return (
    <div className="bg-white rounded-xl p-5 border border-[#18181b]/8 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#18181b]/8">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-[#18181b]">
                งบจัดสรรเทียบเบิกจ่ายจริงรายหน่วยงาน
              </h3>
              <span className="font-mono text-xs text-[#71717a] tabular-nums">
                ({displayData.length}/{rawData.length})
              </span>
            </div>
            <p className="text-xs text-[#71717a] mt-0.5">
              {topDept.name} ได้รับจัดสรรสูงสุด (฿{topDept.จัดสรร.toLocaleString()}) • 5 ลำดับแรกคิดเป็น{' '}
              <span className="text-[#18181b] font-medium tabular-nums">{top5Share}%</span> ของงบรวม
              {selectedCategoryId !== 'all' ? 'กลุ่มนี้' : ''}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex p-0.5 bg-[#f0eee9] rounded-lg border border-[#18181b]/8 text-xs">
              {[
                { id: 'allocated_desc' as const, label: 'งบสูงสุด' },
                { id: 'pct_desc' as const, label: '% สูงสุด' },
                { id: 'pct_asc' as const, label: '% ต่ำสุด' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setSortMode(btn.id)}
                  className={`px-2 py-1 rounded-md text-xs transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                    sortMode === btn.id
                      ? 'bg-white text-[#18181b] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
                      : 'text-[#52525b] hover:text-[#18181b]'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="inline-flex p-0.5 bg-[#f0eee9] rounded-lg border border-[#18181b]/8 text-xs">
              {([8, 15, 'all'] as const)
                .filter((cnt) => cnt === 'all' || rawData.length > cnt)
                .map((cnt) => {
                  const isActive =
                    viewCount === cnt || (rawData.length <= 8 && cnt === 'all');
                  return (
                    <button
                      key={cnt}
                      onClick={() => setViewCount(cnt)}
                      className={`px-2 py-1 rounded-md text-xs transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-white text-[#18181b] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
                          : 'text-[#52525b] hover:text-[#18181b]'
                      }`}
                    >
                      {cnt === 'all' ? 'ทั้งหมด' : `Top ${cnt}`}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Legend Row */}
        <div className="flex items-center justify-between py-2.5 text-xs text-[#71717a] border-b border-[#18181b]/6">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#c85a17] inline-block" />
              <span>เบิกจ่ายจริง</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#e4e2dd] inline-block" />
              <span>กรอบงบจัดสรร</span>
            </span>
          </div>
          <span className="text-[11px]">เบิกจ่าย / จัดสรร (อัตราเบิกจ่าย)</span>
        </div>

        {/* Aligned Ranked Rows */}
        <div
          className={`divide-y divide-[#18181b]/6 ${
            viewCount === 'all' || displayData.length > 8
              ? 'max-h-[440px] overflow-y-auto pr-1'
              : ''
          }`}
        >
          {displayData.map((d, index) => {
            const allocPct = Math.max(4, (d.จัดสรร / maxAllocated) * 100);
            const spentPctOfAlloc = d.จัดสรร > 0 ? Math.min(100, (d.เบิกจ่าย / d.จัดสรร) * 100) : 0;

            return (
              <div
                key={d.name}
                className="py-2.5 flex items-center gap-3 hover:bg-[#f7f6f2]/60 transition-colors duration-150 px-1 rounded-md"
              >
                {/* Column 1: Monospace Rank */}
                <span className="w-5 font-mono text-xs text-[#71717a] tabular-nums flex-shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Column 2: Signature Keycap + Department Name */}
                <div className="w-44 sm:w-56 flex items-center gap-2 min-w-0 flex-shrink-0">
                  <span className="px-1.5 py-0.5 rounded bg-[#f0eee9] border border-[#18181b]/10 font-mono text-[11px] font-medium text-[#52525b] flex-shrink-0">
                    {d.name}
                  </span>
                  <span
                    className="text-xs font-medium text-[#18181b] truncate"
                    data-tooltip={`${d.fullName} (${d.en})`}
                  >
                    {d.fullName}
                  </span>
                </div>

                {/* Column 3: Thin Proportional Bar */}
                <div className="flex-1 min-w-[80px] flex items-center">
                  <div
                    className="h-2 rounded-full bg-[#e4e2dd] overflow-hidden transition-all duration-300"
                    style={{ width: `${allocPct}%` }}
                    data-tooltip={`จัดสรร: ฿${d.จัดสรร.toLocaleString()} • เบิกจ่าย: ฿${d.เบิกจ่าย.toLocaleString()}`}
                  >
                    <div
                      className="h-full rounded-full bg-[#c85a17] transition-all duration-300"
                      style={{ width: `${spentPctOfAlloc}%` }}
                    />
                  </div>
                </div>

                {/* Column 4: Right-aligned Figures */}
                <div className="w-36 sm:w-44 flex items-center justify-end gap-2 font-mono text-xs tabular-nums flex-shrink-0">
                  <span className="text-[#52525b]">
                    <span className="text-[#18181b] font-medium">฿{formatCurrency(d.เบิกจ่าย)}</span>
                    <span className="text-[#71717a]"> / {formatCurrency(d.จัดสรร)}</span>
                  </span>
                  <span
                    className={`w-12 text-right font-medium ${
                      d.pct >= 70
                        ? 'text-[#15803d]'
                        : d.pct >= 40
                          ? 'text-[#18181b]'
                          : 'text-[#71717a]'
                    }`}
                  >
                    {d.pctFormatted}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Summary */}
      <div className="mt-3 pt-3 border-t border-[#18181b]/8 flex items-center justify-between text-xs text-[#71717a]">
        <span>คลิกปุ่มเรียงลำดับด้านบนเพื่อตรวจสอบหน่วยงานที่เบิกจ่ายสูงสุดหรือต่ำสุด</span>
        <span className="font-mono tabular-nums">
          รวม ฿{totalAllocatedAll.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

// ===================== 2. DONUT & SHARE LIST: Budget Distribution by Category =====================

interface BudgetDonutChartProps {
  categories: StrategicCategory[];
  projects: ProjectItem[];
  selectedQuarter: QuarterType;
  selectedCategoryId?: string;
  onSelectCategory?: (id: string) => void;
}

export const BudgetDonutChart = ({
  categories,
  projects,
  selectedCategoryId = 'all',
  onSelectCategory,
}: BudgetDonutChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Restrained palette: One primary accent (#c85a17), one forest semantic (#15803d), and stepped neutrals
  const colors: Record<string, string> = {
    academic: '#c85a17', // Primary accent: พัฒนาวิชาการและหลักสูตร
    research: '#15803d', // Forest: ส่งเสริมการวิจัยและนวัตกรรม
    student: '#27272a',  // Deep Graphite: พัฒนาคุณภาพนักศึกษา
    org: '#71717a',      // Muted Slate: บริหารจัดการและพัฒนาองค์กร
    service: '#a1a1aa',  // Warm Stone: บริการวิชาการแก่สังคม
  };

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
      value: allocated,
      color: colors[cat.id] || '#71717a',
      allocated,
      spent,
      remaining,
      spentPct,
      projectCount: catProjects.length,
    };
  });

  const donutData = categoryStats
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const total = donutData.reduce((s, d) => s + d.value, 0);
  const totalRemaining = donutData.reduce((s, d) => s + d.remaining, 0);

  const selectedCatItem =
    selectedCategoryId !== 'all'
      ? donutData.find((d) => d.id === selectedCategoryId)
      : null;
  const activeItem = hoveredIndex !== null ? donutData[hoveredIndex] : selectedCatItem;
  const activePct =
    activeItem && total > 0 ? ((activeItem.value / total) * 100).toFixed(1) : null;

  return (
    <div className="bg-white rounded-xl p-5 border border-[#18181b]/8 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#18181b]/8">
          <div>
            <h3 className="text-sm font-medium text-[#18181b]">
              สัดส่วนงบประมาณตามยุทธศาสตร์
            </h3>
            <p className="text-xs text-[#71717a] mt-0.5">
              คลิกหมวดเพื่อกรองข้อมูลเฉพาะกลุ่มยุทธศาสตร์
            </p>
          </div>
          {selectedCategoryId !== 'all' ? (
            <button
              onClick={() => onSelectCategory?.('all')}
              className="text-xs text-[#c85a17] font-medium hover:underline cursor-pointer"
            >
              ล้างตัวกรอง
            </button>
          ) : (
            <span className="font-mono text-xs text-[#71717a]">5 กลุ่ม</span>
          )}
        </div>

        {/* Donut + Legend */}
        <div className="flex flex-col sm:flex-row items-center gap-4 py-4">
          <div className="relative w-full sm:w-[44%] h-[160px] flex items-center justify-center flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={2}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  labelLine={false}
                  stroke="#ffffff"
                  strokeWidth={2}
                  onMouseEnter={(_, index) => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {donutData.map((entry, index) => {
                    const isSelected = selectedCategoryId === entry.id;
                    const isDimmed =
                      (hoveredIndex !== null && hoveredIndex !== index) ||
                      (hoveredIndex === null &&
                        selectedCategoryId !== 'all' &&
                        !isSelected);

                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        opacity={isDimmed ? 0.3 : 1}
                        className="transition-opacity duration-150 cursor-pointer"
                        onClick={() =>
                          onSelectCategory?.(isSelected ? 'all' : entry.id)
                        }
                      />
                    );
                  })}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label */}
            <div
              onClick={() => {
                if (selectedCategoryId !== 'all') onSelectCategory?.('all');
              }}
              className={`absolute inset-0 flex flex-col items-center justify-center text-center px-2 ${
                selectedCategoryId !== 'all' ? 'cursor-pointer' : 'pointer-events-none'
              }`}
            >
              {activeItem ? (
                <div className="flex flex-col items-center">
                  <span className="font-mono text-[11px] text-[#71717a]">
                    {activeItem.code}
                  </span>
                  <span className="text-sm font-medium text-[#18181b] tabular-nums mt-0.5">
                    ฿{(activeItem.value / 1000000).toFixed(2)}M
                  </span>
                  <span className="font-mono text-xs text-[#52525b] tabular-nums">
                    {activePct}%
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-xs text-[#71717a]">งบโครงการรวม</span>
                  <span className="text-sm font-medium text-[#18181b] tabular-nums mt-0.5">
                    ฿{(total / 1000000).toFixed(2)}M
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Legend */}
          <div className="flex-1 w-full space-y-1.5 min-w-0">
            {donutData.map((item, idx) => {
              const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0';
              const isSelected = selectedCategoryId === item.id;
              return (
                <div
                  key={item.name}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => onSelectCategory?.(isSelected ? 'all' : item.id)}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors duration-150 flex items-center justify-between gap-2 border cursor-pointer ${
                    isSelected
                      ? 'bg-[#f7f6f2] border-[#c85a17]'
                      : 'border-transparent hover:bg-[#f7f6f2]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-xs flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-[#18181b] truncate" title={item.name}>
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs tabular-nums flex-shrink-0">
                    <span className="text-[#71717a]">
                      ฿{(item.value / 1000000).toFixed(2)}M
                    </span>
                    <span className="text-[#18181b] font-medium w-11 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Execution Breakdown */}
      <div className="pt-3 border-t border-[#18181b]/8 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-[#18181b]">
            ผลการเบิกจ่ายจริงและวงเงินคงเหลือรายกลุ่ม
          </span>
          <span className="text-[#71717a] tabular-nums">
            คงเหลือรวม{' '}
            <span className="font-mono font-medium text-[#18181b]">
              ฿{(totalRemaining / 1000000).toFixed(2)}M
            </span>
          </span>
        </div>

        <div className="space-y-1.5">
          {donutData.map((item, idx) => {
            const isSelected = selectedCategoryId === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onSelectCategory?.(isSelected ? 'all' : item.id)}
                className={`px-2.5 py-2 rounded-lg transition-colors duration-150 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#f7f6f2] border-[#c85a17]'
                    : 'bg-[#f7f6f2]/60 border-transparent hover:border-[#18181b]/10'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-1.5 py-0.5 rounded bg-white border border-[#18181b]/10 font-mono text-[11px] text-[#52525b] flex-shrink-0">
                      {item.code || `SO-${idx + 1}`}
                    </span>
                    <span className="font-medium text-[#18181b] truncate">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs tabular-nums flex-shrink-0">
                    <span className="text-[#71717a]">
                      เบิก ฿{(item.spent / 1000000).toFixed(2)}M
                    </span>
                    <span className="text-[#18181b] font-medium w-11 text-right">
                      {item.spentPct.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-1 bg-[#e4e2dd] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, item.spentPct)}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ===================== 3. MAIN CHART MOMENT: Cumulative Disbursement Trend =====================

interface DisbursementTrendChartProps {
  selectedQuarter: QuarterType;
  selectedCategoryId?: string;
}

export const DisbursementTrendChart = ({
  selectedQuarter,
  selectedCategoryId = 'all',
}: DisbursementTrendChartProps) => {
  const [showQuarterlySubSection, setShowQuarterlySubSection] = useState(true);

  let chartData =
    selectedQuarter === 'all'
      ? MONTHLY_DISBURSEMENT_TREND
      : MONTHLY_DISBURSEMENT_TREND.filter(
          (d) => d.label.toLowerCase() === selectedQuarter.toLowerCase()
        );

  const selectedCat =
    selectedCategoryId !== 'all'
      ? INITIAL_CATEGORIES.find((c) => c.id === selectedCategoryId)
      : null;
  const activeCeiling = selectedCat ? selectedCat.budget : 12000000;

  if (selectedCat) {
    const ratio = selectedCat.budget / 8550000;
    const spentRatio = selectedCat.actual / 5820000;
    chartData = chartData.map((d) => ({
      ...d,
      plan: Math.round(d.plan * ratio),
      actual: d.actual !== null ? Math.round(d.actual * spentRatio) : null,
    }));
  }

  const latestDataWithActual = [...chartData].reverse().find((d) => d.actual !== null);
  const latestMonth = latestDataWithActual?.month || 'มิ.ย. 69';
  const latestActual = latestDataWithActual?.actual || 0;
  const latestPlan = latestDataWithActual?.plan || 1;
  const diffPct = ((latestActual - latestPlan) / latestPlan) * 100;
  const isAheadOrOnTrack = diffPct >= 0;
  const diffText = isAheadOrOnTrack
    ? diffPct === 0
      ? 'ตรงตามแผน 100%'
      : `+${diffPct.toFixed(1)}% เทียบแผน`
    : `-${Math.abs(diffPct).toFixed(1)}% เทียบแผน`;

  const formattedActual =
    latestActual >= 1000000
      ? `฿${(latestActual / 1000000).toFixed(2)}M`
      : `฿${latestActual.toLocaleString()}`;

  const categoryLabel = selectedCat ? ` (${selectedCat.title})` : '';

  const CustomTrendTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={CustomTooltipStyle}>
        <p className="font-medium text-[#18181b] mb-1.5">{label}</p>
        <div className="space-y-1">
          {payload.map((p: any) => (
            <div key={p.dataKey} className="flex items-center justify-between gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-[#52525b]">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <span>{p.name}</span>
              </span>
              <span className="font-mono font-medium text-[#18181b] tabular-nums">
                ฿{p.value?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        {payload.length === 2 && payload[0].value && payload[1].value && (
          <div className="mt-2 pt-1.5 border-t border-[#18181b]/8 text-xs flex justify-between gap-4">
            <span className="text-[#71717a]">เทียบเป้าหมาย</span>
            <span
              className={`font-mono font-medium tabular-nums ${
                payload[1].value >= payload[0].value
                  ? 'text-[#15803d]'
                  : 'text-[#c85a17]'
              }`}
            >
              {((payload[1].value / payload[0].value) * 100).toFixed(1)}% ของแผน
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-[#18181b]/8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="text-sm font-medium text-[#18181b]">
            แนวโน้มการเบิกจ่ายสะสมรายเดือนเทียบแผน{categoryLabel}
          </h3>
          <p className="text-xs text-[#71717a] mt-0.5">
            ปีงบประมาณ 2569 (ต.ค. 2568 – ก.ย. 2569) • ข้อมูลสะสมรายเดือน
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-[#52525b]">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#c85a17] inline-block" />
            <span>เบิกจ่ายจริง</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b border-dashed border-[#71717a] inline-block" />
            <span>แผนการเบิกจ่าย</span>
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradActualClean" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c85a17" stopOpacity={0.14} />
              <stop offset="100%" stopColor="#c85a17" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e2dd" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#71717a' }}
            axisLine={{ stroke: '#e4e2dd' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatCurrency}
            tick={{ fontSize: 11, fill: '#71717a', fontFamily: 'JetBrains Mono, monospace' }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip content={<CustomTrendTooltip />} />
          <ReferenceLine
            y={activeCeiling}
            stroke="#a1a1aa"
            strokeDasharray="4 4"
            strokeWidth={1}
            label={{
              value: `กรอบงบ ฿${(activeCeiling / 1000000).toFixed(1)}M`,
              position: 'insideTopRight',
              fontSize: 11,
              fill: '#71717a',
            }}
          />
          <Area
            type="monotone"
            dataKey="plan"
            name="แผนการเบิกจ่าย"
            stroke="#71717a"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fill="none"
            dot={false}
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="actual"
            name="เบิกจ่ายจริง"
            stroke="#c85a17"
            strokeWidth={2}
            fill="url(#gradActualClean)"
            dot={{ r: 3, fill: '#c85a17', stroke: '#ffffff', strokeWidth: 1.5 }}
            activeDot={{ r: 4.5, fill: '#c85a17', stroke: '#ffffff', strokeWidth: 2 }}
            connectNulls={false}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-[#18181b]/8 text-xs text-[#52525b]">
        <div className="flex items-center gap-4 flex-wrap">
          <span>
            ข้อมูลล่าสุด ({latestMonth}):{' '}
            <span className="font-mono font-medium text-[#18181b] tabular-nums">
              {formattedActual}
            </span>{' '}
            (
            <span
              className={`font-medium tabular-nums ${
                isAheadOrOnTrack ? 'text-[#15803d]' : 'text-[#dc2626]'
              }`}
            >
              {diffText}
            </span>
            )
          </span>
          <span className="text-[#18181b]/20">•</span>
          <span>
            คาดการณ์สิ้นปีงบประมาณ:{' '}
            <span className="font-medium text-[#18181b] tabular-nums">
              92.4% – 94.0% ของกรอบงบ
            </span>
          </span>
        </div>

        <button
          onClick={() => setShowQuarterlySubSection(!showQuarterlySubSection)}
          className="flex items-center gap-1 text-xs font-medium text-[#52525b] hover:text-[#18181b] transition-colors duration-150 cursor-pointer"
        >
          {showQuarterlySubSection ? (
            <ChevronDown size={15} strokeWidth={1.5} />
          ) : (
            <ChevronRight size={15} strokeWidth={1.5} />
          )}
          <span>สรุปรายไตรมาส (Q1 – Q4)</span>
        </button>
      </div>

      {/* Compact Quarterly Breakdown Row */}
      {showQuarterlySubSection && (
        <div className="mt-3 pt-3 border-t border-[#18181b]/6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              q: 'Q1',
              period: 'ต.ค. – ธ.ค. 68',
              amount: '฿1,800,000',
              status: 'ปิดรอบ 100%',
              pct: 100,
              isForecast: false,
            },
            {
              q: 'Q2',
              period: 'ม.ค. – มี.ค. 69',
              amount: '฿2,050,000',
              status: 'ปิดรอบ 100%',
              pct: 100,
              isForecast: false,
            },
            {
              q: 'Q3',
              period: 'เม.ย. – มิ.ย. 69',
              amount: '฿1,970,000',
              status: 'ดำเนินการ 96%',
              pct: 96,
              isForecast: false,
            },
            {
              q: 'Q4',
              period: 'ก.ค. – ก.ย. 69',
              amount: '฿2,730,000',
              status: 'แผนคงเหลือรอบเปิด',
              pct: 0,
              isForecast: true,
            },
          ].map((item) => (
            <div
              key={item.q}
              className="p-3 rounded-lg bg-[#f7f6f2] border border-[#18181b]/6 flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-white border border-[#18181b]/10 font-mono text-[11px] font-medium text-[#18181b]">
                    {item.q}
                  </span>
                  <span className="text-[#71717a]">{item.period}</span>
                </div>
                <span
                  className={`text-[11px] font-medium ${
                    item.isForecast ? 'text-[#c85a17]' : 'text-[#15803d]'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-[#52525b]">
                  {item.isForecast ? 'กรอบแผน' : 'เบิกจ่ายจริง'}
                </span>
                <span className="font-mono text-sm font-medium text-[#18181b] tabular-nums">
                  {item.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
