import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BookingProgress } from "@/components/BookingProgress";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const TIMES = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM",
];

function buildCalendar(base: Date) {
  const result: (Date | null)[] = [];
  const first = new Date(base.getFullYear(), base.getMonth(), 1);
  const pad = first.getDay();
  for (let i = 0; i < pad; i++) result.push(null);
  const days = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  for (let d = 1; d <= days; d++) {
    result.push(new Date(base.getFullYear(), base.getMonth(), d));
  }
  return result;
}

export default function BookingStep1() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { bookingDraft, setBookingDraft } = useApp();

  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const calendar = buildCalendar(viewDate);

  function prevMonth() {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  }
  function nextMonth() {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  }

  function handleContinue() {
    if (!selectedDate || !selectedTime || !bookingDraft) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBookingDraft({ ...bookingDraft, date: selectedDate, startTime: selectedTime });
    router.push("/booking/step2");
  }

  function isToday(d: Date) {
    return d.toDateString() === today.toDateString();
  }
  function isPast(d: Date) {
    return d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }
  function isSelected(d: Date) {
    return selectedDate?.toDateString() === d.toDateString();
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          activeOpacity={0.8}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Select Date & Time</Text>
        <View style={{ width: 42 }} />
      </View>

      <BookingProgress step={1} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad + 110 }]}>
        {bookingDraft && (
          <View style={[styles.sitterPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="person-circle" size={18} color={colors.teal} />
            <Text style={[styles.sitterPillText, { color: colors.foreground }]}>
              Booking with{" "}
              <Text style={{ color: colors.teal, fontFamily: "Inter_700Bold" }}>{bookingDraft.sitterName}</Text>
              {" "}· ${bookingDraft.sitterRate}/hr
            </Text>
          </View>
        )}

        {/* Calendar */}
        <View style={[styles.calendarCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.calHeader}>
            <TouchableOpacity onPress={prevMonth} activeOpacity={0.8} style={styles.navBtn}>
              <Feather name="chevron-left" size={20} color={colors.foreground} />
            </TouchableOpacity>
            <Text style={[styles.monthLabel, { color: colors.foreground }]}>
              {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </Text>
            <TouchableOpacity onPress={nextMonth} activeOpacity={0.8} style={styles.navBtn}>
              <Feather name="chevron-right" size={20} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Day labels */}
          <View style={styles.dayLabels}>
            {DAYS.map((d) => (
              <Text key={d} style={[styles.dayLabel, { color: colors.mutedForeground }]}>{d}</Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View style={styles.calGrid}>
            {calendar.map((d, i) => {
              if (!d) return <View key={`pad-${i}`} style={styles.calCell} />;
              const past = isPast(d);
              const sel = isSelected(d);
              const tod = isToday(d);
              return (
                <TouchableOpacity
                  key={d.toDateString()}
                  onPress={() => {
                    if (past) return;
                    Haptics.selectionAsync();
                    setSelectedDate(d);
                  }}
                  activeOpacity={0.8}
                  style={[
                    styles.calCell,
                    sel && { backgroundColor: colors.teal, borderRadius: 10 },
                    tod && !sel && { borderWidth: 1, borderColor: colors.teal, borderRadius: 10 },
                  ]}
                >
                  <Text
                    style={[
                      styles.calDate,
                      { color: past ? colors.border : sel ? "#FFFFFF" : colors.foreground },
                    ]}
                  >
                    {d.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Time Picker */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Select Time</Text>
          <View style={styles.timeGrid}>
            {TIMES.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedTime(t);
                }}
                activeOpacity={0.8}
                style={[
                  styles.timeChip,
                  {
                    backgroundColor: selectedTime === t ? colors.teal : colors.card,
                    borderColor: selectedTime === t ? colors.teal : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.timeChipText,
                    { color: selectedTime === t ? "#FFFFFF" : colors.mutedForeground },
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Continue button */}
      <View style={[styles.footer, { borderTopColor: colors.border, paddingBottom: botPad + 16 }]}>
        <TouchableOpacity
          onPress={handleContinue}
          activeOpacity={selectedDate && selectedTime ? 0.85 : 1}
          style={[
            styles.continueBtn,
            { backgroundColor: selectedDate && selectedTime ? colors.teal : colors.border },
          ]}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
          <Feather name="arrow-right" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  content: { paddingHorizontal: 20, gap: 20, paddingTop: 8 },
  sitterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  sitterPillText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  calendarCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  calHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  dayLabels: {
    flexDirection: "row",
  },
  dayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  calGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  calDate: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  section: { gap: 12 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  timeChipText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    backgroundColor: "transparent",
  },
  continueBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  continueBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
});
