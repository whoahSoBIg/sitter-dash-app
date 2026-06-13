// artifacts/mobile/lib/database.types.ts

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: "parent" | "sitter"
          first_name: string
          last_name: string
          avatar_url: string | null
          phone: string | null
          bio: string | null
          city: string | null
          province_code: string | null
          zip_code: string | null
          lat: number | null
          lng: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>
      }

      sitter_profiles: {
        Row: {
          id: string
          hourly_rate: number
          years_experience: number
          max_children: number
          min_age_months: number
          has_cpr_cert: boolean
          has_first_aid_cert: boolean
          background_check: "pending" | "verified" | "top_pro"
          is_available: boolean
          rating: number
          total_reviews: number
          university: string | null
          neighbourhood: string | null
          city_id: string | null
          initials: string | null
          avatar_color: string | null
          lat: number | null
          lng: number | null
          stripe_account_id: string | null
        }
        Insert: Omit<Database["public"]["Tables"]["sitter_profiles"]["Row"], "rating" | "total_reviews">
        Update: Partial<Database["public"]["Tables"]["sitter_profiles"]["Insert"]>
      }

      sitter_services: {
        Row: {
          id: string
          sitter_id: string
          service: "newborn" | "infant" | "toddler" | "school_age" | "special_needs" | "overnight" | "pet_care" | "tutoring"
        }
        Insert: Omit<Database["public"]["Tables"]["sitter_services"]["Row"], "id">
        Update: Partial<Database["public"]["Tables"]["sitter_services"]["Insert"]>
      }

      sitter_certifications: {
        Row: {
          id: string
          sitter_id: string
          label: string
        }
        Insert: Omit<Database["public"]["Tables"]["sitter_certifications"]["Row"], "id">
        Update: Partial<Database["public"]["Tables"]["sitter_certifications"]["Insert"]>
      }

      sitter_availability: {
        Row: {
          id: string
          sitter_id: string
          day_of_week: number
          start_time: string
          end_time: string
        }
        Insert: Omit<Database["public"]["Tables"]["sitter_availability"]["Row"], "id">
        Update: Partial<Database["public"]["Tables"]["sitter_availability"]["Insert"]>
      }

      children: {
        Row: {
          id: string
          parent_id: string
          name: string
          age: number
          date_of_birth: string | null
          special_needs: string | null
          allergies: string | null
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["children"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["children"]["Insert"]>
      }

      bookings: {
        Row: {
          id: string
          parent_id: string
          sitter_id: string
          status: "requested" | "accepted" | "declined" | "in_progress" | "completed" | "cancelled"
          start_time: string
          end_time: string
          address: string
          lat: number | null
          lng: number | null
          num_children: number
          hourly_rate: number
          total_amount: number | null
          special_instructions: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["bookings"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>
      }

      booking_children: {
        Row: {
          booking_id: string
          child_id: string
        }
        Insert: Database["public"]["Tables"]["booking_children"]["Row"]
        Update: Partial<Database["public"]["Tables"]["booking_children"]["Row"]>
      }

      payments: {
        Row: {
          id: string
          booking_id: string
          parent_id: string
          sitter_id: string
          amount: number
          platform_fee: number
          sitter_payout: number
          stripe_payment_intent_id: string | null
          stripe_transfer_id: string | null
          status: "pending" | "processing" | "succeeded" | "failed" | "refunded"
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["payments"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>
      }

      reviews: {
        Row: {
          id: string
          booking_id: string
          parent_id: string
          sitter_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>
      }

      messages: {
        Row: {
          id: string
          booking_id: string
          sender_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["messages"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>
      }
    }
  }
}

// Convenience row types
export type Profile        = Database["public"]["Tables"]["profiles"]["Row"]
export type SitterProfile  = Database["public"]["Tables"]["sitter_profiles"]["Row"]
export type Child          = Database["public"]["Tables"]["children"]["Row"]
export type Booking        = Database["public"]["Tables"]["bookings"]["Row"]
export type Payment        = Database["public"]["Tables"]["payments"]["Row"]
export type Review         = Database["public"]["Tables"]["reviews"]["Row"]
export type Message        = Database["public"]["Tables"]["messages"]["Row"]

// Joined types used in your screens
export type SitterWithProfile = SitterProfile & {
  profile: Profile
  certifications: string[]
  services: string[]
}

export type BookingWithSitter = Booking & {
  sitter: Profile & Pick<SitterProfile, "initials" | "avatar_color" | "hourly_rate">
  children: Child[]
}
