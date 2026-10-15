import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  TrendingDown,
  Plus,
  Wallet,
  Clock,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { CategoryIcon } from "../components/IconMap";
import { formatCurrency, formatDate } from "../utils";
import AddTransactionModal from "../components/AddTransactionModal";
import TransactionDetailModal from "../components/TransactionDetailModal";
import type { Transaction, TransactionType } from "../data";

export default function Dashboard() {
  const navigate = useNavigate();
  const { transactions, getCategoryById, deleteTransaction, currency } = useApp();
  const [modalType, setModalType] = useState<TransactionType | null>(null);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
  }, [transactions]);

  const recent = useMemo(
    () => [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7),
    [transactions]
  );

  const topExpCats = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map)
      .map(([id, amount]) => ({ cat: getCategoryById(id), amount }))
      .filter((x) => x.cat)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [transactions, getCategoryById]);

  const savingsRate =
    totalIncome > 0
      ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
      : 0;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
              Overview & Analytics
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Financial Dashboard
            </h1>
          </div>

          {/* Action Button */}
          <div>
            <button
              onClick={() => setModalType("expense")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 ease-out cursor-pointer active:scale-95"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {/* Hero Card & Top Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main Balance Hero Card */}
          <div className="lg:col-span-2 relative rounded-3xl p-6 sm:p-7 text-white shadow-xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 dark:from-gray-900 dark:via-indigo-950 dark:to-slate-900 border border-gray-800/40">
            {/* Background glowing shapes */}
            <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-gray-300 font-semibold">
                    Overall Net Balance
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold">
                    {savingsRate >= 0 ? (
                      <TrendingUp size={13} className="text-emerald-400" />
                    ) : (
                      <TrendingDown size={13} className="text-rose-400" />
                    )}
                    <span className={savingsRate >= 0 ? "text-emerald-300" : "text-rose-300"}>
                      {savingsRate}% savings rate
                    </span>
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black mt-2 tracking-tight">
                  {formatCurrency(balance, currency)}
                </p>
              </div>

              {/* Income vs Expenses breakdown row - Centered & Responsive */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-white/10">
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-2xl bg-white/[0.07] border border-white/10 min-w-0 justify-center sm:justify-start">
                  <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-2xl bg-emerald-500/25 text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <ArrowDownLeft size={19} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0 w-full">
                    <p className="text-[11px] sm:text-xs text-gray-300 font-medium truncate">Total Income</p>
                    <p className="text-sm sm:text-lg font-black text-white truncate mt-0.5">
                      {formatCurrency(totalIncome, currency)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-2xl bg-white/[0.07] border border-white/10 min-w-0 justify-center sm:justify-start">
                  <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-2xl bg-rose-500/25 text-rose-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <ArrowUpRight size={19} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0 w-full">
                    <p className="text-[11px] sm:text-xs text-gray-300 font-medium truncate">Total Expenses</p>
                    <p className="text-sm sm:text-lg font-black text-white truncate mt-0.5">
                      {formatCurrency(totalExpense, currency)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics / Summary */}
          <div className="rounded-3xl p-6 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                Quick Highlights
              </h3>
              <button
                onClick={() => navigate("/stats")}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Analytics <ChevronRight size={13} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Total Transactions
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {transactions.length} recorded
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Avg. Transaction
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatCurrency(transactions.length > 0 ? (totalIncome + totalExpense) / transactions.length : 0, currency)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate("/budget")}
                className="w-full py-2.5 px-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Wallet size={14} className="text-indigo-500" />
                <span>Check Budget Progress</span>
              </button>
            </div>
          </div>
        </div>

        {/* Top Spending Categories */}
        {topExpCats.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Top Spending Categories
              </h2>
              <button
                onClick={() => navigate("/stats")}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                View all breakdown
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {topExpCats.map(({ cat, amount }) => (
                <div
                  key={cat!.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-inner"
                    style={{ backgroundColor: cat!.color + "20", color: cat!.color }}
                  >
                    <CategoryIcon iconName={cat!.icon} size={18} />
                  </div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
                    {cat!.name}
                  </p>
                  <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                    {formatCurrency(amount, currency)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Transactions Section */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Recent Transactions
              </h2>
            </div>
            <button
              onClick={() => navigate("/history")}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Clock size={13} />
              <span>Full History</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {recent.map((tx) => {
              const cat = getCategoryById(tx.category);
              const isIncome = tx.type === "income";
              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="flex items-center gap-3.5 p-3.5 bg-gray-50/80 dark:bg-gray-800/50 hover:bg-indigo-50/50 dark:hover:bg-gray-800/90 border border-transparent hover:border-indigo-100 dark:hover:border-gray-700 rounded-2xl transition-all cursor-pointer group select-none active:scale-[0.99]"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{
                      backgroundColor: isIncome ? "#10B98120" : (cat?.color || "#9CA3AF") + "20",
                      color: isIncome ? "#10B981" : cat?.color,
                    }}
                  >
                    {cat && <CategoryIcon iconName={cat.icon} size={18} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {tx.note || cat?.name || "Transaction"}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-400 truncate">
                      {formatDate(tx.date)} · {cat?.name || "Uncategorized"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p
                      className={`text-sm font-bold ${
                        isIncome
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(tx.amount, currency)}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTransaction(tx.id);
                      }}
                      title="Delete transaction"
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}

            {recent.length === 0 && (
              <div className="text-center py-12 text-gray-400 dark:text-gray-400">
                <p className="text-sm font-medium">No transactions recorded yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {modalType && (
        <AddTransactionModal
          defaultType={modalType}
          onClose={() => setModalType(null)}
        />
      )}

      {selectedTx && (
        <TransactionDetailModal
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </div>
  );
}
