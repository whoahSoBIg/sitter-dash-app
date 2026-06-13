import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
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
import {
  SitterAvatar,
  StarRating,
  BackgroundBadge,
  CertBadge,
  VouchedBadge,
  PlusBadge,
} from "@/components/SitterCard";
import { SITTERS, REVIEWS } from "@/data/sitters";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function SitterProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { setBookingDraft } = useApp();

  const sitter = SITTERS.find((s) => s.id === id) ?? SITTERS[0];
  const reviews = REVIEWS.filter((r) => r.sitterId === sitter.id);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  function handleBook() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBookingDraft({
      sitterId: sitter.id,
      sitterName: sitter.name,
      sitterRate: sitter.ratePerHour,
      date: new Date(),
      startTime: "7:00 PM",
      durationHours: 3,
      selectedChildren: [],
      notes: "",
    });
    router.push("/booking/step1");
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Ionicons name="heart-outline" size={20} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 110 }]}
      >
        {/* Profile top */}
        <View style={styles.profileTop}>
          <SitterAvatar sitter={sitter} size={88} />
          <Text style={[styles.name, { color: colors.foreground }]}>{sitter.name}</Text>
          <Text style={[styles.university, { color: colors.mutedForeground }]}>
            {sitter.university}
          </Text>
          <View style={styles.ratingRow}>
            <StarRating rating={sitter.rating} size={16} />
            <Text style={[styles.ratingText, { color: colors.foreground }]}>
              {sitter.rating} ({sitter.reviewCount} reviews)
            </Text>
          </View>
          <View style={styles.badgesRow}>
            <BackgroundBadge status={sitter.backgroundCheck} />
            {sitter.isPlus && <PlusBadge />}
            {sitter.communityVouched && <VouchedBadge />}
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: "Hourly Rate", value: `$${sitter.ratePerHour}`, unit: "/hr" },
            { label: "Experience", value: `${sitter.yearsExp}`, unit: " yrs" },
            { label: "Distance", value: `${sitter.distance}`, unit: "km" },
          ].map((stat) => (
            <View
              key={stat.label}
              style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={[styles.statValue, { color: colors.teal }]}>
                {stat.value}
                <Text style={[styles.statUnit, { color: colors.mutedForeground }]}>{stat.unit}</Text>
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>About</Text>
          <Text style={[styles.bio, { color: colors.mutedForeground }]}>{sitter.bio}</Text>
        </View>

        {/* Certifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Certifications</Text>
          <View style={styles.certsWrap}>
            {sitter.certifications.map((cert) => (
              <CertBadge key={cert} label={cert} />
            ))}
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Reviews ({reviews.length})
          </Text>
          {reviews.length === 0 && (
            <Text style={[styles.noReviews, { color: colors.mutedForeground }]}>
              No reviews yet.
            </Text>
          )}
          {reviews.map((review) => (
            <View
              key={review.id}
              style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.reviewHeader}>
                <View style={[styles.reviewAvatar, { backgroundColor: colors.muted }]}>
                  <Text style={[styles.reviewInitial, { color: colors.foreground }]}>
                    {review.parentName[0]}
                  </Text>
                </View>
                <View style={styles.reviewMeta}>
                  <Text style={[styles.reviewName, { color: colors.foreground }]}>
                    {review.parentName}
                  </Text>
                  <View style={styles.reviewRatingRow}>
                    <StarRating rating={review.rating} size={12} />
                    <Text style={[styles.reviewDate, { color: colors.mutedForeground }]}>
                      · {review.date}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.reviewText, { color: colors.mutedForeground }]}>{review.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Book Now sticky button */}
      <View style={[styles.bookBar, { backgroundColor: colors.darkBg, borderTopColor: colors.border, paddingBottom: botPad + 16 }]}>
        <View style={styles.bookBarLeft}>
          <Text style={[styles.bookBarRate, { color: colors.teal }]}>${sitter.ratePerHour}/hr</Text>
          <Text style={[styles.bookBarSub, { color: colors.mutedForeground }]}>+ 15% service fee</Text>
        </View>
        <TouchableOpacity
          onPress={handleBook}
          activeOpacity={0.85}
          style={[styles.bookBtn, { backgroundColor: colors.teal }]}
        >
          <Text style={styles.bookBtnText}>Book Now</Text>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { paddingHorizontal: 20, gap: 24 },
  profileTop: {
    alignItems: "center",
    gap: 10,
  },
  name: {
    fontSize: 26,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  university: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  statUnit: {
    fontSize: 13,
    fontWeight: "400" as const,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  section: { gap: 12 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  bio: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
  },
  certsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  noReviews: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  reviewCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    marginBottom: 8,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewInitial: {
    fontSize: 15,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  reviewMeta: { gap: 2 },
  reviewName: {
    fontSize: 14,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  reviewRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  reviewText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  bookBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  bookBarLeft: { gap: 2 },
  bookBarRate: {
    fontSize: 20,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  bookBarSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  bookBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  bookBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
});
