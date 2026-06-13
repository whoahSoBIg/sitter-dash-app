import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function LandingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setUserType } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  function handleParent() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setUserType("parent");
    router.replace("/(tabs)");
  }

  function handleSitter() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setUserType("sitter");
    router.replace("/sitter/dashboard");
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.darkBg }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 20, paddingBottom: botPad + 30 },
      ]}
      bounces={false}
    >
      {/* Logo */}
      <View style={styles.logoRow}>
        <View style={[styles.logoCircle, { backgroundColor: colors.navy }]}>
          <Ionicons name="home" size={32} color={colors.teal} />
          <Ionicons
            name="heart"
            size={14}
            color={colors.teal}
            style={styles.heartIcon}
          />
        </View>
      </View>

      {/* Hero */}
      <View style={styles.heroSection}>
        <Text style={[styles.logo, { color: colors.foreground }]}>
          Go<Text style={{ color: colors.teal }}>Sitter</Text>
        </Text>
        <Text style={[styles.tagline, { color: colors.foreground }]}>
          A university-verified sitter{"\n"}at your door in{" "}
          <Text style={{ color: colors.teal }}>30 minutes.</Text>
        </Text>

        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          Trusted by families across Canada
        </Text>
      </View>

      {/* Trust indicators */}
      <View style={styles.trustRow}>
        {[
          { icon: "shield-checkmark", label: "Background\nChecked" },
          { icon: "school", label: "University\nVerified" },
          { icon: "time", label: "30-Min\nArrival" },
        ].map((item) => (
          <View key={item.label} style={styles.trustItem}>
            <Ionicons name={item.icon as any} size={22} color={colors.teal} />
            <Text style={[styles.trustLabel, { color: colors.mutedForeground }]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      {/* City badge strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.cityScroll}
        contentContainerStyle={styles.cityContent}
      >
        {["Victoria", "Vancouver", "Calgary", "Toronto", "Ottawa", "Montréal", "Winnipeg", "Halifax", "Edmonton"].map((city) => (
          <View key={city} style={[styles.cityBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="location-outline" size={11} color={colors.teal} />
            <Text style={[styles.cityBadgeText, { color: colors.mutedForeground }]}>{city}</Text>
          </View>
        ))}
      </ScrollView>

      {/* CTA Buttons */}
      <View style={styles.btnGroup}>
        <TouchableOpacity
          onPress={handleParent}
          activeOpacity={0.85}
          style={[styles.btn, styles.btnPrimary, { backgroundColor: colors.teal }]}
        >
          <Ionicons name="calendar" size={20} color="#FFFFFF" />
          <Text style={styles.btnPrimaryText}>Book a Sitter</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSitter}
          activeOpacity={0.85}
          style={[
            styles.btn,
            styles.btnSecondary,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="person" size={20} color={colors.foreground} />
          <Text style={[styles.btnSecondaryText, { color: colors.foreground }]}>
            I'm a Sitter
          </Text>
          <Ionicons name="arrow-forward" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.legal, { color: colors.mutedForeground }]}>
        By continuing, you agree to our Terms & Privacy Policy
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 28,
    alignItems: "center",
    gap: 28,
  },
  logoRow: { alignItems: "center" },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  heartIcon: { position: "absolute", bottom: 14, right: 12 },
  heroSection: { alignItems: "center", gap: 10 },
  logo: {
    fontSize: 48,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 22,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
    lineHeight: 32,
  },
  sub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  trustRow: {
    flexDirection: "row",
    gap: 28,
    justifyContent: "center",
  },
  trustItem: { alignItems: "center", gap: 6 },
  trustLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    lineHeight: 16,
  },
  cityScroll: { alignSelf: "stretch" },
  cityContent: {
    gap: 8,
    paddingHorizontal: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  cityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  cityBadgeText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  btnGroup: { gap: 12, alignSelf: "stretch" },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 16,
    gap: 10,
  },
  btnPrimary: {},
  btnPrimaryText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    flex: 1,
    textAlign: "center",
  },
  btnSecondary: { borderWidth: 1 },
  btnSecondaryText: {
    fontSize: 17,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
    flex: 1,
    textAlign: "center",
  },
  legal: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
