import { useState, useEffect } from 'react';
import { ProjectItem } from '../data/mockData';

interface BudgetReductionModalProps {
  isOpen: boolean;
  project: ProjectItem | null;
  onClose: () => void;
  onConfirm: (projectId: string, reduceAmount: number, reason: string) => void;
}

export const BudgetReductionModal = ({
  isOpen,
  project,
  onClose,
  onConfirm,
}: BudgetReductionModalProps) => {
  const [reduceAmount, setReduceAmount] = useState<string>('50000');
  const [reason, setReason] = useState('โอนคืนเข้ากองทุนสำรองส่วนกลางเพื่อเตรียมงวด Q4');

  useEffect(() => {
    if (isOpen && project) {
      const remaining = project.allocated - project.spent;
      const defaultAmount = remaining > 0 ? Math.min(50000, remaining) : 0;
      setReduceAmount(defaultAmount > 0 ? defaultAmount.toString() : '');
      setReason('โอนคืนเข้ากองทุนสำรองส่วนกลางเพื่อเตรียมงวด Q4');
    }
  }, [isOpen, project]);

  if (!isOpen || !project) return null;

  const remaining = project.allocated - project.spent;
  const numericAmount = reduceAmount === '' ? 0 : Number(reduceAmount);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === '') {
      setReduceAmount('');
      return;
    }
    // Remove non-digit characters
    const cleanValue = rawValue.replace(/\D/g, '');
    // Remove leading zeros: "06266" -> "6266", "0" -> "0"
    const normalized = cleanValue.replace(/^0+(?=\d)/, '');
    setReduceAmount(normalized);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reduceAmount || isNaN(numericAmount) || numericAmount <= 0 || numericAmount > remaining) {
      alert(`กรุณาระบุจำนวนเงินที่ถูกต้อง (ไม่เกินยอดคงเหลือ ฿${remaining.toLocaleString()})`);
      return;
    }
    onConfirm(project.id, numericAmount, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#181c20]/60 backdrop-blur-[4px] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#ddc1b2]/40 animate-in fade-in zoom-in duration-150">
        <div className="h-1.5 w-full bg-[#e87722]"></div>
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#e87722] uppercase tracking-wider">
                ปรับเกลี่ยและปรับลดงบประมาณ
              </span>
              <h3 className="text-lg font-bold text-[#181c20] mt-0.5">{project.title}</h3>
              <p className="text-xs text-[#79564b]">{project.dept} • {project.code}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-[#ebeef3] flex items-center justify-center text-[#79564b]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="bg-[#f1f4f9] p-3 rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#564337]">งบจัดสรรเดิม:</span>
              <span className="font-bold text-[#181c20]">฿{project.allocated.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#564337]">เบิกจ่ายจริงไปแล้ว:</span>
              <span className="font-bold text-[#366847]">฿{project.spent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-[#ddc1b2]/30 pt-1">
              <span className="text-[#79564b] font-bold">คงเหลือปรับลดได้สูงสุด:</span>
              <span className="font-extrabold text-[#e87722]">฿{remaining.toLocaleString()}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#181c20] mb-1">
                จำนวนเงินที่ต้องการปรับลด / โอนคืน (บาท):
              </label>
              <input
                type="number"
                min={1}
                max={remaining}
                step={1000}
                value={reduceAmount}
                onChange={handleAmountChange}
                onFocus={(e) => e.target.select()}
                placeholder="ระบุจำนวนเงิน"
                className="w-full px-3 py-2 rounded-xl border border-[#ddc1b2]/60 focus:border-[#e87722] focus:ring-2 focus:ring-[#e87722]/20 font-bold text-sm text-[#181c20] outline-none"
                required
              />
              <span className="text-[11px] text-[#79564b] mt-1 block">
                งบประมาณใหม่หลังปรับลด: ฿{(project.allocated - numericAmount).toLocaleString()}
              </span>
            </div>

            <div>
              <label className="block font-bold text-[#181c20] mb-1">เหตุผลและบันทึกข้อความ:</label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#ddc1b2]/60 focus:border-[#e87722] focus:ring-2 focus:ring-[#e87722]/20 text-xs text-[#181c20] outline-none resize-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#ebeef3]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#ebeef3] font-bold text-[#564337] hover:bg-[#e0e3e8]"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#e87722] hover:bg-[#994700] text-white font-bold shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">check</span>
                ยืนยันการปรับลดงบ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
