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
import { signIn, signUp } from "@/lib/supabase";

type Mode = "login" | "signup";
type Role = "parent" | "sitter";

export default function AuthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<Role>("parent");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (mode === "signup" && (!firstName || !lastName)) {
      setError("Please enter your full name.");
      return;
    }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password, role, firstName, lastName);
      }
      router.replace("/(tabs)");
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.darkBg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={[styles.logoCircle, { backgroundColor: colors.teal + "22", borderColor: colors.teal + "44" }]}>
            <Ionicons name="people" size={36} color={colors.teal} />
          </View>
          <Text style={[styles.appName, { color: colors.foreground }]}>GoSitter</Text>
          <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </Text>
        </View>

        {/* Mode toggle */}
        <View style={[styles.modeToggle, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {(["login", "signup"] as Mode[]).map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.modeBtn, { backgroundColor: mode === m ? colors.teal : "transparent" }]}
              onPress={() => { Haptics.selectionAsync(); setMode(m); setError(null); }}
              activeOpacity={0.8}
            >
              <Text style={[styles.modeBtnText, { color: mode === m ? "#fff" : colors.mutedForeground }]}>
                {m === "login" ? "Sign In" : "Sign Up"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Role picker — signup only */}
        {mode === "signup" && (
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.foreground }]}>I am a...</Text>
            <View style={styles.roleRow}>
              {(["parent", "sitter"] as Role[]).map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => { Haptics.selectionAsync(); setRole(r); }}
                  activeOpacity={0.8}
                  style={[
                    styles.roleCard,
                    {
                      backgroundColor: role === r ? colors.teal + "18" : colors.card,
                      borderColor: role === r ? colors.teal : colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={r === "parent" ? "home-outline" : "people-outline"}
                    size={28}
                    color={role === r ? colors.teal : colors.mutedForeground}
                  />
                  <Text style={[styles.roleLabel, { color: role === r ? colors.teal : colors.foreground }]}>
                    {r === "parent" ? "Parent" : "Sitter"}
                  </Text>
                  <Text style={[styles.roleSub, { color: colors.mutedForeground }]}>
                    {r === "parent" ? "I need a sitter" : "I want to sit"}
                  </Text>
                  {role === r && (
                    <Ionicons name="checkmark-circle" size={18} color={colors.teal} style={styles.roleCheck} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Name fields — signup only */}
        {mode === "signup" && (
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <Text style={[styles.label, { color: colors.foreground }]}>First Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
                placeholder="Sarah"
                placeholderTextColor={colors.mutedForeground}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.nameField}>
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
        )}

        {/* Email */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.foreground }]}>Email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder="you@example.com"
            placeholderTextColor={colors.mutedForeground}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Password */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.foreground }]}>Password</Text>
          <View style={[styles.passwordBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TextInput
              style={[styles.passwordInput, { color: colors.foreground }]}
              placeholder="••••••••"
              placeholderTextColor={colors.mutedForeground}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7}>
              <Feather name={showPassword ? "eye-off" : "eye"} size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Error */}
        {error && (
          <View style={[styles.errorBox, { backgroundColor: "#EF444422", borderColor: "#EF444444" }]}>
            <Ionicons name="alert-circle" size={16} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.teal, opacity: loading ? 0.7 : 1 }]}
          onPress={handleSubmit}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>
              {mode === "login" ? "Sign In" : "Create Account"}
            </Text>
          )}
        </TouchableOpacity>

        {/* Switch mode */}
        <TouchableOpacity
          onPress={() => { Haptics.selectionAsync(); setMode(mode === "login" ? "signup" : "login"); setError(null); }}
          activeOpacity={0.7}
          style={styles.switchRow}
        >
          <Text style={[styles.switchText, { color: colors.mutedForeground }]}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <Text style={{ color: colors.teal, fontFamily: "Inter_600SemiBold" }}>
              {mode === "login" ? "Sign Up" : "Sign In"}
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, gap: 20 },
  logoSection: { alignItems: "center", gap: 10, marginBottom: 8 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  appName: { fontSize: 32, fontWeight: "700", fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  tagline: { fontSize: 15, fontFamily: "Inter_400Regular" },
  modeToggle: {
    flexDirection: "row", borderRadius: 14, borderWidth: 1, padding: 3, gap: 3,
  },
  modeBtn: { flex: 1, paddingVertical: 10, borderRadius: 11, alignItems: "center" },
  modeBtnText: { fontSize: 15, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  section: { gap: 8 },
  label: { fontSize: 14, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  input: {
    borderWidth: 1, borderRadius: 12, paddingHorizontal: 14,
    paddingVertical: 13, fontSize: 15, fontFamily: "Inter_400Regular",
  },
  nameRow: { flexDirection: "row", gap: 12 },
  nameField: { flex: 1, gap: 8 },
  passwordBox: {
    flexDirection: "row", alignItems: "center", borderWidth: 1,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, gap: 10,
  },
  passwordInput: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  roleRow: { flexDirection: "row", gap: 12 },
  roleCard: {
    flex: 1, borderWidth: 1.5, borderRadius: 14, padding: 16,
    alignItems: "center", gap: 6,
  },
  roleLabel: { fontSize: 16, fontWeight: "700", fontFamily: "Inter_700Bold" },
  roleSub: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center" },
  roleCheck: { position: "absolute", top: 10, right: 10 },
  errorBox: {
    flexDirection: "row", alignItems: "center", gap: 8,
    padding: 12, borderRadius: 10, borderWidth: 1,
  },
  errorText: { color: "#EF4444", fontSize: 13, fontFamily: "Inter_400Regular", flex: 1 },
  submitBtn: {
    paddingVertical: 16, borderRadius: 14, alignItems: "center", marginTop: 4,
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "700", fontFamily: "Inter_700Bold" },
  switchRow: { alignItems: "center", paddingBottom: 8 },
  switchText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
