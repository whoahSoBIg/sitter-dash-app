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
            <Text style={
