import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const TIP_OPTIONS = [
  { pct: 10, label: "10%" },
  { pct: 15, label: "15%" },
  { pct: 20, label: "20%" },
  { pct: -1, label: "Custom" },
];

export default function TipScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { bookingDraft, setTipAmount } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const subtotal = (bookingDraft?.sitterRate ?? 22) * (bookingDraft?.durationHours ?? 3);
  const sitterName = bookingDraft?.sitterName ?? "Maya Chen";
  const sitterInitials = sitterName.split(" ").map((n) => n[0]).join("").slice(0, 2);

  const [selectedPct, setSelectedPct] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  function getTipAmount(): number {
    if (selectedPct === -1) return parseFloat(customAmount) || 0;
    if (selectedPct === null) return 0;
    return subtotal * (selectedPct / 100);
  }

  const tipAmount = getTipAmount();
  const serviceFee = subtotal * 0.15;
  const safetyFee = 2;
  const newTotal = subtotal + serviceFee + safetyFee + tipAmount;

  function handleConfirm() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTipAmount(tipAmount);
    router.replace("/ratings");
  }

  function handleSkip() {
    setTipAmount(0);
    router.replace("/ratings");
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={{ width: 42 }} />
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Add a Tip</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 120 }]}
      >
        {/* Sitter card */}
        <View style={[styles.sitterCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.sitterAvatar, { backgroundColor: "#2563EB" }]}>
            <Text style={styles.sitterInitials}>{sitterInitials}</Text>
          </View>
          <View style={styles.sitterInfo}>
            <Text style={[styles.sitterName, { color: colors.foreground }]}>{sitterName}</Text>
            <Text style={[styles.sitterSub, { color: colors.mutedForeground }]}>
              Session complete · {bookingDraft?.durationHours ?? 3}h at ${bookingDraft?.sitterRate ?? 22}/hr
            </Text>
          </View>
          <View style={[styles.completedBadge, { backgroundColor: colors.teal + "22" }]}>
            <Ionicons name="checkmark-circle" size={20} color={colors.teal} />
          </View>
        </View>

        {/* Subtotal */}
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Session subtotal</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>${subtotal.toFixed(2)}</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>How was the service?</Text>

        {/* Tip cards */}
        <View style={styles.tipGrid}>
          {TIP_OPTIONS.map((opt) => {
            const isSelected = selectedPct === opt.pct;
            const dollarAmt = opt.pct > 0 ? (subtotal * opt.pct / 100).toFixed(2) : null;
            return (
              <TouchableOpacity
                key={opt.pct}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedPct(opt.pct);
                  if (opt.pct !== -1) setCustomAmount("");
                }}
                activeOpacity={0.8}
                style={[
                  styles.tipCard,
                  {
                    backgroundColor: isSelected ? colors.teal : colors.card,
                    borderColor: isSelected ? colors.teal : colors.border,
                  },
                ]}
              >
                <Text style={[styles.tipPct, { color: isSelected ? "#FFFFFF" : colors.foreground }]}>
                  {opt.label}
                </Text>
                {dollarAmt && (
                  <Text style={[styles.tipDollar, { color: isSelected ? "#FFFFFFCC" : colors.mutedForeground }]}>
                    ${dollarAmt}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom input */}
        {selectedPct === -1 && (
          <View style={[styles.customInputRow, { backgroundColor: colors.card, borderColor: colors.teal }]}>
            <Text style={[styles.dollarSign, { color: colors.teal }]}>$</Text>
            <TextInput
              style={[styles.customInput, { color: colors.foreground }]}
              placeholder="0.00"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="decimal-pad"
              value={customAmount}
              onChangeText={setCustomAmount}
              autoFocus
            />
          </View>
        )}

        {/* Updated total */}
        {selectedPct !== null && (
          <View
            style={[
              styles.totalCard,
              { backgroundColor: colors.navy + "CC", borderColor: colors.teal + "44" },
            ]}
          >
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.mutedForeground }]}>Tip</Text>
              <Text style={[styles.totalValue, { color: colors.teal }]}>+${tipAmount.toFixed(2)}</Text>
            </View>
            <View style={[styles.totalDivider, { backgroundColor: colors.border }]} />
            <View style={styles.totalRow}>
              <Text style={[styles.totalFinal, { color: colors.foreground }]}>New Total</Text>
              <Text style={[styles.totalFinalValue, { color: colors.teal }]}>${newTotal.toFixed(2)}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View
        style={[
          styles.footer,
          { borderTopColor: colors.border, paddingBottom: botPad + 16, backgroundColor: colors.darkBg },
        ]}
      >
        <TouchableOpacity
          onPress={handleConfirm}
          activeOpacity={0.85}
          style={[styles.confirmBtn, { backgroundColor: colors.teal }]}
        >
          <Text style={styles.confirmBtnText}>
            {selectedPct !== null && tipAmount > 0
              ? `Confirm Tip · $${tipAmount.toFixed(2)}`
              : "Confirm Tip"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkip} activeOpacity={0.8}>
          <Text style={[styles.skipText, { color: colors.mutedForeground }]}>
            No tip, continue to rating
          </Text>
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
  headerTitle: { fontSize: 17, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  content: { paddingHorizontal: 20, gap: 16, paddingTop: 12 },
  sitterCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  sitterAvatar: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
  sitterInitials: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  sitterInfo: { flex: 1 },
  sitterName: { fontSize: 17, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  sitterSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 3 },
  completedBadge: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  summaryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  summaryLabel: { fontSize: 14, fontFamily: "Inter_400Regular" },
  summaryValue: { fontSize: 20, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  sectionTitle: { fontSize: 18, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  tipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  tipCard: {
    width: "47%",
    paddingVertical: 24,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    gap: 6,
  },
  tipPct: { fontSize: 22, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  tipDollar: { fontSize: 14, fontFamily: "Inter_500Medium" },
  customInputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    gap: 8,
  },
  dollarSign: { fontSize: 24, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  customInput: { flex: 1, fontSize: 24, fontFamily: "Inter_400Regular" },
  totalCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalDivider: { height: 1 },
  totalLabel: { fontSize: 14, fontFamily: "Inter_400Regular" },
  totalValue: { fontSize: 16, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  totalFinal: { fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  totalFinalValue: { fontSize: 24, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 12,
    alignItems: "center",
  },
  confirmBtn: { width: "100%", paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  confirmBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  skipText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
