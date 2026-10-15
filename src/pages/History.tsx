import { useMemo, useState } from "react";
import { Search, X, Trash2, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CategoryIcon } from "../components/IconMap";
import { formatCurrency, formatDate, groupByDate } from "../utils";
import AddTransactionModal from "../components/AddTransactionModal";
import TransactionDetailModal from "../components/TransactionDetailModal";
import type { Transaction } from "../data";

export default function History() {
  const {
    transactions,
    deleteTransaction,
    getCategoryById,
    currency,
  } = useApp();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const cat = getCategoryById(t.category);
      const searchLower = search.trim().toLowerCase();

      const matchSearch =
        !searchLower ||
        cat?.name.toLowerCase().includes(searchLower) ||
        t.note.toLowerCase().includes(searchLower) ||
        t.amount.toString().includes(searchLower);

      const matchType = filterType === "all" || t.type === filterType;
      return matchSearch && matchType;
    });
  }, [transactions, search, filterType, getCategoryById]);

  const { filteredIncome, filteredExpense } = useMemo(() => {
    const inc = filtered
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const exp = filtered
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return { filteredIncome: inc, filteredExpense: exp };
  }, [filtered]);

  const grouped = useMemo(
    () => groupByDate([...filtered].sort((a, b) => b.date.localeCompare(a.date))),
    [filtered]
  );

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
              Audit & Ledger
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Transaction History
            </h1>
          </div>

          {/* Quick Summary Metrics of Filtered Search */}
          <div className="flex items-center gap-2 text-xs font-semibold w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
              <ArrowDownLeft size={13} />
              <span>+{formatCurrency(filteredIncome, currency)}</span>
            </div>
            <div className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40">
              <ArrowUpRight size={13} />
              <span>-{formatCurrency(filteredExpense, currency)}</span>
            </div>
          </div>
        </div>

        {/* Search & 3 Filter Buttons Toolbar */}
        <div className="p-4 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm space-y-3 w-full min-w-0 box-border">
          {/* Search bar */}
          <div className="flex items-center gap-2.5 bg-gray-50 dark:bg-gray-800/80 rounded-2xl px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 w-full min-w-0 box-border focus-within:border-indigo-500 transition-colors">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="flex-1 bg-transparent text-xs sm:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none min-w-0"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 transition-colors flex-shrink-0 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* 3 Buttons Only: All Types, Expense, Income */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-md">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 ease-out text-center cursor-pointer active:scale-95 ${
                filterType === "all"
                  ? "bg-gray-900 text-white dark:bg-indigo-600 shadow-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              All Types
            </button>

            <button
              type="button"
              onClick={() => setFilterType("expense")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 ease-out text-center cursor-pointer active:scale-95 ${
                filterType === "expense"
                  ? "bg-rose-500 text-white shadow-sm shadow-rose-500/20"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Expense
            </button>

            <button
              type="button"
              onClick={() => setFilterType("income")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 ease-out text-center cursor-pointer active:scale-95 ${
                filterType === "income"
                  ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Income
            </button>
          </div>
        </div>

        {/* Transaction Grouped List */}
        <div className="space-y-5">
          {grouped.map(([date, txs]) => (
            <div key={date} className="space-y-2">
              {/* Date Header */}
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {formatDate(date)}
                </h3>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(txs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0), currency)}
                  </span>
                  <span className="text-rose-600 dark:text-rose-400">
                    -{formatCurrency(txs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0), currency)}
                  </span>
                </div>
              </div>

              {/* Transactions in Date */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-3 sm:p-4 shadow-sm space-y-2">
                {txs.map((tx) => {
                  const cat = getCategoryById(tx.category);
                  const isIncome = tx.type === "income";
                  return (
                    <div
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className="flex items-center gap-3.5 p-3 rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 hover:bg-indigo-50/50 dark:hover:bg-gray-800/90 border border-transparent hover:border-indigo-100 dark:hover:border-gray-700 transition-all cursor-pointer group select-none active:scale-[0.99]"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner"
                        style={{
                          backgroundColor: isIncome
                            ? "#10B98120"
                            : (cat?.color || "#9CA3AF") + "20",
                          color: isIncome ? "#10B981" : cat?.color,
                        }}
                      >
                        {cat && <CategoryIcon iconName={cat.icon} size={18} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {tx.note || cat?.name || "Transaction"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {cat?.name || "Uncategorized"} · {isIncome ? "Income" : "Expense"}
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
                          title="Delete record"
                          className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm">
              <Search size={40} strokeWidth={1.25} className="mb-2 text-gray-300 dark:text-gray-600" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                No matching transactions found
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try searching for another keyword
              </p>
            </div>
          )}
        </div>
      </div>

      {showAdd && <AddTransactionModal onClose={() => setShowAdd(false)} />}

      {selectedTx && (
        <TransactionDetailModal
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </div>
  );
}
