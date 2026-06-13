import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MOCK_BOOKINGS, BookingRecord } from "@/data/sitters";
import { useColors } from "@/hooks/useColors";

const STATUS_CONFIG = {
  upcoming: { label: "Upcoming", color: "#3B82F6", icon: "calendar" as const },
  active: { label: "Active", color: "#1D9E75", icon: "radio-button-on" as const },
  completed: { label: "Completed", color: "#6B7FA3", icon: "checkmark-circle" as const },
  cancelled: { label: "Cancelled", color: "#EF4444", icon: "close-circle" as const },
};

function BookingCard({ booking, onPress }: { booking: BookingRecord; onPress: () => void }) {
  const colors = useColors();
  const cfg = STATUS_CONFIG[booking.status];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={styles.cardTop}>
        <View style={[styles.avatarSmall, { backgroundColor: booking.sitterAvatarColor }]}>
          <Text style={styles.avatarText}>{booking.sitterInitials}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.sitterName, { color: colors.foreground }]}>
            {booking.sitterName}
          </Text>
          <Text style={[styles.cardDate, { color: colors.mutedForeground }]}>
            {booking.date} · {booking.startTime}
          </Text>
          <Text style={[styles.cardChildren, { color: colors.mutedForeground }]}>
            {booking.children.join(", ")}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: cfg.color + "22", borderColor: cfg.color + "44" }]}>
          <Ionicons name={cfg.icon} size={12} color={cfg.color} />
          <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>
      <View style={[styles.cardBottom, { borderTopColor: colors.border }]}>
        <Text style={[styles.cardDetail, { color: colors.mutedForeground }]}>
          {booking.hours}h · ${booking.rate}/hr
        </Text>
        <Text style={[styles.cardTotal, { color: colors.teal }]}>
          ${booking.totalCost.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function BookingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const displayed =
    tab === "upcoming"
      ? MOCK_BOOKINGS.filter((b) => b.status === "upcoming" || b.status === "active")
      : MOCK_BOOKINGS.filter((b) => b.status === "completed" || b.status === "cancelled");

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>My Bookings</Text>
        <View style={[styles.tabBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {(["upcoming", "past"] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.tabBtn,
                { backgroundColor: tab === t ? colors.teal : "transparent" },
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setTab(t);
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: tab === t ? "#FFFFFF" : colors.mutedForeground },
                ]}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={displayed}
        keyExtractor={(b) => b.id}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onPress={() => {
              Haptics.selectionAsync();
              if (item.status === "active") {
                router.push("/session/live");
              } else if (item.status === "completed") {
                router.push("/ratings");
              }
            }}
          />
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 80 },
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No bookings yet</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Book a sitter to get started
            </Text>
            <TouchableOpacity
              style={[styles.emptyBtn, { backgroundColor: colors.teal }]}
              activeOpacity={0.85}
              onPress={() => router.replace("/(tabs)")}
            >
              <Text style={styles.emptyBtnText}>Find a Sitter</Text>
            </TouchableOpacity>
          </View>
        }
        scrollEnabled={!!displayed.length}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  tabBar: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    padding: 3,
    gap: 3,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 10,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 10,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  avatarSmall: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  cardInfo: { flex: 1, gap: 3 },
  sitterName: {
    fontSize: 16,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  cardDate: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  cardChildren: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  cardDetail: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  cardTotal: {
    fontSize: 16,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  emptyBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
});
