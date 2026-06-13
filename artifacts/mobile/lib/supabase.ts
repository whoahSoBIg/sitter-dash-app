// artifacts/mobile/lib/supabase.ts

import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"
import type {
  Booking,
  BookingWithSitter,
  Child,
  Message,
  Profile,
  Review,
  SitterWithProfile,
} from "./database.types"

const supabaseUrl = "https://jzwxwtkastpwbvmmefou.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6d3h3dGthc3RwYnZtbWVmb3UiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc0OTg0MzAwMiwiZXhwIjoyMDY1NDE5MDAyfQ.pw8SwYUiVdJB_RaA6HbBu5ehaSagVHgkokOx3YeMk88"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function signUp(
  email: string,
  password: string,
  role: "parent" | "sitter",
  firstName: string,
  lastName: string
) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error || !data.user) throw error

  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    role,
    first_name: firstName,
    last_name: lastName,
  })
  if (profileError) throw profileError

  if (role === "sitter") {
    const { error: sitterError } = await supabase
      .from("sitter_profiles")
      .insert({ id: data.user.id, hourly_rate: 20 })
    if (sitterError) throw sitterError
  }

  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()
  if (error) throw error
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { error } = await supabase.from("profiles").update(updates).eq("id", userId)
  if (error) throw error
}

// ─── Sitters ──────────────────────────────────────────────────────────────────

export async function getSittersForCity(cityId: string): Promise<SitterWithProfile[]> {
  const { data, error } = await supabase
    .from("sitter_profiles")
    .select(`*, profile:profiles(*), certifications:sitter_certifications(label), services:sitter_services(service)`)
    .eq("city_id", cityId)
    .eq("is_available", true)
    .order("rating", { ascending: false })
  if (error) throw error
  return (data ?? []).map((s: any) => ({
    ...s,
    certifications: s.certifications.map((c: any) => c.label),
    services: s.services.map((sv: any) => sv.service),
  }))
}

export async function getSitter(sitterId: string): Promise<SitterWithProfile> {
  const { data, error } = await supabase
    .from("sitter_profiles")
    .select(`*, profile:profiles(*), certifications:sitter_certifications(label), services:sitter_services(service)`)
    .eq("id", sitterId)
    .single()
  if (error) throw error
  return {
    ...data,
    certifications: (data as any).certifications.map((c: any) => c.label),
    services: (data as any).services.map((sv: any) => sv.service),
  }
}

// ─── Children ─────────────────────────────────────────────────────────────────

export async function getChildren(parentId: string): Promise<Child[]> {
  const { data, error } = await supabase
    .from("children")
    .select("*")
    .eq("parent_id", parentId)
    .order("created_at")
  if (error) throw error
  return data ?? []
}

export async function addChild(
  parentId: string,
  child: { name: string; age: number; allergies?: string; notes?: string }
): Promise<Child> {
  const { data, error } = await supabase
    .from("children")
    .insert({ parent_id: parentId, ...child })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateChild(childId: string, updates: Partial<Child>) {
  const { error } = await supabase.from("children").update(updates).eq("id", childId)
  if (error) throw error
}

export async function deleteChild(childId: string) {
  const { error } = await supabase.from("children").delete().eq("id", childId)
  if (error) throw error
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function getBookingsForParent(parentId: string): Promise<BookingWithSitter[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select(`*, sitter:sitter_profiles(initials, avatar_color, hourly_rate, profile:profiles(first_name, last_name)), children:booking_children(child:children(*))`)
    .eq("parent_id", parentId)
    .order("start_time", { ascending: false })
  if (error) throw error
  return (data ?? []).map((b: any) => ({
    ...b,
    children: b.children.map((bc: any) => bc.child),
  }))
}

export async function createBooking(booking: {
  parent_id: string
  sitter_id: string
  start_time: string
  end_time: string
  address: string
  num_children: number
  hourly_rate: number
  child_ids: string[]
  special_instructions?: string
}): Promise<Booking> {
  const { child_ids, ...bookingData } = booking
  const { data, error } = await supabase
    .from("bookings")
    .insert({ ...bookingData, status: "requested" })
    .select()
    .single()
  if (error) throw error
  if (child_ids.length > 0) {
    const { error: linkError } = await supabase
      .from("booking_children")
      .insert(child_ids.map((child_id) => ({ booking_id: data.id, child_id })))
    if (linkError) throw linkError
  }
  return data
}

export async function updateBookingStatus(bookingId: string, status: Booking["status"]) {
  const { error } = await supabase.from("bookings").update({ status }).eq("id", bookingId)
  if (error) throw error
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function submitReview(review: {
  booking_id: string
  parent_id: string
  sitter_id: string
  rating: number
  comment?: string
}): Promise<Review> {
  const { data, error } = await supabase.from("reviews").insert(review).select().single()
  if (error) throw error
  return data
}

export async function getReviewsForSitter(sitterId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("sitter_id", sitterId)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data ?? []
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export async function getMessages(bookingId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("booking_id", bookingId)
    .order("created_at")
  if (error) throw error
  return data ?? []
}

export async function sendMessage(bookingId: string, senderId: string, content: string): Promise<Message> {
  const { data, error } = await supabase
    .from("messages")
    .insert({ booking_id: bookingId, sender_id: senderId, content })
    .select()
    .single()
  if (error) throw error
  return data
}

export function subscribeToMessages(bookingId: string, onMessage: (msg: Message) => void) {
  return supabase
    .channel(`messages:${bookingId}`)
    .on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "messages",
      filter: `booking_id=eq.${bookingId}`,
    }, (payload) => onMessage(payload.new as Message))
    .subscribe()
}
