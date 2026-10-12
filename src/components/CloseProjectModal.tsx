interface CloseProjectModalProps {
  isOpen: boolean;
  projectTitle: string;
  refundAmount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export const CloseProjectModal = ({
  isOpen,
  projectTitle,
  refundAmount,
  onClose,
  onConfirm,
}: CloseProjectModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#181c20]/60 backdrop-blur-[4px] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-[#ddc1b2]/40 animate-in fade-in zoom-in duration-150">
        <div className="h-1.5 w-full bg-[#366847]"></div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#b8f0c5] text-[#1d5031] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]">task_alt</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#181c20]">ยืนยันการปิดโครงการ</h3>
              <p className="text-xs text-[#79564b]">ปิดโครงการและโอนคืนงบประมาณคงเหลือ</p>
            </div>
          </div>

          <div className="bg-[#f1f4f9] p-3.5 rounded-xl text-xs space-y-2">
            <div className="font-bold text-[#181c20]">{projectTitle}</div>
            <div className="flex justify-between text-[#564337] border-t border-[#ddc1b2]/30 pt-1.5">
              <span>ยอดเงินคงเหลือส่งคืนคลังกลาง:</span>
              <span className="font-black text-[#366847] text-sm tabular-nums">
                ฿{refundAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <p className="text-xs text-[#564337] leading-relaxed">
            เมื่อปิดโครงการแล้ว สถานะจะเปลี่ยนเป็น <strong>“ปิดโครงการสมบูรณ์”</strong> และยอดเงินคงเหลือจะถูกโอนกลับเข้าสู่กองทุนสำรองส่วนกลางทันที
          </p>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#ebeef3]">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#ebeef3] font-bold text-xs text-[#564337] hover:bg-[#e0e3e8]"
            >
              ยกเลิก
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2 rounded-xl bg-[#366847] hover:bg-[#1d5031] text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              ยืนยันปิดโครงการ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
