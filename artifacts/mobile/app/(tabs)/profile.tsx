import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
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
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

function MenuRow({
  icon,
  label,
  value,
  onPress,
  danger,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.menuRow, { borderBottomColor: colors.border }]}
    >
      <View
        style={[
          styles.menuIcon,
          { backgroundColor: danger ? "#EF444422" : colors.muted },
        ]}
      >
        <Ionicons
          name={icon as any}
          size={18}
          color={danger ? "#EF4444" : colors.teal}
        />
      </View>
      <Text
        style={[styles.menuLabel, { color: danger ? "#EF4444" : colors.foreground }]}
      >
        {label}
      </Text>
      <View style={styles.menuRight}>
        {value && (
          <Text style={[styles.menuValue, { color: colors.mutedForeground }]}>{value}</Text>
        )}
        {!danger && <Feather name="chevron-right" size={16} color={colors.mutedForeground} />}
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { children, setUserType } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.darkBg }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 12, paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 80 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={[styles.avatar, { backgroundColor: colors.navy }]}>
          <Ionicons name="person" size={40} color={colors.teal} />
        </View>
        <Text style={[styles.name, { color: colors.foreground }]}>Sarah Mitchell</Text>
        <Text style={[styles.email, { color: colors.mutedForeground }]}>sarah@example.com</Text>
        <View style={[styles.memberBadge, { backgroundColor: colors.teal + "22", borderColor: colors.teal + "44" }]}>
          <Ionicons name="shield-checkmark" size={13} color={colors.teal} />
          <Text style={[styles.memberText, { color: colors.teal }]}>Verified Parent</Text>
        </View>
      </View>

      {/* Children Profiles */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>My Children</Text>
          <TouchableOpacity activeOpacity={0.8}>
            <Text style={[styles.sectionAction, { color: colors.teal }]}>+ Add</Text>
          </TouchableOpacity>
        </View>
        {children.map((child) => (
          <View key={child.id} style={[styles.childCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.childAvatar, { backgroundColor: colors.muted }]}>
              <Ionicons name="happy-outline" size={20} color={colors.teal} />
            </View>
            <View style={styles.childInfo}>
              <Text style={[styles.childName, { color: colors.foreground }]}>{child.name}</Text>
              <Text style={[styles.childAge, { color: colors.mutedForeground }]}>Age {child.age}</Text>
              {child.allergies !== "None" && child.allergies && (
                <View style={[styles.allergyTag, { backgroundColor: "#EF444422" }]}>
                  <Text style={styles.allergyText}>Allergy: {child.allergies}</Text>
                </View>
              )}
            </View>
            <Feather name="edit-2" size={16} color={colors.mutedForeground} />
          </View>
        ))}
      </View>

      {/* Account */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Account</Text>
        <View style={[styles.menuGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <MenuRow icon="person-outline" label="Edit Profile" />
          <MenuRow icon="card-outline" label="Payment Methods" />
          <MenuRow icon="notifications-outline" label="Notifications" />
          <MenuRow icon="location-outline" label="Saved Addresses" />
        </View>
      </View>

      {/* GoSitter Plus */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.plusCard, { borderColor: colors.gold + "44" }]}
      >
        <View style={styles.plusGradient}>
          <View style={styles.plusTop}>
            <Ionicons name="star" size={22} color={colors.gold} />
            <View style={styles.plusTextBlock}>
              <Text style={[styles.plusTitle, { color: colors.foreground }]}>GoSitter Plus</Text>
              <Text style={[styles.plusSub, { color: colors.mutedForeground }]}>
                $0 service fee for you + priority placement in search results.
              </Text>
            </View>
          </View>
          <View style={[styles.plusBtn, { backgroundColor: colors.gold }]}>
            <Text style={styles.plusBtnText}>$9.99/mo</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Support */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Support</Text>
        <View style={[styles.menuGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <MenuRow icon="help-circle-outline" label="Help Center" />
          <MenuRow icon="document-text-outline" label="Terms & Privacy" />
        </View>
      </View>

      {/* Sign Out */}
      <View style={[styles.menuGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <MenuRow
          icon="log-out-outline"
          label="Sign Out"
          danger
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setUserType(null);
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 24 },
  avatarSection: {
    alignItems: "center",
    gap: 8,
    paddingBottom: 8,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  email: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  memberText: {
    fontSize: 12,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  section: { gap: 12 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  childCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginBottom: 8,
  },
  childAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  childInfo: { flex: 1, gap: 2 },
  childName: {
    fontSize: 15,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  childAge: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  allergyTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  allergyText: {
    fontSize: 11,
    color: "#EF4444",
    fontFamily: "Inter_500Medium",
  },
  menuGroup: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  menuValue: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  plusCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  plusGradient: {
    backgroundColor: "#1A1A2E",
    padding: 16,
    flexDirection: "column",
  },
  plusTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 10,
  },
  plusTextBlock: { flex: 1 },
  plusTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  plusSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  plusBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  plusBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
});
