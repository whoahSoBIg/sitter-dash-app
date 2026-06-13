import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

export function BookingProgress({ step, total = 4 }: { step: number; total?: number }) {
  const colors = useColors();
  return (
    <View style={styles.container}>
      <View style={styles.stepsRow}>
        {Array.from({ length: total }).map((_, i) => (
          <React.Fragment key={i}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: i < step ? colors.teal : colors.border,
                  borderColor: i === step - 1 ? colors.teal : "transparent",
                  width: i === step - 1 ? 10 : 8,
                  height: i === step - 1 ? 10 : 8,
                },
              ]}
            />
            {i < total - 1 && (
              <View
                style={[
                  styles.line,
                  { backgroundColor: i < step - 1 ? colors.teal : colors.border },
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>
        Step {step} of {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 6,
    paddingBottom: 8,
  },
  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  dot: {
    borderRadius: 10,
    borderWidth: 2,
  },
  line: {
    width: 28,
    height: 2,
    marginHorizontal: 3,
    borderRadius: 2,
  },
  label: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
