export const COLORS = {
  primary: "#1E90FF",
  secondary: "#FF7F50",
  background: "#F2F2F2",
  text: "#333333",
  white: "#FFFFFF",
  black: "#000000",

  gray100: "#F5F5F5",
  gray200: "#E0E0E0",
  gray300: "#C2C2C2",
  gray400: "#9E9E9E",
  gray500: "#757575",
  gray600: "#616161",

  success: "#4CAF50",
  warning: "#FFC107",
  error: "#F44336",
  disabled: "#AAB4BE",

  transparent: "transparent",
  bg: "#0d0d0f",
  surface: "#16161a",
  border: "#26262e",
  accent: "#a78bfa",
  accentSoft: "#a78bfa18",
  muted: "#6b6a7e",
  dim: "#3a3a46",
  green: "#34d399",
  greenSoft: "#34d39920",
  orange: "#fb923c",
  orangeSoft: "#fb923c20",
  danger: "#f87171",
  dangerSoft: "#f8717115",
} as const;

export type ColorKeys = keyof typeof COLORS;
export type ColorValue = (typeof COLORS)[ColorKeys];

export const habitColors = [
  "#FF5733",
  "#FFD700",
  "#5D76A9",
  "#1877F2",
  "#CCCCFF",
  "#4169E1",
];
