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
        const iconName =
          toast.type === 'success'
            ? 'check_circle'
            : toast.type === 'warning'
            ? 'warning'
            : toast.type === 'error'
            ? 'error'
            : 'info';

        const bgClass =
          toast.type === 'success'
            ? 'bg-[#366847] text-white'
            : toast.type === 'warning'
            ? 'bg-[#e87722] text-white'
            : toast.type === 'error'
            ? 'bg-[#ba1a1a] text-white'
            : 'bg-[#181c20] text-white';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-xl flex items-start gap-3 border border-white/20 animate-in slide-in-from-bottom-2 duration-200 ${bgClass}`}
          >
            <span className="material-symbols-outlined text-[20px] flex-shrink-0 mt-0.5">
              {iconName}
            </span>
            <div className="flex-1 text-xs">
              <strong className="block font-bold text-sm leading-tight">{toast.title}</strong>
              <span className="opacity-90 leading-relaxed block mt-0.5">{toast.description}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="opacity-75 hover:opacity-100 flex-shrink-0 text-white"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
