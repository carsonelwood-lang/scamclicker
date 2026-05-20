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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_shop_items: {
        Row: {
          active: boolean
          created_at: string
          created_by: string
          currency: string
          description: string
          effect_amount: number
          effect_kind: string
          icon: string
          id: string
          name: string
          price: number
          stock: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by: string
          currency?: string
          description?: string
          effect_amount?: number
          effect_kind?: string
          icon?: string
          id?: string
          name: string
          price?: number
          stock?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string
          currency?: string
          description?: string
          effect_amount?: number
          effect_kind?: string
          icon?: string
          id?: string
          name?: string
          price?: number
          stock?: number
        }
        Relationships: []
      }
      broadcasts: {
        Row: {
          admin_id: string
          admin_name: string
          created_at: string
          id: string
          kind: string
          payload: Json
        }
        Insert: {
          admin_id: string
          admin_name: string
          created_at?: string
          id?: string
          kind: string
          payload?: Json
        }
        Update: {
          admin_id?: string
          admin_name?: string
          created_at?: string
          id?: string
          kind?: string
          payload?: Json
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_admin: boolean
          user_id: string
          username: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_admin?: boolean
          user_id: string
          username: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_admin?: boolean
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      pet_trades: {
        Row: {
          created_at: string
          from_user: string
          id: string
          offered_pet_id: string
          requested_pet_id: string | null
          responded_at: string | null
          status: string
          to_user: string
        }
        Insert: {
          created_at?: string
          from_user: string
          id?: string
          offered_pet_id: string
          requested_pet_id?: string | null
          responded_at?: string | null
          status?: string
          to_user: string
        }
        Update: {
          created_at?: string
          from_user?: string
          id?: string
          offered_pet_id?: string
          requested_pet_id?: string | null
          responded_at?: string | null
          status?: string
          to_user?: string
        }
        Relationships: []
      }
      pets_catalog: {
        Row: {
          created_at: string
          icon: string
          id: string
          name: string
          rarity_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          icon?: string
          id: string
          name: string
          rarity_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          name?: string
          rarity_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "pets_catalog_rarity_id_fkey"
            columns: ["rarity_id"]
            isOneToOne: false
            referencedRelation: "rarities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          banned: boolean
          created_at: string
          equipped_pets: Json
          gems: number
          id: string
          is_online: boolean
          last_seen: string
          muted: boolean
          owned: Json
          points: number
          tokens: number
          username: string
        }
        Insert: {
          banned?: boolean
          created_at?: string
          equipped_pets?: Json
          gems?: number
          id: string
          is_online?: boolean
          last_seen?: string
          muted?: boolean
          owned?: Json
          points?: number
          tokens?: number
          username: string
        }
        Update: {
          banned?: boolean
          created_at?: string
          equipped_pets?: Json
          gems?: number
          id?: string
          is_online?: boolean
          last_seen?: string
          muted?: boolean
          owned?: Json
          points?: number
          tokens?: number
          username?: string
        }
        Relationships: []
      }
      rarities: {
        Row: {
          color: string
          created_at: string
          id: string
          label: string
          mult: number
          sell_gems: number
          sort_order: number
          weight: number
        }
        Insert: {
          color?: string
          created_at?: string
          id: string
          label: string
          mult?: number
          sell_gems?: number
          sort_order?: number
          weight?: number
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          label?: string
          mult?: number
          sell_gems?: number
          sort_order?: number
          weight?: number
        }
        Relationships: []
      }
      shop_purchases: {
        Row: {
          created_at: string
          currency: string
          id: string
          item_id: string
          item_name: string
          price_paid: number
          user_id: string
        }
        Insert: {
          created_at?: string
          currency: string
          id?: string
          item_id: string
          item_name: string
          price_paid: number
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          item_id?: string
          item_name?: string
          price_paid?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_purchases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "admin_shop_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_pets: {
        Row: {
          acquired_at: string
          id: string
          owner_id: string
          pet_id: string
        }
        Insert: {
          acquired_at?: string
          id?: string
          owner_id: string
          pet_id: string
        }
        Update: {
          acquired_at?: string
          id?: string
          owner_id?: string
          pet_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_pet_trade: { Args: { _trade_id: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
