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
