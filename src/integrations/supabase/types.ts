export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          account_number: string
          address: string | null
          authorization_date: string | null
          blue_book_price: number | null
          branch: string
          brand: string | null
          commission: number | null
          created_at: string
          created_by: string | null
          current_bucket: string | null
          cycle_day: string | null
          documents: string[] | null
          engine_number: string | null
          field_team: string
          group_code: string
          id: string
          installment: number
          last_visit_result: string | null
          latitude: number | null
          license_plate: string | null
          longitude: number | null
          model: string | null
          name: string
          notes: string | null
          phone_numbers: string[] | null
          photos: string[] | null
          principle: number
          registration_id: string
          resus: string | null
          uid: string
          updated_at: string
          voice_notes: string[] | null
          work_group: string
          work_status: string | null
        }
        Insert: {
          account_number: string
          address?: string | null
          authorization_date?: string | null
          blue_book_price?: number | null
          branch: string
          brand?: string | null
          commission?: number | null
          created_at?: string
          created_by?: string | null
          current_bucket?: string | null
          cycle_day?: string | null
          documents?: string[] | null
          engine_number?: string | null
          field_team: string
          group_code: string
          id?: string
          installment: number
          last_visit_result?: string | null
          latitude?: number | null
          license_plate?: string | null
          longitude?: number | null
          model?: string | null
          name: string
          notes?: string | null
          phone_numbers?: string[] | null
          photos?: string[] | null
          principle: number
          registration_id: string
          resus?: string | null
          uid: string
          updated_at?: string
          voice_notes?: string[] | null
          work_group: string
          work_status?: string | null
        }
        Update: {
          account_number?: string
          address?: string | null
          authorization_date?: string | null
          blue_book_price?: number | null
          branch?: string
          brand?: string | null
          commission?: number | null
          created_at?: string
          created_by?: string | null
          current_bucket?: string | null
          cycle_day?: string | null
          documents?: string[] | null
          engine_number?: string | null
          field_team?: string
          group_code?: string
          id?: string
          installment?: number
          last_visit_result?: string | null
          latitude?: number | null
          license_plate?: string | null
          longitude?: number | null
          model?: string | null
          name?: string
          notes?: string | null
          phone_numbers?: string[] | null
          photos?: string[] | null
          principle?: number
          registration_id?: string
          resus?: string | null
          uid?: string
          updated_at?: string
          voice_notes?: string[] | null
          work_group?: string
          work_status?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          branch: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string | null
          team: string | null
          updated_at: string
          work_group: string | null
        }
        Insert: {
          avatar_url?: string | null
          branch?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role?: string | null
          team?: string | null
          updated_at?: string
          work_group?: string | null
        }
        Update: {
          avatar_url?: string | null
          branch?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string | null
          team?: string | null
          updated_at?: string
          work_group?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
