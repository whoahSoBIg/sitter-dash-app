import React, { createContext, useContext, useState, ReactNode } from "react";
import { City, DEFAULT_CITY } from "@/data/cities";

export type UserType = "parent" | "sitter" | null;

export type SessionStatus =
  | "idle"
  | "booking_sent"
  | "sitter_accepted"
  | "sitter_en_route"
  | "sitter_arrived"
  | "session_active"
  | "complete";

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  allergies: string;
  medicalNotes: string;
}

export interface BookingDraft {
  sitterId: string;
  sitterName: string;
  sitterRate: number;
  date: Date;
  startTime: string;
  durationHours: number;
  selectedChildren: string[];
  notes: string;
}

interface AppState {
  userType: UserType;
  setUserType: (type: UserType) => void;
  bookingDraft: BookingDraft | null;
  setBookingDraft: (b: BookingDraft | null) => void;
  sessionStatus: SessionStatus;
  setSessionStatus: (s: SessionStatus) => void;
  children: ChildProfile[];
  setChildren: (c: ChildProfile[]) => void;
  sitterActive: boolean;
  setSitterActive: (a: boolean) => void;
  selectedCity: City;
  setSelectedCity: (c: City) => void;
  tipAmount: number;
  setTipAmount: (amount: number) => void;
}

const AppContext = createContext<AppState | null>(null);

const defaultChildren: ChildProfile[] = [
  { id: "c1", name: "Emma", age: 6, allergies: "Peanuts", medicalNotes: "Carries EpiPen" },
  { id: "c2", name: "Liam", age: 3, allergies: "None", medicalNotes: "" },
];

export function AppProvider({ children: childrenNodes }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType>(null);
  const [bookingDraft, setBookingDraft] = useState<BookingDraft | null>(null);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("idle");
  const [children, setChildren] = useState<ChildProfile[]>(defaultChildren);
  const [sitterActive, setSitterActive] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City>(DEFAULT_CITY);
  const [tipAmount, setTipAmount] = useState(0);

  return (
    <AppContext.Provider
      value={{
        userType, setUserType,
        bookingDraft, setBookingDraft,
        sessionStatus, setSessionStatus,
        children, setChildren,
        sitterActive, setSitterActive,
        selectedCity, setSelectedCity,
        tipAmount, setTipAmount,
      }}
    >
      {childrenNodes}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
