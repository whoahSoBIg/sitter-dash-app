import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BookingProgress } from "@/components/BookingProgress";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const DURATIONS = [1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8];

export default function BookingStep2() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { bookingDraft, setBookingDraft } = useApp();

  const [durationHours, setDurationHours] = useState(3);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const rate = bookingDraft?.sitterRate ?? 22;
  const subtotal = rate * durationHours;
  const serviceFee = subtotal * 0.15;
  const safetyFee = 2;
  const total = subtotal + serviceFee + safetyFee;

  function handleContinue() {
    if (!bookingDraft) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBookingDraft({ ...bookingDraft, durationHours });
    router.push("/booking/step3");
  }

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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Session Duration</Text>
        <View style={{ width: 42 }} />
      </View>

      <BookingProgress step={2} />

      <View style={[styles.content, { paddingBottom: botPad + 110 }]}>
        {/* Duration display */}
        <View style={styles.durationDisplay}>
          <Text style={[styles.durationBig, { color: colors.teal }]}>
            {durationHours % 1 === 0 ? durationHours : durationHours.toFixed(1)}
          </Text>
          <Text style={[styles.durationUnit, { color: colors.mutedForeground }]}>hours</Text>
        </View>

        {/* Duration selector */}
        <View style={[styles.selectorCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.selectorLabel, { color: colors.mutedForeground }]}>Select Duration</Text>
          <View style={styles.durationGrid}>
            {DURATIONS.map((d) => (
              <TouchableOpacity
                key={d}
                onPress={() => {
                  Haptics.selectionAsync();
                  setDurationHours(d);
                }}
                activeOpacity={0.8}
                style={[
                  styles.durationChip,
                  {
                    backgroundColor: durationHours === d ? colors.teal : colors.darkBg,
                    borderColor: durationHours === d ? colors.teal : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.durationChipText,
                    { color: durationHours === d ? "#FFFFFF" : colors.mutedForeground },
                  ]}
                >
                  {d % 1 === 0 ? `${d}h` : `${d}h`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Live Price Estimate */}
        <View style={[styles.priceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.priceTitle, { color: colors.foreground }]}>Price Estimate</Text>

          <View style={styles.priceRows}>
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>
                {durationHours}h × ${rate}/hr
              </Text>
              <Text style={[styles.priceValue, { color: colors.foreground }]}>
                ${subtotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>
                Service fee (15%)
              </Text>
              <Text style={[styles.priceValue, { color: colors.foreground }]}>
                ${serviceFee.toFixed(2)}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>Safety fee</Text>
              <Text style={[styles.priceValue, { color: colors.foreground }]}>
                ${safetyFee.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.priceDivider, { backgroundColor: colors.border }]} />
            <View style={styles.priceRow}>
              <Text style={[styles.priceTotalLabel, { color: colors.foreground }]}>Total</Text>
              <Text style={[styles.priceTotalValue, { color: colors.teal }]}>
                ${total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Continue button */}
      <View style={[styles.footer, { borderTopColor: colors.border, paddingBottom: botPad + 16, backgroundColor: colors.darkBg }]}>
        <TouchableOpacity
          onPress={handleContinue}
          activeOpacity={0.85}
          style={[styles.continueBtn, { backgroundColor: colors.teal }]}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
          <Feather name="arrow-right" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
    paddingBottom: 8,
  },
  backBtn: {
    width: 42, height: 42, borderRadius: 21, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 17, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  content: { flex: 1, paddingHorizontal: 20, gap: 20, paddingTop: 12 },
  durationDisplay: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 4,
  },
  durationBig: {
    fontSize: 64,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    letterSpacing: -2,
  },
  durationUnit: { fontSize: 18, fontFamily: "Inter_400Regular" },
  selectorCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  selectorLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  durationGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  durationChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  durationChipText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  priceCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  priceTitle: { fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  priceRows: { gap: 10 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  priceLabel: { fontSize: 14, fontFamily: "Inter_400Regular" },
  priceValue: { fontSize: 14, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  priceDivider: { height: 1, marginVertical: 4 },
  priceTotalLabel: { fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  priceTotalValue: { fontSize: 22, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  continueBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  continueBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
});
