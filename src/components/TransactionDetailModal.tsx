import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  Trash2,
  Calendar,
  Tag,
  CreditCard,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
} from "lucide-react";
import type { Transaction } from "../data";
import { useApp } from "../context/AppContext";
import { CategoryIcon } from "./IconMap";
import { formatCurrency } from "../utils";
import { ConfirmDialog } from "./ui/ConfirmDialog";

interface Props {
  transaction: Transaction | null;
  onClose: () => void;
}

export default function TransactionDetailModal({ transaction, onClose }: Props) {
  const { getCategoryById, currency, deleteTransaction, user } = useApp();
  const [copiedId, setCopiedId] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!transaction) return null;

  const cat = getCategoryById(transaction.category);
  const isIncome = transaction.type === "income";

  // Create a clean UPI/PhonePe style transaction reference
  const txnRef = `UPI/${transaction.id.toUpperCase()}/${transaction.date.replace(/-/g, "")}`;

  const formattedDate = new Date(transaction.date + "T12:00:00").toLocaleDateString(
    "en-IN",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  const handleCopyId = () => {
    navigator.clipboard.writeText(transaction.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleShareReceipt = () => {
    const summary = `🧾 Trackr Transaction Receipt\n━━━━━━━━━━━━━━━━━━━━\n📌 Status: Successful\n💰 Amount: ${isIncome ? "+" : "-"}${formatCurrency(
      transaction.amount,
      currency
    )}\n🏷️ Type: ${isIncome ? "Payment Received" : "Payment Sent"}\n📁 Category: ${
      cat?.name || "General"
    }\n📝 Note: ${transaction.note || "N/A"}\n📅 Date: ${formattedDate}\n🆔 Ref ID: ${transaction.id}\n👤 User: ${
      user?.name || "User"
    }\n━━━━━━━━━━━━━━━━━━━━\nGenerated via Trackr App`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setSharedToast(true);
      setTimeout(() => setSharedToast(false), 2500);
    }
  };

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div
          className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Banner & Close */}
          <div className="relative pt-6 pb-5 px-6 text-center border-b border-gray-100 dark:border-gray-800 bg-gradient-to-b from-gray-50/80 dark:from-gray-800/40 to-transparent">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Success Icon */}
            <div className="mx-auto mb-3 relative flex items-center justify-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                  isIncome
                    ? "bg-emerald-500 text-white shadow-emerald-500/20"
                    : "bg-emerald-600 text-white shadow-emerald-600/20"
                }`}
              >
                <CheckCircle2 size={34} strokeWidth={2.5} />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-2">
              <Sparkles size={12} />
              <span>{isIncome ? "Payment Received" : "Payment Successful"}</span>
            </div>

            {/* Big Amount */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {isIncome ? "+" : "-"}
              {formatCurrency(transaction.amount, currency)}
            </h2>

            {/* Title / Note */}
            <p className="mt-1 text-sm font-semibold text-gray-600 dark:text-gray-300 truncate max-w-xs mx-auto">
              {transaction.note || cat?.name || "Transaction"}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formattedDate}</p>
          </div>

          {/* Details Card Section */}
          <div className="p-5 sm:p-6 space-y-4 max-h-[58vh] overflow-y-auto">
            {/* Category / Entity Card */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                style={{
                  backgroundColor: isIncome ? "#10B98120" : (cat?.color || "#9CA3AF") + "20",
                  color: isIncome ? "#10B981" : cat?.color,
                }}
              >
                {cat && <CategoryIcon iconName={cat.icon} size={22} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Category
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {cat?.name || "Uncategorized"}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                    isIncome
                      ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                      : "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400"
                  }`}
                >
                  {isIncome ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                  {isIncome ? "Credit" : "Debit"}
                </span>
              </div>
            </div>

            {/* Detailed Key-Value Rows (PhonePe Style) */}
            <div className="rounded-2xl bg-gray-50/60 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800/80 divide-y divide-gray-100 dark:divide-gray-800/60 text-xs">
              {/* Account / Mode */}
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <CreditCard size={15} />
                  <span>{isIncome ? "Credited To" : "Debited From"}</span>
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Trackr Account ({user?.name || "User"})
                </span>
              </div>

              {/* Date & Time */}
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Calendar size={15} />
                  <span>Date</span>
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {formattedDate}
                </span>
              </div>

              {/* Remarks / Note */}
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <FileText size={15} />
                  <span>Remarks</span>
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[180px]">
                  {transaction.note || "No note added"}
                </span>
              </div>

              {/* Transaction ID with Copy */}
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Tag size={15} />
                  <span>Transaction ID</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[11px] text-gray-600 dark:text-gray-400 select-all">
                    {transaction.id}
                  </span>
                  <button
                    onClick={handleCopyId}
                    title="Copy Transaction ID"
                    className="p-1 rounded-md text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    {copiedId ? (
                      <Check size={13} className="text-emerald-500" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Copied / Shared Toast Banner */}
            {sharedToast && (
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs text-center font-semibold animate-in fade-in">
                Receipt summary copied to clipboard!
              </div>
            )}
            {copiedId && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs text-center font-semibold animate-in fade-in">
                Transaction ID copied!
              </div>
            )}
          </div>

          {/* Bottom Action Buttons */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 transition-all cursor-pointer"
            >
              <Trash2 size={15} />
              <span>Delete</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShareReceipt}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm transition-all cursor-pointer"
              >
                <Share2 size={15} />
                <span>Share</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Transaction"
        message={`Are you sure you want to delete this ${formatCurrency(
          transaction.amount,
          currency
        )} record?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
