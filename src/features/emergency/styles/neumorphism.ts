// styles/neumorphism.ts
import { colors } from './themes';

export const neumorphism = {
  // Para fondos oscuros
  dark: {
    shadowDark: {
      shadowColor: "#000000",
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 12,
    },
    shadowLight: {
      shadowColor: "rgba(255,255,255,0.1)",
      shadowOffset: { width: -4, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
  },
  // Para botones y elementos prominentes
  prominent: {
    shadowDark: {
      shadowColor: "#000000",
      shadowOffset: { width: 8, height: 8 },
      shadowOpacity: 0.6,
      shadowRadius: 16,
      elevation: 16,
    },
    shadowLight: {
      shadowColor: "rgba(255,255,255,0.15)",
      shadowOffset: { width: -6, height: -6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
    },
  },
  // Efecto presionado
  pressed: {
    shadowDark: {
      shadowColor: "#000000",
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    shadowLight: {
      shadowColor: "rgba(255,255,255,0.05)",
      shadowOffset: { width: -1, height: -1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
  },
};