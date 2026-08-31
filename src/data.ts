export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  note: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget: number; // monthly budget limit (expenses only)
  forIncome?: boolean;
};

// Initial limited expense categories: food, transport, entertainment, shopping
export const EXPENSE_CATEGORIES: Category[] = [
  { id: "food", name: "Food & Dining", icon: "UtensilsCrossed", color: "#FF6B6B", budget: 0 },
  { id: "transport", name: "Transport", icon: "Car", color: "#4ECDC4", budget: 0 },
  { id: "entertainment", name: "Entertainment", icon: "Tv", color: "#F59E0B", budget: 0 },
  { id: "shopping", name: "Shopping", icon: "ShoppingBag", color: "#A78BFA", budget: 0 },
];

// Initial limited income categories: salary, gift
export const INCOME_CATEGORIES: Category[] = [
  { id: "salary", name: "Salary", icon: "Briefcase", color: "#10B981", budget: 0, forIncome: true },
  { id: "gift", name: "Gift", icon: "Gift", color: "#EC4899", budget: 0, forIncome: true },
];

// 100% clean initial state with zero demo transactions
export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const ICON_NAMES = [
  "UtensilsCrossed", "Car", "ShoppingBag", "Tv", "Heart", "Zap", "Home",
  "MoreHorizontal", "Briefcase", "Laptop", "TrendingUp", "Gift", "PlusCircle",
  "Coffee", "Plane", "Music", "Book", "Camera", "Dumbbell", "Package",
];

export const PRESET_COLORS = [
  "#FF6B6B", "#4ECDC4", "#A78BFA", "#F59E0B", "#34D399",
  "#60A5FA", "#F472B6", "#9CA3AF", "#10B981", "#6366F1",
  "#EC4899", "#EF4444", "#8B5CF6", "#06B6D4", "#84CC16",
];
