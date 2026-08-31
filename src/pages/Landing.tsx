import { ArrowRight, BarChart2, Shield, Smartphone, Wallet, Zap, Globe, CreditCard } from "lucide-react";
import { TrackrLogoIcon } from "../components/TrackrLogo";

const FEATURES = [
  {
    icon: Wallet,
    title: "Track Every Rupee",
    desc: "Log income & expenses instantly with smart categorization.",
    color: "#6366F1",
  },
  {
    icon: BarChart2,
    title: "Visual Analytics",
    desc: "Beautiful charts and insights to understand your spending.",
    color: "#F43F5E",
  },
  {
    icon: Shield,
    title: "100% Private",
    desc: "All data stays on your device. No cloud. No tracking.",
    color: "#10B981",
  },
  {
    icon: Zap,
    title: "Budget Alerts",
    desc: "Set category budgets and get warned before overspending.",
    color: "#F59E0B",
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    desc: "Fully responsive — desktop, tablet, or phone.",
    color: "#8B5CF6",
  },
  {
    icon: Globe,
    title: "No Sign-Up Required",
    desc: "Open the link and start tracking. Zero friction.",
    color: "#06B6D4",
  },
];

export default function Landing({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-y-auto">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 py-3.5">
          <div className="flex items-center gap-3">
            <TrackrLogoIcon size={36} />
            <span className="font-extrabold text-lg tracking-tight text-gray-900 dark:text-white">
              Trackr
            </span>
          </div>
          <button
            onClick={onGetStarted}
            className="px-5 py-2.5 rounded-2xl bg-gray-900 dark:bg-indigo-600 text-white text-sm font-bold hover:bg-black dark:hover:bg-indigo-500 transition-all shadow-sm cursor-pointer active:scale-95"
          >
            Open App
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white to-emerald-50/50 dark:from-indigo-950/20 dark:via-gray-950 dark:to-emerald-950/10" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-16 sm:pb-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                Free & Open Source · No Sign-Up Required
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Your Money,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">
                Simplified
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
              Track expenses, set budgets, and visualize your spending — all in one beautiful app that works right in your browser.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gray-900 dark:bg-indigo-600 text-white text-sm font-bold hover:bg-black dark:hover:bg-indigo-500 transition-all shadow-lg shadow-gray-900/20 dark:shadow-indigo-600/20 cursor-pointer active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-lg mx-auto mt-14 sm:mt-16">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">100%</p>
              <p className="text-xs text-gray-400 font-medium mt-1">Free Forever</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">0</p>
              <p className="text-xs text-gray-400 font-medium mt-1">Ads or Tracking</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">∞</p>
              <p className="text-xs text-gray-400 font-medium mt-1">Transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            Everything You Need
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Smart Features, Zero Complexity
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group p-5 sm:p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 shadow-sm hover:shadow-md transition-all"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: f.color + "15", color: f.color }}
              >
                <f.icon size={22} />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">
                {f.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
            Get Started in Seconds
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Three Steps. That&apos;s It.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { step: "01", title: "Open Trackr", desc: "No download, no sign-up. Just open the link and you're ready.", icon: Globe },
            { step: "02", title: "Add Transactions", desc: "Log your income and expenses with amount, category & notes.", icon: CreditCard },
            { step: "03", title: "See Insights", desc: "Get beautiful charts, budget tracking, and spending patterns.", icon: BarChart2 },
          ].map((s) => (
            <div
              key={s.step}
              className="relative p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm"
            >
              <span className="text-4xl font-black text-gray-100 dark:text-gray-800 absolute top-5 right-5">
                {s.step}
              </span>
              <div className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-indigo-600 text-white flex items-center justify-center mb-4">
                <s.icon size={20} />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">
                {s.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-5 sm:px-8 py-8 border-t border-gray-200/60 dark:border-gray-800/60">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <TrackrLogoIcon size={22} />
            <span className="font-semibold">Trackr</span>
          </div>
          <p>
            Built with ❤️ ·{" "}
            <a
              href="https://github.com/prashantxbuilds"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              prashantxbuilds
            </a>
            {" "}· Your data never leaves your device
          </p>
        </div>
      </footer>
    </div>
  );
}
