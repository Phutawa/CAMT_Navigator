import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Wallet,
  FileCheck2,
  BarChart3,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Info,
} from 'lucide-react';
import { LOGO_IMG, AVATAR_IMG } from '../data/mockData';

export type NavTab = 'overview' | 'allocation' | 'disbursement' | 'reports' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingCount?: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar = ({
  currentTab,
  onSelectTab,
  pendingCount = 5,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) => {
  const [showInfo, setShowInfo] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        setShowInfo(false);
      }
    };

    if (showInfo) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInfo]);

  const navItems: {
    id: NavTab;
    label: string;
    Icon: typeof LayoutDashboard;
    badge?: number;
  }[] = [
    { id: 'overview', label: 'แดชบอร์ดภาพรวม', Icon: LayoutDashboard },
    { id: 'allocation', label: 'จัดสรรงบประมาณ', Icon: Wallet },
    { id: 'disbursement', label: 'ติดตามการเบิกจ่าย', Icon: FileCheck2, badge: pendingCount },
    { id: 'reports', label: 'รายงานและสถิติ', Icon: BarChart3 },
    { id: 'settings', label: 'ตั้งค่าระบบ', Icon: Settings },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-[#f0eee9] z-50 flex flex-col justify-between border-r border-[#18181b]/8 transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className={`flex flex-col flex-1 ${isCollapsed ? 'overflow-visible' : 'overflow-y-auto'}`}>
        {/* Brand Header — 56px height aligned with top Header */}
        <div
          className={`h-14 flex items-center justify-between border-b border-[#18181b]/8 ${
            isCollapsed ? 'px-3' : 'px-4'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
            <img alt="CAMT" className="h-7 w-7 object-contain flex-shrink-0" src={LOGO_IMG} />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-[15px] font-medium text-[#18181b] leading-tight tracking-tight truncate">
                  CAMT Navigator
                </span>
                <span className="text-[11px] text-[#71717a] leading-tight truncate">
                  ระบบบริหารงบประมาณ
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="w-7 h-7 rounded-md flex items-center justify-center text-[#71717a] hover:text-[#18181b] hover:bg-[#18181b]/5 transition-colors duration-150 cursor-pointer flex-shrink-0"
              data-tooltip="ย่อแถบเมนู"
              aria-label="ย่อแถบเมนู"
            >
              <PanelLeftClose size={16} strokeWidth={1.5} />
            </button>
          )}
        </div>

        {isCollapsed && (
          <div className="pt-3 pb-1 flex justify-center">
            <button
              onClick={onToggleCollapse}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#71717a] hover:text-[#18181b] hover:bg-[#18181b]/5 transition-colors duration-150 cursor-pointer tooltip-side"
              data-tooltip="ขยายแถบเมนู"
              aria-label="ขยายแถบเมนู"
            >
              <PanelLeftOpen size={16} strokeWidth={1.5} />
            </button>
          </div>
        )}

        {/* Institution Context */}
        {!isCollapsed ? (
          <div className="px-3 pt-4 pb-2">
            <div className="px-3 py-2.5 rounded-lg bg-[#f7f6f2] border border-[#18181b]/8 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs font-medium text-[#18181b] truncate">
                  วิทยาลัยศิลปะ สื่อ และเทคโนโลยี
                </div>
                <div className="text-[11px] text-[#71717a] truncate mt-0.5">
                  มหาวิทยาลัยเชียงใหม่ • ปีงบ 2569
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-white border border-[#18181b]/10 font-mono text-[11px] font-medium text-[#52525b] flex-shrink-0">
                CMU
              </span>
            </div>
          </div>
        ) : (
          <div className="py-2 flex justify-center">
            <span className="px-1.5 py-0.5 rounded bg-white border border-[#18181b]/10 font-mono text-[10px] font-medium text-[#52525b]">
              CMU
            </span>
          </div>
        )}

        {/* Section Label */}
        {!isCollapsed && (
          <div className="px-5 pt-4 pb-2 text-xs text-[#71717a]">
            ระบบงานงบประมาณ
          </div>
        )}

        {/* Navigation Items — 36px height, 4px gap, aligned icon column */}
        <nav className={`flex-1 px-3 space-y-1 ${isCollapsed ? 'pt-2 overflow-visible' : ''}`}>
          {navItems.map(({ id, label, Icon, badge }) => {
            const isActive = currentTab === id;
            return (
              <button
                key={id}
                onClick={() => onSelectTab(id)}
                className={`relative group w-full h-9 flex items-center rounded-lg text-[14px] text-left cursor-pointer transition-colors duration-150 ${
                  isCollapsed ? 'justify-center px-0' : 'justify-between px-3'
                } ${
                  isActive
                    ? 'bg-white text-[#18181b] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#18181b]/8'
                    : 'text-[#52525b] font-normal hover:bg-[#18181b]/[0.04] hover:text-[#18181b]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                    <Icon
                      size={16}
                      strokeWidth={1.5}
                      className={isActive ? 'text-[#c85a17]' : 'text-[#71717a] group-hover:text-[#52525b]'}
                    />
                  </span>
                  {!isCollapsed && <span className="truncate">{label}</span>}
                </div>

                {!isCollapsed && badge !== undefined && badge > 0 && (
                  <span
                    className={`font-mono text-xs tabular-nums ${
                      isActive ? 'text-[#c85a17] font-medium' : 'text-[#71717a]'
                    }`}
                  >
                    {badge}
                  </span>
                )}

                {isCollapsed && (
                  <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-[9999] flex items-center">
                    <div className="bg-[#18181b] text-[#f4f4f5] text-xs px-2.5 py-1.5 rounded-md shadow-md whitespace-nowrap flex items-center gap-2">
                      <span>{label}</span>
                      {badge !== undefined && badge > 0 && (
                        <span className="font-mono text-[11px] text-[#a1a1aa] tabular-nums">
                          {badge}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile */}
      <div ref={infoRef} className="p-3 border-t border-[#18181b]/8 relative">
        {showInfo && (
          <div
            className={`absolute bottom-full mb-2 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-[#18181b]/10 overflow-hidden z-50 ${
              isCollapsed ? 'left-full ml-2 bottom-0 w-72' : 'left-3 right-3'
            }`}
          >
            <div className="px-4 py-3 border-b border-[#18181b]/8 flex justify-between items-center bg-[#f7f6f2]">
              <h3 className="font-medium text-[#18181b] text-xs">
                ข้อมูลระบบ
              </h3>
              <span className="font-mono text-[11px] text-[#71717a]">
                v2.6.9
              </span>
            </div>
            <div className="divide-y divide-[#18181b]/6 text-xs">
              <div className="px-4 py-3">
                <p className="text-[#18181b] font-medium">CAMT Navigator</p>
                <p className="text-[#52525b] mt-0.5 leading-relaxed">
                  ระบบบริหารงบประมาณ วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มหาวิทยาลัยเชียงใหม่
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[#18181b] font-medium">การเชื่อมโยงฐานข้อมูล</p>
                <p className="text-[#52525b] mt-0.5 leading-relaxed">
                  บูรณาการข้อมูลร่วมกับ CMU-ERP, GFMIS และเกณฑ์ EdPEx
                </p>
                <p className="text-[#15803d] mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                  <span>เชื่อมต่อปกติ</span>
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[#18181b] font-medium">งานบริหารการเงินและพัสดุ</p>
                <p className="font-mono text-[11px] text-[#71717a] mt-0.5">
                  053-942649 • finance@camt.cmu.ac.th
                </p>
              </div>
            </div>
          </div>
        )}

        <div
          onClick={() => isCollapsed && setShowInfo(!showInfo)}
          className={`flex items-center rounded-lg ${
            isCollapsed
              ? 'justify-center p-1.5 cursor-pointer hover:bg-[#18181b]/5'
              : 'justify-between px-2 py-1.5'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-[#18181b]/10"
              src={AVATAR_IMG}
            />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-medium text-[#18181b] truncate leading-tight">
                  รศ.ดร. นพดล ผู้บริหาร
                </span>
                <span className="text-xs text-[#71717a] truncate leading-tight mt-0.5">
                  คณบดี (Dean CAMT)
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="w-7 h-7 rounded-md flex items-center justify-center text-[#71717a] hover:bg-[#18181b]/5 hover:text-[#18181b] cursor-pointer transition-colors duration-150 flex-shrink-0"
              data-tooltip="ข้อมูลระบบ"
              aria-label="ข้อมูลระบบ"
            >
              <Info size={16} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
