import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

export default function EmergencyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [activated, setActivated] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  function startHold() {
    if (activated) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setCountdown(3);

    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.08, duration: 400, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ])
    ).start();

    let c = 3;
    intervalRef.current = setInterval(() => {
      c -= 1;
      if (c <= 0) {
        clearInterval(intervalRef.current!);
        setCountdown(null);
        triggerEmergency();
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setCountdown(c);
      }
    }, 1000);
  }

  function cancelHold() {
    if (activated) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
    scaleAnim.stopAnimation();
    Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    setCountdown(null);
  }

  function triggerEmergency() {
    setActivated(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Alert.alert(
      "Emergency Alert Sent",
      "Your parent has been notified with your GPS location. Do you need to call 911?",
      [
        { text: "No, I'm OK", onPress: () => setActivated(false) },
        { text: "Call 911", style: "destructive", onPress: () => {
          Alert.alert("Calling 911", "In a real emergency, call 911 immediately.");
          setActivated(false);
        }},
      ]
    );
  }

  return (
    <View style={[styles.container, { paddingTop: topPad, paddingBottom: botPad }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: "#2A0A0A", borderColor: "#5A1A1A" }]}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Ionicons name="warning" size={48} color="#EF4444" />
        <Text style={styles.title}>Emergency Button</Text>
        <Text style={styles.subtitle}>
          Hold the button below for 3 seconds to alert the parent with your GPS location and prompt a 911 call.
        </Text>

        {/* Big hold button */}
        <Animated.View style={[styles.buttonWrapper, { transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity
            onPressIn={startHold}
            onPressOut={cancelHold}
            activeOpacity={1}
            style={[
              styles.emergencyButton,
              { backgroundColor: activated ? "#7F1D1D" : "#EF4444" },
            ]}
          >
            {countdown !== null ? (
              <Text style={styles.countdown}>{countdown}</Text>
            ) : (
              <>
                <Ionicons name="warning" size={40} color="#FFFFFF" />
                <Text style={styles.btnLabel}>HOLD TO ACTIVATE</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        {countdown !== null && (
          <Text style={styles.holdingText}>Keep holding... {countdown}</Text>
        )}

        <View style={styles.infoCards}>
          {[
            { icon: "location", text: "GPS location shared with parent" },
            { icon: "notifications", text: "Instant alert sent to parent" },
            { icon: "call", text: "Option to call 911 immediately" },
          ].map((item) => (
            <View key={item.text} style={[styles.infoCard, { backgroundColor: "#2A0A0A", borderColor: "#5A1A1A" }]}>
              <Ionicons name={item.icon as any} size={18} color="#EF4444" />
              <Text style={styles.infoText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0000",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "#FF9999",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  buttonWrapper: {
    marginVertical: 20,
  },
  emergencyButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
  },
  countdown: {
    fontSize: 72,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },
  btnLabel: {
    fontSize: 12,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  holdingText: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#EF4444",
    marginTop: -8,
  },
  infoCards: { gap: 8, width: "100%" },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  infoText: {
    color: "#FFAAAA",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
});
