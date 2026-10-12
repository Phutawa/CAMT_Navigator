import { useState } from 'react';
import { DepartmentSummary } from '../data/mockData';

interface PlanEditModalProps {
  isOpen: boolean;
  departments: DepartmentSummary[];
  onClose: () => void;
  onSave: (updated: DepartmentSummary[]) => void;
}

export const PlanEditModal = ({
  isOpen,
  departments,
  onClose,
  onSave,
}: PlanEditModalProps) => {
  const [data, setData] = useState<DepartmentSummary[]>(departments);
  const [note, setNote] = useState('ปรับเกลี่ยสัดส่วนตามผลการเบิกจ่ายจริง Q3');

  if (!isOpen) return null;

  const handleAmountChange = (code: string, rawVal: string) => {
    const cleanValue = rawVal.replace(/\D/g, '');
    const normalized = cleanValue.replace(/^0+(?=\d)/, '');
    const num = normalized === '' ? 0 : Number(normalized);
    setData((prev) =>
      prev.map((d) => (d.code === code ? { ...d, amount: num } : d))
    );
  };

  const totalAlloc = data.reduce((sum, d) => sum + d.amount, 0);

  const handleSave = () => {
    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#181c20]/60 backdrop-blur-[4px] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-[#ddc1b2]/40 animate-in fade-in zoom-in duration-150 flex flex-col max-h-[90vh]">
        <div className="h-1.5 w-full bg-[#e87722]"></div>
        <div className="p-6 border-b border-[#ebeef3] flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-[#181c20]">แก้ไขและปรับเกลี่ยแผนงบประมาณ</h3>
            <p className="text-xs text-[#79564b]">ปรับวงเงินจัดสรรรายส่วนงาน ประจำปี 2569</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#ebeef3] flex items-center justify-center text-[#79564b]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="flex justify-between items-center p-3 bg-[#f1f4f9] rounded-xl font-bold">
            <span className="text-[#564337]">ยอดจัดสรรรวม 6 ส่วนงาน:</span>
            <span className="text-base text-[#181c20] tabular-nums">
              ฿{totalAlloc.toLocaleString()} / ฿12,000,000
            </span>
          </div>

          <div className="space-y-3">
            {data.map((dept) => (
              <div
                key={dept.code}
                className="p-3 bg-white border border-[#ddc1b2]/40 rounded-xl flex items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="font-bold text-[#181c20]">{dept.name} ({dept.code})</div>
                  <div className="text-[11px] text-[#79564b]">{dept.head}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#564337]">฿</span>
                  <input
                    type="number"
                    step={50000}
                    value={dept.amount === 0 ? '' : dept.amount}
                    placeholder="0"
                    onChange={(e) => handleAmountChange(dept.code, e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="w-36 px-2.5 py-1.5 rounded-lg border border-[#ddc1b2]/60 font-bold text-xs text-right outline-none focus:border-[#e87722]"
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block font-bold text-[#181c20] mb-1">บันทึกเหตุผลการแก้ไขแผน:</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#ddc1b2]/60 text-xs outline-none focus:border-[#e87722]"
            />
          </div>
        </div>

        <div className="p-4 bg-[#f1f4f9] border-t border-[#ebeef3] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-[#ddc1b2]/40 font-bold text-xs text-[#564337] hover:bg-[#ebeef3]"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#e87722] hover:bg-[#994700] text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            บันทึกการแก้ไขแผน
          </button>
        </div>
      </div>
    </div>
  );
};
