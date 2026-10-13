import { useState, useEffect, useRef } from 'react';
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
  const navItems: { id: NavTab; label: string; icon: string; badge?: number }[] = [
    { id: 'overview', label: 'แดชบอร์ดภาพรวม', icon: 'dashboard' },
    { id: 'allocation', label: 'จัดสรรงบประมาณ', icon: 'account_balance_wallet' },
    { id: 'disbursement', label: 'ติดตามการเบิกจ่าย', icon: 'receipt_long', badge: pendingCount },
    { id: 'reports', label: 'รายงานและสถิติ', icon: 'monitoring' },
    { id: 'settings', label: 'ตั้งค่าระบบ', icon: 'settings' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-[#f1f4f9] z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-[#ddc1b2]/30 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'
        }`}
    >
      {/* Floating Circular Toggle Button (half inside sidebar, half outside on the border like in reference) */}
      <button
        onClick={onToggleCollapse}
        className="absolute right-0 top-10 -translate-y-1/2 translate-x-1/2 z-[60] w-7 h-7 bg-white rounded-full border border-[#ddc1b2]/60 shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex items-center justify-center text-[#564337] hover:text-[#181c20] hover:bg-slate-50 hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer group tooltip-side"
        data-tooltip={isCollapsed ? 'ขยายแถบเมนู' : 'ย่อแถบเมนู'}
        aria-label={isCollapsed ? 'ขยายแถบเมนู' : 'ย่อแถบเมนู'}
      >
        {isCollapsed ? (
          <svg
            className="w-3.5 h-3.5 text-[#564337] group-hover:text-[#181c20] transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        ) : (
          <svg
            className="w-3.5 h-3.5 text-[#564337] group-hover:text-[#181c20] transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        )}
      </button>

      <div className={`flex flex-col flex-1 ${isCollapsed ? 'overflow-visible' : 'overflow-y-auto'}`}>
        {/* Brand Header */}
        <div
          className={`h-20 flex items-center border-b border-[#ddc1b2]/20 transition-all duration-300 ${isCollapsed ? 'justify-center px-2' : 'justify-start px-5'
            }`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <img alt="CAMT" className="h-9 w-10 object-contain flex-shrink-0" src={LOGO_IMG} />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-[1.1rem] font-extrabold text-[#181c20] leading-tight tracking-tight whitespace-nowrap">
                  CAMT Navigator
                </span>
                <span className="text-[0.65rem] font-bold text-[#79564b] tracking-wider uppercase whitespace-nowrap">
                  ระบบบริหารงบประมาณ
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Institution Badge */}
        {!isCollapsed ? (
          <div className="px-4 py-3">
            <div className="bg-white rounded-xl p-3 shadow-xs border border-[#ddc1b2]/20 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="w-2.5 h-2.5 rounded-full bg-[#366847] flex-shrink-0"></span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[0.75rem] font-bold text-[#181c20] leading-snug truncate">
                    วิทยาลัยศิลปะ สื่อ และเทคโนโลยี
                  </span>
                  <span className="text-[0.6875rem] text-[#79564b] truncate">มหาวิทยาลัยเชียงใหม่</span>
                </div>
              </div>
              <span className="text-[0.6875rem] font-extrabold text-[#994700] bg-[#ffdbc8] px-1.5 py-0.5 rounded flex-shrink-0">
                CMU
              </span>
            </div>
          </div>
        ) : (
          <div className="py-3 flex justify-center">
            <span className="text-[0.6875rem] font-extrabold text-[#994700] bg-[#ffdbc8] px-2 py-1 rounded">
              CMU
            </span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className={`flex-1 px-3 py-2 space-y-1.5 ${isCollapsed ? 'overflow-visible' : ''}`}>
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`relative group w-full flex items-center rounded-xl transition-all text-[0.875rem] font-bold text-left cursor-pointer ${isCollapsed ? 'justify-center p-3' : 'justify-between px-4 py-3'
                  } ${isActive
                    ? 'bg-[#e87722] text-white shadow-sm ring-2 ring-[#e87722]/30'
                    : 'text-[#564337] hover:bg-[#ebeef3] hover:text-[#181c20]'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[22px] flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!isCollapsed && item.badge && item.badge > 0 ? (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-white text-[#994700]' : 'bg-[#e87722]/15 text-[#e87722]'
                      }`}
                  >
                    {item.badge}
                  </span>
                ) : null}

                {/* Sleek Floating Side Tooltip for Collapsed Sidebar (Appears on the RIGHT, never clipped) */}
                {isCollapsed && (
                  <div className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 ease-out z-[9999] flex items-center drop-shadow-2xl translate-x-1 group-hover:translate-x-0">
                    {/* Tooltip Arrow pointing left */}
                    <div className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[7px] border-r-[#1a0f07] mr-[-1px] shrink-0" />
                    {/* Tooltip Bubble with unclipped full text and solid background */}
                    <div className="bg-[#1a0f07] text-[#fdf5ef] text-[12px] font-bold px-3.5 py-1.5 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-[#e87722]/50 whitespace-nowrap tracking-wide flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.badge && item.badge > 0 ? (
                        <span className="bg-[#e87722] text-white text-[10px] px-1.5 py-0.5 rounded-full font-black leading-none shadow-xs">
                          {item.badge}
                        </span>
                      ) : null}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile */}
      {/* User Footer Profile */}
      <div ref={infoRef} className="p-3 bg-white/70 border-t border-[#ddc1b2]/20 relative">
        {/* Info Popup Dialog Styled like Header Notifications (Image 2) */}
        {showInfo && (
          <div
            className={`absolute bottom-full mb-3 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#ddc1b2]/30 overflow-hidden z-50 animate-in slide-in-from-bottom-2 fade-in duration-200 ${isCollapsed
              ? 'left-full ml-3 bottom-2 w-80'
              : 'left-3 right-3 sm:right-auto sm:w-80'
              }`}
          >
            <div className="px-4 py-3 border-b border-[#ebeef3] flex justify-between items-center bg-[#f7f9ff]">
              <h3 className="font-bold text-[#181c20] text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[#e87722] text-[18px]">info</span>
                ข้อมูลระบบ
              </h3>
              <span className="text-[10px] bg-[#e87722]/10 text-[#e87722] font-bold px-2 py-0.5 rounded-full">
                v2.6.9
              </span>
            </div>
            <div className="max-h-[320px] overflow-y-auto">
              <div className="px-4 py-3 border-b border-[#ebeef3] hover:bg-[#f7f9ff] transition-colors relative">
                <span className="absolute top-4 left-2 w-1.5 h-1.5 rounded-full bg-[#e87722]"></span>
                <div className="pl-3">
                  <p className="text-xs text-[#181c20] font-bold">CAMT Navigator Budget System</p>
                  <p className="text-[11px] text-[#564337] mt-1 leading-relaxed">
                    ระบบบริหารงบประมาณ วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มหาวิทยาลัยเชียงใหม่
                  </p>
                  <p className="text-[10px] text-[#79564b] mt-1.5">CAMT CMU Fiscal Executive Dashboard</p>
                </div>
              </div>

              <div className="px-4 py-3 border-b border-[#ebeef3] hover:bg-[#f7f9ff] transition-colors relative">
                <span className="absolute top-4 left-2 w-1.5 h-1.5 rounded-full bg-[#366847]"></span>
                <div className="pl-3">
                  <p className="text-xs text-[#181c20] font-bold">การเชื่อมโยงระบบฐานข้อมูล</p>
                  <p className="text-[11px] text-[#564337] mt-1 leading-relaxed">
                    บูรณาการข้อมูลร่วมกับ CMU-ERP, GFMIS, และเกณฑ์ EdPEx Real-time
                  </p>
                  <p className="text-[10px] text-[#366847] font-semibold mt-1.5">● สถานะการเชื่อมต่อ: สมบูรณ์ (Real-time)</p>
                </div>
              </div>

              <div className="px-4 py-3 hover:bg-[#f7f9ff] transition-colors relative">
                <span className="absolute top-4 left-2 w-1.5 h-1.5 rounded-full bg-[#79564b]"></span>
                <div className="pl-3">
                  <p className="text-xs text-[#181c20] font-bold">ติดต่อสอบถามและการสนับสนุน</p>
                  <p className="text-[11px] text-[#564337] mt-1 leading-relaxed">
                    งานบริหารการเงินและการพัสดุ วิทยาลัยศิลปะ สื่อ และเทคโนโลยี
                  </p>
                  <p className="text-[10px] text-[#79564b] mt-1.5">โทร. 053-942649 • finance@camt.cmu.ac.th</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          onClick={() => isCollapsed && setShowInfo(!showInfo)}
          className={`flex items-center rounded-xl bg-white shadow-xs border border-[#ddc1b2]/30 relative group ${isCollapsed ? 'justify-center p-2 cursor-pointer hover:border-[#e87722]/50 hover:bg-[#fff9f5]' : 'justify-between p-2.5'
            }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-1 ring-[#e87722]/40"
              src={AVATAR_IMG}
            />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-[0.8125rem] font-bold text-[#181c20] truncate">
                  รศ.ดร. นพดล ผู้บริหาร
                </span>
                <span className="text-[0.6875rem] text-[#79564b] font-medium truncate">
                  คณบดี (Dean CAMT)
                </span>
              </div>
            )}
          </div>
          {isCollapsed && (
            <div className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 ease-out z-[9999] flex items-center drop-shadow-2xl translate-x-1 group-hover:translate-x-0">
              <div className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[7px] border-r-[#1a0f07] mr-[-1px] shrink-0" />
              <div className="bg-[#1a0f07] text-[#fdf5ef] text-[12px] font-bold px-3 py-1.5 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-[#e87722]/50 whitespace-nowrap tracking-wide flex flex-col">
                <span>รศ.ดร. นพดล ผู้บริหาร</span>
                <span className="text-[10px] text-[#e87722] font-semibold">คณบดี (Dean CAMT)</span>
              </div>
            </div>
          )}
          {!isCollapsed && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#564337] hover:bg-[#ebeef3] hover:text-[#181c20] cursor-pointer transition-colors"
                data-tooltip="ข้อมูลระบบ"
              >
                <span className="material-symbols-outlined text-[18px]">help</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
