import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BookingProgress } from "@/components/BookingProgress";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function BookingStep3() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { bookingDraft, setBookingDraft, children } = useApp();

  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  function toggleChild(id: string) {
    Haptics.selectionAsync();
    setSelectedChildren((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function handleContinue() {
    if (!bookingDraft || selectedChildren.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBookingDraft({ ...bookingDraft, selectedChildren, notes });
    router.push("/booking/step4");
  }

  const canContinue = selectedChildren.length > 0;

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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Children & Notes</Text>
        <View style={{ width: 42 }} />
      </View>

      <BookingProgress step={3} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 110 }]}
      >
        {/* Select Children */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Select Children</Text>
          <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>
            Their profiles will be shared with the sitter
          </Text>
          {children.map((child) => {
            const selected = selectedChildren.includes(child.id);
            return (
              <TouchableOpacity
                key={child.id}
                onPress={() => toggleChild(child.id)}
                activeOpacity={0.85}
                style={[
                  styles.childRow,
                  {
                    backgroundColor: selected ? colors.teal + "22" : colors.card,
                    borderColor: selected ? colors.teal : colors.border,
                  },
                ]}
              >
                <View style={[styles.childAvatar, { backgroundColor: selected ? colors.teal : colors.muted }]}>
                  <Ionicons name="happy-outline" size={20} color={selected ? "#FFFFFF" : colors.teal} />
                </View>
                <View style={styles.childInfo}>
                  <Text style={[styles.childName, { color: colors.foreground }]}>{child.name}</Text>
                  <Text style={[styles.childAge, { color: colors.mutedForeground }]}>Age {child.age}</Text>
                  {child.allergies !== "None" && child.allergies && (
                    <Text style={[styles.childAllergy, { color: "#EF4444" }]}>
                      Allergy: {child.allergies}
                    </Text>
                  )}
                </View>
                <View
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor: selected ? colors.teal : "transparent",
                      borderColor: selected ? colors.teal : colors.border,
                    },
                  ]}
                >
                  {selected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Notes for Sitter</Text>
          <TextInput
            style={[styles.notesInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder="Bedtime routine, allergies, special instructions..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Continue */}
      <View style={[styles.footer, { borderTopColor: colors.border, paddingBottom: botPad + 16, backgroundColor: colors.darkBg }]}>
        <TouchableOpacity
          onPress={handleContinue}
          activeOpacity={canContinue ? 0.85 : 1}
          style={[styles.continueBtn, { backgroundColor: canContinue ? colors.teal : colors.border }]}
        >
          <Text style={styles.continueBtnText}>
            {canContinue ? "Continue" : "Select at least one child"}
          </Text>
          {canContinue && <Feather name="arrow-right" size={18} color="#FFFFFF" />}
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
  content: { paddingHorizontal: 20, gap: 24, paddingTop: 12 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  sectionSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: -6 },
  childRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    marginBottom: 8,
  },
  childAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  childInfo: { flex: 1, gap: 2 },
  childName: { fontSize: 16, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  childAge: { fontSize: 13, fontFamily: "Inter_400Regular" },
  childAllergy: { fontSize: 12, fontFamily: "Inter_500Medium" },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  notesInput: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    minHeight: 120,
  },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 16, borderTopWidth: 1 },
  continueBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  continueBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
});
