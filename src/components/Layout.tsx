import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import {
  Home,
  BarChart2,
  Wallet,
  Clock,
  Settings as SettingsIcon,
  Plus,
  Moon,
  Sun,
} from "lucide-react";
import AddTransactionModal from "./AddTransactionModal";
import TrackrLogo, { TrackrLogoIcon } from "./TrackrLogo";
import CartoonAvatar from "./CartoonAvatar";
import { useApp } from "../context/AppContext";

const NAV = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/stats", label: "Analytics", icon: BarChart2 },
  { path: "/budget", label: "Budgets", icon: Wallet },
  { path: "/history", label: "History", icon: Clock },
  { path: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, setDarkMode, user } = useApp();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="flex h-full w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased overflow-hidden">
      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white dark:bg-gray-900 border-r border-gray-200/80 dark:border-gray-800/80 p-5 z-20 flex-shrink-0">
        {/* Brand Logo Header */}
        <div className="flex items-center justify-between gap-3 px-1 mb-7">
          <TrackrLogo size="md" />

          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-hide">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-400 mb-2">
            Menu
          </p>
          {NAV.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-medium transition-colors duration-150 text-left cursor-pointer !transform-none select-none ${
                  active
                    ? "bg-gray-900 text-white dark:bg-gray-800 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <Icon
                  size={19}
                  strokeWidth={active ? 2.2 : 1.8}
                  className={active ? "text-white" : "text-gray-400 dark:text-gray-400"}
                />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom User Profile Card */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/60">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800/40">
            <CartoonAvatar name={user ? user.name : "User"} size={36} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-200 truncate">
                {user ? user.name : "User"}
              </p>
              <p className="text-[11px] text-gray-400 dark:text-gray-400 truncate">
                {user ? user.email : "user@trackr.app"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-5 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800/80 z-10 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <TrackrLogoIcon size={30} />
            <span className="font-extrabold text-base tracking-tight text-gray-900 dark:text-white">
              Trackr
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Toggle theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* Viewport Router Content with Smooth Page Transitions */}
        <main key={location.pathname} className="flex-1 overflow-hidden flex flex-col animate-page">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation - Stable & Steady */}
        <nav className="md:hidden flex-shrink-0 flex items-center justify-around bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 px-2 py-1.5 z-20">
          {NAV.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex-1 flex flex-col items-center gap-1 py-1.5 px-1 rounded-xl transition-colors duration-150 cursor-pointer !transform-none select-none ${
                  active
                    ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-gray-400 dark:text-gray-400 font-normal hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.3 : 1.75}
                  className={active ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-400"}
                />
                <span className="text-[11px] leading-none">
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Mobile Floating Action Button (FAB) */}
        <button
          onClick={() => setShowAdd(true)}
          className="md:hidden fixed bottom-18 right-5 w-13 h-13 rounded-full bg-gray-900 dark:bg-indigo-600 text-white shadow-xl flex items-center justify-center z-30 transition-transform active:scale-90 hover:scale-105"
          aria-label="Add transaction"
        >
          <Plus size={22} strokeWidth={2.5} />
        </button>
      </div>

      {/* Global Add Transaction Modal */}
      {showAdd && <AddTransactionModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
