import React from "react";
import MapView, {
  Callout,
  Marker,
  PROVIDER_DEFAULT,
} from "react-native-maps";

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
  initialRegion,
  style,
  showsUserLocation,
  showsMyLocationButton,
  userInterfaceStyle,
  children,
}: MapWrapperProps) {
  return (
    <MapView
      style={style}
      provider={PROVIDER_DEFAULT}
      initialRegion={initialRegion}
      showsUserLocation={showsUserLocation}
      showsMyLocationButton={showsMyLocationButton}
      mapType="standard"
      userInterfaceStyle={userInterfaceStyle as any}
    >
      {children}
    </MapView>
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
  return (
    <Marker coordinate={coordinate} onPress={onPress}>
      {children}
    </Marker>
  );
}

export function MapCallout({
  tooltip,
  children,
}: {
  tooltip?: boolean;
  children?: React.ReactNode;
}) {
  return <Callout tooltip={tooltip}>{children}</Callout>;
}
