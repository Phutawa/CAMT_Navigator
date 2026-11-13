import { X } from 'lucide-react';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer = ({ toasts, onDismiss }: ToastContainerProps) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const dotColor =
          toast.type === 'success'
            ? 'bg-[#16a34a]'
            : toast.type === 'warning'
              ? 'bg-[#c85a17]'
              : toast.type === 'error'
                ? 'bg-[#dc2626]'
                : 'bg-[#a1a1aa]';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto p-3.5 rounded-xl bg-[#18181b] text-[#f4f4f5] shadow-[0_8px_24px_rgba(0,0,0,0.12)] flex items-start gap-3 border border-white/10"
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${dotColor}`} />
            <div className="flex-1 text-xs">
              <span className="block font-medium text-[#f4f4f5] leading-tight">
                {toast.title}
              </span>
              <span className="text-[#a1a1aa] leading-relaxed block mt-0.5">
                {toast.description}
              </span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-[#a1a1aa] hover:text-white flex-shrink-0 p-0.5 cursor-pointer"
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
