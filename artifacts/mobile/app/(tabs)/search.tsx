import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FilterChip, SitterCard } from "@/components/SitterCard";
import { SITTERS } from "@/data/sitters";
import { useColors } from "@/hooks/useColors";

const NEIGHBOURHOODS = [
  "All Areas",
  "Downtown",
  "James Bay",
  "Fairfield",
  "Oak Bay",
  "Rockland",
  "Saanich",
];

const SORT_OPTIONS = ["Rating", "Distance", "Price"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [activeNeighbourhood, setActiveNeighbourhood] = useState("All Areas");
  const [activeSort, setActiveSort] = useState<SortOption>("Rating");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = SITTERS.filter((s) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.university.toLowerCase().includes(q) ||
      s.neighbourhood.toLowerCase().includes(q) ||
      s.certifications.some((c) => c.toLowerCase().includes(q));
    const matchesNeighbourhood =
      activeNeighbourhood === "All Areas" ||
      s.neighbourhood.toLowerCase().includes(activeNeighbourhood.toLowerCase());
    return matchesQuery && matchesNeighbourhood;
  }).sort((a, b) => {
    if (activeSort === "Rating") return b.rating - a.rating;
    if (activeSort === "Distance") return a.distance - b.distance;
    if (activeSort === "Price") return a.ratePerHour - b.ratePerHour;
    return 0;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        {/* Title + location */}
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.foreground }]}>Find a Sitter</Text>
          <View style={styles.locationPill}>
            <Ionicons name="location" size={12} color={colors.teal} />
            <Text style={[styles.locationText, { color: colors.teal }]}>Victoria, BC</Text>
          </View>
        </View>

        {/* Search box */}
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            placeholder="Name, neighbourhood, certification..."
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")} activeOpacity={0.7}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Neighbourhood filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chipContent}
      >
        {NEIGHBOURHOODS.map((n) => (
          <FilterChip
            key={n}
            label={n}
            active={activeNeighbourhood === n}
            onPress={() => {
              Haptics.selectionAsync();
              setActiveNeighbourhood(n);
            }}
          />
        ))}
      </ScrollView>

      {/* Result count + sort */}
      <View style={[styles.sortRow, { paddingHorizontal: 20 }]}>
        <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
          {filtered.length} sitter{filtered.length !== 1 ? "s" : ""}
          {activeNeighbourhood !== "All Areas" ? ` in ${activeNeighbourhood}` : " in Victoria, BC"}
        </Text>
        <View style={styles.sortOptions}>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.sortChip,
                {
                  backgroundColor: activeSort === opt ? colors.teal + "22" : colors.card,
                  borderColor: activeSort === opt ? colors.teal + "66" : colors.border,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => {
                Haptics.selectionAsync();
                setActiveSort(opt);
              }}
            >
              <Text
                style={[
                  styles.sortChipText,
                  { color: activeSort === opt ? colors.teal : colors.mutedForeground },
                ]}
              >
                {opt}
              </Text>
              <Ionicons
                name="chevron-down"
                size={12}
                color={activeSort === opt ? colors.teal : colors.mutedForeground}
              />
            </TouchableOpacity>
          ))}
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
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No sitters found
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Try a different neighbourhood or search term
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
    paddingBottom: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600" as const,
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
  chipScroll: {
    maxHeight: 48,
    marginTop: 8,
  },
  chipContent: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  resultCount: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    flex: 1,
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
    paddingTop: 4,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    fontWeight: "700" as const,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
