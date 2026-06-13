import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MapWrapper, MapMarker } from "@/components/MapViewWrapper";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const CANCEL_REASONS = [
  "Plans changed",
  "Family emergency",
  "Sitter is too far",
  "Found another sitter",
  "Other",
];

function FakeMapWeb({ colors }: { colors: any }) {
  const dotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(dotAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const sitterY = dotAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -14] });

  return (
    <View style={[fakeStyles.container, { backgroundColor: colors.darkBg }]}>
      {/* Grid lines for map feel */}
      {[0, 1, 2, 3, 4].map((i) => (
        <View
          key={`h${i}`}
          style={[fakeStyles.hLine, { backgroundColor: colors.border + "55", top: `${i * 25}%` as any }]}
        />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <View
          key={`v${i}`}
          style={[fakeStyles.vLine, { backgroundColor: colors.border + "55", left: `${i * 25}%` as any }]}
        />
      ))}

      {/* Route line */}
      <View style={fakeStyles.routeContainer}>
        <View style={[fakeStyles.routeLine, { backgroundColor: colors.teal + "44" }]} />
        <View style={[fakeStyles.routeLineSolid, { backgroundColor: colors.teal }]} />
      </View>

      {/* Home pin */}
      <View style={fakeStyles.homePinContainer}>
        <View style={[fakeStyles.homePinOuter, { backgroundColor: colors.navy + "CC", borderColor: colors.teal }]}>
          <Ionicons name="home" size={18} color={colors.teal} />
        </View>
        <Text style={[fakeStyles.pinLabel, { color: colors.foreground }]}>Your Home</Text>
      </View>

      {/* Sitter pin (animated) */}
      <Animated.View style={[fakeStyles.sitterPinContainer, { transform: [{ translateY: sitterY }] }]}>
        <View style={[fakeStyles.sitterPinOuter, { backgroundColor: colors.teal, borderColor: "#FFFFFF" }]}>
          <Text style={fakeStyles.sitterPinText}>MC</Text>
        </View>
        <View style={[fakeStyles.sitterPinTail, { backgroundColor: colors.teal }]} />
        <Text style={[fakeStyles.pinLabel, { color: colors.foreground }]}>Maya</Text>
      </Animated.View>

      <Text style={[fakeStyles.mapNote, { color: colors.mutedForeground }]}>
        Live map · Sitter en route
      </Text>
    </View>
  );
}

const fakeStyles = StyleSheet.create({
  container: { flex: 1, position: "relative", overflow: "hidden" },
  hLine: { position: "absolute", left: 0, right: 0, height: 1 },
  vLine: { position: "absolute", top: 0, bottom: 0, width: 1 },
  routeContainer: {
    position: "absolute",
    left: "50%",
    top: "22%",
    bottom: "40%",
    width: 4,
    alignItems: "center",
    gap: 0,
  },
  routeLine: { flex: 1, width: 3, borderRadius: 2 },
  routeLineSolid: { height: "40%", width: 3, borderRadius: 2 },
  homePinContainer: { position: "absolute", bottom: "34%", left: "50%", alignItems: "center", marginLeft: -20 },
  homePinOuter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sitterPinContainer: {
    position: "absolute",
    top: "18%",
    left: "50%",
    alignItems: "center",
    marginLeft: -20,
  },
  sitterPinOuter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1D9E75",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  sitterPinText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  sitterPinTail: { width: 3, height: 8, borderRadius: 2, marginTop: -2 },
  pinLabel: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    marginTop: 4,
  },
  mapNote: { position: "absolute", bottom: 10, left: 0, right: 0, textAlign: "center", fontSize: 11, fontFamily: "Inter_400Regular" },
});

