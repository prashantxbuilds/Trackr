import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  INITIAL_TRANSACTIONS,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  type Transaction,
  type Category,
  type TransactionType,
} from "../data";
import { generateId, type CurrencyType } from "../utils";

const STORAGE_KEYS = {
  TRANSACTIONS: "expense_tracker_transactions_v4",
  EXPENSE_CATS: "expense_tracker_expense_cats_v4",
  INCOME_CATS: "expense_tracker_income_cats_v4",
  DARK_MODE: "expense_tracker_dark_mode_v4",
  CURRENCY: "expense_tracker_currency_v4",
  USER: "expense_tracker_user_v4",
};

export type UserProfile = {
  name: string;
  email: string;
};

type AppState = {
  transactions: Transaction[];
  expenseCategories: Category[];
  incomeCategories: Category[];
  darkMode: boolean;
  currency: CurrencyType;
  user: UserProfile | null;
};

type AppContextValue = AppState & {
  addTransaction: (t: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (cat: Omit<Category, "id">, type: TransactionType) => void;
  deleteCategory: (id: string, type: TransactionType) => void;
  updateCategoryBudget: (id: string, budget: number) => void;
  setDarkMode: (v: boolean) => void;
  setCurrency: (c: CurrencyType) => void;
  setUser: (u: UserProfile | null) => void;
  login: (u: UserProfile) => void;
  logout: () => void;
  resetAllData: () => void;
  getCategoryById: (id: string) => Category | undefined;
};

const AppContext = createContext<AppContextValue | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

const DEFAULT_USER: UserProfile = {
  name: "Guest",
  email: "guest@trackr.app",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadFromStorage(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS)
  );
  const [expenseCategories, setExpenseCategories] = useState<Category[]>(() =>
    loadFromStorage(STORAGE_KEYS.EXPENSE_CATS, EXPENSE_CATEGORIES)
  );
  const [incomeCategories, setIncomeCategories] = useState<Category[]>(() =>
    loadFromStorage(STORAGE_KEYS.INCOME_CATS, INCOME_CATEGORIES)
  );
  const [currency, setCurrencyState] = useState<CurrencyType>(() =>
    loadFromStorage<CurrencyType>(STORAGE_KEYS.CURRENCY, "INR")
  );
  const [user, setUserState] = useState<UserProfile | null>(() =>
    loadFromStorage<UserProfile | null>(STORAGE_KEYS.USER, DEFAULT_USER)
  );
  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    const saved = loadFromStorage<boolean | null>(STORAGE_KEYS.DARK_MODE, null);
    if (saved !== null) return saved;
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Sync dark class on root document
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode));
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch {
      // ignore storage errors
    }
  }, [darkMode]);

  // Sync user to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch {
      // ignore
    }
  }, [user]);

  // Sync currency to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENCY, JSON.stringify(currency));
    } catch {
      // ignore
    }
  }, [currency]);

  // Sync transactions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch {
      // ignore
    }
  }, [transactions]);

  // Sync categories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSE_CATS, JSON.stringify(expenseCategories));
      localStorage.setItem(STORAGE_KEYS.INCOME_CATS, JSON.stringify(incomeCategories));
    } catch {
      // ignore
    }
  }, [expenseCategories, incomeCategories]);

  const addTransaction = useCallback((t: Omit<Transaction, "id">) => {
    const newTx: Transaction = { ...t, id: generateId("tx") };
    setTransactions((prev) => [newTx, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addCategory = useCallback((cat: Omit<Category, "id">, type: TransactionType) => {
    const newCat: Category = { ...cat, id: generateId("cat") };
    if (type === "expense") {
      setExpenseCategories((prev) => [...prev, newCat]);
    } else {
      setIncomeCategories((prev) => [...prev, newCat]);
    }
  }, []);

  const deleteCategory = useCallback((id: string, type: TransactionType) => {
    if (type === "expense") {
      setExpenseCategories((prev) => prev.filter((c) => c.id !== id));
    } else {
      setIncomeCategories((prev) => prev.filter((c) => c.id !== id));
    }
  }, []);

  const updateCategoryBudget = useCallback((id: string, budget: number) => {
    setExpenseCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, budget } : c))
    );
  }, []);

  const setDarkMode = useCallback((v: boolean) => {
    setDarkModeState(v);
  }, []);

  const setCurrency = useCallback((c: CurrencyType) => {
    setCurrencyState(c);
  }, []);

  const setUser = useCallback((u: UserProfile | null) => {
    setUserState(u);
  }, []);

  const login = useCallback((u: UserProfile) => {
    setUserState(u);
  }, []);

  const logout = useCallback(() => {
    setUserState(null);
  }, []);

  const resetAllData = useCallback(() => {
    setTransactions([]);
    setExpenseCategories(EXPENSE_CATEGORIES);
    setIncomeCategories(INCOME_CATEGORIES);
    setCurrencyState("INR");
    setUserState(DEFAULT_USER);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.EXPENSE_CATS);
    localStorage.removeItem(STORAGE_KEYS.INCOME_CATS);
    localStorage.removeItem(STORAGE_KEYS.CURRENCY);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }, []);

  const getCategoryById = useCallback(
    (id: string) => {
      return [...expenseCategories, ...incomeCategories].find((c) => c.id === id);
    },
    [expenseCategories, incomeCategories]
  );

  return (
    <AppContext.Provider
      value={{
        transactions,
        expenseCategories,
        incomeCategories,
        darkMode,
        currency,
        user,
        addTransaction,
        deleteTransaction,
        addCategory,
        deleteCategory,
        updateCategoryBudget,
        setDarkMode,
        setCurrency,
        setUser,
        login,
        logout,
        resetAllData,
        getCategoryById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
