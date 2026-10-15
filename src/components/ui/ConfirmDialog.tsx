import React from "react";
import { AlertTriangle, Trash2, X, Check } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3.5 mb-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              isDestructive
                ? "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                : "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
            }`}
          >
            {isDestructive ? <Trash2 size={20} /> : <AlertTriangle size={20} />}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
              {title}
            </h3>
            <p className="text-xs text-gray-400">Confirmation required</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`py-3 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-md cursor-pointer ${
              isDestructive
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/25"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
