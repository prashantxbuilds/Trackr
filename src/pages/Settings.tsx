import { useState } from "react";
import {
  ChevronRight,
  Moon,
  Sun,
  Bell,
  Download,
  Tag,
  User,
  X,
  Check,
  Trash2,
  Plus,
  RotateCcw,
  CheckCircle2,
  Coins,
  LogOut,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { CategoryIcon } from "../components/IconMap";
import { ICON_NAMES, PRESET_COLORS } from "../data";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { escapeCSV, formatCurrency, getCurrencySymbol, type CurrencyType } from "../utils";
import type { TransactionType } from "../data";

type AddCatForm = { name: string; icon: string; color: string };

function AddCategoryModal({
  type,
  onClose,
}: {
  type: TransactionType;
  onClose: () => void;
}) {
  const { addCategory } = useApp();
  const [form, setForm] = useState<AddCatForm>({
    name: "",
    icon: "UtensilsCrossed",
    color: PRESET_COLORS[0],
  });

  const handleSave = () => {
    if (!form.name.trim()) return;
    addCategory(
      {
        name: form.name.trim(),
        icon: form.icon,
        color: form.color,
        budget: 0,
        forIncome: type === "income",
      },
      type
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 animate-scale-in overflow-hidden min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Create New {type === "expense" ? "Expense" : "Income"} Category
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4 max-h-[75vh] overflow-y-auto overflow-x-hidden scrollbar-hide min-w-0 w-full box-border">
          {/* Category Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Category Name
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Groceries, Gym, Subscriptions"
              className="w-full bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-indigo-500"
              autoFocus
            />
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Select Color
            </label>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, color: c }))}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer"
                  style={{ backgroundColor: c }}
                >
                  {form.color === c && <Check size={14} className="text-white" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Select Icon
            </label>
            <div className="grid grid-cols-7 gap-2">
              {ICON_NAMES.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, icon: name }))}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                  style={{
                    backgroundColor:
                      form.icon === name ? form.color + "25" : "transparent",
                    color: form.icon === name ? form.color : "#9CA3AF",
                    outline:
                      form.icon === name ? `2px solid ${form.color}` : "1px solid rgba(156,163,175,0.2)",
                  }}
                >
                  <CategoryIcon iconName={name} size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Preview Card */}
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: form.color + "20", color: form.color }}
            >
              <CategoryIcon iconName={form.icon} size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {form.name || "Preview Name"}
              </p>
              <p className="text-xs text-gray-400">
                {type === "expense" ? "Expense Category (Set limit in Budgets)" : "Income Category"}
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!form.name.trim()}
            className="w-full py-4 rounded-2xl text-sm font-bold text-white bg-gray-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-all disabled:opacity-40 shadow-md cursor-pointer"
          >
            Save Category
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryManager({ type }: { type: TransactionType }) {
  const { expenseCategories, incomeCategories, deleteCategory, currency } = useApp();
  const symbol = getCurrencySymbol(currency);
  const [showAdd, setShowAdd] = useState(false);
  const cats = type === "expense" ? expenseCategories : incomeCategories;

  return (
    <div className="space-y-3 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {cats.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 rounded-2xl"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: cat.color + "20", color: cat.color }}
            >
              <CategoryIcon iconName={cat.icon} size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                {cat.name}
              </p>
              {type === "expense" && (
                <p className="text-xs text-gray-400">
                  {cat.budget > 0 ? `${symbol}${cat.budget}/month` : "No limit"}
                </p>
              )}
            </div>
            <button
              onClick={() => deleteCategory(cat.id, type)}
              title="Delete Category"
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowAdd(true)}
        className="flex items-center justify-center gap-2 w-full p-3.5 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors text-xs font-bold"
      >
        <Plus size={15} />
        <span>Add New {type === "expense" ? "Expense" : "Income"} Category</span>
      </button>

      {showAdd && <AddCategoryModal type={type} onClose={() => setShowAdd(false)} />}
    </div>
  );
}

