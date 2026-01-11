import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    // Ensure unique ID to prevent collisions and key issues
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    
    // Auto-dismiss
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Increased z-index to 200 to stay above other overlays */}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start w-80 p-4 rounded-xl shadow-lg border transform transition-all animate-in slide-in-from-right-10 duration-300 ${
              toast.type === 'success' ? 'bg-white border-emerald-200 text-emerald-800' :
              toast.type === 'error' ? 'bg-white border-red-200 text-red-800' :
              toast.type === 'warning' ? 'bg-white border-amber-200 text-amber-800' :
              'bg-white border-blue-200 text-blue-800'
            }`}
          >
            <div className={`mr-3 flex-shrink-0 mt-0.5 ${
               toast.type === 'success' ? 'text-emerald-500' :
               toast.type === 'error' ? 'text-red-500' :
               toast.type === 'warning' ? 'text-amber-500' :
               'text-blue-500'
            }`}>
              {toast.type === 'success' && <CheckCircle size={18} />}
              {toast.type === 'error' && <AlertCircle size={18} />}
              {toast.type === 'warning' && <AlertTriangle size={18} />}
              {toast.type === 'info' && <Info size={18} />}
            </div>
            <div className="flex-1 text-sm font-medium leading-tight pt-0.5">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              type="button"
              className="ml-3 -mr-1 -mt-1 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors flex-shrink-0"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
