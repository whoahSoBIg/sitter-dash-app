import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FilterChip, SitterCard } from "@/components/SitterCard";
import { MapWrapper, MapMarker, MapCallout } from "@/components/MapViewWrapper";
import { SITTERS, Sitter } from "@/data/sitters";
import { useColors } from "@/hooks/useColors";

const { height } = Dimensions.get("window");

const VICTORIA = {
  latitude: 48.4284,
  longitude: -123.3656,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

const FILTERS = [
  "All",
  "Downtown",
  "James Bay",
  "Fairfield",
  "Oak Bay",
  "Rockland",
  "Saanich",
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState("All");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  function getFilteredSitters(): Sitter[] {
    if (activeFilter === "All") return SITTERS;
    const needle = activeFilter.toLowerCase();
    return SITTERS.filter((s) =>
      s.neighbourhood.toLowerCase().includes(needle)
    );
  }

  const filtered = getFilteredSitters();

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View>
          <Text style={[styles.locationLabel, { color: colors.mutedForeground }]}>
            Your location
          </Text>
          <TouchableOpacity style={styles.locationRow} activeOpacity={0.8}>
            <Ionicons name="location" size={16} color={colors.teal} />
            <Text style={[styles.locationText, { color: colors.foreground }]}>
              Victoria, BC
            </Text>
            <Feather name="chevron-down" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.emergencyBtn, { backgroundColor: "#EF444422", borderColor: "#EF444444" }]}
          activeOpacity={0.8}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            router.push("/emergency");
          }}
        >
          <Ionicons name="warning" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map((f) => (
          <FilterChip
            key={f}
            label={f}
            active={activeFilter === f}
            onPress={() => {
              Haptics.selectionAsync();
              setActiveFilter(f);
            }}

          />
        ))}
      </ScrollView>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapWrapper
          style={styles.map}
          initialRegion={VICTORIA}
          showsUserLocation
          showsMyLocationButton={false}
          userInterfaceStyle="dark"
        >
          {filtered.map((sitter) => (
            <MapMarker
              key={sitter.id}
              coordinate={sitter.coordinate}
              onPress={() => {
                Haptics.selectionAsync();
                router.push(`/sitter/${sitter.id}`);
              }}
            >
              <View style={styles.markerContainer}>
                <View
                  style={[
                    styles.markerBubble,
                    { backgroundColor: sitter.avatarColor, borderColor: colors.teal },
                  ]}
                >
                  <Text style={styles.markerInitials}>{sitter.initials}</Text>
                </View>
                <View style={[styles.markerPrice, { backgroundColor: colors.teal }]}>
                  <Text style={styles.markerPriceText}>${sitter.ratePerHour}</Text>
                </View>
              </View>
              <MapCallout tooltip>
                <View style={[styles.callout, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.calloutName, { color: colors.foreground }]}>{sitter.name}</Text>
                  <Text style={[styles.calloutSub, { color: colors.mutedForeground }]}>{sitter.university}</Text>
                </View>
              </MapCallout>
            </MapMarker>
          ))}
        </MapWrapper>
      </View>

      {/* Sitter List */}
      <View style={[styles.listContainer, { backgroundColor: colors.darkBg }]}>
        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, { color: colors.foreground }]}>
            {filtered.length} sitter{filtered.length !== 1 ? "s" : ""} nearby
          </Text>
          <Text style={[styles.listSub, { color: colors.mutedForeground }]}>
            Tap a pin or card to view profile
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listScroll,
            { paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 80 },
          ]}
        >
          {filtered.map((sitter) => (
            <SitterCard
              key={sitter.id}
              sitter={sitter}
              onPress={() => {
                Haptics.selectionAsync();
                router.push(`/sitter/${sitter.id}`);
              }}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  locationLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 18,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  emergencyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  filterScroll: { maxHeight: 44 },
  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  mapContainer: {
    height: height * 0.28,
  },
  map: { flex: 1 },
  markerContainer: {
    alignItems: "center",
  },
  markerBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  markerInitials: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  markerPrice: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 3,
  },
  markerPriceText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  callout: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 140,
  },
  calloutName: {
    fontSize: 14,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  calloutSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  listContainer: {
    flex: 1,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  listSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  listScroll: {
    paddingHorizontal: 20,
  },
});
