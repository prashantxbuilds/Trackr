import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface CalendarProps {
  value?: string; // "YYYY-MM-DD"
  onChange?: (date: string) => void;
  onClose?: () => void;
  className?: string;
}

const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function Calendar({
  value,
  onChange,
  onClose,
  className = "",
}: CalendarProps) {
  const initialDate = value ? new Date(value + "T00:00:00") : new Date();
  const [viewYear, setViewYear] = useState<number>(
    isNaN(initialDate.getTime()) ? new Date().getFullYear() : initialDate.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState<number>(
    isNaN(initialDate.getTime()) ? new Date().getMonth() : initialDate.getMonth()
  );

  const selectedDateStr = value || new Date().toISOString().split("T")[0];

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Generate Year options (from current-10 to current+10)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  // Compute days in month
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

  // Previous month padding
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const prevM = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevY = viewMonth === 0 ? viewYear - 1 : viewYear;
    const dStr = `${prevY}-${String(prevM + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    days.push({ dateStr: dStr, dayNum: d, isCurrentMonth: false });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    days.push({ dateStr: dStr, dayNum: d, isCurrentMonth: true });
  }

  // Next month padding to fill grid
  const remaining = (7 - (days.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const nextM = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;
    const dStr = `${nextY}-${String(nextM + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    days.push({ dateStr: dStr, dayNum: d, isCurrentMonth: false });
  }

  const handleSelect = (dateStr: string) => {
    if (onChange) onChange(dateStr);
    if (onClose) onClose();
  };

  return (
    <div
      className={`p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl select-none w-[260px] ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Navigation Row matching reference */}
      <div className="flex items-center justify-between mb-4">
        {/* Prev Arrow */}
        <button
          type="button"
          onClick={prevMonth}
          className="p-1 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} strokeWidth={2.2} />
        </button>

        {/* Dropdown Pickers for Month and Year */}
        <div className="flex items-center gap-1.5">
          {/* Month Dropdown Pill */}
          <div className="relative">
            <select
              value={viewMonth}
              onChange={(e) => setViewMonth(parseInt(e.target.value))}
              className="appearance-none bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-2.5 py-1 pr-6 text-xs font-semibold text-gray-900 dark:text-white cursor-pointer outline-none transition-colors"
            >
              {SHORT_MONTHS.map((m, idx) => (
                <option key={m} value={idx} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                  {m}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          {/* Year Dropdown Pill */}
          <div className="relative">
            <select
              value={viewYear}
              onChange={(e) => setViewYear(parseInt(e.target.value))}
              className="appearance-none bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-2.5 py-1 pr-6 text-xs font-semibold text-gray-900 dark:text-white cursor-pointer outline-none transition-colors"
            >
              {years.map((y) => (
                <option key={y} value={y} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                  {y}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Next Arrow */}
        <button
          type="button"
          onClick={nextMonth}
          className="p-1 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <ChevronRight size={16} strokeWidth={2.2} />
        </button>
      </div>

      {/* Weekday Headers matching image: S M T W T F S */}
      <div className="grid grid-cols-7 text-center mb-2">
        {WEEK_DAYS.map((w, idx) => (
          <div
            key={idx}
            className="text-xs font-medium text-gray-400 dark:text-gray-500 py-0.5"
          >
            {w}
          </div>
        ))}
      </div>

      {/* Days Grid matching reference image */}
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {days.map(({ dateStr, dayNum, isCurrentMonth }) => {
          const isSelected = dateStr === selectedDateStr;

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => handleSelect(dateStr)}
              className={`h-7 w-7 mx-auto rounded-lg flex items-center justify-center text-xs font-medium transition-all cursor-pointer ${
                isSelected
                  ? "bg-black text-white dark:bg-white dark:text-black font-bold shadow-sm"
                  : isCurrentMonth
                  ? "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                  : "text-gray-300 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/40"
              }`}
            >
              {dayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
