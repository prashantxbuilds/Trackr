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
          <linearGradient id="logoBgGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EFF6FF" />
            <stop offset="100%" stopColor="#DBEAFE" />
          </linearGradient>
          <linearGradient id="logoShirtGrad" x1="14" y1="47" x2="50" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="logoSkinGrad" x1="18" y1="18" x2="46" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="100%" stopColor="#FBBF8A" />
          </linearGradient>
        </defs>

        {/* Squircle rounded background */}
        <rect width="64" height="64" rx="16" fill="url(#logoBgGrad)" />
        <rect width="64" height="64" rx="16" stroke="#BFDBFE" strokeWidth="1" />

        {/* Body / Shirt */}
        <path d="M14 64 Q14 50 22 47 L32 50 L42 47 Q50 50 50 64 Z" fill="url(#logoShirtGrad)" />

        {/* Collar */}
        <path d="M28 47 L32 52 L36 47 L32 49 Z" fill="#FFFFFF" opacity="0.95" />

        {/* Neck */}
        <rect x="28" y="41" width="8" height="8" rx="2" fill="#FBBF8A" />

        {/* Head */}
        <ellipse cx="32" cy="32" rx="14" ry="14" fill="url(#logoSkinGrad)" />

        {/* Hair */}
        <path d="M18 28 Q18 16 32 16 Q46 16 46 28 Q46 20 42 18 Q36 14 28 15 Q20 16 18 28Z" fill="#1C1917" />
        <rect x="18" y="24" width="3" height="8" rx="1.5" fill="#1C1917" />
        <rect x="43" y="24" width="3" height="8" rx="1.5" fill="#1C1917" />

        {/* Ears */}
        <ellipse cx="18" cy="32" rx="2.5" ry="3" fill="#F6A96C" />
        <ellipse cx="46" cy="32" rx="2.5" ry="3" fill="#F6A96C" />

        {/* Eyebrows */}
        <path d="M23 25 Q26 23 29 25" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M35 25 Q38 23 41 25" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Eyes */}
        <ellipse cx="26" cy="29" rx="3.2" ry="3.2" fill="#FFFFFF" />
        <ellipse cx="38" cy="29" rx="3.2" ry="3.2" fill="#FFFFFF" />
        <circle cx="27" cy="29.5" r="2" fill="#1C1917" />
        <circle cx="39" cy="29.5" r="2" fill="#1C1917" />
        <circle cx="27.8" cy="28.5" r="0.75" fill="#FFFFFF" />
        <circle cx="39.8" cy="28.5" r="0.75" fill="#FFFFFF" />

        {/* Nose */}
        <path d="M31 33 Q32 35.5 33 33" stroke="#E8956A" strokeWidth="1.4" strokeLinecap="round" fill="none" />

        {/* Cheerful Smile */}
        <path d="M26 37 Q32 42 38 37" stroke="#C2714E" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Cheek blush */}
        <ellipse cx="21" cy="36" rx="3" ry="2" fill="#FCA5A5" opacity="0.6" />
        <ellipse cx="43" cy="36" rx="3" ry="2" fill="#FCA5A5" opacity="0.6" />
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
