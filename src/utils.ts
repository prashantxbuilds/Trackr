export type CurrencyType = "INR" | "USD";

export function getCurrencySymbol(currency: CurrencyType = "INR"): string {
  return currency === "INR" ? "₹" : "$";
}

export function formatCurrency(amount: number, currency: CurrencyType = "INR"): string {
  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length < 3) return dateStr;
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function groupByDate<T extends { date: string }>(items: T[]): [string, T[]][] {
  const map: Record<string, T[]> = {};
  items.forEach((item) => {
    if (!map[item.date]) map[item.date] = [];
    map[item.date].push(item);
  });
  return Object.entries(map).sort(([a], [b]) => b.localeCompare(a));
}

export function currentMonth(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function getCurrentMonthName(): string {
  return new Date().toLocaleDateString("en-US", { month: "long" });
}

export function isDateInRange(dateStr: string, range: "week" | "month" | "3m" | "year" | "all"): boolean {
  if (range === "all") return true;
  const target = new Date(dateStr + "T00:00:00");
  const now = new Date();

  if (range === "week") {
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return target >= weekAgo && target <= now;
  }
  if (range === "month") {
    return dateStr.startsWith(currentMonth());
  }
  if (range === "3m") {
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    return target >= threeMonthsAgo && target <= now;
  }
  if (range === "year") {
    const yearAgo = new Date(now);
    yearAgo.setFullYear(now.getFullYear() - 1);
    return target >= yearAgo && target <= now;
  }
  return true;
}

export function getBarColor(pct: number): string {
  if (pct >= 100) return "#EF4444";
  if (pct >= 80) return "#F59E0B";
  return "#10B981";
}

export function generateId(prefix: string = ""): string {
  return (prefix ? `${prefix}_` : "") + Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

export function generateTransactionId(
  dateStr: string,
  existingTransactions: { date: string; id?: string }[] = []
): string {
  const parts = (dateStr || new Date().toISOString().slice(0, 10)).split("-");
  const yy = parts[0] ? parts[0].slice(-2) : String(new Date().getFullYear()).slice(-2);
  const mm = parts[1] || String(new Date().getMonth() + 1).padStart(2, "0");
  const dd = parts[2] || String(new Date().getDate()).padStart(2, "0");
  const dayPrefix = `T${yy}${mm}${dd}`;

  // Find highest existing sequence for this day if any
  let maxSeq = 0;
  existingTransactions.forEach((t) => {
    if (t.id && t.id.startsWith(dayPrefix)) {
      const numPart = parseInt(t.id.slice(dayPrefix.length), 10);
      if (!isNaN(numPart) && numPart > maxSeq) {
        maxSeq = numPart;
      }
    } else if (t.date === dateStr) {
      maxSeq++;
    }
  });

  const nextSeq = String(maxSeq + 1).padStart(2, "0");
  return `${dayPrefix}${nextSeq}`;
}

export function escapeCSV(val: string | number): string {
  const str = String(val ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function formatDateForExport(dateStr: string): string {
  if (!dateStr) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const parts = dateStr.split("-");
  if (parts.length < 3) return dateStr;
  const day = parts[2];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const year = parts[0];
  return `${day}-${months[monthIdx] || parts[1]}-${year}`;
}
