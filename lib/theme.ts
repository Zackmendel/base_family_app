export const colors = {
  primary: {
    light: "#3b82f6",
    DEFAULT: "#2563eb",
    dark: "#1d4ed8",
  },
  secondary: {
    light: "#8b5cf6",
    DEFAULT: "#7c3aed",
    dark: "#6d28d9",
  },
  success: {
    light: "#10b981",
    DEFAULT: "#059669",
    dark: "#047857",
  },
  warning: {
    light: "#f59e0b",
    DEFAULT: "#d97706",
    dark: "#b45309",
  },
  error: {
    light: "#ef4444",
    DEFAULT: "#dc2626",
    dark: "#b91c1c",
  },
};

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
};

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
};
