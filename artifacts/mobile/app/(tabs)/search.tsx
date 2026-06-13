import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
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

type BackgroundFilter = "any" | "verified" | "top_pro";
type RateFilter = "any" | "under20" | "20to24" | "25plus";

const RATE_OPTIONS: { key: RateFilter; label: string }[] = [
  { key: "any", label: "Any" },
  { key: "under20", label: "Under $20" },
  { key: "20to24", label: "$20 – $24" },
  { key: "25plus", label: "$25+" },
];

const BG_OPTIONS: { key: BackgroundFilter; label: string; icon: string }[] = [
  { key: "any", label: "Any", icon: "shield-outline" },
  { key: "verified", label: "Verified", icon: "shield-checkmark-outline" },
  { key: "top_pro", label: "Top Pro", icon: "shield-checkmark" },
];

function matchesRate(ratePerHour: number, filter: RateFilter): boolean {
  if (filter === "any") return true;
  if (filter === "under20") return ratePerHour < 20;
  if (filter === "20to24") return ratePerHour >= 20 && ratePerHour <= 24;
  if (filter === "25plus") return ratePerHour >= 25;
  return true;
}

function matchesBg(
  bg: "pending" | "verified" | "top_pro",
  filter: BackgroundFilter
): boolean {
  if (filter === "any") return true;
  if (filter === "verified") return bg === "verified" || bg === "top_pro";
  if (filter === "top_pro") return bg === "top_pro";
  return true;
}

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { selectedCity, setSelectedCity } = useApp();

  const [query, setQuery] = useState("");
  const [activeNeighbourhood, setActiveNeighbourhood] = useState("All Areas");
  const [activeSort, setActiveSort] = useState<SortOption>("Rating");
  const [cityPickerVisible, setCityPickerVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  // Filter state
  const [activeUniversity, setActiveUniversity] = useState("Any");
  const [activeRate, setActiveRate] = useState<RateFilter>("any");
  const [activeBg, setActiveBg] = useState<BackgroundFilter>("any");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const neighbourhoodChips = ["All Areas", ...selectedCity.neighbourhoods];

  // All universities in selected city
  const universitiesInCity = useMemo(() => {
    const unis = SITTERS.filter((s) => s.cityId === selectedCity.id).map(
      (s) => s.university
    );
    return ["Any", ...Array.from(new Set(unis)).sort()];
  }, [selectedCity.id]);

  // Active filter count (for badge)
  const activeFilterCount = [
    activeUniversity !== "Any",
    activeRate !== "any",
    activeBg !== "any",
  ].filter(Boolean).length;

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
    const matchesUni =
      activeUniversity === "Any" || s.university === activeUniversity;
    const matchesRateFilter = matchesRate(s.ratePerHour, activeRate);
    const matchesBgFilter = matchesBg(s.backgroundCheck, activeBg);
    return (
      matchesCity &&
      matchesQuery &&
      matchesNeighbourhood &&
      matchesUni &&
      matchesRateFilter &&
      matchesBgFilter
    );
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
    setActiveUniversity("Any");
    setCityPickerVisible(false);
  }

  function clearFilters() {
    setActiveUniversity("Any");
    setActiveRate("any");
    setActiveBg("any");
  }

  const provinces = getCitiesByProvince();

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        {/* Title row */}
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Find a Sitter
          </Text>
          <TouchableOpacity
            onPress={() => {
              Haptics.selectionAsync();
              setCityPickerVisible(true);
            }}
            activeOpacity={0.8}
            style={[
              styles.cityPill,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Ionicons name="location" size={13} color={colors.teal} />
            <Text
              style={[styles.cityPillText, { color: colors.foreground }]}
            >
              {selectedCity.name}, {selectedCity.provinceCode}
            </Text>
            <Feather
              name="chevron-down"
              size={13}
              color={colors.mutedForeground}
            />
          </TouchableOpacity>
        </View>

        {/* Search box + filter button */}
        <View style={styles.searchRow}>
          <View
            style={[
              styles.searchBox,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
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
              <TouchableOpacity
                onPress={() => setQuery("")}
                activeOpacity={0.7}
              >
                <Feather name="x" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter button */}
          <TouchableOpacity
            onPress={() => {
              Haptics.selectionAsync();
              setFilterVisible(true);
            }}
            activeOpacity={0.8}
            style={[
              styles.filterBtn,
              {
                backgroundColor:
                  activeFilterCount > 0
                    ? colors.teal + "22"
                    : colors.card,
                borderColor:
                  activeFilterCount > 0
                    ? colors.teal + "88"
                    : colors.border,
              },
            ]}
          >
            <Ionicons
              name="options-outline"
              size={18}
              color={activeFilterCount > 0 ? colors.teal : colors.mutedForeground}
            />
            {activeFilterCount > 0 && (
              <View
                style={[styles.filterBadge, { backgroundColor: colors.teal }]}
              >
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
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
        <Text
          style={[styles.resultCount, { color: colors.mutedForeground }]}
        >
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
                  backgroundColor:
                    activeSort === opt ? colors.teal + "22" : colors.card,
                  borderColor:
                    activeSort === opt ? colors.teal + "66" : colors.border,
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
                  {
                    color:
                      activeSort === opt
                        ? colors.teal
                        : colors.mutedForeground,
                  },
                ]}
              >
                {opt}
              </Text>
              <Ionicons
                name="chevron-down"
                size={12}
                color={
                  activeSort === opt ? colors.teal : colors.mutedForeground
                }
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
            <Text
              style={[styles.emptyTitle, { color: colors.foreground }]}
            >
              No sitters found
            </Text>
            <Text
              style={[styles.emptyText, { color: colors.mutedForeground }]}
            >
              {activeFilterCount > 0
                ? "Try clearing some filters"
                : "Try a different neighbourhood or search term"}
            </Text>
            {activeFilterCount > 0 && (
              <TouchableOpacity
                onPress={clearFilters}
                activeOpacity={0.8}
                style={[
                  styles.clearBtn,
                  {
                    backgroundColor: colors.teal + "22",
                    borderColor: colors.teal + "66",
                  },
                ]}
              >
                <Text style={[styles.clearBtnText, { color: colors.teal }]}>
                  Clear Filters
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }
        scrollEnabled={filtered.length > 0}
      />

      {/* ── City Picker Modal ─────────────────────────────────────────────── */}
      <Modal
        visible={cityPickerVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setCityPickerVisible(false)}
      >
        <View
          style={[styles.modalContainer, { backgroundColor: colors.darkBg }]}
        >
          <View
            style={[
              styles.modalHeader,
              { borderBottomColor: colors.border },
            ]}
          >
            <Text
              style={[styles.modalTitle, { color: colors.foreground }]}
            >
              Choose Your City
            </Text>
            <TouchableOpacity
              onPress={() => setCityPickerVisible(false)}
              style={[
                styles.modalClose,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Feather name="x" size={18} color={colors.foreground} />
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {provinces.map((province) => (
              <View key={province.code} style={styles.provinceSection}>
                <View style={styles.provinceLabelRow}>
                  <Text
                    style={[
                      styles.provinceLabel,
                      { color: colors.teal },
                    ]}
                  >
                    {province.name}
                  </Text>
                  <Text
                    style={[
                      styles.provinceCode,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {province.code}
                  </Text>
                </View>
                {province.cities.map((city) => {
                  const isSelected = city.id === selectedCity.id;
                  const count = SITTERS.filter(
                    (s) => s.cityId === city.id
                  ).length;
                  return (
                    <TouchableOpacity
                      key={city.id}
                      onPress={() => handleSelectCity(city)}
                      activeOpacity={0.8}
                      style={[
                        styles.cityRow,
                        {
                          backgroundColor: isSelected
                            ? colors.teal + "18"
                            : colors.card,
                          borderColor: isSelected
                            ? colors.teal + "66"
                            : colors.border,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.cityDot,
                          {
                            backgroundColor: isSelected
                              ? colors.teal
                              : colors.border,
                          },
                        ]}
                      />
                      <View style={styles.cityRowInfo}>
                        <Text
                          style={[
                            styles.cityRowName,
                            { color: colors.foreground },
                          ]}
                        >
                          {city.name}
                        </Text>
                        <Text
                          style={[
                            styles.cityRowSub,
                            { color: colors.mutedForeground },
                          ]}
                        >
                          {count} sitter{count !== 1 ? "s" : ""} available
                        </Text>
                      </View>
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={colors.teal}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* ── Filter Modal ──────────────────────────────────────────────────── */}
      <Modal
        visible={filterVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setFilterVisible(false)}
      >
        <View
          style={[styles.modalContainer, { backgroundColor: colors.darkBg }]}
        >
          {/* Header */}
          <View
            style={[
              styles.modalHeader,
              { borderBottomColor: colors.border },
            ]}
          >
            <View>
              <Text
                style={[styles.modalTitle, { color: colors.foreground }]}
              >
                Filters
              </Text>
              {activeFilterCount > 0 && (
                <TouchableOpacity onPress={clearFilters} activeOpacity={0.7}>
                  <Text
                    style={[styles.clearAllText, { color: colors.teal }]}
                  >
                    Clear all ({activeFilterCount})
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              onPress={() => setFilterVisible(false)}
              style={[
                styles.modalClose,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Feather name="x" size={18} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.filterContent}
            showsVerticalScrollIndicator={false}
          >
            {/* ── University ───────────────────────────────────────── */}
            <View style={styles.filterSection}>
              <View style={styles.filterSectionHeader}>
                <Ionicons
                  name="school-outline"
                  size={17}
                  color={colors.teal}
                />
                <Text
                  style={[
                    styles.filterSectionTitle,
                    { color: colors.foreground },
                  ]}
                >
                  University
                </Text>
              </View>
              <View style={styles.filterChipGrid}>
                {universitiesInCity.map((uni) => {
                  const active = activeUniversity === uni;
                  return (
                    <TouchableOpacity
                      key={uni}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setActiveUniversity(uni);
                      }}
                      activeOpacity={0.8}
                      style={[
                        styles.filterOption,
                        {
                          backgroundColor: active
                            ? colors.teal + "22"
                            : colors.card,
                          borderColor: active
                            ? colors.teal + "88"
                            : colors.border,
                        },
                      ]}
                    >
                      {active && (
                        <Ionicons
                          name="checkmark-circle"
                          size={15}
                          color={colors.teal}
                        />
                      )}
                      <Text
                        style={[
                          styles.filterOptionText,
                          {
                            color: active
                              ? colors.teal
                              : colors.foreground,
                          },
                        ]}
                      >
                        {uni}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            {/* ── Hourly Rate ──────────────────────────────────────── */}
            <View style={styles.filterSection}>
              <View style={styles.filterSectionHeader}>
                <Ionicons
                  name="cash-outline"
                  size={17}
                  color={colors.teal}
                />
                <Text
                  style={[
                    styles.filterSectionTitle,
                    { color: colors.foreground },
                  ]}
                >
                  Hourly Rate
                </Text>
              </View>
              <View style={styles.rateGrid}>
                {RATE_OPTIONS.map(({ key, label }) => {
                  const active = activeRate === key;
                  return (
                    <TouchableOpacity
                      key={key}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setActiveRate(key);
                      }}
                      activeOpacity={0.8}
                      style={[
                        styles.rateOption,
                        {
                          backgroundColor: active
                            ? colors.teal + "22"
                            : colors.card,
                          borderColor: active
                            ? colors.teal + "88"
                            : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.rateOptionText,
                          {
                            color: active ? colors.teal : colors.foreground,
                            fontFamily: active
                              ? "Inter_700Bold"
                              : "Inter_500Medium",
                          },
                        ]}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            {/* ── Background Check ─────────────────────────────────── */}
            <View style={styles.filterSection}>
              <View style={styles.filterSectionHeader}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={17}
                  color={colors.teal}
                />
                <Text
                  style={[
                    styles.filterSectionTitle,
                    { color: colors.foreground },
                  ]}
                >
                  Background Check
                </Text>
              </View>
              <Text
                style={[
                  styles.filterSectionSub,
                  { color: colors.mutedForeground },
                ]}
              >
                Show sitters at or above the selected tier
              </Text>
              {BG_OPTIONS.map(({ key, label, icon }) => {
                const active = activeBg === key;
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setActiveBg(key);
                    }}
                    activeOpacity={0.8}
                    style={[
                      styles.bgRow,
                      {
                        backgroundColor: active
                          ? colors.teal + "18"
                          : colors.card,
                        borderColor: active
                          ? colors.teal + "66"
                          : colors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.bgIconWrap,
                        {
                          backgroundColor: active
                            ? colors.teal + "30"
                            : colors.darkBg,
                        },
                      ]}
                    >
                      <Ionicons
                        name={icon as any}
                        size={18}
                        color={active ? colors.teal : colors.mutedForeground}
                      />
                    </View>
                    <View style={styles.bgInfo}>
                      <Text
                        style={[
                          styles.bgLabel,
                          {
                            color: active
                              ? colors.foreground
                              : colors.foreground,
                            fontFamily: active
                              ? "Inter_700Bold"
                              : "Inter_600SemiBold",
                          },
                        ]}
                      >
                        {label}
                      </Text>
                      <Text
                        style={[
                          styles.bgSub,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        {key === "any"
                          ? "All background check levels"
                          : key === "verified"
                          ? "Police check completed & cleared"
                          : "Enhanced check + identity verified"}
                      </Text>
                    </View>
                    {active ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={colors.teal}
                      />
                    ) : (
                      <View
                        style={[
                          styles.radioEmpty,
                          { borderColor: colors.border },
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Apply button */}
          <View
            style={[
              styles.filterFooter,
              {
                backgroundColor: colors.darkBg,
                borderTopColor: colors.border,
                paddingBottom:
                  (Platform.OS === "web" ? 24 : insets.bottom) + 12,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setFilterVisible(false);
              }}
              activeOpacity={0.85}
              style={[styles.applyBtn, { backgroundColor: colors.teal }]}
            >
              <Text style={styles.applyBtnText}>
                Show {filtered.length} sitter{filtered.length !== 1 ? "s" : ""}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, gap: 12, paddingBottom: 4 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 26,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  cityPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  cityPillText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600" as const,
  },
  searchRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  filterBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    fontWeight: "700" as const,
  },
  chipScroll: { maxHeight: 48, marginTop: 8 },
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
  resultCount: { fontSize: 13, fontFamily: "Inter_500Medium", flex: 1 },
  sortOptions: { flexDirection: "row", gap: 6 },
  sortChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  sortChipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  list: { paddingHorizontal: 20, paddingTop: 4 },
  empty: { alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 12 },
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
  clearBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  clearBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold", fontWeight: "600" as const },

  // Shared modal
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 8,
  },

  // City modal
  provinceSection: { gap: 8, marginBottom: 8 },
  provinceLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
  },
  provinceLabel: {
    fontSize: 13,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  provinceCode: { fontSize: 12, fontFamily: "Inter_500Medium" },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  cityDot: { width: 10, height: 10, borderRadius: 5 },
  cityRowInfo: { flex: 1 },
  cityRowName: {
    fontSize: 16,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  cityRowSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },

  // Filter modal
  clearAllText: { fontSize: 13, fontFamily: "Inter_500Medium", marginTop: 3 },
  filterContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20, gap: 0 },
  filterSection: { gap: 14, paddingVertical: 20 },
  filterSectionHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  filterSectionTitle: {
    fontSize: 17,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  filterSectionSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: -6 },
  divider: { height: 1 },
  filterChipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  filterOptionText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  rateGrid: { flexDirection: "row", gap: 8 },
  rateOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  rateOptionText: { fontSize: 13, textAlign: "center" },
  bgRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  bgIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  bgInfo: { flex: 1, gap: 2 },
  bgLabel: { fontSize: 15 },
  bgSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  radioEmpty: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  filterFooter: {
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  applyBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  applyBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
});
