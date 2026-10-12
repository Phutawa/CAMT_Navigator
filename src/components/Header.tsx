import { useState, useEffect } from 'react';
import { AVATAR_IMG, ProjectItem } from '../data/mockData';
interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  syncTime?: string;
  onRefreshSync?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate?: (tab: 'overview' | 'allocation' | 'disbursement' | 'reports' | 'settings') => void;
  projects?: ProjectItem[];
  onSelectProject?: (project: ProjectItem) => void;
}

export const Header = ({
  searchQuery,
  onSearchChange,
  syncTime = '5 นาทีที่แล้ว',
  onRefreshSync,
  isCollapsed,
  onToggleCollapse,
  onNavigate,
  projects = [],
  onSelectProject,
}: HeaderProps) => {
  const [showNotif, setShowNotif] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleNotificationClick = (tab: 'overview' | 'allocation' | 'disbursement' | 'reports' | 'settings') => {
    if (onNavigate) onNavigate(tab);
    setShowNotif(false);
  };

  const suggestions = projects.filter((p) => 
    localSearch.trim() !== '' && 
    (p.title.toLowerCase().includes(localSearch.toLowerCase()) || 
     p.code.toLowerCase().includes(localSearch.toLowerCase()) ||
     p.category.toLowerCase().includes(localSearch.toLowerCase()))
  ).slice(0, 5);

  const handleSearchSubmit = (query: string = localSearch) => {
    setLocalSearch(query);
    onSearchChange(query);
    setShowSuggestions(false);
  };
  
  return (
    <header
      className={`fixed top-0 right-0 h-20 bg-[#f7f9ff]/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.03)] z-40 border-b border-[#ddc1b2]/30 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'left-20' : 'left-72'
      }`}
    >
      <div className="h-20 w-full px-6 sm:px-8 flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl flex items-center gap-3">

          <div className="relative flex items-center flex-1 z-40">
            <span className="material-symbols-outlined absolute left-3.5 text-[#79564b] text-[20px]">
              search
            </span>
            <input
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchSubmit();
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full pl-11 pr-[100px] py-2 rounded-xl bg-white text-[#181c20] placeholder:text-[#8a7265] text-[0.875rem] outline-none shadow-xs border border-[#ddc1b2]/50 focus:border-[#e87722] focus:ring-2 focus:ring-[#e87722]/20 transition-all"
              placeholder="ค้นหาโครงการ, หมวดงบประมาณ, รหัสกิจกรรม..."
              type="text"
            />
            <div className="absolute right-2 flex items-center gap-1">
              {localSearch && (
                <button
                  onClick={() => {
                    setLocalSearch('');
                    onSearchChange('');
                  }}
                  className="p-1 flex items-center text-[#79564b] hover:text-[#181c20] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
              <button
                onClick={() => handleSearchSubmit()}
                className="bg-[#e87722] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#994700] shadow-sm transition-colors cursor-pointer"
              >
                ค้นหา
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && localSearch && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-[#ddc1b2]/40 overflow-hidden">
                {suggestions.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      if (onSelectProject) {
                        onSelectProject(p);
                      } else {
                        handleSearchSubmit(p.title);
                      }
                      setShowSuggestions(false);
                      setLocalSearch('');
                      onSearchChange('');
                    }}
                    className="px-4 py-3 border-b border-[#ebeef3] hover:bg-[#f7f9ff] cursor-pointer flex flex-col"
                  >
                    <span className="text-sm font-bold text-[#181c20] truncate">{p.title}</span>
                    <span className="text-[11px] text-[#79564b] mt-0.5">
                      รหัส: {p.code} • กลุ่ม: {p.category}
                    </span>
                  </div>
                ))}
              </div>
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
          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#564337] hover:text-[#181c20] hover:bg-[#ebeef3] shadow-xs border border-[#ddc1b2]/40 transition-colors cursor-pointer"
              title="การแจ้งเตือน"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#e87722] ring-2 ring-white"></span>
            </button>
            
            {/* Dropdown */}
            {showNotif && (
              <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#ddc1b2]/30 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="px-4 py-3 border-b border-[#ebeef3] flex justify-between items-center bg-[#f7f9ff]">
                  <h3 className="font-bold text-[#181c20] text-sm">การแจ้งเตือน</h3>
                  <span className="text-[10px] bg-[#e87722]/10 text-[#e87722] font-bold px-2 py-0.5 rounded-full">2 ใหม่</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  <div 
                    onClick={() => handleNotificationClick('reports')}
                    className="px-4 py-3 border-b border-[#ebeef3] hover:bg-[#f7f9ff] cursor-pointer transition-colors relative"
                  >
                    <span className="absolute top-4 left-2 w-1.5 h-1.5 rounded-full bg-[#e87722]"></span>
                    <div className="pl-3">
                      <p className="text-xs text-[#181c20] font-bold">มี 3 รายการเสี่ยงเบิกจ่ายช้าใน Q3</p>
                      <p className="text-[11px] text-[#564337] mt-1">ระบบ AI ตรวจพบช่องว่างการเบิกจ่ายล่าช้าเกิน 15 วัน โปรดตรวจสอบ</p>
                      <p className="text-[10px] text-[#79564b] mt-1.5">10 นาทีที่แล้ว</p>
                    </div>
                  </div>
                  <div 
                    onClick={() => handleNotificationClick('disbursement')}
                    className="px-4 py-3 border-b border-[#ebeef3] hover:bg-[#f7f9ff] cursor-pointer transition-colors relative"
                  >
                    <span className="absolute top-4 left-2 w-1.5 h-1.5 rounded-full bg-[#e87722]"></span>
                    <div className="pl-3">
                      <p className="text-xs text-[#181c20] font-bold">PO #041 รอการตรวจรับ</p>
                      <p className="text-[11px] text-[#564337] mt-1">โครงการสัมมนาหลักสูตร ประจำปี มีเอกสารส่งถึงมือแล้ว</p>
                      <p className="text-[10px] text-[#79564b] mt-1.5">1 ชั่วโมงที่แล้ว</p>
                    </div>
                  </div>
                  <div 
                    onClick={() => handleNotificationClick('overview')}
                    className="px-4 py-3 hover:bg-[#f7f9ff] cursor-pointer transition-colors opacity-60"
                  >
                    <div className="pl-3">
                      <p className="text-xs text-[#181c20] font-bold">อัปเดตระบบ AI สำเร็จ</p>
                      <p className="text-[11px] text-[#564337] mt-1">โมเดลคาดการณ์งบประมาณได้รับการอัปเดตเป็นเวอร์ชันล่าสุด</p>
                      <p className="text-[10px] text-[#79564b] mt-1.5">เมื่อวาน 14:30 น.</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-[#ebeef3] bg-white text-center">
                  <button onClick={() => setShowNotif(false)} className="text-[#e87722] text-xs font-bold hover:underline cursor-pointer">
                    ปิดหน้าต่างนี้
                  </button>
                </div>
              </div>
            )}
          </div>
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
