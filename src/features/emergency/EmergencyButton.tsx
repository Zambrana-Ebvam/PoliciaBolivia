// EmergencyButton.tsx - CORREGIDO Y FUNCIONAL
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

type Props = { onPress: () => void };

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function EmergencyButton({ onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const ringScale = useRef(new Animated.Value(1)).current;
  const ringOpacity = useRef(new Animated.Value(0.3)).current;

  // Animaciones corregidas
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    const ringPulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ringScale, {
            toValue: 1.2,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    pulse.start();
    ringPulse.start();

    return () => {
      pulse.stop();
      ringPulse.stop();
    };
  }, []);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    onPress?.();
  };

  return (
    <View style={styles.wrap}>
      {/* Anillos concéntricos animados */}
      <Animated.View
        style={[
          styles.ring,
          {
            transform: [{ scale: ringScale }],
            opacity: ringOpacity,
          },
        ]}
      >
        <LinearGradient
          colors={["rgba(230,57,70,0.3)", "rgba(230,57,70,0)"]}
          style={styles.ringGrad}
        />
      </Animated.View>

      {/* Botón principal */}
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={[styles.buttonCore, { transform: [{ scale }] }]}
      >
        <LinearGradient
          colors={["#e63946", "#c1121f"]}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.buttonText}>SOS</Text>
          <View style={styles.buttonGlow} />
        </LinearGradient>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  ring: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
  },
  ringGrad: {
    flex: 1,
    borderRadius: 120,
  },
  buttonCore: {
    width: 200,
    height: 200,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  buttonGlow: {
    position: "absolute",
    width: "60%",
    height: "60%",
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.1)",
    top: "10%",
    left: "20%",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 3,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
});