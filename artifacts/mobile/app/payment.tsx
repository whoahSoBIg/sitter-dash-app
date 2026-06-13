import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function PaymentScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { bookingDraft, setSessionStatus } = useApp();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const subtotal = (bookingDraft?.sitterRate ?? 22) * (bookingDraft?.durationHours ?? 3);
  const serviceFee = subtotal * 0.15;
  const safetyFee = 2;
  const total = subtotal + serviceFee + safetyFee;

  const dateStr = bookingDraft?.date
    ? `${MONTHS[bookingDraft.date.getMonth()]} ${bookingDraft.date.getDate()}, ${bookingDraft.date.getFullYear()}`
    : "";

  function formatCardNumber(text: string) {
    const cleaned = text.replace(/\D/g, "").slice(0, 16);
    return cleaned.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(text: string) {
    const cleaned = text.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 2) return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    return cleaned;
  }

  function validate() {
    if (!name.trim()) return "Please enter the name on your card.";
    if (cardNumber.replace(/\s/g, "").length < 16) return "Please enter a valid card number.";
    if (expiry.length < 5) return "Please enter a valid expiry date.";
    if (cvv.length < 3) return "Please enter a valid CVV.";
    return null;
  }

  async function handlePay() {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setError(null);
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // TODO: Replace this with real Stripe call once backend is ready
      // const { paymentIntent } = await createPaymentIntent(total)
      // await stripe.confirmPayment(paymentIntent.client_secret, { ... })
      await new Promise((res) => setTimeout(res, 1800)); // simulate network
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSessionStatus("booking_sent");
      router.replace("/session/live");
    } catch (e: any) {
      setError(e?.message ?? "Payment failed. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Payment</Text>
        <View style={[styles.secureBadge, { backgroundColor: colors.teal + "22", borderColor: colors.teal + "44" }]}>
          <Ionicons name="lock-closed" size={12} color={colors.teal} />
          <Text style={[styles.secureText, { color: colors.teal }]}>Secure</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 120 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Order summary */}
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Sitter</Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>{bookingDraft?.sitterName ?? "—"}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Date</Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>{dateStr}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Duration</Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>{bookingDraft?.durationHours ?? 0}h</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Subtotal</Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Service fee (15%)</Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>${serviceFee.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.safetyRow}>
              <Ionicons name="shield-checkmark" size={13} color={colors.teal} />
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Safety fee</Text>
            </View>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>${safetyFee.toFixed(2)}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: colors.foreground }]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.teal }]}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Card input */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Card Details</Text>

          {/* Card number */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Card Number</Text>
            <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="card-outline" size={18} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={colors.mutedForeground}
                value={cardNumber}
                onChangeText={(t) => setCardNumber(formatCardNumber(t))}
                keyboardType="number-pad"
                maxLength={19}
              />
            </View>
          </View>

          {/* Name */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Name on Card</Text>
            <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="person-outline" size={18} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Sarah Mitchell"
                placeholderTextColor={colors.mutedForeground}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Expiry + CVV */}
          <View style={styles.rowFields}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Expiry</Text>
              <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons name="calendar-outline" size={18} color={colors.mutedForeground} />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="MM/YY"
                  placeholderTextColor={colors.mutedForeground}
                  value={expiry}
                  onChangeText={(t) => setExpiry(formatExpiry(t))}
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
            </View>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={[styles.fieldLabel, { color: colors.foreground }]}>CVV</Text>
              <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.mutedForeground} />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="123"
                  placeholderTextColor={colors.mutedForeground}
                  value={cvv}
                  onChangeText={(t) => setCvv(t.replace(/\D/g, "").slice(0, 4))}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        </View>

        {/* Accepted cards */}
        <View style={styles.cardBrands}>
          {["VISA", "MC", "AMEX", "DISCOVER"].map((brand) => (
            <View key={brand} style={[styles.brandPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.brandText, { color: colors.mutedForeground }]}>{brand}</Text>
            </View>
          ))}
        </View>

        {/* Error */}
        {error && (
          <View style={[styles.errorBox, { backgroundColor: "#EF444422", borderColor: "#EF444444" }]}>
            <Ionicons name="alert-circle" size={16} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Fine print */}
        <Text style={[styles.finePrint, { color: colors.mutedForeground }]}>
          Payment is held securely and released to the sitter after your session is complete. You won't be charged until the sitter accepts.
        </Text>
      </ScrollView>

      {/* Pay button */}
      <View style={[styles.footer, { borderTopColor: colors.border, paddingBottom: botPad + 16, backgroundColor: colors.darkBg }]}>
        <TouchableOpacity
          onPress={handlePay}
          activeOpacity={0.85}
          disabled={loading}
          style={[styles.payBtn, { backgroundColor: colors.teal, opacity: loading ? 0.7 : 1 }]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="lock-closed" size={18} color="#fff" />
              <Text style={styles.payBtnText}>Pay ${total.toFixed(2)}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 8,
  },
  backBtn: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontWeight: "700", fontFamily: "Inter_700Bold" },
  secureBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1 },
  secureText: { fontSize: 12, fontFamily: "Inter_600SemiBold", fontWeight: "600" },
  content: { paddingHorizontal: 20, gap: 20, paddingTop: 12 },
  summaryCard: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 10 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  summaryLabel: { fontSize: 14, fontFamily: "Inter_400Regular" },
  summaryValue: { fontSize: 14, fontFamily: "Inter_600SemiBold", fontWeight: "600" },
  safetyRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  divider: { height: 1, marginVertical: 2 },
  totalLabel: { fontSize: 16, fontWeight: "700", fontFamily: "Inter_700Bold" },
  totalValue: { fontSize: 22, fontWeight: "700", fontFamily: "Inter_700Bold" },
  section: { gap: 14 },
  sectionTitle: { fontSize: 16, fontWeight: "700", fontFamily: "Inter_700Bold" },
  fieldGroup: { gap: 6 },
  fieldLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold", fontWeight: "600" },
  inputRow: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 13, gap: 10 },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  rowFields: { flexDirection: "row", gap: 12 },
  cardBrands: { flexDirection: "row", gap: 8 },
  brandPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  brandText: { fontSize: 11, fontFamily: "Inter_700Bold", fontWeight: "700" },
  errorBox: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 10, borderWidth: 1 },
  errorText: { color: "#EF4444", fontSize: 13, fontFamily: "Inter_400Regular", flex: 1 },
  finePrint: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 18 },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 16, borderTopWidth: 1 },
  payBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, borderRadius: 14, gap: 8 },
  payBtnText: { color: "#fff", fontSize: 16, fontWeight: "700", fontFamily: "Inter_700Bold" },
});
