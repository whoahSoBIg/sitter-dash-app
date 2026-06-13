import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "parent" | "sitter";
  timestamp: number;
  sitterName: string;
}

const STORAGE_KEY = "gositter_chat_messages";

const SITTER_REPLIES = [
  "On my way! Should be there in about 8 minutes.",
  "Just arrived at your door 🙂",
  "The kids are doing great! We're playing in the living room.",
  "Emma just finished her homework — she was very focused.",
  "Liam is having his snack now. Everything going smoothly.",
  "Both kids are happy! We read two books already.",
  "Just wanted to check in — all good here! Having fun.",
  "Getting the kids ready for bath time now.",
  "Liam is almost asleep. Emma asked for 10 more minutes.",
  "Both tucked in! Great evening with them. See you soon.",
];

let replyIndex = 0;

function getNextReply() {
  const reply = SITTER_REPLIES[replyIndex % SITTER_REPLIES.length];
  replyIndex += 1;
  return reply;
}

function makeId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export function useChat(sitterName: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const loadedRef = useRef(false);

  // Load from AsyncStorage on mount
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const stored: ChatMessage[] = JSON.parse(raw);
          setMessages(stored);
        } catch {
          // Ignore parse errors
        }
      } else {
        // Seed with a welcome message from the sitter
        const welcome: ChatMessage = {
          id: makeId(),
          text: `Hi! This is ${sitterName}. I'm heading over now. Feel free to message me anytime!`,
          sender: "sitter",
          timestamp: Date.now() - 60000,
          sitterName,
        };
        setMessages([welcome]);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([welcome]));
      }
    });
  }, []);

  // Save to AsyncStorage whenever messages change
  const saveMessages = useCallback((msgs: ChatMessage[]) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(msgs)).catch(() => {});
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      const parentMsg: ChatMessage = {
        id: makeId(),
        text: text.trim(),
        sender: "parent",
        timestamp: Date.now(),
        sitterName,
      };

      setMessages((prev) => {
        const updated = [...prev, parentMsg];
        saveMessages(updated);
        return updated;
      });

      // Sitter types then replies after a short delay
      setIsTyping(true);
      const delay = 1500 + Math.random() * 1500;
      setTimeout(() => {
        setIsTyping(false);
        const sitterMsg: ChatMessage = {
          id: makeId(),
          text: getNextReply(),
          sender: "sitter",
          timestamp: Date.now(),
          sitterName,
        };
        setMessages((prev) => {
          const updated = [...prev, sitterMsg];
          saveMessages(updated);
          return updated;
        });
      }, delay);
    },
    [sitterName, saveMessages]
  );

  const clearHistory = useCallback(() => {
    setMessages([]);
    AsyncStorage.removeItem(STORAGE_KEY);
    replyIndex = 0;
  }, []);

  return { messages, isTyping, sendMessage, clearHistory };
}
