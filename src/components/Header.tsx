import { AVATAR_IMG } from '../data/mockData';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  syncTime?: string;
  onRefreshSync?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Header = ({
  searchQuery,
  onSearchChange,
  syncTime = '5 นาทีที่แล้ว',
  onRefreshSync,
  isCollapsed,
  onToggleCollapse,
}: HeaderProps) => {
  return (
    <header
      className={`fixed top-0 right-0 h-20 bg-[#f7f9ff]/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.03)] z-30 border-b border-[#ddc1b2]/30 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'left-20' : 'left-72'
      }`}
    >
      <div className="h-20 w-full px-6 sm:px-8 flex items-center justify-between gap-4">
        {/* Toggle + Search Bar */}
        <div className="flex-1 max-w-xl flex items-center gap-3">
          {/* Quick toggle on top bar */}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-xl bg-white border border-[#ddc1b2]/40 text-[#564337] hover:text-[#181c20] hover:bg-[#ebeef3] shadow-xs cursor-pointer transition-colors"
            title={isCollapsed ? 'ขยายเมนูด้านข้าง' : 'ย่อเมนูเพื่อใช้งานแบบเต็มจอ (Full Screen Mode)'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isCollapsed ? 'fullscreen_exit' : 'fullscreen'}
            </span>
          </button>

          <div className="relative flex items-center flex-1">
            <span className="material-symbols-outlined absolute left-3.5 text-[#79564b] text-[20px]">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-2 rounded-xl bg-white text-[#181c20] placeholder:text-[#8a7265] text-[0.875rem] outline-none shadow-xs border border-[#ddc1b2]/50 focus:border-[#e87722] focus:ring-2 focus:ring-[#e87722]/20 transition-all"
              placeholder="ค้นหาโครงการ, หมวดงบประมาณ, รหัสกิจกรรม..."
              type="text"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-xs text-[#79564b] hover:text-[#181c20] cursor-pointer"
              >
                ล้าง
              </button>
            )}
          </div>
        </div>

        {/* Right Info & Actions */}
        <div className="flex items-center gap-3">
          {/* Fiscal Year Date Range */}
          <div className="hidden sm:flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-[#ddc1b2]/50 shadow-xs">
            <span className="material-symbols-outlined text-[#e87722] text-[20px]">date_range</span>
            <div className="flex flex-col text-left">
              <span className="text-[11px] text-[#79564b] leading-tight font-bold">
                ปีงบประมาณ 2569 (CAMT)
              </span>
              <span className="text-[0.75rem] text-[#181c20] font-bold">
                01 ต.ค. 2568 - 30 ก.ย. 2569
              </span>
            </div>
            <span className="material-symbols-outlined text-[#8a7265] text-[18px]">calendar_month</span>
          </div>

          {/* Auto Sync Pill */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#366847]/10 border border-[#366847]/30">
            <span className="w-2.5 h-2.5 rounded-full bg-[#366847] animate-pulse"></span>
            <span className="text-[0.6875rem] text-[#366847] font-extrabold uppercase">
              ดึงข้อมูล CMU ERP สด
            </span>
          </div>

          {/* Refresh sync */}
          <button
            onClick={onRefreshSync}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#ddc1b2]/50 shadow-xs text-[0.75rem] text-[#564337] hover:bg-[#ebeef3] transition-colors cursor-pointer"
            title="กดเพื่ออัปเดตข้อมูลล่าสุด"
          >
            <span className="material-symbols-outlined text-[16px] text-[#e87722]">sync</span>
            <span>
              ซิงก์: <strong className="text-[#181c20]">{syncTime}</strong>
            </span>
          </button>

          {/* Notification Button */}
          <button
            onClick={() => alert('การแจ้งเตือนงบประมาณ:\n- มี 3 รายการเสี่ยงเบิกจ่ายช้าใน Q3\n- PO #041 รอการตรวจรับ')}
            className="relative w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#564337] hover:text-[#181c20] hover:bg-[#ebeef3] shadow-xs border border-[#ddc1b2]/40 transition-colors cursor-pointer"
            title="การแจ้งเตือน"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#e87722] ring-2 ring-white"></span>
          </button>

          {/* Profile Thumbnail */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#ddc1b2]/40">
            <img
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#e87722]/30"
              src={AVATAR_IMG}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
