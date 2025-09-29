// EmergencyScreen.tsx - CORREGIDO
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Alert, Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import GlassCard from "../../../components/ui/GlassCard";
import EmergencyButton from "./EmergencyButton";

const { height } = Dimensions.get("window");

export default function EmergencyScreen() {
  const sendAlert = () => {
    Alert.alert(
      "🚨 Señal de Emergencia Enviada", 
      "Las autoridades han sido notificadas. Mantén la calma y espera instrucciones.",
      [{ text: "Entendido", style: "default" }]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Fondo con gradiente */}
      <LinearGradient
        colors={["#0f172a", "#1e1b4b", "#0f172a"]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Emergencia</Text>
          <Text style={styles.headerSubtitle}>Botón de Auxilio</Text>
          <Text style={styles.headerDesc}>
            Presiona el botón en caso de emergencia para alertar a las autoridades
          </Text>
        </View>

        <View style={styles.buttonSection}>
          <EmergencyButton onPress={sendAlert} />
        </View>

        <View style={styles.infoSection}>
          <GlassCard style={styles.infoCard}>
            <Text style={styles.infoTitle}>¿Qué sucede al presionar?</Text>
            <Text style={styles.infoText}>
              • Se envía tu ubicación en tiempo real{"\n"}
              • Se notifica a las autoridades cercanas{"\n"}
              • Se activa el protocolo de emergencia{"\n"}
              • Recibirás confirmación inmediata
            </Text>
          </GlassCard>

          <GlassCard style={styles.tipCard}>
            <Text style={styles.tipText}>
              💡 Mantén la calma y espera en un lugar seguro hasta que llegue la ayuda
            </Text>
          </GlassCard>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ff6b7a",
    textAlign: "center",
    marginBottom: 12,
  },
  headerDesc: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    maxWidth: 300,
    lineHeight: 22,
  },
  buttonSection: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32,
    minHeight: 300,
  },
  infoSection: {
    alignItems: "center",
    gap: 16,
  },
  infoCard: {
    padding: 24,
    borderRadius: 24,
    width: "100%",
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 16,
    textAlign: "center",
  },
  infoText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 22,
  },
  tipCard: {
    padding: 16,
    borderRadius: 18,
    width: "100%",
  },
  tipText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    fontStyle: "italic",
  },
});