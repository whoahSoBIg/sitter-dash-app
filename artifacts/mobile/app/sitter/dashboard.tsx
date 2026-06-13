import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { INCOMING_REQUESTS } from "@/data/sitters";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function SitterDashboard() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { sitterActive, setSitterActive, setUserType } = useApp();
  const [requests, setRequests] = useState(INCOMING_REQUESTS);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  function handleAccept(id: string) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setRequests((prev) => prev.filter((r) => r.id !== id));
    Alert.alert("Booking Accepted!", "The parent has been notified. Head over now!");
    router.push("/session/live");
  }

  function handleDecline(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Welcome back,</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>Maya Chen</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setUserType(null);
            router.replace("/");
          }}
          style={[styles.backHome, { backgroundColor: colors.card, borderColor: colors.border }]}
          activeOpacity={0.8}
        >
          <Feather name="log-out" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 24 }]}
      >
        {/* Active Toggle */}
        <View style={[styles.activeCard, {
          backgroundColor: sitterActive ? colors.teal + "22" : colors.card,
          borderColor: sitterActive ? colors.teal + "66" : colors.border,
        }]}>
          <View style={styles.activeLeft}>
            <View style={[styles.statusDot, { backgroundColor: sitterActive ? colors.teal : colors.mutedForeground }]} />
            <View>
              <Text style={[styles.activeTitle, { color: colors.foreground }]}>
                {sitterActive ? "You're Active" : "You're Inactive"}
              </Text>
              <Text style={[styles.activeSub, { color: colors.mutedForeground }]}>
                {sitterActive ? "Parents can see and book you" : "Toggle on to receive bookings"}
              </Text>
            </View>
          </View>
          <Switch
            value={sitterActive}
            onValueChange={(v) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSitterActive(v);
            }}
            trackColor={{ false: colors.border, true: colors.teal }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Earnings Summary */}
        <View style={styles.earningsRow}>
          {[
            { label: "This Week", value: "$187", icon: "trending-up" as const },
            { label: "This Month", value: "$643", icon: "calendar" as const },
            { label: "Total Sessions", value: "87", icon: "people" as const },
          ].map((item) => (
            <View
              key={item.label}
              style={[styles.earningsCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Ionicons name={item.icon} size={18} color={colors.teal} />
              <Text style={[styles.earningsValue, { color: colors.foreground }]}>{item.value}</Text>
              <Text style={[styles.earningsLabel, { color: colors.mutedForeground }]}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* GoSitter Plus */}
        <View style={[styles.plusCard, { borderColor: colors.gold + "44" }]}>
          <View style={styles.plusTop}>
            <Ionicons name="star" size={20} color={colors.gold} />
            <View style={styles.plusTextBlock}>
              <Text style={[styles.plusTitle, { color: colors.foreground }]}>GoSitter Plus</Text>
              <Text style={[styles.plusSub, { color: colors.mutedForeground }]}>
                $0 service fee for you + priority placement in search results.
              </Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.plusBtn, { backgroundColor: colors.gold }]} activeOpacity={0.85}>
            <Text style={styles.plusBtnText}>$9.99/mo</Text>
          </TouchableOpacity>
        </View>

        {/* Incoming Requests */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Incoming Requests</Text>
            {requests.length > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.teal }]}>
                <Text style={styles.badgeText}>{requests.length}</Text>
              </View>
            )}
          </View>

          {requests.length === 0 && (
            <View style={[styles.emptyRequests, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="checkmark-circle-outline" size={36} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No pending requests
              </Text>
            </View>
          )}

          {requests.map((req) => (
            <View key={req.id} style={[styles.requestCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.requestHeader}>
                <View style={[styles.reqAvatar, { backgroundColor: colors.navy }]}>
                  <Text style={styles.reqInitials}>{req.parentInitials}</Text>
                </View>
                <View style={styles.reqInfo}>
                  <Text style={[styles.reqParent, { color: colors.foreground }]}>{req.parentName}</Text>
                  <Text style={[styles.reqDate, { color: colors.mutedForeground }]}>
                    {req.date} · {req.startTime}
                  </Text>
                </View>
                <Text style={[styles.reqEarning, { color: colors.teal }]}>${req.totalEarning}</Text>
              </View>

              <View style={[styles.reqDetails, { backgroundColor: colors.darkBg + "88" }]}>
                <View style={styles.reqDetailRow}>
                  <Ionicons name="time-outline" size={14} color={colors.mutedForeground} />
                  <Text style={[styles.reqDetailText, { color: colors.mutedForeground }]}>
                    {req.hours} hours
                  </Text>
                  <Ionicons name="happy-outline" size={14} color={colors.mutedForeground} />
                  <Text style={[styles.reqDetailText, { color: colors.mutedForeground }]}>
                    {req.children.join(", ")}
                  </Text>
                </View>
                {req.notes && (
                  <Text style={[styles.reqNotes, { color: colors.mutedForeground }]}>
                    "{req.notes}"
                  </Text>
                )}
              </View>

              <View style={styles.reqActions}>
                <TouchableOpacity
                  onPress={() => handleDecline(req.id)}
                  activeOpacity={0.8}
                  style={[styles.declineBtn, { backgroundColor: colors.darkBg, borderColor: colors.border }]}
                >
                  <Text style={[styles.declineBtnText, { color: colors.mutedForeground }]}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleAccept(req.id)}
                  activeOpacity={0.85}
                  style={[styles.acceptBtn, { backgroundColor: colors.teal }]}
                >
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  <Text style={styles.acceptBtnText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Emergency Button access */}
        <TouchableOpacity
          onPress={() => router.push("/emergency")}
          activeOpacity={0.85}
          style={[styles.emergencyRow, { backgroundColor: "#EF444422", borderColor: "#EF444444" }]}
        >
          <Ionicons name="warning" size={20} color="#EF4444" />
          <Text style={styles.emergencyText}>Emergency Button</Text>
          <Feather name="chevron-right" size={16} color="#EF4444" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  greeting: { fontSize: 14, fontFamily: "Inter_400Regular" },
  title: { fontSize: 26, fontWeight: "700" as const, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  backHome: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  content: { paddingHorizontal: 20, gap: 16 },
  activeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  activeLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  activeTitle: { fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  activeSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  earningsRow: { flexDirection: "row", gap: 10 },
  earningsCard: {
    flex: 1,
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  earningsValue: { fontSize: 20, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  earningsLabel: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center" },
  plusCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: "column",
    backgroundColor: "#1A1A2E",
  },
  plusTop: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 10 },
  plusTextBlock: { flex: 1 },
  plusTitle: { fontSize: 15, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  plusSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2, flexWrap: "wrap" },
  plusBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, alignSelf: "flex-start" },
  plusBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  section: { gap: 12 },
  sectionRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  badge: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  badgeText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  emptyRequests: {
    alignItems: "center",
    padding: 30,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  emptyText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  requestCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 8,
  },
  requestHeader: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  reqAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  reqInitials: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  reqInfo: { flex: 1, gap: 3 },
  reqParent: { fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  reqDate: { fontSize: 13, fontFamily: "Inter_400Regular" },
  reqEarning: { fontSize: 20, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  reqDetails: { paddingHorizontal: 14, paddingVertical: 10, gap: 6 },
  reqDetailRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  reqDetailText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  reqNotes: { fontSize: 13, fontStyle: "italic", fontFamily: "Inter_400Regular" },
  reqActions: { flexDirection: "row", padding: 14, gap: 10 },
  declineBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  declineBtnText: { fontSize: 15, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  acceptBtn: {
    flex: 2,
    flexDirection: "row",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  acceptBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  emergencyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  emergencyText: { flex: 1, color: "#EF4444", fontSize: 15, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
});
