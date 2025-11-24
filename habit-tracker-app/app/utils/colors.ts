export const COLORS = {
  primary: "#1E90FF",
  secondary: "#FF7F50",
  background: "#F2F2F2",
  text: "#333333",
  white: "#FFFFFF",
  black: "#000000",

  // Grays
  gray100: "#F5F5F5",
  gray200: "#E0E0E0",
  gray300: "#C2C2C2",
  gray400: "#9E9E9E",
  gray500: "#757575",
  gray600: "#616161",

  // Status
  success: "#4CAF50",
  warning: "#FFC107",
  error: "#F44336",
  disabled: "#AAB4BE",

  // Transparent
  transparent: "transparent",
}as const;

export type ColorKeys = keyof typeof Colors;
export type ColorValue = (typeof Colors)[ColorKeys];

