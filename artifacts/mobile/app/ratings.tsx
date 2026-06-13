import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { SITTERS } from "@/data/sitters";
import { useApp } from "@/context/AppContext";

const TIP_OPTIONS = [0, 5, 10, 15, 20];

export default function RatingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { selectedCity } = useApp();
  const sitter = SITTERS.find((s) => s.cityId === selectedCity.id) ?? SITTERS[0];
  const [stars, setStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [tip, setTip] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (submitted) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.darkBg }]}>
        <Ionicons name="checkmark-circle" size={72} color={colors.teal} />
        <Text style={[styles.thankTitle, { color: colors.foreground }]}>Thanks for your review!</Text>
        <Text style={[styles.thankSub, { color: colors.mutedForeground }]}>
          Your feedback helps other parents find great sitters.
        </Text>
        <TouchableOpacity
          style={[styles.doneBtn, { backgroundColor: colors.teal }]}
          onPress={() => router.replace("/(tabs)/bookings")}
        >
          <Text style={styles.doneBtnText}>Back to Bookings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Rate Your Session</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 40 }]}>
        <View style={[styles.sitterCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: sitter.avatarColor }]}>
            <Text style={styles.avatarText}>{sitter.initials}</Text>
          </View>
          <View>
            <Text style={[styles.sitterName, { color: colors.foreground }]}>{sitter.name}</Text>
            <Text style={[styles.sitterSub, { color: colors.mutedForeground }]}>Session completed</Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>How was your experience?</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => { Haptics.selectionAsync(); setStars(s); }}
                onPressIn={() => setHoveredStar(s)}
                onPressOut={() => setHoveredStar(0)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="star"
                  size={40}
                  color={(hoveredStar || stars) >= s ? "#F59E0B" : colors.border}
                />
              </TouchableOpacity>
            ))}
          </View>
          {stars > 0 && (
            <Text style={[styles.starLabel, { color: colors.mutedForeground }]}>
              {["", "Poor", "Fair", "Good", "Great", "Amazing!"][stars]}
            </Text>
          )}
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Leave a tip</Text>
          <View style={styles.tipRow}>
            {TIP_OPTIONS.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => { Haptics.selectionAsync(); setTip(t); }}
                style={[
                  styles.tipChip,
                  {
                    backgroundColor: tip === t ? colors.teal : colors.darkBg,
                    borderColor: tip === t ? colors.teal : colors.border,
                  },
                ]}
              >
                <Text style={[styles.tipText, { color: tip === t ? "#fff" : colors.foreground }]}>
                  {t === 0 ? "No tip" : `$${t}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Write a review (optional)</Text>
          <TextInput
            style={[styles.reviewInput, { backgroundColor: colors.darkBg, borderColor: colors.border, color: colors.foreground }]}
            placeholder="Share your experience..."
            placeholderTextColor={colors.mutedForeground}
            value={review}
            onChangeText={setReview}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: stars > 0 ? colors.teal : colors.muted }]}
          activeOpacity={0.85}
          disabled={stars === 0}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setSubmitted(true);
          }}
        >
          <Text style={styles.submitBtnText}>Submit Review{tip > 0 ? ` + $${tip} Tip` : ""}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { alignItems: "center", justifyContent: "center", gap: 16, paddingHorizontal: 40 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 26, fontWeight: "700", fontFamily: "Inter_700Bold" },
  body: { paddingHorizontal: 20, gap: 14 },
  sitterCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    padding: 16, borderRadius: 14, borderWidth: 1,
  },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: 17, fontWeight: "700", fontFamily: "Inter_700Bold" },
  sitterName: { fontSize: 17, fontWeight: "700", fontFamily: "Inter_700Bold" },
  sitterSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  section: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 14 },
  sectionTitle: { fontSize: 16, fontWeight: "700", fontFamily: "Inter_700Bold" },
  starsRow: { flexDirection: "row", gap: 8, justifyContent: "center", paddingVertical: 8 },
  starLabel: { textAlign: "center", fontSize: 14, fontFamily: "Inter_500Medium" },
  tipRow: { flexDirection: "row", gap: 8 },
  tipChip: {
    flex: 1, alignItems: "center", paddingVertical: 12,
    borderRadius: 12, borderWidth: 1,
  },
  tipText: { fontSize: 13, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  reviewInput: {
    borderRadius: 12, borderWidth: 1, padding: 14,
    fontSize: 14, fontFamily: "Inter_400Regular",
    height: 100, textAlignVertical: "top",
  },
  submitBtn: { paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "700", fontFamily: "Inter_700Bold" },
  thankTitle: { fontSize: 22, fontWeight: "700", fontFamily: "Inter_700Bold", textAlign: "center" },
  thankSub: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
  doneBtn: { marginTop: 8, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14 },
  doneBtnText: { color: "#fff", fontSize: 16, fontWeight: "700", fontFamily: "Inter_700Bold" },
});
