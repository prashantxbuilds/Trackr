import { useState, useEffect, useRef } from "react";
import { X, Calendar as CalendarIcon, FileText, Check, ArrowDownLeft, ArrowUpRight, ChevronDown } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CategoryIcon } from "./IconMap";
import { getCurrencySymbol, formatDate } from "../utils";
import { Calendar } from "./ui/Calendar";
import type { TransactionType } from "../data";

type Props = {
  onClose: () => void;
  defaultType?: TransactionType;
};

const QUICK_AMOUNTS = [10, 50, 100, 500];

export default function AddTransactionModal({ onClose, defaultType = "expense" }: Props) {
  const { expenseCategories, incomeCategories, addTransaction, currency, getCategoryById } = useApp();
  const symbol = getCurrencySymbol(currency);
  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const cats = type === "expense" ? expenseCategories : incomeCategories;
  const selectedCat = getCategoryById(category) || cats[0];

  // Auto-select first category if current is invalid for the active type
  useEffect(() => {
    if (cats.length > 0 && (!category || !cats.some((c) => c.id === category))) {
      setCategory(cats[0].id);
    }
  }, [type, cats, category]);

  // Close category dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCatOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0 || !category) return;

    addTransaction({
      type,
      amount: num,
      category,
      date,
      note: note.trim(),
    });
    onClose();
  };

  const handleQuickAdd = (val: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + val).toFixed(2).replace(/\.00$/, ""));
  };

  const isValid = amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && !!category;

  const todayStr = new Date().toISOString().split("T")[0];
  const formattedDateLabel =
    date === todayStr ? `Today, ${formatDate(date)}` : formatDate(date);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 animate-scale-in overflow-hidden min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            Add {type === "expense" ? "Expense" : "Income"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto overflow-x-hidden scrollbar-hide min-w-0 w-full box-border"
        >
          {/* Type Toggle: Expense vs Income */}
          <div className="grid grid-cols-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl gap-1 border border-gray-200/60 dark:border-gray-700 w-full min-w-0">
            <button
              type="button"
              onClick={() => {
                setType("expense");
                setIsCatOpen(false);
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ease-out min-w-0 cursor-pointer active:scale-95 ${
                type === "expense"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/25"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <ArrowUpRight size={15} strokeWidth={2.5} className="flex-shrink-0" />
              <span className="truncate">Expense</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType("income");
                setIsCatOpen(false);
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ease-out min-w-0 cursor-pointer active:scale-95 ${
                type === "income"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <ArrowDownLeft size={15} strokeWidth={2.5} className="flex-shrink-0" />
              <span className="truncate">Income</span>
            </button>
          </div>

          {/* Amount Box */}
          <div className="w-full min-w-0">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Amount ({symbol})
            </label>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 transition-colors w-full min-w-0 box-border">
              <span className="text-xl font-bold text-gray-400 dark:text-gray-500 flex-shrink-0">
                {symbol}
              </span>
              <input
                type="number"
                step="any"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full min-w-0 text-xl font-bold text-gray-900 dark:text-white bg-transparent outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600"
                autoFocus
              />
            </div>

            {/* Quick Amount Increment Pills (4 Units) */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-1 w-full min-w-0">
              <span className="text-[11px] font-semibold text-gray-400 mr-1 flex-shrink-0">
                Quick:
              </span>
              {QUICK_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAdd(val)}
                  className="px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 transition-all duration-150 flex-shrink-0 cursor-pointer active:scale-90"
                >
                  +{symbol}{val}
                </button>
              ))}
            </div>
          </div>

          {/* Compact Category Dropdown */}
          <div className="w-full min-w-0 relative" ref={dropdownRef}>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Category
            </label>

            {/* Dropdown Trigger Button */}
            <button
              type="button"
              onClick={() => setIsCatOpen(!isCatOpen)}
              className="flex items-center justify-between w-full bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-left focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                {selectedCat && (
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: selectedCat.color + "22", color: selectedCat.color }}
                  >
                    <CategoryIcon iconName={selectedCat.icon} size={17} />
                  </div>
                )}
                <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {selectedCat ? selectedCat.name : "Select a category"}
                </span>
              </div>

              <ChevronDown
                size={18}
                className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                  isCatOpen ? "rotate-180 text-indigo-500" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu Options */}
            {isCatOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-30 max-h-48 overflow-y-auto scrollbar-hide py-1.5 animate-scale-in">
                {cats.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setCategory(cat.id);
                        setIsCatOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-4 py-2.5 text-left transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 font-bold"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700/60 text-gray-800 dark:text-gray-200 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: cat.color + "22", color: cat.color }}
                        >
                          <CategoryIcon iconName={cat.icon} size={15} />
                        </div>
                        <span className="text-xs sm:text-sm truncate">{cat.name}</span>
                      </div>

                      {isSelected && <Check size={16} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Date Picker Button */}
          <div className="w-full min-w-0">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Date
            </label>

            <button
              type="button"
              onClick={() => {
                setIsDateOpen(true);
                setIsCatOpen(false);
              }}
              className="flex items-center justify-between w-full bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-left focus:border-indigo-500 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white min-w-0">
                <CalendarIcon size={17} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{formattedDateLabel}</span>
              </div>
              <ChevronDown
                size={18}
                className="text-gray-400 flex-shrink-0"
              />
            </button>
          </div>

          {/* Note Input */}
          <div className="w-full min-w-0">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Note (Optional)
            </label>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 focus-within:border-indigo-500 transition-colors w-full min-w-0 box-border">
              <FileText size={16} className="text-gray-400 flex-shrink-0" />
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Lunch with friends"
                className="w-full min-w-0 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 w-full min-w-0">
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-4 rounded-2xl text-sm font-bold text-white transition-all duration-200 shadow-md cursor-pointer active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${
                type === "expense"
                  ? "bg-gray-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-indigo-600/10"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
              }`}
            >
              Save {type === "expense" ? "Expense" : "Income"}
            </button>
          </div>
        </form>
      </div>

      {/* Perfectly Centered Calendar Popup Modal */}
      {isDateOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsDateOpen(false)}
        >
          <div
            className="animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <Calendar
              value={date}
              onChange={(newDate) => {
                setDate(newDate);
                setIsDateOpen(false);
              }}
              onClose={() => setIsDateOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
