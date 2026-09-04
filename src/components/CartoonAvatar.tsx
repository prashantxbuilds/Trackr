interface CartoonAvatarProps {
  name?: string;
  size?: number;
  className?: string;
}

export default function CartoonAvatar({ size = 40, className = "" }: CartoonAvatarProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`flex-shrink-0 overflow-hidden rounded-2xl select-none ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect width="64" height="64" rx="16" fill="#EFF6FF" />

        {/* Body / Shirt */}
        <path
          d="M14 64 Q14 50 22 47 L32 50 L42 47 Q50 50 50 64 Z"
          fill="#3B82F6"
        />

        {/* Collar */}
        <path d="M28 47 L32 52 L36 47 L32 49 Z" fill="white" opacity="0.9" />

        {/* Neck */}
        <rect x="28" y="41" width="8" height="8" rx="2" fill="#FBBF8A" />

        {/* Head */}
        <ellipse cx="32" cy="32" rx="14" ry="14" fill="#FBBF8A" />

        {/* Hair */}
        <path
          d="M18 28 Q18 16 32 16 Q46 16 46 28 Q46 20 42 18 Q36 14 28 15 Q20 16 18 28Z"
          fill="#1C1917"
        />
        {/* Side hair / ears area */}
        <rect x="18" y="24" width="3" height="8" rx="1.5" fill="#1C1917" />
        <rect x="43" y="24" width="3" height="8" rx="1.5" fill="#1C1917" />

        {/* Ears */}
        <ellipse cx="18" cy="32" rx="2.5" ry="3" fill="#F6A96C" />
        <ellipse cx="46" cy="32" rx="2.5" ry="3" fill="#F6A96C" />

        {/* Eyebrows */}
        <path d="M23 25 Q26 23 29 25" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M35 25 Q38 23 41 25" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Eyes */}
        <ellipse cx="26" cy="29" rx="3.2" ry="3.2" fill="white" />
        <ellipse cx="38" cy="29" rx="3.2" ry="3.2" fill="white" />
        <circle cx="27" cy="29.5" r="2" fill="#1C1917" />
        <circle cx="39" cy="29.5" r="2" fill="#1C1917" />
        {/* Eye shine */}
        <circle cx="27.8" cy="28.5" r="0.7" fill="white" />
        <circle cx="39.8" cy="28.5" r="0.7" fill="white" />

        {/* Nose */}
        <path d="M31 33 Q32 35.5 33 33" stroke="#E8956A" strokeWidth="1.4" strokeLinecap="round" fill="none" />

        {/* Smile */}
        <path
          d="M26 37 Q32 42 38 37"
          stroke="#C2714E"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cheek blush */}
        <ellipse cx="21" cy="36" rx="3" ry="2" fill="#FCA5A5" opacity="0.45" />
        <ellipse cx="43" cy="36" rx="3" ry="2" fill="#FCA5A5" opacity="0.45" />
      </svg>
    </div>
  );
}
