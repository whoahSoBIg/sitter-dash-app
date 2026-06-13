import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp, SessionStatus } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type StatusStep = {
  key: SessionStatus;
  label: string;
  icon: string;
  description: string;
};

const STEPS: StatusStep[] = [
  { key: "booking_sent", label: "Booking Sent", icon: "paper-plane-outline", description: "Waiting for sitter to respond..." },
  { key: "sitter_accepted", label: "Sitter Accepted", icon: "checkmark-circle-outline", description: "Maya has accepted your booking!" },
  { key: "sitter_en_route", label: "Sitter En Route", icon: "navigate-outline", description: "Maya is on her way — ETA 8 mins" },
  { key: "sitter_arrived", label: "Sitter Arrived", icon: "location-outline", description: "Maya has arrived at your address" },
  { key: "session_active", label: "Session Active", icon: "radio-button-on", description: "Your children are in safe hands" },
  { key: "complete", label: "Session Complete", icon: "checkmark-done-circle-outline", description: "Great session! Rate your experience" },
];

const STATUS_ORDER: SessionStatus[] = [
  "booking_sent",
  "sitter_accepted",
  "sitter_en_route",
  "sitter_arrived",
  "session_active",
  "complete",
];

export default function LiveSessionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { sessionStatus, setSessionStatus, bookingDraft } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const currentIndex = STATUS_ORDER.indexOf(sessionStatus === "idle" ? "booking_sent" : sessionStatus);

  // Auto-advance for demo
  useEffect(() => {
    if (sessionStatus === "complete" || sessionStatus === "idle") return;
    const timer = setTimeout(() => {
      const next = STATUS_ORDER[currentIndex + 1];
      if (next) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setSessionStatus(next);
      }
    }, 3500);
    return () => clearTimeout(timer);
  }, [sessionStatus, currentIndex]);

  function handleComplete() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSessionStatus("idle");
    router.replace("/ratings");
  }

  const currentStep = STEPS[currentIndex] ?? STEPS[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          activeOpacity={0.8}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Live Session</Text>
        <TouchableOpacity
          onPress={() => router.push("/emergency")}
          style={[styles.emergencyBtn, { backgroundColor: "#EF444422", borderColor: "#EF444444" }]}
          activeOpacity={0.8}
        >
          <Ionicons name="warning" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 30 }]}
      >
        {/* Status card */}
        <View
          style={[
            styles.statusCard,
            {
              backgroundColor:
                sessionStatus === "session_active" ? colors.teal + "22" : colors.card,
              borderColor:
                sessionStatus === "session_active" ? colors.teal : colors.border,
            },
          ]}
        >
          <View style={[styles.statusIconCircle, { backgroundColor: colors.teal + "33" }]}>
            <Ionicons name={currentStep.icon as any} size={32} color={colors.teal} />
          </View>
          <Text style={[styles.statusLabel, { color: colors.teal }]}>{currentStep.label}</Text>
          <Text style={[styles.statusDesc, { color: colors.mutedForeground }]}>
            {currentStep.description}
          </Text>

          {sessionStatus !== "complete" && (
            <View style={styles.pulseRow}>
              <View style={[styles.pulseDot, { backgroundColor: colors.teal }]} />
              <Text style={[styles.pulseText, { color: colors.mutedForeground }]}>
                Live tracking active
              </Text>
            </View>
          )}
        </View>

        {/* Sitter info + action buttons */}
        {bookingDraft && (
          <View
            style={[
              styles.sitterRow,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.sitterAvatar, { backgroundColor: "#2563EB" }]}>
              <Text style={styles.sitterInitials}>MC</Text>
            </View>
            <View style={styles.sitterInfo}>
              <Text style={[styles.sitterName, { color: colors.foreground }]}>
                {bookingDraft.sitterName}
              </Text>
              <Text style={[styles.sitterSub, { color: colors.mutedForeground }]}>
                Harvard University · 4.9 ★
              </Text>
            </View>

            {/* Chat button — prominent */}
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/session/chat");
              }}
              style={[styles.chatBtn, { backgroundColor: colors.teal }]}
              activeOpacity={0.85}
            >
              <Ionicons name="chatbubble" size={16} color="#FFFFFF" />
              <Text style={styles.chatBtnText}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.iconBtn,
                { backgroundColor: colors.muted, borderColor: colors.border },
              ]}
              activeOpacity={0.8}
            >
              <Ionicons name="call" size={18} color={colors.foreground} />
            </TouchableOpacity>
          </View>
        )}

        {/* Timeline */}
        <View style={styles.timelineSection}>
          <Text style={[styles.timelineTitle, { color: colors.foreground }]}>
            Session Timeline
          </Text>
          {STEPS.map((step, i) => {
            const done = i < currentIndex;
            const current = i === currentIndex;
            const future = i > currentIndex;
            return (
              <View key={step.key} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.timelineDot,
                      {
                        backgroundColor: done || current ? colors.teal : colors.border,
                        borderColor: current ? colors.teal : "transparent",
                        borderWidth: current ? 3 : 0,
                        width: current ? 18 : 14,
                        height: current ? 18 : 14,
                        borderRadius: current ? 9 : 7,
                      },
                    ]}
                  />
                  {i < STEPS.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        { backgroundColor: done ? colors.teal : colors.border },
                      ]}
                    />
                  )}
                </View>
                <View style={[styles.timelineContent, { opacity: future ? 0.4 : 1 }]}>
                  <Text
                    style={[
                      styles.timelineLabel,
                      { color: current ? colors.teal : colors.foreground },
                    ]}
                  >
                    {step.label}
                  </Text>
                  {(done || current) && (
                    <Text style={[styles.timelineDesc, { color: colors.mutedForeground }]}>
                      {step.description}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Photo check-in */}
        {(sessionStatus === "session_active" || sessionStatus === "sitter_arrived") && (
          <View
            style={[
              styles.photoCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.photoIconCircle, { backgroundColor: colors.teal + "22" }]}>
              <Ionicons name="camera" size={20} color={colors.teal} />
            </View>
            <View style={styles.photoInfo}>
              <Text style={[styles.photoTitle, { color: colors.foreground }]}>
                Hourly Photo Check-In
              </Text>
              <Text style={[styles.photoDesc, { color: colors.mutedForeground }]}>
                Maya will send a photo update every hour. Next check-in in 42 minutes.
              </Text>
            </View>
          </View>
        )}

        {/* Chat preview card — nudge to open chat */}
        {currentIndex >= 1 && sessionStatus !== "complete" && (
          <TouchableOpacity
            onPress={() => {
              Haptics.selectionAsync();
              router.push("/session/chat");
            }}
            activeOpacity={0.85}
            style={[
              styles.chatPreviewCard,
              { backgroundColor: colors.card, borderColor: colors.teal + "55" },
            ]}
          >
            <View style={[styles.chatPreviewLeft, { backgroundColor: "#2563EB" }]}>
              <Text style={styles.chatPreviewInitials}>MC</Text>
            </View>
            <View style={styles.chatPreviewInfo}>
              <Text style={[styles.chatPreviewName, { color: colors.foreground }]}>
                {bookingDraft?.sitterName ?? "Maya Chen"}
              </Text>
              <Text style={[styles.chatPreviewMsg, { color: colors.mutedForeground }]}>
                Tap to open session chat →
              </Text>
            </View>
            <View style={[styles.chatBadge, { backgroundColor: colors.teal }]}>
              <Ionicons name="chatbubble-ellipses" size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        )}

        {/* Complete session */}
        {sessionStatus === "complete" && (
          <TouchableOpacity
            onPress={handleComplete}
            activeOpacity={0.85}
            style={[styles.rateBtn, { backgroundColor: colors.teal }]}
          >
            <Ionicons name="star" size={20} color="#FFFFFF" />
            <Text style={styles.rateBtnText}>Rate Your Session</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  emergencyBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { paddingHorizontal: 20, gap: 16 },
  statusCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    gap: 10,
  },
  statusIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 22,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  statusDesc: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  pulseRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  pulseDot: { width: 8, height: 8, borderRadius: 4 },
  pulseText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  sitterRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  sitterAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  sitterInitials: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  sitterInfo: { flex: 1 },
  sitterName: {
    fontSize: 16,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  sitterSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  chatBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },
  chatBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineSection: { gap: 0 },
  timelineTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    marginBottom: 16,
  },
  timelineRow: { flexDirection: "row", gap: 12, marginBottom: 4 },
  timelineLeft: { alignItems: "center", width: 20 },
  timelineDot: {},
  timelineLine: {
    flex: 1,
    width: 2,
    marginTop: 4,
    marginBottom: 0,
    minHeight: 28,
  },
  timelineContent: { flex: 1, paddingBottom: 20 },
  timelineLabel: {
    fontSize: 15,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  timelineDesc: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  photoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  photoIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  photoInfo: { flex: 1, gap: 4 },
  photoTitle: {
    fontSize: 15,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  photoDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  chatPreviewCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  chatPreviewLeft: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  chatPreviewInitials: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  chatPreviewInfo: { flex: 1 },
  chatPreviewName: {
    fontSize: 15,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  chatPreviewMsg: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  chatBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  rateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  rateBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
});
