import { Feather, Ionicons } from "@expo/vector-icons";
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
import { BookingProgress } from "@/components/BookingProgress";
import { SITTERS } from "@/data/sitters";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function BookingStep4() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { bookingDraft, children, setSessionStatus } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const sitter = bookingDraft ? SITTERS.find((s) => s.id === bookingDraft.sitterId) : SITTERS[0];
  const selectedKids = children.filter((c) => bookingDraft?.selectedChildren.includes(c.id));

  const subtotal = (bookingDraft?.sitterRate ?? 22) * (bookingDraft?.durationHours ?? 3);
  const serviceFee = subtotal * 0.15;
  const safetyFee = 2;
  const total = subtotal + serviceFee + safetyFee;

  const dateStr = bookingDraft?.date
    ? `${MONTHS[bookingDraft.date.getMonth()]} ${bookingDraft.date.getDate()}, ${bookingDraft.date.getFullYear()}`
    : "";

 function handleConfirm() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  router.push("/payment");
}

  if (!bookingDraft || !sitter) {
    return (
      <View style={[styles.container, { backgroundColor: colors.darkBg, alignItems: "center", justifyContent: "center" }]}>
        <Text style={{ color: colors.foreground }}>No booking in progress</Text>
        <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
          <Text style={{ color: colors.teal, marginTop: 12 }}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          activeOpacity={0.8}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Confirm Booking</Text>
        <View style={{ width: 42 }} />
      </View>

      <BookingProgress step={4} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad + 110 }]}>
        {/* Sitter summary */}
        <View style={[styles.sitterCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.sitterAvatar, { backgroundColor: sitter.avatarColor }]}>
            <Text style={styles.sitterInitials}>{sitter.initials}</Text>
          </View>
          <View style={styles.sitterInfo}>
            <Text style={[styles.sitterName, { color: colors.foreground }]}>{sitter.name}</Text>
            <Text style={[styles.sitterUniversity, { color: colors.mutedForeground }]}>{sitter.university}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={13} color={colors.gold} />
              <Text style={[styles.ratingText, { color: colors.foreground }]}>{sitter.rating}</Text>
            </View>
          </View>
          <Ionicons name="shield-checkmark" size={24} color={sitter.backgroundCheck === "top_pro" ? colors.gold : colors.success} />
        </View>

        {/* Session details */}
        <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.detailTitle, { color: colors.foreground }]}>Session Details</Text>
          {[
            { icon: "calendar-outline" as const, label: "Date", value: dateStr },
            { icon: "time-outline" as const, label: "Start Time", value: bookingDraft.startTime },
            { icon: "hourglass-outline" as const, label: "Duration", value: `${bookingDraft.durationHours}h` },
            { icon: "location-outline" as const, label: "Location", value: "Your address on file" },
          ].map((item) => (
            <View key={item.label} style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Ionicons name={item.icon} size={16} color={colors.teal} />
              <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{item.label}</Text>
              <Text style={[styles.detailValue, { color: colors.foreground }]}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Children */}
        <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.detailTitle, { color: colors.foreground }]}>Children</Text>
          {selectedKids.map((child) => (
            <View key={child.id} style={[styles.childRow, { borderBottomColor: colors.border }]}>
              <Ionicons name="happy-outline" size={16} color={colors.teal} />
              <Text style={[styles.detailValue, { color: colors.foreground }]}>
                {child.name}, {child.age}
              </Text>
              {child.allergies !== "None" && child.allergies && (
                <View style={styles.allergyPill}>
                  <Text style={styles.allergyText}>Allergy: {child.allergies}</Text>
                </View>
              )}
            </View>
          ))}
          {bookingDraft.notes ? (
            <View style={styles.notesRow}>
              <Feather name="file-text" size={14} color={colors.mutedForeground} />
              <Text style={[styles.notesText, { color: colors.mutedForeground }]}>{bookingDraft.notes}</Text>
            </View>
          ) : null}
        </View>

        {/* Price Breakdown */}
        <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.detailTitle, { color: colors.foreground }]}>Price Breakdown</Text>
          <View style={styles.priceRows}>
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>
                {bookingDraft.durationHours}h × ${bookingDraft.sitterRate}/hr
              </Text>
              <Text style={[styles.priceValue, { color: colors.foreground }]}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>Service fee (15%)</Text>
              <Text style={[styles.priceValue, { color: colors.foreground }]}>${serviceFee.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <View style={styles.safetyRow}>
                <Ionicons name="shield-checkmark" size={13} color={colors.teal} />
                <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>Safety fee</Text>
              </View>
              <Text style={[styles.priceValue, { color: colors.foreground }]}>${safetyFee.toFixed(2)}</Text>
            </View>
            <View style={[styles.priceDivider, { backgroundColor: colors.border }]} />
            <View style={styles.priceRow}>
              <Text style={[styles.totalLabel, { color: colors.foreground }]}>Total</Text>
              <Text style={[styles.totalValue, { color: colors.teal }]}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Confirm button */}
      <View style={[styles.footer, { borderTopColor: colors.border, paddingBottom: botPad + 16, backgroundColor: colors.darkBg }]}>
        <TouchableOpacity
          onPress={handleConfirm}
          activeOpacity={0.85}
          style={[styles.confirmBtn, { backgroundColor: colors.teal }]}
        >
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          <Text style={styles.confirmBtnText}>Confirm & Book — ${total.toFixed(2)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            router.push("/session/chat");
          }}
          activeOpacity={0.85}
          style={[styles.chatBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Ionicons name="chatbubble-outline" size={18} color={colors.foreground} />
          <Text style={[styles.chatBtnText, { color: colors.foreground }]}>Message Sitter First</Text>
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
  backBtn: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  content: { paddingHorizontal: 20, gap: 16, paddingTop: 12 },
  sitterCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  sitterAvatar: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
  sitterInitials: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  sitterInfo: { flex: 1, gap: 4 },
  sitterName: { fontSize: 17, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  sitterUniversity: { fontSize: 13, fontFamily: "Inter_400Regular" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontSize: 13, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  detailCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  detailTitle: { fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold", marginBottom: 4 },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 10,
    borderBottomWidth: 1,
  },
  childRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 10,
    borderBottomWidth: 1,
    flexWrap: "wrap",
  },
  detailLabel: { fontSize: 14, fontFamily: "Inter_400Regular", width: 90 },
  detailValue: { flex: 1, fontSize: 14, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold", textAlign: "right" },
  allergyPill: { backgroundColor: "#EF444422", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  allergyText: { color: "#EF4444", fontSize: 11, fontFamily: "Inter_500Medium" },
  notesRow: { flexDirection: "row", gap: 8, paddingTop: 4 },
  notesText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  priceRows: { gap: 10 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  safetyRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  priceLabel: { fontSize: 14, fontFamily: "Inter_400Regular" },
  priceValue: { fontSize: 14, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  priceDivider: { height: 1, marginVertical: 4 },
  totalLabel: { fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  totalValue: { fontSize: 22, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 16, borderTopWidth: 1 },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  confirmBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  chatBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  chatBtnText: { fontSize: 15, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
});
