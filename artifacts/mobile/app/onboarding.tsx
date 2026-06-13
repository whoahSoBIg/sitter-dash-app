import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { CITIES, getCitiesByProvince, City } from "@/data/cities";
import { useApp } from "@/context/AppContext";

type Step = 1 | 2 | 3;

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setSelectedCity, setUserType } = useApp();

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  // Step 1 — name
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Step 2 — first child
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [childAllergies, setChildAllergies] = useState("");
  const [skipChild, setSkipChild] = useState(false);

  // Step 3 — city
  const [pickedCity, setPickedCity] = useState<City>(CITIES[0]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;
  const provinces = getCitiesByProvince();

  function nextStep() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < 3) setStep((step + 1) as Step);
    else handleFinish();
  }

  async function handleFinish() {
    setLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSelectedCity(pickedCity);
    setUserType("parent");
    router.replace("/(tabs)");
  }

  const progress = (step / 3) * 100;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.darkBg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%` as any, backgroundColor: colors.teal },
            ]}
          />
        </View>
        <Text style={[styles.stepLabel, { color: colors.mutedForeground }]}>
          Step {step} of 3
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: botPad + 100 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Step 1: Name ─────────────────────────────────────── */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <View style={[styles.iconCircle, { backgroundColor: colors.teal + "22", borderColor: colors.teal + "44" }]}>
              <Ionicons name="person" size={36} color={colors.teal} />
            </View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>
              What's your name?
            </Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>
              This is how sitters will know you
            </Text>
            <View style={styles.fields}>
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: colors.foreground }]}>First Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
                  placeholder="Sarah"
                  placeholderTextColor={colors.mutedForeground}
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoFocus
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: colors.foreground }]}>Last Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
                  placeholder="Mitchell"
                  placeholderTextColor={colors.mutedForeground}
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </View>
            </View>
          </View>
        )}

        {/* ── Step 2: Add Child ─────────────────────────────────── */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <View style={[styles.iconCircle, { backgroundColor: colors.teal + "22", borderColor: colors.teal + "44" }]}>
              <Ionicons name="happy" size={36} color={colors.teal} />
            </View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>
              Add your first child
            </Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>
              Sitters will be briefed on your kids before arrival
            </Text>

            {!skipChild ? (
              <View style={styles.fields}>
                <View style={styles.fieldGroup}>
                  <Text style={[styles.label, { color: colors.foreground }]}>Child's Name</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
                    placeholder="Emma"
                    placeholderTextColor={colors.mutedForeground}
                    value={childName}
                    onChangeText={setChildName}
                    autoCapitalize="words"
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={[styles.label, { color: colors.foreground }]}>Age</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
                    placeholder="6"
                    placeholderTextColor={colors.mutedForeground}
                    value={childAge}
                    onChangeText={setChildAge}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={[styles.label, { color: colors.foreground }]}>Allergies or special notes</Text>
                  <TextInput
                    style={[styles.input, styles.inputMulti, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
                    placeholder="Peanuts, gluten-free, etc. (optional)"
                    placeholderTextColor={colors.mutedForeground}
                    value={childAllergies}
                    onChangeText={setChildAllergies}
                    multiline
                  />
                </View>
                <TouchableOpacity
                  onPress={() => { Haptics.selectionAsync(); setSkipChild(true); }}
                  activeOpacity={0.7}
                  style={styles.skipRow}
                >
                  <Text style={[styles.skipText, { color: colors.mutedForeground }]}>
                    I'll add children later
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.skippedBox}>
                <Ionicons name="checkmark-circle" size={40} color={colors.mutedForeground} />
                <Text style={[styles.skippedText, { color: colors.mutedForeground }]}>
                  No problem — you can add children from your Profile tab anytime.
                </Text>
                <TouchableOpacity
                  onPress={() => setSkipChild(false)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.skipText, { color: colors.teal }]}>Add one now</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* ── Step 3: Pick City ─────────────────────────────────── */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <View style={[styles.iconCircle, { backgroundColor: colors.teal + "22", borderColor: colors.teal + "44" }]}>
              <Ionicons name="location" size={36} color={colors.teal} />
            </View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>
              Where are you located?
            </Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>
              We'll show you sitters near you
            </Text>
            <View style={styles.cityList}>
              {provinces.map((province) => (
                <View key={province.code} style={styles.provinceSection}>
                  <Text style={[styles.provinceLabel, { color: colors.teal }]}>
                    {province.name}
                  </Text>
                  {province.cities.map((city) => {
                    const isSelected = city.id === pickedCity.id;
                    return (
                      <TouchableOpacity
                        key={city.id}
                        onPress={() => { Haptics.selectionAsync(); setPickedCity(city); }}
                        activeOpacity={0.8}
                        style={[
                          styles.cityRow,
                          {
                            backgroundColor: isSelected ? colors.teal + "18" : colors.card,
                            borderColor: isSelected ? colors.teal : colors.border,
                          },
                        ]}
                      >
                        <View style={[styles.cityDot, { backgroundColor: isSelected ? colors.teal : colors.border }]} />
                        <Text style={[styles.cityName, { color: colors.foreground }]}>{city.name}</Text>
                        {isSelected && <Ionicons name="checkmark-circle" size={20} color={colors.teal} />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer button */}
      <View style={[styles.footer, { borderTopColor: colors.border, paddingBottom: botPad + 16, backgroundColor: colors.darkBg }]}>
        <TouchableOpacity
          onPress={nextStep}
          activeOpacity={0.85}
          disabled={loading}
          style={[styles.nextBtn, { backgroundColor: colors.teal, opacity: loading ? 0.7 : 1 }]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.nextBtnText}>
                {step === 3 ? "Let's Go!" : "Continue"}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, gap: 8, paddingBottom: 8 },
  progressTrack: { height: 4, backgroundColor: "#ffffff18", borderRadius: 2 },
  progressFill: { height: 4, borderRadius: 2 },
  stepLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  content: { paddingHorizontal: 24, paddingTop: 16 },
  stepContent: { gap: 20 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40, borderWidth: 1,
    alignItems: "center", justifyContent: "center", alignSelf: "center",
  },
  stepTitle: { fontSize: 28, fontWeight: "700", fontFamily: "Inter_700Bold", textAlign: "center", letterSpacing: -0.5 },
  stepSub: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center" },
  fields: { gap: 16 },
  fieldGroup: { gap: 6 },
  label: { fontSize: 14, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, fontFamily: "Inter_400Regular" },
  inputMulti: { height: 80, textAlignVertical: "top" },
  skipRow: { alignItems: "center", paddingTop: 4 },
  skipText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  skippedBox: { alignItems: "center", gap: 12, paddingTop: 20 },
  skippedText: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
  cityList: { gap: 16 },
  provinceSection: { gap: 8 },
  provinceLabel: { fontSize: 12, fontWeight: "700", fontFamily: "Inter_700Bold", letterSpacing: 1, textTransform: "uppercase" },
  cityRow: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 14, borderWidth: 1, gap: 12 },
  cityDot: { width: 10, height: 10, borderRadius: 5 },
  cityName: { flex: 1, fontSize: 16, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1 },
  nextBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, borderRadius: 14, gap: 8 },
  nextBtnText: { color: "#fff", fontSize: 17, fontWeight: "700", fontFamily: "Inter_700Bold" },
});
