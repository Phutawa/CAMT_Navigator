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
  const navItems: { id: NavTab; label: string; icon: string; badge?: number }[] = [
    { id: 'overview', label: 'แดชบอร์ดภาพรวม', icon: 'dashboard' },
    { id: 'allocation', label: 'จัดสรรงบประมาณ', icon: 'account_balance_wallet' },
    { id: 'disbursement', label: 'ติดตามการเบิกจ่าย', icon: 'receipt_long', badge: pendingCount },
    { id: 'reports', label: 'รายงานและสถิติ', icon: 'monitoring' },
    { id: 'settings', label: 'ตั้งค่าระบบ', icon: 'settings' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-[#f1f4f9] z-40 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-[#ddc1b2]/30 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div
          className={`h-20 flex items-center border-b border-[#ddc1b2]/20 transition-all duration-300 ${
            isCollapsed ? 'justify-center px-2' : 'justify-between px-5'
          }`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <img alt="CAMT Logo" className="h-9 w-auto object-contain flex-shrink-0" src={LOGO_IMG} />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-[1.15rem] font-extrabold text-[#181c20] leading-tight tracking-tight truncate">
                  CAMT Navigator
                </span>
                <span className="text-[0.6875rem] font-bold text-[#79564b] tracking-wider uppercase truncate">
                  ระบบบริหารงบประมาณ
                </span>
              </div>
            )}
          </div>

          {/* Collapse/Expand Toggle Button */}
          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#564337] hover:bg-[#ebeef3] hover:text-[#181c20] transition-colors cursor-pointer flex-shrink-0"
            title={isCollapsed ? 'ขยายเมนู (เต็มจอ -> ปกติ)' : 'ย่อเมนู (เข้าสู่โหมดเต็มจอ)'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isCollapsed ? 'menu_open' : 'menu'}
            </span>
          </button>
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
        <nav className="flex-1 px-3 py-2 space-y-1.5">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center rounded-xl transition-all text-[0.875rem] font-bold text-left cursor-pointer ${
                  isCollapsed ? 'justify-center p-3' : 'justify-between px-4 py-3'
                } ${
                  isActive
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
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white text-[#994700]' : 'bg-[#e87722]/15 text-[#e87722]'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 bg-white/70 border-t border-[#ddc1b2]/20">
        <div
          className={`flex items-center rounded-xl bg-white shadow-xs border border-[#ddc1b2]/30 ${
            isCollapsed ? 'justify-center p-2' : 'justify-between p-2.5'
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
          {!isCollapsed && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => alert('CAMT Navigator Budget System v2.6.9\nระบบบริหารงบประมาณ วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มช.')}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#564337] hover:bg-[#ebeef3] hover:text-[#181c20]"
                title="ช่วยเหลือ"
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
