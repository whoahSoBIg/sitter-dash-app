import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

interface NotificationBannerProps {
  message: string;
  visible: boolean;
  onHide: () => void;
}

export function NotificationBanner({ message, visible, onHide }: NotificationBannerProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-140)).current;
  const topOffset = Platform.OS === "web" ? 72 : insets.top + 8;

  useEffect(() => {
    if (!visible) return;
    translateY.setValue(-140);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 90,
      friction: 12,
    }).start();
    const timer = setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -140,
        duration: 280,
        useNativeDriver: true,
      }).start(() => onHide());
    }, 4000);
    return () => clearTimeout(timer);
  }, [visible, message]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.banner,
        {
          top: topOffset,
          backgroundColor: colors.navy,
          borderColor: colors.teal + "55",
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={[styles.logoMark, { backgroundColor: colors.teal }]}>
        <Ionicons name="home" size={14} color="#FFFFFF" />
      </View>
      <View style={styles.textBlock}>
        <Text style={[styles.appName, { color: "#FFFFFF" }]}>GoSitter</Text>
        <Text style={[styles.message, { color: "#FFFFFFCC" }]} numberOfLines={2}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 9999,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 12,
  },
  logoMark: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: { flex: 1, gap: 2 },
  appName: { fontSize: 13, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  message: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
});
