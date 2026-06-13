import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const { width, height } = Dimensions.get("window");

export default function LandingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setUserType } = useApp();

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

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.darkBg, paddingTop: topPad, paddingBottom: botPad },
      ]}
    >
      {/* Background accent circles */}
      <View
        style={[
          styles.bgCircle,
          { backgroundColor: colors.navy + "60", top: height * 0.05, left: -80 },
        ]}
      />
      <View
        style={[
          styles.bgCircle2,
          { backgroundColor: colors.teal + "20", bottom: height * 0.15, right: -60 },
        ]}
      />

      {/* Top section */}
      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          {/* House + Heart icon */}
          <View style={[styles.iconCircle, { backgroundColor: colors.navy }]}>
            <Ionicons name="home" size={32} color={colors.teal} />
            <View style={[styles.heartOverlay, { backgroundColor: colors.darkBg }]}>
              <Ionicons name="heart" size={14} color={colors.teal} />
            </View>
          </View>
          <Text style={[styles.logoText, { color: colors.foreground }]}>
            Go<Text style={{ color: colors.teal }}>Sitter</Text>
          </Text>
        </View>

        <Text style={[styles.tagline, { color: colors.foreground }]}>
          A university-verified sitter{"\n"}at your door in{" "}
          <Text style={{ color: colors.teal }}>30 minutes.</Text>
        </Text>

        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          Trusted by 4,000+ families in Victoria, BC
        </Text>
      </View>

      {/* Trust indicators */}
      <View style={styles.trustRow}>
        {[
          { icon: "shield-checkmark" as const, text: "Background Checked" },
          { icon: "school" as const, text: "University Verified" },
          { icon: "time" as const, text: "30-Min Arrival" },
        ].map((item) => (
          <View key={item.text} style={styles.trustItem}>
            <Ionicons name={item.icon} size={20} color={colors.teal} />
            <Text style={[styles.trustText, { color: colors.mutedForeground }]}>
              {item.text}
            </Text>
          </View>
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={handleParent}
          activeOpacity={0.85}
          style={[styles.primaryBtn, { backgroundColor: colors.teal }]}
        >
          <Ionicons name="calendar" size={20} color="#FFFFFF" />
          <Text style={styles.primaryBtnText}>Book a Sitter</Text>
          <Feather name="arrow-right" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSitter}
          activeOpacity={0.85}
          style={[
            styles.secondaryBtn,
            { backgroundColor: colors.cardBg, borderColor: colors.border },
          ]}
        >
          <Ionicons name="person" size={20} color={colors.foreground} />
          <Text style={[styles.secondaryBtnText, { color: colors.foreground }]}>
            I'm a Sitter
          </Text>
          <Feather name="arrow-right" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.footer, { color: colors.mutedForeground }]}>
        By continuing, you agree to our Terms & Privacy Policy
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  bgCircle: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  bgCircle2: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
  },
  topSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: "center",
    gap: 16,
    marginBottom: 8,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  heartOverlay: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 42,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 22,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
    lineHeight: 30,
  },
  sub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  trustRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 24,
  },
  trustItem: {
    alignItems: "center",
    gap: 6,
  },
  trustText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    maxWidth: 70,
  },
  buttonsContainer: {
    gap: 12,
    paddingBottom: 12,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },
  primaryBtnText: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  secondaryBtnText: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  footer: {
    fontSize: 11,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    paddingBottom: 8,
  },
});
