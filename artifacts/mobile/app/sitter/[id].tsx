import { Ionicons, Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { SITTERS } from "@/data/sitters";

export default function SitterProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const sitter = SITTERS.find((s) => s.id === id) ?? SITTERS[0];
  const [saved, setSaved] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => { Haptics.selectionAsync(); setSaved((s) => !s); }}
        >
          <Ionicons name={saved ? "heart" : "heart-outline"} size={22} color={saved ? "#EF4444" : colors.foreground} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 100 }]}>
        <View style={styles.heroSection}>
          <View style={[styles.bigAvatar, { backgroundColor: sitter.avatarColor }]}>
            <Text style={styles.bigAvatarText}>{sitter.initials}</Text>
          </View>
          <Text style={[styles.name, { color: colors.foreground }]}>{sitter.name}</Text>
          <Text style={[styles.location, { color: colors.mutedForeground }]}>
            <Ionicons name="location" size={13} color={colors.teal} /> {sitter.neighbourhood}, {sitter.city}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Text style={[styles.statVal, { color: colors.foreground }]}>★ {sitter.rating}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Rating</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statChip}>
              <Text style={[styles.statVal, { color: colors.foreground }]}>{sitter.reviewCount}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Reviews</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statChip}>
              <Text style={[styles.statVal, { color: colors.teal }]}>${sitter.ratePerHour}/h</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Rate</Text>
            </View>
          </View>
        </View>

        {sitter.backgroundCheck === "top_pro" && (
          <View style={[styles.proBadgeRow, { backgroundColor: colors.teal + "15", borderColor: colors.teal + "44" }]}>
            <Ionicons name="shield-checkmark" size={18} color={colors.teal} />
            <Text style={[styles.proBadgeText, { color: colors.teal }]}>Top Pro — Enhanced background check + ID verified</Text>
          </View>
        )}

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>About</Text>
          <Text style={[styles.bio, { color: colors.mutedForeground }]}>
            {sitter.name.split(" ")[0]} is a trusted sitter in {sitter.neighbourhood} with {sitter.yearsExp ?? 2}+ years of experience.
            Studies at {sitter.university}. CPR certified and background checked.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Certifications</Text>
          <View style={styles.certGrid}>
            {sitter.certifications.map((c) => (
              <View key={c} style={[styles.certChip, { backgroundColor: colors.teal + "18", borderColor: colors.teal + "44" }]}>
                <Ionicons name="checkmark-circle" size={13} color={colors.teal} />
                <Text style={[styles.certText, { color: colors.teal }]}>{c}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Reviews</Text>
          {[
            { author: "Emma P.", text: "Amazing with our 2-year-old. Will definitely book again!", stars: 5 },
            { author: "James K.", text: "Super reliable and very attentive. Highly recommend.", stars: 5 },
            { author: "Aisha M.", text: "Great experience, kids loved her!", stars: 4 },
          ].map((r, i) => (
            <View key={i} style={[styles.reviewRow, { borderTopColor: colors.border, borderTopWidth: i === 0 ? 0 : 1 }]}>
              <View style={styles.reviewTop}>
                <Text style={[styles.reviewAuthor, { color: colors.foreground }]}>{r.author}</Text>
                <Text style={{ color: "#F59E0B" }}>{"★".repeat(r.stars)}</Text>
              </View>
              <Text style={[styles.reviewText, { color: colors.mutedForeground }]}>{r.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.bookBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom + 12 }]}>
        <View>
          <Text style={[styles.bookRate, { color: colors.teal }]}>${sitter.ratePerHour}<Text style={[styles.bookRateSub, { color: colors.mutedForeground }]}>/hr</Text></Text>
          <Text style={[styles.bookAvail, { color: colors.mutedForeground }]}>Available today</Text>
        </View>
        <View style={styles.bookBtns}>
          <TouchableOpacity
            style={[styles.chatBtnLg, { borderColor: colors.teal }]}
            onPress={() => router.push(`/chat/${sitter.id}`)}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.teal} />
            <Text style={[styles.chatBtnText, { color: colors.teal }]}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bookBtn, { backgroundColor: colors.teal }]}
            activeOpacity={0.85}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/(tabs)/bookings");
            }}
          >
            <Text style={styles.bookBtnText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row", justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 8,
  },
  iconBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  body: { paddingHorizontal: 20, gap: 14 },
  heroSection: { alignItems: "center", gap: 8, paddingVertical: 12 },
  bigAvatar: { width: 88, height: 88, borderRadius: 44, alignItems: "center", justifyContent: "center" },
  bigAvatarText: { color: "#fff", fontSize: 28, fontWeight: "700", fontFamily: "Inter_700Bold" },
  name: { fontSize: 24, fontWeight: "700", fontFamily: "Inter_700Bold" },
  location: { fontSize: 14, fontFamily: "Inter_400Regular" },
  statsRow: { flexDirection: "row", alignItems: "center", gap: 20, marginTop: 8 },
  statChip: { alignItems: "center", gap: 2 },
  statVal: { fontSize: 17, fontWeight: "700", fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  statDivider: { width: 1, height: 30 },
  proBadgeRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    padding: 12, borderRadius: 12, borderWidth: 1,
  },
  proBadgeText: { fontSize: 13, fontWeight: "600", fontFamily: "Inter_600SemiBold", flex: 1 },
  section: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "700", fontFamily: "Inter_700Bold" },
  bio: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  certGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  certChip: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1,
  },
  certText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  reviewRow: { paddingTop: 10, gap: 4 },
  reviewTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  reviewAuthor: { fontSize: 14, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  reviewText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  bookBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingTop: 16, borderTopWidth: 1,
  },
  bookRate: { fontSize: 22, fontWeight: "700", fontFamily: "Inter_700Bold" },
  bookRateSub: { fontSize: 14, fontWeight: "400" },
  bookAvail: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  bookBtns: { flexDirection: "row", gap: 10 },
  chatBtnLg: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5,
  },
  chatBtnText: { fontSize: 14, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  bookBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  bookBtnText: { color: "#fff", fontSize: 15, fontWeight: "700", fontFamily: "Inter_700Bold" },
});
