// styles/themes.ts - CORREGIDO
export const colors = {
  primary: "#e63946",
  primaryLight: "#ff6b7a", 
  primaryDark: "#c1121f",
  background: "#0f1320",
  surface: "#141a2a",
  white: "#ffffff",
  black: "#000000",
  glass: "rgba(255,255,255,0.08)",
  textPrimary: "#ffffff",
  textSecondary: "rgba(255,255,255,0.7)",
  textTertiary: "rgba(255,255,255,0.5)",
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  title: {
    fontSize: 34,
    fontWeight: "800" as const,
    letterSpacing: 1.5,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600" as const,
    letterSpacing: 0.5,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: "500" as const,
    lineHeight: 22,
  },
  caption: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 18,
  },
};

export const borderRadius = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  round: 100,
};