// styles.ts
import { StyleSheet, Dimensions } from "react-native";
import { colors, spacing, typography, borderRadius } from "../../features/emergency/styles/themes";
import { neumorphism } from "../../features/emergency/styles/neumorphism";

const { width, height } = Dimensions.get("window");

export const emergencyStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: height * 0.05,
    paddingBottom: spacing.xl,
  },
  backgroundPattern: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    opacity: 0.03,
    backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.3) 2%, transparent 40%)`,
    backgroundSize: "50px 50px",
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  headerTitle: {
    ...typography.title,
    color: colors.white,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.subtitle,
    color: colors.primaryLight,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  headerDesc: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: 300,
    lineHeight: 22,
  },
  buttonSection: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.xl,
    minHeight: 300,
  },
  buttonCore: {
    width: 200,
    height: 200,
    borderRadius: borderRadius.round,
    ...neumorphism.prominent.shadowDark,
    ...neumorphism.prominent.shadowLight,
  },
  buttonGradient: {
    width: "100%",
    height: "100%",
    borderRadius: borderRadius.round,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  buttonGlow: {
    position: "absolute",
    width: "60%",
    height: "60%",
    borderRadius: borderRadius.round,
    backgroundColor: "rgba(255,255,255,0.1)",
    top: "10%",
    left: "20%",
  },
  buttonText: {
    color: colors.white,
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 3,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  infoSection: {
    alignItems: "center",
    gap: spacing.md,
  },
  infoCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    width: "100%",
  },
  infoTitle: {
    ...typography.subtitle,
    color: colors.white,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  infoText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  tipCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    width: "100%",
  },
  tipText: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: "center",
    fontStyle: "italic",
  },
});