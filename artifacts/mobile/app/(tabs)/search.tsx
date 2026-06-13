import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SitterCard } from "@/components/SitterCard";
import { SITTERS } from "@/data/sitters";
import { useColors } from "@/hooks/useColors";

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = SITTERS.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.university.toLowerCase().includes(query.toLowerCase()) ||
      s.certifications.some((c) => c.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Search</Text>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            placeholder="Name, university, certification..."
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>

        {/* Sort/Filter row */}
        <View style={styles.sortRow}>
          <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
            {filtered.length} sitter{filtered.length !== 1 ? "s" : ""}
          </Text>
          <View style={styles.sortOptions}>
            {["Rating", "Distance", "Price"].map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.sortChip, { backgroundColor: colors.card, borderColor: colors.border }]}
                activeOpacity={0.8}
                onPress={() => Haptics.selectionAsync()}
              >
                <Text style={[styles.sortChipText, { color: colors.mutedForeground }]}>{opt}</Text>
                <Ionicons name="chevron-down" size={12} color={colors.mutedForeground} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => (
          <SitterCard
            sitter={item}
            onPress={() => {
              Haptics.selectionAsync();
              router.push(`/sitter/${item.id}`);
            }}
          />
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 80 },
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No sitters found
            </Text>
          </View>
        }
        scrollEnabled={filtered.length > 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resultCount: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  sortOptions: {
    flexDirection: "row",
    gap: 6,
  },
  sortChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  sortChipText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
});
