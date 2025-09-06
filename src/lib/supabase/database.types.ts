export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      cogs: {
        Row: {
          amount_pence: number
          created_at: string | null
          evidence_url: string | null
          id: string
          method: string
          notes: string | null
          order_id: string | null
          sku: string | null
          user_id: string
        }
        Insert: {
          amount_pence: number
          created_at?: string | null
          evidence_url?: string | null
          id?: string
          method: string
          notes?: string | null
          order_id?: string | null
          sku?: string | null
          user_id: string
        }
        Update: {
          amount_pence?: number
          created_at?: string | null
          evidence_url?: string | null
          id?: string
          method?: string
          notes?: string | null
          order_id?: string | null
          sku?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cogs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      manual_expenses: {
        Row: {
          amount_pence: number
          category: string
          created_at: string | null
          date: string
          id: string
          note: string | null
          user_id: string
        }
        Insert: {
          amount_pence: number
          category: string
          created_at?: string | null
          date: string
          id?: string
          note?: string | null
          user_id: string
        }
        Update: {
          amount_pence?: number
          category?: string
          created_at?: string | null
          date?: string
          id?: string
          note?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "manual_expenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_accounts: {
        Row: {
          access_token: string | null
          connected_at: string | null
          id: string
          platform: string
          refresh_token: string | null
          seller_id: string | null
          status: string | null
          token_expires_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          connected_at?: string | null
          id?: string
          platform: string
          refresh_token?: string | null
          seller_id?: string | null
          status?: string | null
          token_expires_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          connected_at?: string | null
          id?: string
          platform?: string
          refresh_token?: string | null
          seller_id?: string | null
          status?: string | null
          token_expires_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      raw_files: {
        Row: {
          account_id: string | null
          bytes: number | null
          filename: string
          id: string
          sha256: string | null
          uploaded_at: string | null
          user_id: string
        }
        Insert: {
          account_id?: string | null
          bytes?: number | null
          filename: string
          id?: string
          sha256?: string | null
          uploaded_at?: string | null
          user_id: string
        }
        Update: {
          account_id?: string | null
          bytes?: number | null
          filename?: string
          id?: string
          sha256?: string | null
          uploaded_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "raw_files_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "marketplace_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "raw_files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      summaries: {
        Row: {
          cogs_pence: number
          fees_pence: number
          gross_sales_pence: number
          id: string
          manual_pence: number
          period: string
          profit_before_allowance_pence: number
          shipping_income_pence: number
          shipping_labels_pence: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cogs_pence?: number
          fees_pence?: number
          gross_sales_pence?: number
          id?: string
          manual_pence?: number
          period: string
          profit_before_allowance_pence?: number
          shipping_income_pence?: number
          shipping_labels_pence?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cogs_pence?: number
          fees_pence?: number
          gross_sales_pence?: number
          id?: string
          manual_pence?: number
          period?: string
          profit_before_allowance_pence?: number
          shipping_income_pence?: number
          shipping_labels_pence?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "summaries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_years: {
        Row: {
          basis: string | null
          created_at: string | null
          id: string
          use_trading_allowance: boolean | null
          user_id: string
          vat_watch_on: boolean | null
          year: string
        }
        Insert: {
          basis?: string | null
          created_at?: string | null
          id?: string
          use_trading_allowance?: boolean | null
          user_id: string
          vat_watch_on?: boolean | null
          year: string
        }
        Update: {
          basis?: string | null
          created_at?: string | null
          id?: string
          use_trading_allowance?: boolean | null
          user_id?: string
          vat_watch_on?: boolean | null
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_years_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount_pence: number
          cash_date: string
          created_at: string | null
          currency: string | null
          id: string
          is_personal: boolean | null
          notes: string | null
          order_id: string | null
          platform: string
          source: string
          source_ref: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount_pence: number
          cash_date: string
          created_at?: string | null
          currency?: string | null
          id?: string
          is_personal?: boolean | null
          notes?: string | null
          order_id?: string | null
          platform: string
          source: string
          source_ref?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount_pence?: number
          cash_date?: string
          created_at?: string | null
          currency?: string | null
          id?: string
          is_personal?: boolean | null
          notes?: string | null
          order_id?: string | null
          platform?: string
          source?: string
          source_ref?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
