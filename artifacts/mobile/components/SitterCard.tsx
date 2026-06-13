import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";
import { Sitter } from "@/data/sitters";

// ─── Sitter Avatar ─────────────────────────────────────────────────────────────
export function SitterAvatar({
  sitter,
  size = 52,
}: {
  sitter: Sitter;
  size?: number;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: sitter.avatarColor,
          borderWidth: 2,
          borderColor: colors.teal,
        },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.36 }]}>
        {sitter.initials}
      </Text>
    </View>
  );
}

// ─── Star Rating ────────────────────────────────────────────────────────────────
export function StarRating({
  rating,
  size = 12,
}: {
  rating: number;
  size?: number;
}) {
  const colors = useColors();
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= Math.round(rating) ? "star" : "star-outline"}
          size={size}
          color={colors.gold}
          style={{ marginRight: 1 }}
        />
      ))}
    </View>
  );
}

// ─── Background Check Badge ─────────────────────────────────────────────────────
export function BackgroundBadge({
  status,
}: {
  status: "pending" | "verified" | "top_pro";
}) {
  const colors = useColors();
  const config = {
    pending: { label: "Check Pending", color: colors.mutedForeground, icon: "time-outline" as const },
    verified: { label: "Verified", color: colors.success, icon: "shield-checkmark" as const },
    top_pro: { label: "Top Pro", color: colors.gold, icon: "shield-checkmark" as const },
  }[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.color + "22", borderColor: config.color + "44" }]}>
      <Ionicons name={config.icon} size={11} color={config.color} />
      <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

// ─── Cert Badge ─────────────────────────────────────────────────────────────────
export function CertBadge({ label }: { label: string }) {
  const colors = useColors();
  return (
    <View style={[styles.certBadge, { backgroundColor: colors.muted, borderColor: colors.border }]}>
      <Feather name="check-circle" size={11} color={colors.teal} />
      <Text style={[styles.certText, { color: colors.foreground }]}>{label}</Text>
    </View>
  );
}

// ─── Community Vouched Badge ─────────────────────────────────────────────────────
export function VouchedBadge() {
  const colors = useColors();
  return (
    <View style={[styles.badge, { backgroundColor: "#8B5CF622", borderColor: "#8B5CF644" }]}>
      <Ionicons name="people" size={11} color="#8B5CF6" />
      <Text style={[styles.badgeText, { color: "#8B5CF6" }]}>Community Vouched</Text>
    </View>
  );
}

// ─── GoSitter Plus Badge ─────────────────────────────────────────────────────────
export function PlusBadge() {
  const colors = useColors();
  return (
    <View style={[styles.badge, { backgroundColor: colors.gold + "22", borderColor: colors.gold + "44" }]}>
      <Ionicons name="star" size={11} color={colors.gold} />
      <Text style={[styles.badgeText, { color: colors.gold }]}>GoSitter Plus</Text>
    </View>
  );
}

// ─── Filter Chip ────────────────────────────────────────────────────────────────
export function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.filterChip,
        {
          backgroundColor: active ? colors.teal : colors.cardBg,
          borderColor: active ? colors.teal : colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.filterChipText,
          { color: active ? "#FFFFFF" : colors.mutedForeground },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Sitter List Card ────────────────────────────────────────────────────────────
export function SitterCard({
  sitter,
  onPress,
}: {
  sitter: Sitter;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <SitterAvatar sitter={sitter} size={56} />
      <View style={styles.cardInfo}>
        <View style={styles.cardRow}>
          <Text
            style={[styles.cardName, { color: colors.foreground }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {sitter.name}
          </Text>
          {sitter.isPlus && (
            <View style={[styles.miniPlusBadge, { backgroundColor: colors.gold + "22" }]}>
              <Text style={[styles.miniPlusText, { color: colors.gold }]}>+</Text>
            </View>
          )}
        </View>
        <Text style={[styles.cardUniversity, { color: colors.mutedForeground }]}>{sitter.university}</Text>
        <View style={styles.cardMeta}>
          <StarRating rating={sitter.rating} />
          <Text style={[styles.cardRating, { color: colors.foreground }]}> {sitter.rating}</Text>
          <Text style={[styles.cardDot, { color: colors.mutedForeground }]}> · </Text>
          <Ionicons name="location-outline" size={12} color={colors.mutedForeground} />
          <Text style={[styles.cardMeta2, { color: colors.mutedForeground }]}>
            {sitter.neighbourhood} · {sitter.distance}km
          </Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Text style={[styles.cardRate, { color: colors.teal }]}>${sitter.ratePerHour}</Text>
        <Text style={[styles.cardRateSub, { color: colors.mutedForeground }]}>/hr</Text>
        {sitter.backgroundCheck === "top_pro" && (
          <Ionicons name="shield-checkmark" size={16} color={colors.gold} style={{ marginTop: 4 }} />
        )}
        {sitter.backgroundCheck === "verified" && (
          <Ionicons name="shield-checkmark" size={16} color={colors.success} style={{ marginTop: 4 }} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  certBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  certText: {
    fontSize: 12,
    fontWeight: "500" as const,
    fontFamily: "Inter_500Medium",
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "500" as const,
    fontFamily: "Inter_500Medium",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  cardInfo: {
    flex: 1,
    gap: 3,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexShrink: 1,
  },
  cardName: {
    fontSize: 15,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    flexShrink: 1,
  },
  miniPlusBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    flexShrink: 0,
  },
  miniPlusText: {
    fontSize: 10,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  cardUniversity: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  cardRating: {
    fontSize: 12,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  cardDot: {
    fontSize: 12,
  },
  cardMeta2: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  cardRight: {
    alignItems: "flex-end",
  },
  cardRate: {
    fontSize: 20,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  cardRateSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
});
