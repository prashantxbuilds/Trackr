import { useMemo, useState } from "react";
import { Edit3, Check, X, AlertTriangle, CheckCircle2, TrendingDown } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CategoryIcon } from "../components/IconMap";
import { formatCurrency, getCurrencySymbol } from "../utils";

export default function Budget() {
  const { transactions, expenseCategories, updateCategoryBudget, currency } = useApp();
  const symbol = getCurrencySymbol(currency);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Calculate days elapsed and days in month for avg spend
  const { daysElapsed, daysInMonth } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const mon = now.getMonth();
    const days = new Date(year, mon + 1, 0).getDate(); // total days in month
    const elapsed = now.getDate(); // days elapsed so far (including today)
    return { daysElapsed: elapsed, daysInMonth: days };
  }, []);

  const catData = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });

    return expenseCategories.map((cat) => {
      const spent = map[cat.id] || 0;
      const pct = cat.budget > 0 ? (spent / cat.budget) * 100 : 0;
      const isOver = cat.budget > 0 && spent > cat.budget;
      const remaining = cat.budget - spent;
      // Daily avg: total spent / days elapsed so far
      const dailyAvg = daysElapsed > 0 ? spent / daysElapsed : 0;
      // Projected spend: dailyAvg * total days in month
      const projected = dailyAvg * daysInMonth;
      return { ...cat, spent, pct, isOver, remaining, dailyAvg, projected };
    });
  }, [transactions, expenseCategories, daysElapsed, daysInMonth]);

  const totalBudget = useMemo(
    () => expenseCategories.reduce((s, c) => s + c.budget, 0),
    [expenseCategories]
  );
  const totalSpent = useMemo(
    () => catData.reduce((s, c) => s + c.spent, 0),
    [catData]
  );
  const totalDailyAvg = daysElapsed > 0 ? totalSpent / daysElapsed : 0;

  const overallPct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const isOverallOver = totalBudget > 0 && totalSpent > totalBudget;
  const overBudgetCategories = catData.filter((c) => c.isOver);

  const startEdit = (id: string, current: number) => {
    setEditingId(id);
    setEditValue(current === 0 ? "" : current.toString());
  };

  const saveEdit = (id: string) => {
    const val = parseFloat(editValue);
    if (!isNaN(val) && val >= 0) {
      updateCategoryBudget(id, val);
    }
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  // Overall bar: segmented by category color
  const categoriesWithBudget = catData.filter((c) => c.budget > 0 && c.spent > 0);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
              Targets & Limits
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Budget Tracker
            </h1>
          </div>
        </div>

        {/* Overall Summary Card */}
        <div className="rounded-3xl p-6 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                Total Expenses
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-gray-900 dark:text-white">
                  {formatCurrency(totalSpent, currency)}
                </p>
                <span className="text-sm text-gray-400">
                  of {formatCurrency(totalBudget, currency)}
                </span>
              </div>
              {/* Daily avg for total */}
              <div className="flex items-center gap-1.5 mt-1.5">
                <TrendingDown size={13} className="text-gray-400" />
                <span className="text-xs text-gray-400">
                  Daily avg:{" "}
                  <span className="font-bold text-gray-600 dark:text-gray-300">
                    {formatCurrency(totalDailyAvg, currency)}/day
                  </span>
                  <span className="text-gray-400"> · Day {daysElapsed} of {daysInMonth}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isOverallOver ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-800">
                  <AlertTriangle size={14} />
                  <span>Over budget by {formatCurrency(totalSpent - totalBudget, currency)}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 size={14} />
                  <span>{formatCurrency(Math.max(0, totalBudget - totalSpent), currency)} remaining</span>
                </div>
              )}
            </div>
          </div>

          {/* Overall progress bar: segmented by category color */}
          <div className="space-y-1.5">
            {categoriesWithBudget.length > 0 ? (
              <div className="h-3.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-0.5 flex">
                {categoriesWithBudget.map((cat, i) => {
                  const segPct = totalBudget > 0 ? Math.min((cat.spent / totalBudget) * 100, 100) : 0;
                  return (
                    <div
                      key={cat.id}
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${segPct}%`,
                        backgroundColor: cat.color,
                        borderRadius: i === 0 ? "9999px 0 0 9999px" : i === categoriesWithBudget.length - 1 ? "0 9999px 9999px 0" : "0",
                        marginLeft: i === 0 ? 0 : "1px",
                      }}
                      title={`${cat.name}: ${formatCurrency(cat.spent, currency)}`}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="h-3.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-indigo-500"
                  style={{ width: `${Math.min(overallPct, 100)}%` }}
                />
              </div>
            )}
            <div className="flex justify-between text-xs font-semibold text-gray-400">
              <span>{Math.round(overallPct)}% consumed</span>
              <span>{totalBudget > 0 ? `${Math.max(0, Math.round(100 - overallPct))}% left` : "No limit"}</span>
            </div>
          </div>

          {/* Category color legend for overall bar */}
          {categoriesWithBudget.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {categoriesWithBudget.map((cat) => (
                <div key={cat.id} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">{cat.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Warning Alert if any category is over budget */}
        {overBudgetCategories.length > 0 && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-center gap-3">
            <AlertTriangle className="text-rose-500 flex-shrink-0" size={20} />
            <div className="text-xs text-rose-800 dark:text-rose-300">
              <span className="font-bold">Budget Alert: </span>
              {overBudgetCategories.length} {overBudgetCategories.length === 1 ? "category has" : "categories have"} exceeded their spending limit ({overBudgetCategories.map((c) => c.name).join(", ")}).
            </div>
          </div>
        )}

        {/* Category Budget Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Category Limits
            </h2>
            <span className="text-xs text-gray-400">Set budget limit</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {catData.map((cat) => {
              const isEditing = editingId === cat.id;
              // Bar color = category's own color, fades to rose if over budget
              const barColor = cat.isOver ? "#F43F5E" : cat.color;
              return (
                <div
                  key={cat.id}
                  className={`p-5 rounded-3xl bg-white dark:bg-gray-900 border transition-all ${
                    cat.isOver
                      ? "border-rose-300 dark:border-rose-900 shadow-sm"
                      : "border-gray-200/80 dark:border-gray-800 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: cat.color + "20", color: cat.color }}
                    >
                      <CategoryIcon iconName={cat.icon} size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {cat.name}
                      </p>
                      <p className="text-xs font-semibold" style={{ color: barColor }}>
                        {cat.budget > 0
                          ? cat.isOver
                            ? `Over by ${formatCurrency(Math.abs(cat.remaining), currency)}`
                            : `${Math.round(cat.pct)}% used`
                          : "No limit set"}
                      </p>
                    </div>

                    {/* Edit Budget Controls */}
                    {isEditing ? (
                      <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                        <span className="text-xs text-gray-400 pl-1">{symbol}</span>
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-16 text-xs font-bold text-gray-900 dark:text-white bg-transparent outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit(cat.id);
                            if (e.key === "Escape") cancelEdit();
                          }}
                        />
                        <button
                          onClick={() => saveEdit(cat.id)}
                          className="p-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors cursor-pointer"
                        >
                          <Check size={12} strokeWidth={3} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 transition-colors cursor-pointer"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(cat.id, cat.budget)}
                        className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                        title="Edit Budget"
                      >
                        <Edit3 size={15} />
                      </button>
                    )}
                  </div>

                  {/* Progress Bar — category's own color */}
                  <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(cat.pct, 100)}%`,
                        backgroundColor: barColor,
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs font-medium text-gray-500 dark:text-gray-400">
                    <span>{formatCurrency(cat.spent, currency)} spent</span>
                    <button
                      onClick={() => !isEditing && startEdit(cat.id, cat.budget)}
                      className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer font-medium"
                    >
                      {cat.budget > 0
                        ? `Budget: ${formatCurrency(cat.budget, currency)}`
                        : "Set limit"}
                    </button>
                  </div>

                  {/* Daily avg spend for this category */}
                  {cat.spent > 0 && (
                    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <TrendingDown size={11} className="text-gray-400 flex-shrink-0" />
                      <span className="text-[11px] text-gray-400">
                        Daily avg:{" "}
                        <span className="font-semibold text-gray-600 dark:text-gray-300">
                          {formatCurrency(cat.dailyAvg, currency)}/day
                        </span>
                        {cat.budget > 0 && (
                          <span className="text-gray-400">
                            {" "}· Projected: {formatCurrency(cat.projected, currency)}
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