export default function Settings() {
  const { transactions, darkMode, setDarkMode, currency, setCurrency, resetAllData, user, logout } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [exported, setExported] = useState(false);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const ToggleSwitch = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative w-12 h-6.5 rounded-full transition-colors ${
        on ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"
      }`}
    >
      <span
        className="absolute top-1 left-1 w-4.5 h-4.5 bg-white rounded-full shadow-md transition-transform"
        style={{ transform: on ? "translateX(22px)" : "none" }}
      />
    </button>
  );

  const exportCSV = () => {
    const headers = ["ID", "Date", "Type", "Category", "Amount", "Currency", "Note"];
    const rows = transactions.map((t) => [
      escapeCSV(t.id),
      escapeCSV(t.date),
      escapeCSV(t.type),
      escapeCSV(t.category),
      escapeCSV(t.amount),
      escapeCSV(currency),
      escapeCSV(t.note),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const handleResetData = () => {
    setShowResetConfirm(false);
    setIsResetting(true);
    setTimeout(() => {
      resetAllData();
      setIsResetting(false);
    }, 2500);
  };

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
            Preferences & Configuration
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Settings
          </h1>
        </div>

        {/* User Profile Card */}
        <div className="flex items-center gap-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-xl">
            {user ? user.name.charAt(0).toUpperCase() : <User size={26} strokeWidth={2} />}
          </div>
          <div className="min-w-0">
            <p className="text-base font-bold text-gray-900 dark:text-white truncate">
              {user ? user.name : "Guest Account"}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user ? user.email : "Local Workspace"}
            </p>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
            General Preferences
          </p>
          <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm divide-y divide-gray-100 dark:divide-gray-800">
            {/* Currency Selector (₹ / $) */}
            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                  <Coins size={18} />
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Display Currency
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200/60 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setCurrency("INR")}
                  className={`w-8 h-8 rounded-xl text-sm font-black transition-all duration-200 ease-out cursor-pointer active:scale-95 flex items-center justify-center ${
                    currency === "INR"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  title="Indian Rupee (₹)"
                >
                  ₹
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency("USD")}
                  className={`w-8 h-8 rounded-xl text-sm font-black transition-all duration-200 ease-out cursor-pointer active:scale-95 flex items-center justify-center ${
                    currency === "USD"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  title="US Dollar ($)"
                >
                  $
                </button>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Dark Mode
                  </p>
                  <p className="text-xs text-gray-400">Toggle appearance</p>
                </div>
              </div>
              <ToggleSwitch on={darkMode} onToggle={() => setDarkMode(!darkMode)} />
            </div>

            {/* Budget Alerts Toggle */}
            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  <Bell size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Budget Alerts
                  </p>
                  <p className="text-xs text-gray-400">Warn near budget limits</p>
                </div>
              </div>
              <ToggleSwitch on={notifications} onToggle={() => setNotifications(!notifications)} />
            </div>
          </div>
        </div>

        {/* Categories Customization */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
            Manage Categories
          </p>
          <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm divide-y divide-gray-100 dark:divide-gray-800">
            {/* Expense Categories Accordion */}
            <div className="p-4 sm:p-5">
              <button
                onClick={() => setOpenSection(openSection === "expense" ? null : "expense")}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                    <Tag size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      Expense Categories
                    </p>
                    <p className="text-xs text-gray-400">Manage expense groups</p>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className={`text-gray-400 transition-transform ${
                    openSection === "expense" ? "rotate-90" : ""
                  }`}
                />
              </button>

              {openSection === "expense" && <CategoryManager type="expense" />}
            </div>

            {/* Income Categories Accordion */}
            <div className="p-4 sm:p-5">
              <button
                onClick={() => setOpenSection(openSection === "income" ? null : "income")}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                    <Tag size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      Income Categories
                    </p>
                    <p className="text-xs text-gray-400">Manage income sources</p>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className={`text-gray-400 transition-transform ${
                    openSection === "income" ? "rotate-90" : ""
                  }`}
                />
              </button>

              {openSection === "income" && <CategoryManager type="income" />}
            </div>
          </div>
        </div>

        {/* Data & Backup */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
            Data Management
          </p>
          <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm divide-y divide-gray-100 dark:divide-gray-800">
            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  <Download size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Export to CSV
                  </p>
                  <p className="text-xs text-gray-400">{transactions.length} records</p>
                </div>
              </div>
              <button
                onClick={exportCSV}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm"
              >
                {exported ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>Exported</span>
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    <span>Download</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 ${isResetting ? "animate-spin" : ""}`}>
                  <RotateCcw size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Reset Data
                  </p>
                  <p className="text-xs text-gray-400">Clear all records</p>
                </div>
              </div>
              <button
                onClick={() => setShowResetConfirm(true)}
                disabled={isResetting}
                className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-bold transition-all border border-rose-200 dark:border-rose-900/60 cursor-pointer disabled:opacity-50"
              >
                {isResetting ? "Resetting..." : "Reset Data"}
              </button>
            </div>

            {user && (
              <div className="flex items-center justify-between p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                    <LogOut size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Log Out of Account
                    </p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* In-App Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Log Out of Account"
        message={`Are you sure you want to log out of ${user?.email || "your account"}?`}
        confirmText="Yes, Log Out"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reset Data"
        message="All transactions, categories and settings will be cleared. This cannot be undone."
        confirmText="Reset Everything"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleResetData}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
}
