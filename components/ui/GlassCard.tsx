// components/ui/GlassCard.tsx - CORREGIDO
import { BlurView } from "expo-blur";
import React, { PropsWithChildren } from "react";
import { StyleProp, ViewStyle } from "react-native";

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  tint?: "light" | "dark" | "default";
}>;

export default function GlassCard({ 
  children, 
  style, 
  intensity = 50, 
  tint = "dark"
}: Props) {
  return (
    <BlurView 
      intensity={intensity} 
      tint={tint} 
      style={[
        {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: 24,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.2)",
          overflow: "hidden" as const,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.25,
          shadowRadius: 20,
          elevation: 10,
        },
        style
      ]}
    >
      {children}
    </BlurView>
  );
}