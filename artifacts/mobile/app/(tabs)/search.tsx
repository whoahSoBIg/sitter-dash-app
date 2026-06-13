import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
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
import { CITIES, getCitiesByProvince, City } from "@/data/cities";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const SORT_OPTIONS = ["Rating", "Distance", "Price"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { selectedCity, setSelectedCity } = useApp();
  const [query, setQuery] = useState("");
  const [activeNeighbourhood, setActiveNeighbourhood] = useState("All Areas");
  const [activeSort, setActiveSort] = useState<SortOption>("Rating");
  const [cityPickerVisible, setCityPickerVisible] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const neighbourhoodChips = ["All Areas", ...selectedCity.neighbourhoods];

  const filtered = SITTERS.filter((s) => {
    const q = query.toLowerCase();
    const matchesCity = s.cityId === selectedCity.id;
    const matchesQuery =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.university.toLowerCase().includes(q) ||
      s.neighbourhood.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.certifications.some((c) => c.toLowerCase().includes(q));
    const matchesNeighbourhood =
      activeNeighbourhood === "All Areas" ||
      s.neighbourhood.toLowerCase().includes(activeNeighbourhood.toLowerCase());
    return matchesCity && matchesQuery && matchesNeighbourhood;
  }).sort((a, b) => {
    if (activeSort === "Rating") return b.rating - a.rating;
    if (activeSort === "Distance") return a.distance - b.distance;
    if (activeSort === "Price") return a.ratePerHour - b.ratePerHour;
    return 0;
  });

  function handleSelectCity(city: City) {
    Haptics.selectionAsync();
    setSelectedCity(city);
    setActiveNeighbourhood("All Areas");
    setCityPickerVisible(false);
  }

  const provinces = getCitiesByProvince();

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        {/* Title row */}
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.foreground }]}>Find a Sitter</Text>
          <TouchableOpacity
            onPress={() => {
              Haptics.selectionAsync();
              setCityPickerVisible(true);
            }}
            activeOpacity={0.8}
            style={[styles.cityPill, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name="location" size={13} color={colors.teal} />
            <Text style={[styles.cityPillText, { color: colors.foreground }]}>
              {selectedCity.name}, {selectedCity.provinceCode}
            </Text>
            <Feather name="chevron-down" size={13} color={colors.mutedForeground} />
          </TouchableOpacity>
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

      {/* Neighbourhood chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chipContent}
      >
        {neighbourhoodChips.map((n) => (
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
          {activeNeighbourhood !== "All Areas"
            ? ` in ${activeNeighbourhood}`
            : ` in ${selectedCity.name}`}
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
              <Text style={[styles.sortChipText, { color: activeSort === opt ? colors.teal : colors.mutedForeground }]}>
                {opt}
              </Text>
              <Ionicons name="chevron-down" size={12} color={activeSort === opt ? colors.teal : colors.mutedForeground} />
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
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No sitters found</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Try a different neighbourhood or search term
            </Text>
          </View>
        }
        scrollEnabled={filtered.length > 0}
      />

      {/* City Picker Modal */}
      <Modal
        visible={cityPickerVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setCityPickerVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.darkBg }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Choose Your City</Text>
            <TouchableOpacity
              onPress={() => setCityPickerVisible(false)}
              style={[styles.modalClose, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Feather name="x" size={18} color={colors.foreground} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            {provinces.map((province) => (
              <View key={province.code} style={styles.provinceSection}>
                <View style={styles.provinceLabelRow}>
                  <Text style={[styles.provinceLabel, { color: colors.teal }]}>{province.name}</Text>
                  <Text style={[styles.provinceCode, { color: colors.mutedForeground }]}>{province.code}</Text>
                </View>
                {province.cities.map((city) => {
                  const isSelected = city.id === selectedCity.id;
                  const count = SITTERS.filter((s) => s.cityId === city.id).length;
                  return (
                    <TouchableOpacity
                      key={city.id}
                      onPress={() => handleSelectCity(city)}
                      activeOpacity={0.8}
                      style={[
                        styles.cityRow,
                        {
                          backgroundColor: isSelected ? colors.teal + "18" : colors.card,
                          borderColor: isSelected ? colors.teal + "66" : colors.border,
                        },
                      ]}
                    >
                      <View style={[styles.cityDot, { backgroundColor: isSelected ? colors.teal : colors.border }]} />
                      <View style={styles.cityRowInfo}>
                        <Text style={[styles.cityRowName, { color: colors.foreground }]}>{city.name}</Text>
                        <Text style={[styles.cityRowSub, { color: colors.mutedForeground }]}>
                          {count} sitter{count !== 1 ? "s" : ""} available
                        </Text>
                      </View>
                      {isSelected && <Ionicons name="checkmark-circle" size={20} color={colors.teal} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, gap: 12, paddingBottom: 4 },
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 26, fontWeight: "700" as const, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  cityPill: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1,
  },
  cityPillText: { fontSize: 13, fontFamily: "Inter_600SemiBold", fontWeight: "600" as const },
  searchBox: {
    flexDirection: "row", alignItems: "center", borderRadius: 14,
    borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, gap: 10,
  },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  chipScroll: { maxHeight: 48, marginTop: 8 },
  chipContent: { paddingHorizontal: 20, paddingVertical: 6, flexDirection: "row", alignItems: "center" },
  sortRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 },
  resultCount: { fontSize: 13, fontFamily: "Inter_500Medium", flex: 1 },
  sortOptions: { flexDirection: "row", gap: 6 },
  sortChip: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
  sortChipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  list: { paddingHorizontal: 20, paddingTop: 4 },
  empty: { alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 8 },
  emptyTitle: { fontSize: 17, fontFamily: "Inter_700Bold", fontWeight: "700" as const },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },

  // Modal
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 20, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  modalClose: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  modalContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40, gap: 8 },
  provinceSection: { gap: 8, marginBottom: 8 },
  provinceLabelRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingTop: 8 },
  provinceLabel: { fontSize: 13, fontWeight: "700" as const, fontFamily: "Inter_700Bold", letterSpacing: 0.5, textTransform: "uppercase" },
  provinceCode: { fontSize: 12, fontFamily: "Inter_500Medium" },
  cityRow: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 14, borderWidth: 1, gap: 12 },
  cityDot: { width: 10, height: 10, borderRadius: 5 },
  cityRowInfo: { flex: 1 },
  cityRowName: { fontSize: 16, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  cityRowSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
});
