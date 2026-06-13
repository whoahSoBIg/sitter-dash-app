import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapWrapperProps {
  initialRegion: Region;
  style: any;
  showsUserLocation?: boolean;
  showsMyLocationButton?: boolean;
  userInterfaceStyle?: string;
  children?: React.ReactNode;
}

export function MapWrapper({
  style,
  children,
}: MapWrapperProps) {
  const colors = useColors();
  return (
    <View style={[style, styles.fallback, { backgroundColor: colors.cardBgAlt }]}>
      <Text style={[styles.text, { color: colors.mutedForeground }]}>
        Map view available on mobile
      </Text>
    </View>
  );
}

export function MapMarker({
  coordinate,
  onPress,
  children,
}: {
  coordinate: { latitude: number; longitude: number };
  onPress?: () => void;
  children?: React.ReactNode;
}) {
  return null;
}

export function MapCallout({
  tooltip,
  children,
}: {
  tooltip?: boolean;
  children?: React.ReactNode;
}) {
  return null;
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
});
