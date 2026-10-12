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
              <span className={`font-extrabold ${remaining <= 0 ? 'text-[#ba1a1a]' : 'text-[#e87722]'}`}>
                ฿{remaining.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Alert Notification Box 1: เมื่อไม่มียอดเงินเหลือให้ปรับลด (remaining <= 0) */}
          {remaining <= 0 && (
            <div className="p-3.5 rounded-xl bg-[#ffdad6]/60 border border-[#ba1a1a]/30 flex items-start gap-3 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[22px] flex-shrink-0 mt-0.5">
                error
              </span>
              <div className="flex-1 text-xs">
                <p className="font-bold text-[#ba1a1a]">ไม่มียอดงบประมาณคงเหลือสำหรับปรับลด</p>
                <p className="text-[#564337] mt-1 leading-relaxed">
                  โครงการนี้เบิกจ่ายครบตามกรอบงบประมาณแล้ว (฿{project.spent.toLocaleString()} / ฿{project.allocated.toLocaleString()}) จึงไม่สามารถทำรายการปรับลดหรือโอนคืนงบประมาณได้
                </p>
              </div>
            </div>
          )}

          <form noValidate onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#181c20] mb-1">
                จำนวนเงินที่ต้องการปรับลด / โอนคืน (บาท):
              </label>
              <input
                type="number"
                step="any"
                disabled={remaining <= 0}
                value={reduceAmount}
                onChange={handleAmountChange}
                onFocus={(e) => e.target.select()}
                placeholder={remaining <= 0 ? 'ไม่สามารถปรับลดได้ (งบคงเหลือ ฿0)' : 'ระบุจำนวนเงิน'}
                className={`w-full px-3 py-2 rounded-xl border font-bold text-sm outline-none transition-all ${
                  remaining <= 0
                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    : numericAmount > remaining
                    ? 'border-[#ba1a1a] bg-[#fff5f5] text-[#ba1a1a] focus:ring-2 focus:ring-[#ba1a1a]/20'
                    : 'border-[#ddc1b2]/60 focus:border-[#e87722] focus:ring-2 focus:ring-[#e87722]/20 text-[#181c20]'
                }`}
              />

              {/* Alert Notification Box 2: เมื่อกรอกเกินยอดคงเหลือ (numericAmount > remaining) */}
              {remaining > 0 && numericAmount > remaining && (
                <div className="p-3 rounded-xl bg-[#ffdad6]/60 border border-[#ba1a1a]/30 flex items-start gap-2.5 text-xs text-[#ba1a1a] mt-2 animate-in fade-in duration-150">
                  <span className="material-symbols-outlined text-[18px] flex-shrink-0 mt-0.5">
                    warning
                  </span>
                  <div>
                    <p className="font-bold">ยอดเงินปรับลดเกินงบคงเหลือ</p>
                    <p className="text-[11px] text-[#564337] mt-0.5">
                      คุณระบุ ฿{numericAmount.toLocaleString()} ซึ่งเกินยอดงบคงเหลือที่ปรับลดได้สูงสุด (฿{remaining.toLocaleString()}) โปรดระบุยอดไม่เกินจำนวนดังกล่าว
                    </p>
                  </div>
                </div>
              )}

              {/* Quick Select Buttons (แสดงเฉพาะเมื่อมียอดคงเหลือ > 0) */}
              {remaining > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[10000, 20000, 50000]
                    .filter((val) => val <= remaining)
                    .map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setReduceAmount(val.toString())}
                        className="px-2.5 py-1 rounded-lg bg-[#f1f4f9] hover:bg-[#e87722]/15 text-[#564337] hover:text-[#e87722] font-semibold text-[11px] transition-colors cursor-pointer border border-[#ddc1b2]/30"
                      >
                        ฿{val.toLocaleString()}
                      </button>
                    ))}
                  <button
                    type="button"
                    onClick={() => setReduceAmount(remaining.toString())}
                    className="px-2.5 py-1 rounded-lg bg-[#e87722]/10 hover:bg-[#e87722] text-[#e87722] hover:text-white font-bold text-[11px] transition-colors cursor-pointer border border-[#e87722]/30"
                  >
                    ทั้งหมด (฿{remaining.toLocaleString()})
                  </button>
                </div>
              )}

              {remaining > 0 && (
                <span className="text-[11px] text-[#79564b] mt-1.5 block">
                  งบประมาณใหม่หลังปรับลด: ฿{Math.max(0, project.allocated - numericAmount).toLocaleString()}
                </span>
              )}
            </div>

            <div>
              <label className="block font-bold text-[#181c20] mb-1">เหตุผลและบันทึกข้อความ:</label>
              <textarea
                rows={2}
                disabled={remaining <= 0}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs outline-none resize-none ${
                  remaining <= 0
                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    : 'border-[#ddc1b2]/60 focus:border-[#e87722] focus:ring-2 focus:ring-[#e87722]/20 text-[#181c20]'
                }`}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#ebeef3]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#ebeef3] font-bold text-[#564337] hover:bg-[#e0e3e8] cursor-pointer"
              >
                {remaining <= 0 ? 'ปิดหน้าต่าง' : 'ยกเลิก'}
              </button>
              <button
                type="submit"
                disabled={remaining <= 0 || numericAmount <= 0 || numericAmount > remaining}
                className={`px-5 py-2 rounded-xl font-bold shadow-xs flex items-center gap-1.5 transition-all ${
                  remaining <= 0 || numericAmount <= 0 || numericAmount > remaining
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#e87722] hover:bg-[#994700] text-white cursor-pointer'
                }`}
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
