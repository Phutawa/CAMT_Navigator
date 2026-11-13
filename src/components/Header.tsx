import { useState, useEffect, useRef } from 'react';
import { Search, X, RefreshCw, Bell } from 'lucide-react';
import { ProjectItem } from '../data/mockData';

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
  onNavigate,
  projects = [],
  onSelectProject,
}: HeaderProps) => {
  const [showNotif, setShowNotif] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotif(false);
      }
    };

    if (showNotif) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotif]);

  const handleNotificationClick = (tab: 'overview' | 'allocation' | 'disbursement' | 'reports' | 'settings') => {
    if (onNavigate) onNavigate(tab);
    setShowNotif(false);
  };

  const suggestions = projects
    .filter(
      (p) =>
        localSearch.trim() !== '' &&
        (p.title.toLowerCase().includes(localSearch.toLowerCase()) ||
          p.code.toLowerCase().includes(localSearch.toLowerCase()) ||
          p.category.toLowerCase().includes(localSearch.toLowerCase()))
    )
    .slice(0, 5);

  const handleSearchSubmit = (query: string = localSearch) => {
    setLocalSearch(query);
    onSearchChange(query);
    setShowSuggestions(false);
  };

  return (
    <header
      className={`fixed top-0 right-0 h-14 bg-[#f7f6f2]/95 backdrop-blur-sm z-40 border-b border-[#18181b]/8 transition-[left] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isCollapsed ? 'left-16' : 'left-64'
      }`}
    >
      <div className="h-14 w-full max-w-[1520px] mx-auto px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative flex items-center">
            <Search
              size={16}
              strokeWidth={1.5}
              className="absolute left-3 text-[#71717a] pointer-events-none"
            />
            <input
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                onSearchChange(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchSubmit();
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full h-9 pl-9 pr-8 rounded-lg bg-white text-[#18181b] placeholder:text-[#71717a] text-sm outline-none border border-[#18181b]/10 focus:border-[#c85a17] transition-colors duration-150"
              placeholder="ค้นหาโครงการหรือรหัส..."
              type="text"
            />
            {localSearch && (
              <button
                onClick={() => {
                  setLocalSearch('');
                  onSearchChange('');
                }}
                className="absolute right-2.5 p-0.5 flex items-center text-[#71717a] hover:text-[#18181b] cursor-pointer"
                aria-label="ล้างคำค้นหา"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && localSearch && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-[#18181b]/10 overflow-hidden divide-y divide-[#18181b]/6">
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
                    className="px-3.5 py-2.5 hover:bg-[#f7f6f2] cursor-pointer flex items-center justify-between gap-3"
                  >
                    <span className="text-sm font-medium text-[#18181b] truncate">{p.title}</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#f0eee9] border border-[#18181b]/10 font-mono text-[11px] text-[#52525b] flex-shrink-0">
                      {p.code}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Info & Actions */}
        <div className="flex items-center gap-3">
          {/* Fiscal Year Meta */}
          <div className="hidden md:flex items-center gap-2 text-xs text-[#52525b]">
            <span>ปีงบประมาณ 2569</span>
            <span className="text-[#18181b]/20">•</span>
            <span className="text-[#71717a] tabular-nums">1 ต.ค. 68 – 30 ก.ย. 69</span>
          </div>

          <div className="hidden md:block h-4 w-px bg-[#18181b]/10" />

          {/* ERP Sync Status & Refresh (Signature live status dot) */}
          <button
            onClick={onRefreshSync}
            className="h-8 px-3 rounded-lg bg-white border border-[#18181b]/10 text-xs text-[#52525b] hover:bg-[#f0eee9] hover:text-[#18181b] transition-colors duration-150 cursor-pointer flex items-center gap-2"
            data-tooltip="คลิกเพื่อดึงข้อมูลล่าสุดจาก CMU ERP"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] flex-shrink-0" />
            <span className="hidden sm:inline">CMU ERP</span>
            <span className="text-[#71717a] tabular-nums">{syncTime}</span>
            <RefreshCw size={13} strokeWidth={1.5} className="text-[#71717a]" />
          </button>

          {/* Notification Button */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#52525b] hover:text-[#18181b] hover:bg-[#f0eee9] border border-[#18181b]/10 transition-colors duration-150 cursor-pointer"
              data-tooltip="การแจ้งเตือน"
              aria-label="การแจ้งเตือน"
            >
              <Bell size={16} strokeWidth={1.5} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#c85a17]" />
            </button>

            {/* Dropdown */}
            {showNotif && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-[#18181b]/10 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-[#18181b]/8 flex justify-between items-center bg-[#f7f6f2]">
                  <h3 className="font-medium text-[#18181b] text-xs">การแจ้งเตือน</h3>
                  <span className="font-mono text-[11px] text-[#71717a]">2 รายการใหม่</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto divide-y divide-[#18181b]/6">
                  <div
                    onClick={() => handleNotificationClick('reports')}
                    className="px-4 py-3 hover:bg-[#f7f6f2] cursor-pointer transition-colors duration-150"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-[#18181b] font-medium">3 โครงการเบิกจ่ายล่าช้าในไตรมาส 3</p>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c85a17] flex-shrink-0" />
                    </div>
                    <p className="text-xs text-[#52525b] mt-1">ล่าช้าเกินกำหนดเฉลี่ย 15 วันในหมวดครุภัณฑ์</p>
                    <p className="text-[11px] text-[#71717a] mt-1 font-mono">10 นาทีที่แล้ว</p>
                  </div>
                  <div
                    onClick={() => handleNotificationClick('disbursement')}
                    className="px-4 py-3 hover:bg-[#f7f6f2] cursor-pointer transition-colors duration-150"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-[#18181b] font-medium">PO #041 รอการตรวจรับ</p>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c85a17] flex-shrink-0" />
                    </div>
                    <p className="text-xs text-[#52525b] mt-1">โครงการสัมมนาหลักสูตรประจำปีส่งเอกสารครบแล้ว</p>
                    <p className="text-[11px] text-[#71717a] mt-1 font-mono">1 ชั่วโมงที่แล้ว</p>
                  </div>
                  <div
                    onClick={() => handleNotificationClick('overview')}
                    className="px-4 py-3 hover:bg-[#f7f6f2] cursor-pointer transition-colors duration-150"
                  >
                    <p className="text-xs text-[#52525b] font-medium">ซิงก์ข้อมูลรอบบัญชีสำเร็จ</p>
                    <p className="text-xs text-[#71717a] mt-1">อัปเดตข้อมูลโครงการและงบกลางจากระบบ CMU ERP</p>
                    <p className="text-[11px] text-[#71717a] mt-1 font-mono">เมื่อวาน 14:30 น.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
