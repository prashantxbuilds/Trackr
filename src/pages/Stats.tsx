import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useApp } from "../context/AppContext";
import { CategoryIcon } from "../components/IconMap";
import { formatCurrency, getCurrencySymbol, isDateInRange } from "../utils";

type Range = "week" | "month" | "3m" | "year";

// Exact colors matching reference bar chart
const BAR_COLORS = {
  income: "#80BFFF", // Light blue
  expense: "#2563EB", // Vibrant blue
};

// Vibrant distinct color palette for Pie Chart categories
const PIE_COLORS = [
  "#6366F1", // Indigo
  "#F43F5E", // Rose
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#84CC16", // Lime
  "#F97316", // Orange
];

export default function Stats() {
  const { transactions, getCategoryById, darkMode, currency } = useApp();
  const symbol = getCurrencySymbol(currency);
  const [range, setRange] = useState<Range>("month");
  const [tab, setTab] = useState<"expense" | "income">("expense");

  // Dynamic breakdown according to selected range and tab
  const pieData = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === tab && isDateInRange(t.date, range))
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });

    return Object.entries(map)
      .map(([id, value], index) => {
        const cat = getCategoryById(id);
        const color = PIE_COLORS[index % PIE_COLORS.length];
        return {
          id,
          name: cat?.name || id,
          value,
          color,
          icon: cat?.icon || "MoreHorizontal",
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [transactions, tab, range, getCategoryById]);

  const total = useMemo(() => pieData.reduce((s, d) => s + d.value, 0), [pieData]);

  // Dynamic last 6 months trend from actual transactions
  const { monthlyTrendData, rangeTitle } = useMemo(() => {
    const monthsMap: Record<
      string,
      { income: number; expense: number; label: string; fullMonth: string; year: number }
    > = {};
    const now = new Date();
    const monthLabels: string[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-US", { month: "short" });
      const fullMonth = d.toLocaleDateString("en-US", { month: "long" });
      monthLabels.push(fullMonth);
      monthsMap[key] = { income: 0, expense: 0, label, fullMonth, year: d.getFullYear() };
    }

    transactions.forEach((t) => {
      const ym = t.date.slice(0, 7);
      if (monthsMap[ym]) {
        if (t.type === "income") {
          monthsMap[ym].income += t.amount;
        } else {
          monthsMap[ym].expense += t.amount;
        }
      }
    });

    const data = Object.entries(monthsMap).map(([_, val]) => ({
      month: val.label,
      fullMonth: val.fullMonth,
      income: val.income,
      expense: val.expense,
    }));

    const rangeTitle =
      monthLabels.length >= 2
        ? `${monthLabels[0]} - ${monthLabels[monthLabels.length - 1]} ${now.getFullYear()}`
        : `${now.getFullYear()}`;

    return { monthlyTrendData: data, rangeTitle };
  }, [transactions]);

  // Exact Tooltip pop-up matching the user's reference Pie Chart image
  const CustomPieTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { name: string; value: number; payload: { color?: string } }[];
  }) => {
    if (active && payload?.length) {
      const data = payload[0];
      const sliceColor = data.payload?.color || "#2563EB";

      return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 rounded-xl shadow-xl px-3.5 py-1.5 flex items-center justify-between gap-3 min-w-[140px] pointer-events-none">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-3 h-3 rounded-[4px] flex-shrink-0"
              style={{ backgroundColor: sliceColor }}
            />
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
              {data.name}
            </span>
          </div>
          <span className="text-xs font-bold text-gray-950 dark:text-white flex-shrink-0">
            {formatCurrency(data.value, currency)}
          </span>
        </div>
      );
    }
    return null;
  };

  // Exact Tooltip pop-up matching the user's reference Bar Chart image
  const CustomBarTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: { name: string; value: number; payload: { fullMonth?: string } }[];
    label?: string;
  }) => {
    if (active && payload?.length) {
      const fullMonthName = payload[0]?.payload?.fullMonth || label;
      const incomeVal = payload.find((p) => p.name === "income")?.value || 0;
      const expenseVal = payload.find((p) => p.name === "expense")?.value || 0;

      return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl shadow-xl border border-gray-200/90 dark:border-gray-800 p-3 min-w-[155px] space-y-2">
          <p className="font-extrabold text-xs text-gray-900 dark:text-white tracking-tight">
            {fullMonthName}
          </p>
          <div className="space-y-1.5 text-xs">
            {/* Income Row with light blue indicator */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-1.5 h-3.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: BAR_COLORS.income }}
                />
                <span className="text-gray-500 dark:text-gray-400 font-medium">Income</span>
              </div>
              <span className="font-bold text-gray-950 dark:text-white text-right">
                {formatCurrency(incomeVal, currency)}
              </span>
            </div>

            {/* Expense Row with dark blue indicator */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-1.5 h-3.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: BAR_COLORS.expense }}
                />
                <span className="text-gray-500 dark:text-gray-400 font-medium">Expense</span>
              </div>
              <span className="font-bold text-gray-950 dark:text-white text-right">
                {formatCurrency(expenseVal, currency)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Header & Perfectly Aligned Time Range Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
              Insights & Patterns
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Spending Analytics
            </h1>
          </div>

          {/* Time Range 4-Button Responsive Grid */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl shadow-sm w-full sm:w-auto">
            {(
              [
                { id: "week", label: "7 Days" },
                { id: "month", label: "Month" },
                { id: "3m", label: "3 Months" },
                { id: "year", label: "1 Year" },
              ] as { id: Range; label: string }[]
            ).map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all duration-250 ease-out text-center truncate cursor-pointer active:scale-95 ${
                  range === r.id
                    ? "bg-gray-900 text-white dark:bg-indigo-600 shadow-sm scale-100"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Toggle: Expense vs Income (Compact & Aligned) */}
        <div className="grid grid-cols-2 p-1 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl shadow-sm w-full sm:max-w-xs gap-1">
          {(["expense", "income"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all duration-250 ease-out text-center cursor-pointer active:scale-95 ${
                tab === t
                  ? t === "expense"
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                    : "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
            >
              {t === "expense" ? "Expenses" : "Income"}
            </button>
          ))}
        </div>

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Reference-Styled Solid Pie Chart */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  Category Distribution
                </h2>
                <p className="text-[11px] text-gray-400">Proportional Share</p>
              </div>
              <span className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                {formatCurrency(total, currency)}
              </span>
            </div>

            {pieData.length > 0 ? (
              <div className="flex flex-col sm:flex-row items-center gap-5 my-auto py-2">
                <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={0}
                        outerRadius={85}
                        dataKey="value"
                        stroke={darkMode ? "#111827" : "#ffffff"}
                        strokeWidth={1.5}
                      >
                        {pieData.map((d) => (
                          <Cell key={d.id} fill={d.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Color Notations List */}
                <div className="flex-1 w-full space-y-2.5 min-w-0">
                  {pieData.slice(0, 5).map((d) => (
                    <div key={d.id} className="flex items-center gap-2.5 text-xs">
                      <span
                        className="w-3 h-3 rounded-[4px] flex-shrink-0"
                        style={{ backgroundColor: d.color }}
                      />
                      <span className="text-gray-700 dark:text-gray-300 font-medium flex-1 truncate">
                        {d.name}
                      </span>
                      <span className="text-gray-400 font-normal">
                        {formatCurrency(d.value, currency)}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white w-9 text-right">
                        {total > 0 ? Math.round((d.value / total) * 100) : 0}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 text-gray-400">
                <p className="text-xs sm:text-sm font-medium">No transactions in this period</p>
              </div>
            )}
          </div>

          {/* Reference-Styled 6-Month Bar Chart */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  {rangeTitle}
                </h2>
                <p className="text-[11px] text-gray-400">Income & Expense Comparison</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: BAR_COLORS.income }}
                  />
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Income</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: BAR_COLORS.expense }}
                  />
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Expense</span>
                </div>
              </div>
            </div>

            <div className="w-full h-56 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrendData} barSize={16} barGap={4}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? "#374151" : "#F3F4F6"}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: darkMode ? "#9CA3AF" : "#6B7280", fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: darkMode ? "#9CA3AF" : "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${symbol}${v >= 1000 ? `${v / 1000}k` : v}`}
                  />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: darkMode ? "#ffffff08" : "#00000005", radius: 8 }} />
                  <Bar
                    dataKey="income"
                    fill={BAR_COLORS.income}
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    fill={BAR_COLORS.expense}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Category Progress List */}
        {pieData.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-3">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
              Category Breakdown
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pieData.map((d) => {
                const pct = total > 0 ? (d.value / total) * 100 : 0;
                return (
                  <div
                    key={d.id}
                    className="p-3.5 bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-3 h-3 rounded-[4px] flex-shrink-0"
                          style={{ backgroundColor: d.color }}
                        />
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {d.name}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white flex-shrink-0">
                        {formatCurrency(d.value, currency)}
                      </span>
                    </div>

                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: d.color }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-gray-400">
                      <span>Share of total</span>
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
