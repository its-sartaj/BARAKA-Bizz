import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#191918] text-[#FAF8F5] p-3.5 rounded-lg shadow-xl border border-white/10 flex items-start gap-3 animate-in slide-in-from-bottom-3 duration-300"
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#B85D36]" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-amber-300" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
          </div>

          <div className="flex-1 space-y-0.5 text-xs">
            <h5 className="font-semibold text-white tracking-wide">{toast.title}</h5>
            <p className="text-[#C2BCB2] leading-tight">{toast.message}</p>
          </div>

          <button
            onClick={() => dismissToast(toast.id)}
            className="text-white/40 hover:text-white shrink-0 p-0.5"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
