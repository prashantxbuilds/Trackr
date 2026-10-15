import React from "react";

interface TrackrLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  className?: string;
}

export function TrackrLogoIcon({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center flex-shrink-0 rounded-2xl overflow-hidden shadow-sm select-none ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Background Gradient */}
          <linearGradient id="logoBgGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EFF6FF" />
            <stop offset="50%" stopColor="#EEF2FF" />
            <stop offset="100%" stopColor="#E0E7FF" />
          </linearGradient>

          {/* Wallet Gradient */}
          <linearGradient id="logoWalletGrad" x1="12" y1="26" x2="52" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          {/* Wallet Flap Gradient */}
          <linearGradient id="logoFlapGrad" x1="12" y1="33" x2="52" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>

          {/* Gold Coin Gradient */}
          <linearGradient id="logoCoinGrad" x1="33" y1="11" x2="49" y2="27" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Growth Arrow / Card Gradient */}
          <linearGradient id="logoChartGrad" x1="16" y1="13" x2="32" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* App Icon Squircle Background */}
        <rect width="64" height="64" rx="16" fill="url(#logoBgGrad)" />
        <rect width="64" height="64" rx="16" stroke="#C7D2FE" strokeWidth="1.2" />

        {/* Background Growth Chart Bars (Rising Tracker Bars) */}
        <rect x="17" y="24" width="4" height="10" rx="2" fill="#93C5FD" opacity="0.8" />
        <rect x="23" y="19" width="4" height="15" rx="2" fill="#60A5FA" opacity="0.9" />
        <rect x="29" y="14" width="4" height="20" rx="2" fill="url(#logoChartGrad)" />

        {/* Upward Trend Trendline Arrow */}
        <path d="M18 22 L25 17 L31 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 11.5 L32 11.5 L32 15.5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Cartoon Shiny Gold Coin */}
        <circle cx="43" cy="20" r="9" fill="url(#logoCoinGrad)" />
        <circle cx="43" cy="20" r="7.2" fill="none" stroke="#FEF08A" strokeWidth="1" opacity="0.8" />
        {/* Coin Center Star Symbol */}
        <path d="M43 16.5 L44.2 19 L46.8 19.4 L44.9 21.2 L45.4 23.8 L43 22.5 L40.6 23.8 L41.1 21.2 L39.2 19.4 L41.8 19 Z" fill="#FFFFFF" opacity="0.9" />
        {/* Coin Glossy Sparkle */}
        <circle cx="39.5" cy="16.5" r="1.3" fill="#FFFFFF" />

        {/* Front Cute Cartoon Wallet */}
        <rect x="11" y="29" width="42" height="25" rx="7" fill="url(#logoWalletGrad)" />
        <rect x="13" y="31" width="38" height="21" rx="5" fill="none" stroke="#60A5FA" strokeWidth="0.8" strokeDasharray="2 1.5" opacity="0.6" />

        {/* Front Pocket Cut */}
        <path d="M11 37 C20 40 44 35 53 38 L53 47 C53 50.8 49.8 54 46 54 L18 54 C14.2 54 11 50.8 11 47 Z" fill="url(#logoFlapGrad)" />

        {/* Wallet Fastener Clasp */}
        <rect x="36" y="38" width="16" height="9" rx="4.5" fill="#1E3A8A" />
        <circle cx="48" cy="42.5" r="3" fill="#FBBF24" />
        <circle cx="48" cy="42.5" r="1.8" fill="#F59E0B" />
        <circle cx="47.3" cy="41.8" r="0.8" fill="#FFFFFF" />

        {/* Cute Highlight Reflection on Wallet Corner */}
        <path d="M15 31.5 C13 31.5 12.5 33 12.5 35" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

        {/* Cute Magic Tracker Sparkles */}
        <path d="M11 17 C11 19 10 20 10 20 C10 20 11 21 11 23 C11 21 12 20 12 20 C12 20 11 19 11 17 Z" fill="#6366F1" />
        <circle cx="53" cy="13" r="1.2" fill="#F59E0B" />
      </svg>
    </div>
  );
}

export default function TrackrLogo({
  size = "md",
  showWordmark = true,
  className = "",
}: TrackrLogoProps) {
  const pixelSize = {
    sm: 34,
    md: 42,
    lg: 50,
    xl: 58,
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <TrackrLogoIcon size={pixelSize} />
      {showWordmark && (
        <div className="flex flex-col justify-center">
          <h1 className="font-extrabold text-base tracking-tight text-gray-900 dark:text-white leading-none">
            Trackr
          </h1>
          <span className="text-[11px] text-gray-400 font-medium mt-1">
            Expense & Budget
          </span>
        </div>
      )}
    </div>
  );
}
