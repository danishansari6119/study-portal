// components/ui/toaster.tsx - Simple toast notification
"use client";
import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";
interface Toast { id: string; message: string; type: ToastType; }
interface ToastContextType { toast: (message: string, type?: ToastType) => void; }

const ToastContext = createContext<ToastContextType>({ toast: () => {} });
export const useToast = () => useContext(ToastContext);

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  const icons = { success: CheckCircle, error: AlertCircle, info: Info };
  const colors = {
    success: "border-green-500/30 bg-green-50 dark:bg-green-950/50 text-green-800 dark:text-green-200",
    error: "border-red-500/30 bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-200",
    info: "border-blue-500/30 bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-200",
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div key={t.id} className={cn("flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-slide-up", colors[t.type])}>
              <Icon size={16} className="mt-0.5 shrink-0" />
              <p className="text-sm flex-1">{t.message}</p>
              <button onClick={() => removeToast(t.id)} className="opacity-60 hover:opacity-100 transition-opacity">
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
