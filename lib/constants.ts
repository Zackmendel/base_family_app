export const APP_NAME = "FamFunds";
export const APP_DESCRIPTION =
  "Collaborative family financial management platform";

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  EXPENSES: "/expenses",
  BUDGET: "/budget",
  SETTINGS: "/settings",
} as const;

export const API_ROUTES = {
  AUTH: "/api/auth",
  EXPENSES: "/api/expenses",
  BUDGET: "/api/budget",
  FAMILY: "/api/family",
} as const;

export const CATEGORY_COLORS = {
  food: "#f59e0b",
  transport: "#3b82f6",
  entertainment: "#8b5cf6",
  education: "#10b981",
  shopping: "#ec4899",
  utilities: "#6366f1",
  healthcare: "#ef4444",
  other: "#6b7280",
} as const;

export const ROLE_LABELS = {
  parent: "Parent",
  child: "Child",
  guardian: "Guardian",
} as const;

export const ROLE_COLORS = {
  parent: "text-blue-600 dark:text-blue-400",
  child: "text-purple-600 dark:text-purple-400",
  guardian: "text-green-600 dark:text-green-400",
} as const;
