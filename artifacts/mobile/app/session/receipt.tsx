import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
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

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function Row({ label, value, teal, bold }: { label: string; value: string; teal?: boolean; bold?: boolean }) {
  const colors = useColors();
  return (
    <View style={rowStyles.row}>
      <Text style={[rowStyles.label, { color: colors.mutedForeground }]}>{label}</Text>
      <Text
        style={[
          rowStyles.value,
          { color: teal ? colors.teal : colors.foreground },
          bold && rowStyles.boldValue,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 14, fontFamily: "Inter_400Regular" },
  value: { fontSize: 14, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  boldValue: { fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
});

export default function ReceiptScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { bookingDraft, tipAmount } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const sitterName = bookingDraft?.sitterName ?? "Maya Chen";
  const sitterInitials = sitterName.split(" ").map((n) => n[0]).join("").slice(0, 2);
  const rate = bookingDraft?.sitterRate ?? 22;
  const hours = bookingDraft?.durationHours ?? 3;
  const subtotal = rate * hours;
  const serviceFee = subtotal * 0.15;
  const safetyFee = 2;
  const tip = tipAmount ?? 0;
  const total = subtotal + serviceFee + safetyFee + tip;

  const dateStr = bookingDraft?.date
    ? `${MONTHS[bookingDraft.date.getMonth()]} ${bookingDraft.date.getDate()}, ${bookingDraft.date.getFullYear()}`
    : "Today";

  const receiptId = `GS-${Date.now().toString(36).toUpperCase().slice(-8)}`;

  function handleDownload() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Receipt Saved", "Your receipt has been saved to your documents.");
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: topPad + 20, paddingBottom: botPad + 120 }]}
      >
        {/* GoSitter logo header */}
        <View style={styles.logoSection}>
          <View style={[styles.logoCircle, { backgroundColor: colors.teal }]}>
            <Ionicons name="home" size={28} color="#FFFFFF" />
          </View>
          <Text style={[styles.appName, { color: colors.foreground }]}>GoSitter</Text>
          <Text style={[styles.receiptLabel, { color: colors.mutedForeground }]}>Session Receipt</Text>
          <Text style={[styles.receiptId, { color: colors.mutedForeground }]}>{receiptId}</Text>
        </View>

        {/* Sitter card */}
        <View style={[styles.sitterCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.sitterAvatar, { backgroundColor: "#2563EB" }]}>
            <Text style={styles.sitterInitials}>{sitterInitials}</Text>
          </View>
          <View style={styles.sitterInfo}>
            <Text style={[styles.sitterName, { color: colors.foreground }]}>{sitterName}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={13} color={colors.gold} />
              <Text style={[styles.ratingText, { color: colors.mutedForeground }]}>4.9 · University Verified</Text>
            </View>
          </View>
          <View style={[styles.verifiedIcon, { backgroundColor: colors.teal + "22" }]}>
            <Ionicons name="shield-checkmark" size={22} color={colors.teal} />
          </View>
        </View>

        {/* Session info */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Session Details</Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.rows}>
            <Row label="Date" value={dateStr} />
            <Row label="Start Time" value={bookingDraft?.startTime ?? "10:00 AM"} />
            <Row label="Duration" value={`${hours} hours`} />
            <Row label="Location" value="Your address on file" />
          </View>
        </View>

        {/* Price breakdown */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Payment Breakdown</Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.rows}>
            <Row label={`${hours}h × $${rate}/hr`} value={`$${subtotal.toFixed(2)}`} />
            <Row label="Service fee (15%)" value={`$${serviceFee.toFixed(2)}`} />
            <Row
              label="Safety fee"
              value={`$${safetyFee.toFixed(2)}`}
            />
            {tip > 0 && <Row label="Tip" value={`$${tip.toFixed(2)}`} teal />}
          </View>
          <View style={[styles.totalDivider, { backgroundColor: colors.border }]} />
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.foreground }]}>Total Charged</Text>
            <Text style={[styles.totalValue, { color: colors.teal }]}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment method */}
        <View style={[styles.payRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="card-outline" size={20} color={colors.mutedForeground} />
          <Text style={[styles.payText, { color: colors.mutedForeground }]}>•••• •••• •••• 4242</Text>
          <Text style={[styles.payStatus, { color: colors.teal }]}>Paid</Text>
        </View>

        {/* Thank you */}
        <View style={styles.thankYou}>
          <Ionicons name="heart" size={18} color={colors.teal} />
          <Text style={[styles.thankYouText, { color: colors.mutedForeground }]}>
            Thank you for trusting GoSitter with your family
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View
        style={[
          styles.footer,
          { borderTopColor: colors.border, paddingBottom: botPad + 16, backgroundColor: colors.darkBg },
        ]}
      >
        <TouchableOpacity
          onPress={handleDownload}
          activeOpacity={0.85}
          style={[styles.downloadBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Ionicons name="download-outline" size={18} color={colors.foreground} />
          <Text style={[styles.downloadBtnText, { color: colors.foreground }]}>Download Receipt</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.replace("/(tabs)");
          }}
          activeOpacity={0.85}
          style={[styles.homeBtn, { backgroundColor: colors.teal }]}
        >
          <Ionicons name="home" size={18} color="#FFFFFF" />
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  logoSection: { alignItems: "center", gap: 6, paddingBottom: 8 },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  appName: { fontSize: 26, fontWeight: "700" as const, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  receiptLabel: { fontSize: 15, fontFamily: "Inter_500Medium" },
  receiptId: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  sitterCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  sitterAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  sitterInitials: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  sitterInfo: { flex: 1 },
  sitterName: { fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 },
  ratingText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  verifiedIcon: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  card: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  cardTitle: { fontSize: 15, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  divider: { height: 1, marginVertical: 2 },
  rows: { gap: 12 },
  totalDivider: { height: 1, marginVertical: 4 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: 17, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  totalValue: { fontSize: 26, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  payRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  payText: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  payStatus: { fontSize: 14, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  thankYou: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  thankYouText: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 10,
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  downloadBtnText: { fontSize: 15, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  homeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  homeBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
});
