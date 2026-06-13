import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MapWrapper, MapMarker } from "@/components/MapViewWrapper";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { SITTERS } from "@/data/sitters";

export default function LiveSessionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { selectedCity } = useApp();
  const sitter = SITTERS.find((s) => s.cityId === selectedCity.id) ?? SITTERS[0];
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState<"enroute" | "arrived" | "sitting">("enroute");

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("arrived"), 8000);
    const t2 = setTimeout(() => setPhase("sitting"), 16000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const phaseColor = phase === "enroute" ? "#3B82F6" : phase === "arrived" ? colors.teal : "#8B5CF6";
  const phaseLabel = phase === "enroute" ? "En Route" : phase === "arrived" ? "Arrived" : "Sitting Now";
  const phaseIcon = phase === "enroute" ? "car" : phase === "arrived" ? "checkmark-circle" : "happy";

  const region = {
    latitude: selectedCity.coordinate.latitude,
    longitude: selectedCity.coordinate.longitude,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      <MapWrapper style={styles.map} initialRegion={region} showsUserLocation userInterfaceStyle="dark">
        <MapMarker coordinate={sitter.coordinate}>
          <View style={[styles.sitterMarker, { backgroundColor: sitter.avatarColor }]}>
            <Text style={styles.markerText}>{sitter.initials}</Text>
          </View>
        </MapMarker>
      </MapWrapper>

      <View style={[styles.topBar, { paddingTop: (Platform.OS === "web" ? 67 : insets.top) + 8 }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.card + "DD", borderColor: colors.border }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View style={[styles.phasePill, { backgroundColor: phaseColor + "22", borderColor: phaseColor + "55" }]}>
          <Ionicons name={phaseIcon as any} size={14} color={phaseColor} />
          <Text style={[styles.phaseText, { color: phaseColor }]}>{phaseLabel}</Text>
        </View>
      </View>

      <View style={[styles.bottomCard, { backgroundColor: colors.card, borderColor: colors.border, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.sitterRow}>
          <View style={[styles.avatar, { backgroundColor: sitter.avatarColor }]}>
            <Text style={styles.avatarText}>{sitter.initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sitterName, { color: colors.foreground }]}>{sitter.name}</Text>
            <Text style={[styles.sitterSub, { color: colors.mutedForeground }]}>
              ★ {sitter.rating} · {sitter.neighbourhood}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.chatBtn, { backgroundColor: colors.teal + "22", borderColor: colors.teal + "44" }]}
            onPress={() => router.push(`/chat/${sitter.id}`)}
          >
            <Ionicons name="chatbubble-ellipses" size={18} color={colors.teal} />
          </TouchableOpacity>
        </View>

        <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
          <View style={styles.stat}>
            <Text style={[styles.statVal, { color: colors.foreground }]}>{elapsed}h {0}m</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Elapsed</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statVal, { color: colors.teal }]}>${(sitter.ratePerHour * (elapsed / 60 || 0.1)).toFixed(2)}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Running total</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statVal, { color: colors.foreground }]}>${sitter.ratePerHour}/h</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Rate</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.endBtn, { backgroundColor: "#EF444422", borderColor: "#EF444444" }]}
          activeOpacity={0.85}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.replace("/ratings");
          }}
        >
          <Ionicons name="stop-circle" size={18} color="#EF4444" />
          <Text style={[styles.endBtnText, { color: "#EF4444" }]}>End Session</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  topBar: {
    position: "absolute", top: 0, left: 0, right: 0,
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", paddingHorizontal: 20, gap: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  phasePill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1,
  },
  phaseText: { fontSize: 13, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  bottomCard: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderWidth: 1, padding: 20, gap: 16,
  },
  sitterRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: 16, fontWeight: "700", fontFamily: "Inter_700Bold" },
  sitterName: { fontSize: 17, fontWeight: "700", fontFamily: "Inter_700Bold" },
  sitterSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  chatBtn: {
    width: 42, height: 42, borderRadius: 12, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row", borderTopWidth: 1, paddingTop: 16, gap: 0,
  },
  stat: { flex: 1, alignItems: "center", gap: 4 },
  statVal: { fontSize: 17, fontWeight: "700", fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  statDivider: { width: 1, marginVertical: 4 },
  endBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 14, borderRadius: 14, borderWidth: 1,
  },
  endBtnText: { fontSize: 15, fontWeight: "700", fontFamily: "Inter_700Bold" },
  sitterMarker: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#fff",
  },
  markerText: { color: "#fff", fontSize: 14, fontWeight: "700", fontFamily: "Inter_700Bold" },
});
