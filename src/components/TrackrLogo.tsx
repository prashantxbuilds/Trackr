import React from "react";
import logoImg from "../assets/logo.png";

interface TrackrLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  className?: string;
}

export function TrackrLogoIcon({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center flex-shrink-0 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 ${className}`}
    >
      <img
        src={logoImg}
        alt="Trackr Logo"
        className="w-full h-full object-cover select-none pointer-events-none scale-105"
        onError={(e) => {
          // Fallback if image fails to load
          e.currentTarget.src = "/favicon.svg";
        }}
      />
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
