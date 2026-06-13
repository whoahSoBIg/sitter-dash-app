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
