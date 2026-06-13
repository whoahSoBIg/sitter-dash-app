import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useChat, ChatMessage } from "@/hooks/useChat";
import { useColors } from "@/hooks/useColors";

function formatTime(ts: number) {
  const d = new Date(ts);
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function MessageBubble({
  message,
  sitterInitials,
  sitterAvatarColor,
}: {
  message: ChatMessage;
  sitterInitials: string;
  sitterAvatarColor: string;
}) {
  const colors = useColors();
  const isParent = message.sender === "parent";

  return (
    <View style={[styles.bubbleRow, isParent ? styles.bubbleRowRight : styles.bubbleRowLeft]}>
      {!isParent && (
        <View style={[styles.sitterAvatar, { backgroundColor: sitterAvatarColor }]}>
          <Text style={styles.sitterAvatarText}>{sitterInitials}</Text>
        </View>
      )}
      <View style={styles.bubbleContent}>
        <View
          style={[
            styles.bubble,
            isParent
              ? { backgroundColor: colors.teal, borderBottomRightRadius: 4 }
              : {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderBottomLeftRadius: 4,
                },
          ]}
        >
          <Text style={[styles.bubbleText, { color: isParent ? "#FFFFFF" : colors.foreground }]}>
            {message.text}
          </Text>
        </View>
        <Text
          style={[
            styles.timestamp,
            { color: colors.mutedForeground, textAlign: isParent ? "right" : "left" },
          ]}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>
      {isParent && (
        <View style={[styles.parentAvatar, { backgroundColor: colors.navy }]}>
          <Ionicons name="person" size={14} color={colors.teal} />
        </View>
      )}
    </View>
  );
}

function TypingIndicator({ sitterInitials, color }: { sitterInitials: string; color: string }) {
  const colors = useColors();
  return (
    <View style={styles.bubbleRowLeft}>
      <View style={[styles.sitterAvatar, { backgroundColor: color }]}>
        <Text style={styles.sitterAvatarText}>{sitterInitials}</Text>
      </View>
      <View style={[styles.typingBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.typingDot, { backgroundColor: colors.mutedForeground }]} />
        <View style={[styles.typingDot, { backgroundColor: colors.mutedForeground }]} />
        <View style={[styles.typingDot, { backgroundColor: colors.mutedForeground }]} />
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { bookingDraft } = useApp();

  const sitterName = bookingDraft?.sitterName ?? "Maya Chen";
  const sitterInitials = sitterName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  const sitterAvatarColor = "#2563EB";

  const { messages, isTyping, sendMessage } = useChat(sitterName);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  function handleSend() {
    const text = inputText.trim();
    if (!text) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInputText("");
    sendMessage(text);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }

  // Render newest at bottom — use regular FlatList with scrollToEnd
  const allItems: Array<ChatMessage | { id: "typing" }> = [
    ...messages,
    ...(isTyping ? [{ id: "typing" as const }] : []),
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 8,
            backgroundColor: colors.darkBg,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          activeOpacity={0.8}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={[styles.headerAvatar, { backgroundColor: sitterAvatarColor }]}>
            <Text style={styles.headerAvatarText}>{sitterInitials}</Text>
          </View>
          <View>
            <Text style={[styles.headerName, { color: colors.foreground }]}>{sitterName}</Text>
            <View style={styles.onlineRow}>
              <View style={[styles.onlineDot, { backgroundColor: colors.teal }]} />
              <Text style={[styles.onlineText, { color: colors.teal }]}>Active session</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.callBtn, { backgroundColor: colors.teal + "22", borderColor: colors.teal + "44" }]}
          activeOpacity={0.8}
        >
          <Ionicons name="call" size={18} color={colors.teal} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={allItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.messageList,
            { paddingBottom: 16 },
          ]}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (item.id === "typing") {
              return (
                <TypingIndicator
                  sitterInitials={sitterInitials}
                  color={sitterAvatarColor}
                />
              );
            }
            return (
              <MessageBubble
                message={item as ChatMessage}
                sitterInitials={sitterInitials}
                sitterAvatarColor={sitterAvatarColor}
              />
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Ionicons name="chatbubbles-outline" size={40} color={colors.mutedForeground} />
              <Text style={[styles.emptyChatText, { color: colors.mutedForeground }]}>
                Start chatting with {sitterName.split(" ")[0]}
              </Text>
            </View>
          }
        />

        {/* Input bar */}
        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: colors.darkBg,
              borderTopColor: colors.border,
              paddingBottom: botPad + 8,
            },
          ]}
        >
          {/* Quick replies */}
          <FlatList
            horizontal
            data={[
              "How are the kids?",
              "ETA?",
              "Bedtime at 8:30 PM",
              "Thanks! 👍",
              "Any issues?",
            ]}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            style={styles.quickReplies}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  Haptics.selectionAsync();
                  setInputText(item);
                }}
                activeOpacity={0.8}
                style={[
                  styles.quickReply,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.quickReplyText, { color: colors.foreground }]}>{item}</Text>
              </TouchableOpacity>
            )}
          />

          <View style={styles.inputRow}>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Message..."
                placeholderTextColor={colors.mutedForeground}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                returnKeyType="send"
                onSubmitEditing={handleSend}
                blurOnSubmit={false}
              />
            </View>
            <TouchableOpacity
              onPress={handleSend}
              activeOpacity={inputText.trim() ? 0.8 : 1}
              style={[
                styles.sendBtn,
                { backgroundColor: inputText.trim() ? colors.teal : colors.border },
              ]}
            >
              <Ionicons name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  headerName: {
    fontSize: 16,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  onlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  onlineText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  messageList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 4,
  },

  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 4,
    gap: 8,
  },
  bubbleRowLeft: {
    justifyContent: "flex-start",
  },
  bubbleRowRight: {
    justifyContent: "flex-end",
  },
  sitterAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  sitterAvatarText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  parentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  bubbleContent: {
    maxWidth: "72%",
    gap: 3,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    paddingHorizontal: 4,
  },

  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    gap: 4,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    opacity: 0.6,
  },

  emptyChat: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyChatText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },

  inputBar: {
    borderTopWidth: 1,
    paddingTop: 8,
    gap: 8,
  },
  quickReplies: {
    maxHeight: 36,
  },
  quickReply: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
  },
  quickReplyText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    gap: 10,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
  },
  input: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
});