export default function EnRouteScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { bookingDraft } = useApp();

  const botPad = Platform.OS === "web" ? 34 : insets.bottom;
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const sitterName = bookingDraft?.sitterName ?? "Maya Chen";
  const sitterInitials = sitterName.split(" ").map((n) => n[0]).join("").slice(0, 2);

  const [etaSeconds, setEtaSeconds] = useState(8 * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setEtaSeconds((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const etaMin = Math.floor(etaSeconds / 60);
  const etaSec = etaSeconds % 60;
  const etaLabel =
    etaMin > 0
      ? `${etaMin} min${etaMin !== 1 ? "s" : ""}`
      : `${etaSec}s`;

  function handleCancel() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Cancel Booking",
      "Please tell us why you're cancelling:",
      [
        ...CANCEL_REASONS.map((reason) => ({
          text: reason,
          onPress: () => {
            Alert.alert(
              "Booking Cancelled",
              "Your booking has been cancelled. A refund will be issued within 3–5 business days.",
              [{ text: "OK", onPress: () => router.replace("/(tabs)") }]
            );
          },
        })),
        { text: "Never mind", style: "cancel" },
      ]
    );
  }

  const TORONTO = {
    latitude: 43.6532,
    longitude: -79.3832,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const parentCoord = { latitude: 43.6532, longitude: -79.3832 };
  const sitterCoord = { latitude: 43.6612, longitude: -79.3760 };

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      {/* Map section */}
      <View style={styles.mapSection}>
        {Platform.OS === "web" ? (
          <FakeMapWeb colors={colors} />
        ) : (
          <MapWrapper initialRegion={TORONTO} style={styles.map}>
            <MapMarker coordinate={parentCoord}>
              <View style={[styles.homePin, { backgroundColor: colors.navy, borderColor: colors.teal }]}>
                <Ionicons name="home" size={18} color={colors.teal} />
              </View>
            </MapMarker>
            <MapMarker coordinate={sitterCoord}>
              <View style={[styles.sitterPin, { backgroundColor: colors.teal }]}>
                <Text style={styles.sitterPinText}>{sitterInitials}</Text>
              </View>
            </MapMarker>
          </MapWrapper>
        )}

        {/* Back button overlay */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backOverlay, { top: topPad + 12, backgroundColor: colors.darkBg + "EE", borderColor: colors.border }]}
          activeOpacity={0.8}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      {/* Bottom card */}
      <View style={[styles.bottomCard, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        {/* ETA headline */}
        <View style={styles.etaSection}>
          <Text style={[styles.etaTitle, { color: colors.mutedForeground }]}>Arriving in</Text>
          <Text style={[styles.etaCountdown, { color: colors.teal }]}>{etaLabel}</Text>
          <View style={[styles.etaBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.etaProgress,
                {
                  backgroundColor: colors.teal,
                  width: `${Math.max(4, 100 - (etaSeconds / (8 * 60)) * 100)}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Sitter row */}
        <View style={[styles.sitterRow, { backgroundColor: colors.darkBg, borderColor: colors.border }]}>
          <View style={[styles.sitterAvatar, { backgroundColor: "#2563EB" }]}>
            <Text style={styles.sitterInitials}>{sitterInitials}</Text>
          </View>
          <View style={styles.sitterInfo}>
            <Text style={[styles.sitterName, { color: colors.foreground }]}>{sitterName}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color={colors.gold} />
              <Text style={[styles.ratingText, { color: colors.mutedForeground }]}>4.9 · UBC</Text>
            </View>
          </View>
          <View style={[styles.verifiedBadge, { backgroundColor: colors.teal + "22" }]}>
            <Ionicons name="shield-checkmark" size={16} color={colors.teal} />
            <Text style={[styles.verifiedText, { color: colors.teal }]}>Verified</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={[styles.btnRow, { paddingBottom: botPad + 8 }]}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/session/chat");
            }}
            activeOpacity={0.85}
            style={[styles.chatBtn, { backgroundColor: colors.teal }]}
          >
            <Ionicons name="chatbubble" size={18} color="#FFFFFF" />
            <Text style={styles.chatBtnText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCancel}
            activeOpacity={0.85}
            style={[styles.cancelBtn, { backgroundColor: colors.darkBg, borderColor: colors.border }]}
          >
            <Text style={[styles.cancelBtnText, { color: colors.mutedForeground }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapSection: { flex: 1, position: "relative" },
  map: { flex: 1 },
  backOverlay: {
    position: "absolute",
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  homePin: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  sitterPin: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  sitterPinText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  bottomCard: {
    borderTopWidth: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    gap: 16,
  },
  etaSection: { alignItems: "center", gap: 6 },
  etaTitle: { fontSize: 13, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 1 },
  etaCountdown: { fontSize: 48, fontWeight: "700" as const, fontFamily: "Inter_700Bold", lineHeight: 54 },
  etaBar: { width: "100%", height: 4, borderRadius: 2, overflow: "hidden" },
  etaProgress: { height: 4, borderRadius: 2 },
  sitterRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  sitterAvatar: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  sitterInitials: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  sitterInfo: { flex: 1 },
  sitterName: { fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 },
  ratingText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  verifiedBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  verifiedText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  btnRow: { flexDirection: "row", gap: 12 },
  chatBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  chatBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  cancelBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  cancelBtnText: { fontSize: 16, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
});
