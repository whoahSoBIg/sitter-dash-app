import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
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
import { CITIES, getCitiesByProvince, City } from "@/data/cities";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const { height } = Dimensions.get("window");

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { selectedCity, setSelectedCity } = useApp();
  const [activeNeighbourhood, setActiveNeighbourhood] = useState("All");
  const [cityPickerVisible, setCityPickerVisible] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const citySitters = SITTERS.filter((s) => s.cityId === selectedCity.id);

  const filtered =
    activeNeighbourhood === "All"
      ? citySitters
      : citySitters.filter((s) =>
          s.neighbourhood.toLowerCase().includes(activeNeighbourhood.toLowerCase())
        );

  const neighbourhoodChips = ["All", ...selectedCity.neighbourhoods];

  const region = {
    latitude: selectedCity.coordinate.latitude,
    longitude: selectedCity.coordinate.longitude,
    latitudeDelta: selectedCity.delta,
    longitudeDelta: selectedCity.delta,
  };

  function handleSelectCity(city: City) {
    Haptics.selectionAsync();
    setSelectedCity(city);
    setActiveNeighbourhood("All");
    setCityPickerVisible(false);
  }

  const provinces = getCitiesByProvince();

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View>
          <Text style={[styles.locationLabel, { color: colors.mutedForeground }]}>
            Your city
          </Text>
          <TouchableOpacity
            style={styles.locationRow}
            activeOpacity={0.8}
            onPress={() => {
              Haptics.selectionAsync();
              setCityPickerVisible(true);
            }}
          >
            <Ionicons name="location" size={16} color={colors.teal} />
            <Text style={[styles.locationText, { color: colors.foreground }]}>
              {selectedCity.name}, {selectedCity.provinceCode}
            </Text>
            <Feather name="chevron-down" size={16} color={colors.teal} />
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

      {/* Neighbourhood Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {neighbourhoodChips.map((f) => (
          <FilterChip
            key={f}
            label={f}
            active={activeNeighbourhood === f}
            onPress={() => {
              Haptics.selectionAsync();
              setActiveNeighbourhood(f);
            }}
          />
        ))}
      </ScrollView>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapWrapper
          style={styles.map}
          initialRegion={region}
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
                <View style={[styles.markerBubble, { backgroundColor: sitter.avatarColor, borderColor: colors.teal }]}>
                  <Text style={styles.markerInitials}>{sitter.initials}</Text>
                </View>
                <View style={[styles.markerPrice, { backgroundColor: colors.teal }]}>
                  <Text style={styles.markerPriceText}>${sitter.ratePerHour}</Text>
                </View>
              </View>
              <MapCallout tooltip>
                <View style={[styles.callout, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.calloutName, { color: colors.foreground }]}>{sitter.name}</Text>
                  <Text style={[styles.calloutSub, { color: colors.mutedForeground }]}>{sitter.neighbourhood}</Text>
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
            {filtered.length} sitter{filtered.length !== 1 ? "s" : ""} in{" "}
            {activeNeighbourhood === "All" ? selectedCity.name : activeNeighbourhood}
          </Text>
          <Text style={[styles.listSub, { color: colors.mutedForeground }]}>
            Tap a pin or card
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.listScroll, { paddingBottom: botPad + 80 }]}
        >
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="location-outline" size={36} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No sitters in {activeNeighbourhood} yet
              </Text>
            </View>
          ) : (
            filtered.map((sitter) => (
              <SitterCard
                key={sitter.id}
                sitter={sitter}
                onPress={() => {
                  Haptics.selectionAsync();
                  router.push(`/sitter/${sitter.id}`);
                }}
              />
            ))
          )}
        </ScrollView>
      </View>

      {/* City Picker Modal */}
      <Modal
        visible={cityPickerVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setCityPickerVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.darkBg }]}>
          {/* Modal header */}
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
                  <Text style={[styles.provinceLabel, { color: colors.teal }]}>
                    {province.name}
                  </Text>
                  <Text style={[styles.provinceCode, { color: colors.mutedForeground }]}>
                    {province.code}
                  </Text>
                </View>
                {province.cities.map((city) => {
                  const isSelected = city.id === selectedCity.id;
                  const sitterCount = SITTERS.filter((s) => s.cityId === city.id).length;
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
                        <Text style={[styles.cityRowName, { color: colors.foreground }]}>
                          {city.name}
                        </Text>
                        <Text style={[styles.cityRowSub, { color: colors.mutedForeground }]}>
                          {sitterCount} sitter{sitterCount !== 1 ? "s" : ""} available
                        </Text>
                      </View>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={20} color={colors.teal} />
                      )}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  locationLabel: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 2 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  locationText: { fontSize: 18, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  emergencyBtn: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  filterScroll: { maxHeight: 44 },
  filterContent: { paddingHorizontal: 20, paddingVertical: 4, flexDirection: "row", alignItems: "center" },
  mapContainer: { height: height * 0.28 },
  map: { flex: 1 },
  markerContainer: { alignItems: "center" },
  markerBubble: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  markerInitials: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  markerPrice: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, marginTop: 3 },
  markerPriceText: { color: "#FFFFFF", fontSize: 10, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  callout: { padding: 10, borderRadius: 10, borderWidth: 1, minWidth: 140 },
  calloutName: { fontSize: 14, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  calloutSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  listContainer: { flex: 1 },
  listHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 14,
  },
  listTitle: { fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  listSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  listScroll: { paddingHorizontal: 20 },
  emptyState: { alignItems: "center", paddingTop: 40, gap: 10 },
  emptyText: { fontSize: 15, fontFamily: "Inter_500Medium", textAlign: "center" },

  // Modal
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 20, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  modalClose: {
    width: 36, height: 36, borderRadius: 18, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  modalContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40, gap: 8 },
  provinceSection: { gap: 8, marginBottom: 8 },
  provinceLabelRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingTop: 8 },
  provinceLabel: { fontSize: 13, fontWeight: "700" as const, fontFamily: "Inter_700Bold", letterSpacing: 0.5, textTransform: "uppercase" },
  provinceCode: { fontSize: 12, fontFamily: "Inter_500Medium" },
  cityRow: {
    flexDirection: "row", alignItems: "center", padding: 14,
    borderRadius: 14, borderWidth: 1, gap: 12,
  },
  cityDot: { width: 10, height: 10, borderRadius: 5 },
  cityRowInfo: { flex: 1 },
  cityRowName: { fontSize: 16, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  cityRowSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
});
