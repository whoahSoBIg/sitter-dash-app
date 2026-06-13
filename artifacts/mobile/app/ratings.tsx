import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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

function StarPicker({ rating, onRating }: { rating: number; onRating: (r: number) => void }) {
  const colors = useColors();
  return (
    <View style={styles.starPicker}>
      {[1, 2, 3, 4, 5].map((i) => (
        <TouchableOpacity
          key={i}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onRating(i);
          }}
          activeOpacity={0.8}
          hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
        >
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={36}
            color={i <= rating ? colors.gold : colors.border}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function RatingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { bookingDraft, setSessionStatus } = useApp();

  const [sitterRating, setSitterRating] = useState(0);
  const [review, setReview] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const sitterName = bookingDraft?.sitterName ?? "Your Sitter";

  function handleSubmit() {
    if (sitterRating === 0) {
      Alert.alert("Please rate your sitter first");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSessionStatus("idle");
    router.replace("/session/receipt");
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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Rate Session</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 30 }]}
      >
        {/* Header message */}
        <View style={styles.topSection}>
          <Ionicons name="star-half" size={40} color={colors.gold} />
          <Text style={[styles.title, { color: colors.foreground }]}>How was your session?</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            Share your experience with {sitterName}
          </Text>
        </View>

        {/* Rate the sitter */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.sitterAvatar, { backgroundColor: "#2563EB" }]}>
              <Text style={styles.sitterInitials}>MC</Text>
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>{sitterName}</Text>
              <Text style={[styles.cardSub, { color: colors.mutedForeground }]}>Rate your sitter</Text>
            </View>
          </View>
          <StarPicker rating={sitterRating} onRating={setSitterRating} />
          {sitterRating > 0 && (
            <Text style={[styles.ratingLabel, { color: colors.teal }]}>
              {["", "Poor", "Fair", "Good", "Great", "Excellent!"][sitterRating]}
            </Text>
          )}
        </View>

        {/* Written review */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Leave a Review</Text>
          <TextInput
            style={[styles.reviewInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder={`Tell others what you loved about ${sitterName.split(" ")[0]}...`}
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={4}
            value={review}
            onChangeText={setReview}
            textAlignVertical="top"
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={sitterRating > 0 ? 0.85 : 1}
          style={[styles.submitBtn, { backgroundColor: sitterRating > 0 ? colors.teal : colors.border }]}
        >
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          <Text style={styles.submitBtnText}>Submit Review</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/(tabs)")}
          activeOpacity={0.8}
        >
          <Text style={[styles.skipText, { color: colors.mutedForeground }]}>Skip for now</Text>
        </TouchableOpacity>
      </ScrollView>
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
  content: { paddingHorizontal: 20, gap: 20, paddingTop: 12 },
  topSection: { alignItems: "center", gap: 10, paddingVertical: 16 },
  title: { fontSize: 24, fontWeight: "700" as const, fontFamily: "Inter_700Bold", textAlign: "center" },
  sub: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center" },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 16,
    alignItems: "center",
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  sitterAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  sitterInitials: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  cardTitle: { fontSize: 17, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  cardSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  starPicker: { flexDirection: "row", gap: 8 },
  ratingLabel: { fontSize: 18, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  section: { gap: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  reviewInput: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    minHeight: 130,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  submitBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  skipText: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
});
